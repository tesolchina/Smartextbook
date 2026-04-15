import { Router, type IRouter } from "express";
import * as cheerio from "cheerio";
import { FetchUrlBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/fetch-url", async (req, res): Promise<void> => {
  const parsed = FetchUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let { url } = parsed.data;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      res.status(400).json({ error: "Only http and https URLs are supported" });
      return;
    }
  } catch {
    res.status(400).json({ error: "Invalid URL" });
    return;
  }

  // ── arXiv: redirect abs → best available full-text ────────────────────────
  // Priority: arxiv.org/html/XXXX (official) → ar5iv.org/abs/XXXX (fallback)
  const arxivAbsMatch = parsedUrl.hostname.match(/arxiv\.org$/i) &&
    parsedUrl.pathname.match(/^\/abs\/(.+)/);
  let isArxivFallback = false; // true when we only have the abstract page
  if (arxivAbsMatch) {
    const paperId = arxivAbsMatch[1];
    // 1. Try official arXiv HTML version
    const officialHtml = `https://arxiv.org/html/${paperId}`;
    try {
      const probe = await fetch(officialHtml, {
        method: "HEAD",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LessonBuilder/1.0)" },
        signal: AbortSignal.timeout(8_000),
      });
      if (probe.ok) {
        url = officialHtml;
        parsedUrl = new URL(officialHtml);
      } else {
        throw new Error("no html version");
      }
    } catch {
      // 2. Try ar5iv.org (community HTML renderer for older papers)
      const ar5ivUrl = `https://ar5iv.org/abs/${paperId}`;
      try {
        const ar5ivProbe = await fetch(ar5ivUrl, {
          method: "HEAD",
          headers: { "User-Agent": "Mozilla/5.0 (compatible; LessonBuilder/1.0)" },
          signal: AbortSignal.timeout(10_000),
        });
        if (ar5ivProbe.ok) {
          url = ar5ivUrl;
          parsedUrl = new URL(ar5ivUrl);
        } else {
          isArxivFallback = true; // will only get abstract
        }
      } catch {
        isArxivFallback = true; // will only get abstract
      }
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  // arXiv pages can be slow — give them more time
  const isArxivRequest = /arxiv\.org|ar5iv\.org/i.test(parsedUrl.hostname);
  const fetchTimeout = isArxivRequest ? 30_000 : 15_000;

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LessonBuilder/1.0; +https://lessonbuilder.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(fetchTimeout),
    });

    if (!response.ok) {
      res.status(422).json({ error: `URL returned status ${response.status}` });
      return;
    }

    // Bail early on very large responses (> 5 MB) to avoid memory exhaustion
    const contentLength = parseInt(response.headers.get("content-length") ?? "0", 10);
    if (contentLength > 5_000_000) {
      res.status(422).json({ error: "Page is too large to fetch (> 5 MB). Try copying the text manually." });
      return;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      if (contentType.includes("text/plain")) {
        const text = await response.text();
        res.json({ title: parsedUrl.hostname, content: text.slice(0, 50_000), url });
        return;
      }
      res.status(422).json({ error: "URL does not return readable text content" });
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $("head title").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      $("h1").first().text().trim() ||
      parsedUrl.hostname;

    // Detect SPA sites before removing scripts: look for common framework markers
    const isSPA =
      /id=["']root["']|id=["']app["']|id=["']__next["']|data-reactroot|ng-version|ng-app|data-vue|__nuxt/i.test(html);

    // Try JSON-LD structured data first (works on many modern/SPA sites)
    let jsonLdContent = "";
    $('script[type="application/ld+json"]').each((_i, el) => {
      if (jsonLdContent) return;
      try {
        const ld = JSON.parse($(el).html() ?? "");
        const candidate = ld.articleBody || ld.description || ld.text;
        if (typeof candidate === "string" && candidate.length > 150) {
          jsonLdContent = candidate;
        }
      } catch {
        // malformed JSON-LD — skip
      }
    });

    $("script, style, nav, header, footer, aside, form, noscript, iframe, svg, img, button, [role=navigation], [role=banner], [role=complementary], .ad, .ads, .advertisement, #comments").remove();

    let content = "";

    // ── arXiv / ar5iv HTML full-text: LaTeX-to-HTML extraction ──────────────
    const isArxivHtml = /arxiv\.org/i.test(parsedUrl.hostname) &&
      parsedUrl.pathname.startsWith("/html/");
    const isAr5iv = /ar5iv\.org/i.test(parsedUrl.hostname);
    if (isArxivHtml || isAr5iv) {
      const ltxMain = $(".ltx_page_main, .ltx_document, #content, main").first();
      const root = ltxMain.length ? ltxMain : $("body");
      // Remove bibliography, appendix, footnotes, author blocks, and nav noise
      root.find(
        ".ltx_bibliography, .ltx_appendix, .ltx_note, .ltx_authors, " +
        ".ltx_dates, .ltx_acknowledgements, " +
        "nav, header, footer, .ar5iv-footer, .ar5iv-header"
      ).remove();
      content = root
        .find("h1, h2, h3, h4, h5, h6, p.ltx_p, p, .ltx_title, .ltx_abstract p, li.ltx_item")
        .map((_i, el) => $(el).text().trim())
        .get()
        .filter((t) => t.length > 15)
        .join("\n\n");
    }

    // If we only have the abstract page (no HTML version found), add a note
    if (isArxivFallback && !content) {
      // abstract page only — extract what we can and add a note
    }

    const article = $("article").first();
    const main = $("main").first();
    const contentDiv = $("#content, .content, .post-content, .entry-content, .article-body, .post-body").first();

    const primaryEl = article.length ? article : main.length ? main : contentDiv.length ? contentDiv : null;

    if (!content && primaryEl && primaryEl.length) {
      content = primaryEl
        .find("h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, td")
        .map((_i, el) => $(el).text().trim())
        .get()
        .filter(Boolean)
        .join("\n\n");
    }

    if (!content || content.length < 200) {
      content = $("body")
        .find("h1, h2, h3, h4, h5, h6, p, li, blockquote")
        .map((_i, el) => $(el).text().trim())
        .get()
        .filter((t) => t.length > 20)
        .join("\n\n");
    }

    // Fall back to JSON-LD content if DOM extraction failed
    if ((!content || content.length < 200) && jsonLdContent) {
      content = jsonLdContent;
    }

    // Higher content cap for arXiv/ar5iv since papers can be long
    const contentCap = isArxivRequest ? 100_000 : 50_000;
    content = content.replace(/\n{3,}/g, "\n\n").trim().slice(0, contentCap);

    if (!content || content.length < 100) {
      if (isArxivFallback) {
        res.status(422).json({
          error:
            "This arXiv paper doesn't have an HTML version yet. " +
            "To get the full text, open the paper on arxiv.org, click 'Download PDF', " +
            "then use the 'Upload PDF' option in the lesson builder.",
        });
      } else if (isSPA) {
        res.status(422).json({
          error:
            "This page is a JavaScript-rendered app and its content cannot be fetched directly. Please open the page in your browser, select all the text, and paste it manually.",
        });
      } else {
        res.status(422).json({ error: "Could not extract readable text from this page. Try copying the text manually." });
      }
      return;
    }

    // Attach a note if we could only retrieve the abstract
    const note = isArxivFallback
      ? "\n\n[Note: This paper has no HTML version on arXiv. Only the abstract was retrieved. For the full text, download the PDF and use the 'Upload PDF' option.]"
      : "";

    res.json({ title: title.slice(0, 200), content: content + note, url });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TimeoutError") {
      const timeoutMsg = isArxivRequest
        ? "arXiv took too long to respond (30 s timeout). The paper may be temporarily unavailable — try again in a moment."
        : "The URL took too long to respond (15 s timeout)";
      res.status(422).json({ error: timeoutMsg });
      return;
    }
    res.status(422).json({ error: `Failed to fetch URL: ${err instanceof Error ? err.message : String(err)}` });
  }
});

export default router;

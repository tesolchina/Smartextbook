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

  const { url } = parsed.data;

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

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LessonBuilder/1.0; +https://lessonbuilder.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(15_000),
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

    const article = $("article").first();
    const main = $("main").first();
    const contentDiv = $("#content, .content, .post-content, .entry-content, .article-body, .post-body").first();

    const primaryEl = article.length ? article : main.length ? main : contentDiv.length ? contentDiv : null;

    if (primaryEl && primaryEl.length) {
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

    content = content.replace(/\n{3,}/g, "\n\n").trim().slice(0, 50_000);

    if (!content || content.length < 100) {
      if (isSPA) {
        res.status(422).json({
          error:
            "This page is a JavaScript-rendered app and its content cannot be fetched directly. Please open the page in your browser, select all the text, and paste it manually.",
        });
      } else {
        res.status(422).json({ error: "Could not extract readable text from this page. Try copying the text manually." });
      }
      return;
    }

    res.json({ title: title.slice(0, 200), content, url });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TimeoutError") {
      res.status(422).json({ error: "The URL took too long to respond (15 s timeout)" });
      return;
    }
    res.status(422).json({ error: `Failed to fetch URL: ${err instanceof Error ? err.message : String(err)}` });
  }
});

export default router;

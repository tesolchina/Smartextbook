"""
Step 2b: Second-pass resolver for unresolved records.

For records that Step 2 left as 'unresolved':
  - Re-extract title using a smarter heuristic (avoid stripping title start)
  - Try CrossRef with lower match threshold
  - Try CrossRef using query.title= endpoint
  - Try OpenAlex with broader search

Reads/writes data/pubs_resolved.json in-place.
"""

import json, re, time, urllib.request, urllib.parse, os, sys

BASE  = os.path.dirname(__file__)
FILE  = os.path.join(BASE, "data", "pubs_resolved.json")
MAILTO = "docai@hkbu.edu.hk"
DELAY  = 0.10

# ── HTTP helper ───────────────────────────────────────────────────────────────

def get_json(url: str, timeout: int = 20) -> dict:
    req = urllib.request.Request(url, headers={
        "User-Agent": f"DocAI-pipeline/1.0 (mailto:{MAILTO})",
        "Accept"    : "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        return {"_error": str(e)}

def clean(s: str) -> str:
    s = re.sub(r'<[^>]+>', '', s or '')
    return re.sub(r'\s+', ' ', s).strip()

# ── Better title extraction ───────────────────────────────────────────────────

def extract_title_v2(raw: str) -> str:
    """
    Improved title extractor that's less aggressive about stripping leading words.
    Tries multiple strategies and returns the longest plausible result.
    """
    text = re.sub(r'^\d+[\.\)]\s*', '', raw.strip())
    candidates = []

    # 1. Quoted title
    m = re.search(r'"([^"]{15,300})"', text)
    if m:
        candidates.append(("quoted", m.group(1)))

    # 2. APA year-dot: Author(s). (YYYY). Title sentence. Journal...
    m = re.search(r'\(\d{4}[a-z]?\)\.\s+(.+?)(?:\.\s+[A-Z][a-z]{2,}|\.$)', text)
    if m:
        cand = m.group(1).strip()
        if 15 <= len(cand) <= 350:
            candidates.append(("apa-year-dot", cand))

    # 3. Format: "Title. Author, F., Author, G." — title ends at first period
    #    followed by an author-like pattern
    m = re.match(r'^([A-Z].{14,280}?)\.\s+[A-Z][a-z]+,?\s+[A-Z]', text)
    if m:
        cand = m.group(1).strip()
        if 15 <= len(cand) <= 350:
            candidates.append(("title-first", cand))

    # 4. Author block at start — skip 1-4 author tokens then take the rest
    #    Author pattern: "Lastname, F." or "Lastname F." (multiple separated by comma/semicolon/&)
    # More careful: only strip a compact author block that ends with year or period
    stripped = re.sub(
        r'^(?:[A-Z][a-zA-Z\-\'àéü]+,?\s+(?:[A-Z]\.?\s*){0,4}[,;&\s]*){1,6}'
        r'(?:\(\d{4}[a-z]?\)\.?\s*|,?\s*\d{4}\.?\s*)',
        '', text
    ).strip()
    if stripped and len(stripped) >= 20:
        m2 = re.match(r'^(.{15,300}?)(?:\.\s+[A-Z][a-z]{2,}|\.$)', stripped)
        if m2:
            candidates.append(("after-authors", m2.group(1).strip()))
        elif len(stripped) <= 350:
            candidates.append(("after-authors-raw", stripped[:350]))

    # 5. Semicolon split — title often last
    parts = [p.strip() for p in re.split(r';\s*', text) if p.strip()]
    if len(parts) >= 2:
        last = parts[-1]
        if 20 <= len(last) <= 300 and re.match(r'^[A-Z]', last):
            candidates.append(("semicolon-last", last))

    # 6. If raw starts with a capital word (likely title-first format)
    #    and doesn't look like "Lastname, Firstname" take up to first period
    if re.match(r'^[A-Z][a-z]', text) and not re.match(r'^[A-Z][a-z]+,\s+[A-Z]', text):
        m3 = re.match(r'^(.{15,300}?)(?:\.\s|\.$)', text)
        if m3:
            candidates.append(("raw-start", m3.group(1).strip()))

    # Pick the best candidate: prefer longer ones that don't start with author fragments
    def score(c):
        label, val = c
        s = 0
        if label == "quoted": s += 30
        if label in ("apa-year-dot", "title-first"): s += 20
        s += min(len(val), 200) / 10
        # Penalise if looks like it starts mid-word
        if not re.match(r'^[A-Z]', val): s -= 20
        # Penalise bare author fragments
        if re.match(r'^[A-Z][a-z]+,\s+[A-Z]', val): s -= 10
        return s

    if candidates:
        best = max(candidates, key=score)
        return clean(best[1])

    return clean(text[:150])


# ── CrossRef ─────────────────────────────────────────────────────────────────

def crossref_title_search(title: str) -> list:
    q = urllib.parse.quote(title[:250])
    url = (f"https://api.crossref.org/works"
           f"?query.title={q}&rows=3&mailto={MAILTO}")
    return (get_json(url).get("message") or {}).get("items", [])

def crossref_biblio_search(query: str) -> list:
    q = urllib.parse.quote(query[:250])
    url = (f"https://api.crossref.org/works"
           f"?query.bibliographic={q}&rows=3&mailto={MAILTO}")
    return (get_json(url).get("message") or {}).get("items", [])

def parse_cr(item: dict) -> dict:
    authors = []
    for a in item.get("author", []):
        name = a.get("family", "")
        g = a.get("given", "")
        if g: name += f", {g[0]}."
        if name: authors.append(name)
    pub = (item.get("published") or {}).get("date-parts", [[""]])[0]
    doi = item.get("DOI", "")
    return {
        "title"   : clean((item.get("title") or [""])[0]),
        "authors" : "; ".join(authors),
        "journal" : clean(((item.get("container-title") or [""])[0])),
        "pub_year": str(pub[0]) if pub else "",
        "doi"     : doi,
        "url"     : f"https://doi.org/{doi}" if doi else item.get("URL", ""),
        "source"  : "crossref",
    }

def openalex_search(query: str) -> list:
    q = urllib.parse.quote(query[:200])
    url = f"https://api.openalex.org/works?search={q}&per-page=3&mailto={MAILTO}"
    return get_json(url).get("results", [])

def parse_oa(item: dict) -> dict:
    authors = [a.get("author",{}).get("display_name","")
               for a in item.get("authorships",[])[:6]]
    doi = (item.get("doi") or "").replace("https://doi.org/","")
    oa_url = ((item.get("open_access") or {}).get("oa_url") or
              (item.get("best_oa_location") or {}).get("pdf_url") or
              (item.get("primary_location") or {}).get("landing_page_url") or "")
    venue = ((item.get("primary_location") or {}).get("source") or {})
    return {
        "title"   : clean(item.get("title","") or ""),
        "authors" : "; ".join(a for a in authors if a),
        "journal" : clean(venue.get("display_name","") or ""),
        "pub_year": str(item.get("publication_year","") or ""),
        "doi"     : doi,
        "url"     : f"https://doi.org/{doi}" if doi else oa_url,
        "source"  : "openalex",
    }

def word_overlap(a: str, b: str) -> float:
    stop = {"the","a","an","of","in","and","or","for","to","on","with","by","from","is","are"}
    wa = {w for w in re.findall(r'[a-z]+', a.lower()) if len(w) > 2 and w not in stop}
    wb = {w for w in re.findall(r'[a-z]+', b.lower()) if len(w) > 2 and w not in stop}
    if not wa or not wb: return 0.0
    return len(wa & wb) / len(wa | wb)

SKIP_RAW = re.compile(
    r'not applicable|see below|in preparation|in progress|conference|'
    r'two other papers|tbc\b|n/a\b|see further|working on', re.I
)

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    with open(FILE) as f:
        records = json.load(f)

    # Build a dict by id for easy lookup and mutation
    recs_by_id = {r["id"]: r for r in records}

    unresolved = [r for r in records if r.get("status") == "unresolved"]
    print(f"Unresolved records to re-attempt: {len(unresolved)}")

    improved = 0

    for n, rec in enumerate(unresolved):
        rid = rec["id"]
        raw = rec.get("raw", "")

        # Skip known placeholders
        if SKIP_RAW.search(raw) or len(raw.strip()) < 15:
            continue

        # Re-extract title
        title = extract_title_v2(raw)
        if len(title) < 10:
            continue

        pct = int((n+1) / len(unresolved) * 100)

        # Strategy A: CrossRef title search
        best = None
        items = crossref_title_search(title)
        time.sleep(DELAY)
        for item in items:
            p = parse_cr(item)
            if item.get("score", 0) >= 30 and word_overlap(p["title"], raw) >= 0.25:
                best = {**p, "status": "text-crossref-retry"}
                break

        # Strategy B: CrossRef bibliographic with raw text
        if not best:
            items2 = crossref_biblio_search(raw[:200])
            time.sleep(DELAY)
            for item in items2:
                p = parse_cr(item)
                if item.get("score", 0) >= 30 and word_overlap(p["title"], raw) >= 0.25:
                    best = {**p, "status": "text-crossref-retry"}
                    break

        # Strategy C: OpenAlex
        if not best:
            oa_items = openalex_search(title)
            time.sleep(DELAY)
            for item in oa_items:
                p = parse_oa(item)
                if p["title"] and word_overlap(p["title"], raw) >= 0.25:
                    best = {**p, "status": "text-openalex-retry"}
                    break

        if best:
            updated = {**rec, **best, "title": best["title"] or title}
            recs_by_id[rid] = updated
            print(f"[{pct:3d}%] FIXED #{rid:04d} | {best['title'][:65]}")
            improved += 1
        else:
            # At least update the title hint with the improved extraction
            updated = {**rec, "title": title}
            recs_by_id[rid] = updated
            sys.stdout.write(f"[{pct:3d}%] kept  #{rid:04d} | {title[:65]}\n")

        sys.stdout.flush()

        # Periodic save — write the full dict back as a sorted list
        if (n+1) % 20 == 0:
            out_list = sorted(recs_by_id.values(), key=lambda r: r["id"])
            with open(FILE, "w") as f:
                json.dump(out_list, f, indent=2, ensure_ascii=False)

    # Final save
    out_list = sorted(recs_by_id.values(), key=lambda r: r["id"])
    with open(FILE, "w") as f:
        json.dump(out_list, f, indent=2, ensure_ascii=False)

    # Stats
    by_s = {}
    for r in records:
        s = r.get("status","?"); by_s[s] = by_s.get(s,0)+1

    print(f"\n{'='*55}")
    print(f"Improved: {improved}/{len(unresolved)} unresolved records")
    print("Final breakdown:")
    for s, n in sorted(by_s.items(), key=lambda x:-x[1]):
        print(f"  {s:30s}: {n}")

if __name__ == "__main__":
    main()

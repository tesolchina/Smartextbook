"""
Step 2: Resolve each publication record to full bibliographic metadata.

Reads  : data/pubs_raw.json
Writes : data/pubs_resolved.json  (updated incrementally — safe to re-run)

Lookups (in priority order):
  1. CrossRef by DOI              → authoritative when DOI present
  2. CrossRef bibliographic search → for title/text-only records
  3. OpenAlex title search         → fallback
"""

import json, re, time, urllib.request, urllib.parse, urllib.error, os, sys

BASE  = os.path.dirname(__file__)
RAW   = os.path.join(BASE, "data", "pubs_raw.json")
OUT   = os.path.join(BASE, "data", "pubs_resolved.json")

MAILTO = "docai@hkbu.edu.hk"
DELAY  = 0.15  # seconds between API calls

# ── HTTP helper ───────────────────────────────────────────────────────────────

def get_json(url: str, timeout: int = 20) -> dict:
    req = urllib.request.Request(url, headers={
        "User-Agent": f"DocAI-pipeline/1.0 (mailto:{MAILTO})",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        return {"_error": str(e)}

def clean(s: str) -> str:
    if not s:
        return ""
    # Strip HTML tags
    s = re.sub(r'<[^>]+>', '', s)
    # Normalise whitespace
    s = re.sub(r'\s+', ' ', s).strip()
    return s

# ── CrossRef ─────────────────────────────────────────────────────────────────

def crossref_by_doi(doi: str) -> dict | None:
    url = f"https://api.crossref.org/works/{urllib.parse.quote(doi, safe='/')}?mailto={MAILTO}"
    data = get_json(url)
    if "_error" in data or data.get("status") != "ok":
        return None
    return data.get("message")

def crossref_search(query: str, rows: int = 3) -> list:
    q = urllib.parse.quote(query[:300])
    url = (f"https://api.crossref.org/works"
           f"?query.bibliographic={q}&rows={rows}&mailto={MAILTO}")
    data = get_json(url)
    if "_error" in data:
        return []
    return data.get("message", {}).get("items", [])

def parse_crossref_item(item: dict) -> dict:
    authors = []
    for a in item.get("author", []):
        name = a.get("family", "")
        given = a.get("given", "")
        if given:
            name += f", {given[0]}."  # Lastname, F.
        if name:
            authors.append(name)

    pub_date = item.get("published", {}).get("date-parts", [[""]])[0]
    pub_year = str(pub_date[0]) if pub_date else ""

    doi = item.get("DOI", "")
    link = item.get("URL", "") or (f"https://doi.org/{doi}" if doi else "")

    return {
        "title"   : clean(item.get("title", [""])[0]),
        "authors" : "; ".join(authors),
        "journal" : clean((item.get("container-title") or [""])[0]),
        "pub_year": pub_year,
        "doi"     : doi,
        "url"     : link,
        "source"  : "crossref",
    }

# ── OpenAlex ─────────────────────────────────────────────────────────────────

def openalex_search(query: str) -> list:
    q = urllib.parse.quote(query[:200])
    url = (f"https://api.openalex.org/works"
           f"?search={q}&per-page=3&mailto={MAILTO}")
    data = get_json(url)
    return data.get("results", [])

def parse_openalex_item(item: dict) -> dict:
    authors = []
    for a in item.get("authorships", []):
        name = a.get("author", {}).get("display_name", "")
        if name:
            authors.append(name)

    pub_year = str(item.get("publication_year", "") or "")
    doi = (item.get("doi") or "").replace("https://doi.org/", "")
    oa_url = ((item.get("open_access") or {}).get("oa_url") or
              (item.get("best_oa_location") or {}).get("pdf_url") or
              (item.get("primary_location") or {}).get("landing_page_url") or "")
    link = f"https://doi.org/{doi}" if doi else oa_url

    venue = ((item.get("primary_location") or {}).get("source")) or {}
    journal = venue.get("display_name", "")

    return {
        "title"   : clean(item.get("title", "")),
        "authors" : "; ".join(authors[:6]),
        "journal" : clean(journal),
        "pub_year": pub_year,
        "doi"     : doi,
        "url"     : link,
        "source"  : "openalex",
    }

# ── Scoring helper ─────────────────────────────────────────────────────────────

def word_overlap(a: str, b: str) -> float:
    """Jaccard word overlap between two strings (lowercased, stop-word stripped)."""
    stop = {"the","a","an","of","in","and","or","for","to","on","with","by","at","from"}
    wa = {w for w in re.findall(r'[a-z]+', a.lower()) if w not in stop and len(w) > 2}
    wb = {w for w in re.findall(r'[a-z]+', b.lower()) if w not in stop and len(w) > 2}
    if not wa or not wb:
        return 0.0
    return len(wa & wb) / len(wa | wb)

def is_good_match(candidate_title: str, raw_text: str, threshold: float = 0.35) -> bool:
    score = word_overlap(candidate_title, raw_text)
    return score >= threshold

# ── Main resolver ─────────────────────────────────────────────────────────────

def resolve(rec: dict) -> dict:
    """Fill in metadata for a single publication record."""
    raw  = rec["raw"]
    doi  = rec["doi"]
    url  = rec["url"]
    hint = rec.get("title", "")   # title heuristic from Step 1

    resolved = {}

    # ── Strategy 1: CrossRef by DOI ──────────────────────────────────────────
    if doi:
        item = crossref_by_doi(doi)
        time.sleep(DELAY)
        if item:
            resolved = parse_crossref_item(item)
            resolved["status"] = "doi-crossref"
            return {**rec, **resolved}

    # ── Strategy 2: CrossRef bibliographic search ─────────────────────────────
    # Build query from title hint or raw text
    query = hint if len(hint) >= 20 else raw[:300]
    if len(query) >= 15:
        items = crossref_search(query, rows=3)
        time.sleep(DELAY)
        for item in items:
            parsed = parse_crossref_item(item)
            if (item.get("score", 0) >= 60 and
                    is_good_match(parsed["title"], raw, threshold=0.35)):
                resolved = parsed
                resolved["status"] = "text-crossref"
                return {**rec, **resolved}

        # Looser: if strong DOI URL in raw, trust the metadata from that DOI
        if not resolved and doi:
            pass  # already tried above

    # ── Strategy 3: OpenAlex search ──────────────────────────────────────────
    query_oa = hint if len(hint) >= 20 else raw[:200]
    if len(query_oa) >= 15:
        items = openalex_search(query_oa)
        time.sleep(DELAY)
        for item in items:
            parsed = parse_openalex_item(item)
            if is_good_match(parsed["title"], raw, threshold=0.35):
                resolved = parsed
                resolved["status"] = "text-openalex"
                return {**rec, **resolved}

    # ── Strategy 4: URL only ────────────────────────────────────────────────
    if url and not resolved:
        # Attempt to find DOI from a CrossRef search using the raw text
        # (already tried above) — just record the URL as the link
        title_guess = hint or raw[:150]
        return {**rec,
                "title"   : title_guess,
                "url"     : url,
                "status"  : "url-only"}

    # ── Unresolved ───────────────────────────────────────────────────────────
    return {**rec,
            "title"  : hint or raw[:150],
            "status" : "unresolved"}


def main():
    with open(RAW) as f:
        records = json.load(f)

    # Load previously resolved records so we can resume
    existing = {}
    if os.path.exists(OUT):
        with open(OUT) as f:
            for r in json.load(f):
                existing[r["id"]] = r

    total   = len(records)
    done    = 0
    skipped = 0

    results = []

    for i, rec in enumerate(records):
        rid = rec["id"]

        # Skip if already resolved (non-pending)
        if rid in existing and existing[rid].get("status", "pending") != "pending":
            results.append(existing[rid])
            skipped += 1
            continue

        resolved = resolve(rec)
        results.append(resolved)
        done += 1

        pct = int((i + 1) / total * 100)
        status_icon = {
            "doi-crossref"  : "✓DOI",
            "text-crossref" : "✓CR",
            "text-openalex" : "✓OA",
            "url-only"      : "URL",
            "unresolved"    : "---",
        }.get(resolved.get("status", ""), "?")

        print(f"[{pct:3d}%] #{rid:04d} {status_icon:6s} | {resolved.get('title','')[:60]}")
        sys.stdout.flush()

        # Save incrementally every 20 records
        if done % 20 == 0:
            # Merge: results so far + existing records not yet processed
            processed_ids = {r["id"] for r in results}
            extra = [r for r in existing.values() if r["id"] not in processed_ids]
            merged_so_far = {r["id"]: r for r in results + extra}
            with open(OUT, "w") as f:
                json.dump(sorted(merged_so_far.values(), key=lambda r: r["id"]),
                          f, indent=2, ensure_ascii=False)

    # Final save
    # Merge: results (processed in this run) + any existing not yet processed
    merged = {r["id"]: r for r in results}
    with open(OUT, "w") as f:
        json.dump(sorted(merged.values(), key=lambda r: r["id"]),
                  f, indent=2, ensure_ascii=False)

    # Stats
    by_status = {}
    for r in merged.values():
        s = r.get("status", "?")
        by_status[s] = by_status.get(s, 0) + 1

    print(f"\n{'='*50}")
    print(f"Processed {done} new, skipped {skipped} cached.")
    for s, n in sorted(by_status.items(), key=lambda x: -x[1]):
        print(f"  {s:20s}: {n}")
    print(f"Output → {OUT}")

if __name__ == "__main__":
    main()

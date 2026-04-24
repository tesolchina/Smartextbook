"""
Step 1: Parse raw source sheet data into individual publication records.

Reads  : /tmp/raw_source.json  (dumped by JS)
Writes : data/pubs_raw.json
"""

import json, re, os, sys

SRC  = "/tmp/raw_source.json"
OUT  = os.path.join(os.path.dirname(__file__), "data", "pubs_raw.json")

os.makedirs(os.path.join(os.path.dirname(__file__), "data"), exist_ok=True)

# ── DOI patterns ──────────────────────────────────────────────────────────────
DOI_RE = re.compile(
    r'10\.\d{4,}/[^\s\]\[>)<,"\']+', re.IGNORECASE
)
DOI_URL_RE = re.compile(
    r'https?://(?:dx\.)?doi\.org/(10\.\d{4,}/[^\s\]\[>)<,"\')]+)', re.IGNORECASE
)
URL_RE = re.compile(r'https?://[^\s\]>)<,"\']+')

# ── Title extraction helpers ──────────────────────────────────────────────────

def extract_doi(text: str) -> str:
    m = DOI_URL_RE.search(text)
    if m:
        return m.group(1).rstrip('.')
    m = DOI_RE.search(text)
    if m:
        return m.group(0).rstrip('.')
    return ""

def extract_url(text: str) -> str:
    m = URL_RE.search(text)
    return m.group(0).rstrip('.') if m else ""

def clean(s: str) -> str:
    return re.sub(r'\s+', ' ', s).strip()

def extract_title(raw: str) -> str:
    """
    Try multiple heuristics to extract a clean title from a raw citation string.
    Returns the best guess or empty string.
    """
    text = clean(raw)

    # Remove numbered list prefix e.g. "1." or "2.\t"
    text = re.sub(r'^\d+[\.\)]\s*', '', text)

    # 1. Quoted title: "Title here"
    m = re.search(r'"([^"]{15,200})"', text)
    if m:
        return clean(m.group(1))

    # 2. APA style – year-dot pattern: Author, A. (2020). Title sentence. Journal...
    #    Match the segment between "). " and the next ". " (journal start)
    m = re.search(r'\(\d{4}[a-z]?\)\.\s+(.+?)(?:\.\s+[A-Z][a-z]|\.\s*$|,\s*\d+[\(\,])', text)
    if m:
        cand = clean(m.group(1))
        if 15 <= len(cand) <= 350:
            return cand

    # 3. APA: "Lastname, F. (Year). Title." — pick sentence after year-dot
    m = re.search(r'\(\d{4}[a-z]?\)[.,:]\s+(.+?)(?:\.\s|\.$)', text)
    if m:
        cand = clean(m.group(1))
        if 15 <= len(cand) <= 350:
            return cand

    # 4. Semicolon-separated – last segment often is the title when it's a short
    #    author-list format:  "Author A; Author B; Title Here"
    parts = [p.strip() for p in text.split(';')]
    if len(parts) >= 2:
        last = parts[-1]
        if 15 <= len(last) <= 300 and not re.match(r'^[A-Z][a-z]+,\s', last):
            return clean(last)

    # 5. "&" author pattern: "Smith A & Jones B. Title of paper."
    m = re.search(r'&\s+[A-Z][a-z]+\b[^.]*\.\s+(.+?)(?:\.\s|\.$|,\s*\d)', text)
    if m:
        cand = clean(m.group(1))
        if 15 <= len(cand) <= 350:
            return cand

    # 6. Strip leading author block (LastName, Initials pattern up to year or period)
    #    then take the remainder up to first period or journal keyword
    stripped = re.sub(
        r'^(?:[A-Z][a-zA-Zéàü\-\']+,?\s+(?:[A-Z]\.?\s*){0,4}[,;&\s]*){1,8}'
        r'(?:\(\d{4}[a-z]?\)|\d{4})?[.,\s]*',
        '', text
    ).strip()
    if stripped and len(stripped) >= 15:
        # Take up to first period followed by capital (journal name start)
        m2 = re.match(r'^(.+?)(?:\.\s+[A-Z]|\.$)', stripped)
        if m2:
            cand = clean(m2.group(1))
            if 15 <= len(cand) <= 350:
                return cand
        if len(stripped) <= 350:
            return stripped[:350]

    return ""


def looks_like_real_pub(text: str) -> bool:
    """Filter out empty cells, project-description lines, 'not applicable' etc."""
    t = text.strip().lower()
    if len(t) < 10:
        return False
    skip_phrases = [
        'not applicable', 'see further below', 'conference paper',
        'in preparation', 'in progress', 'forthcoming',
        'articles in preparation', 'papers in preparation',
        'see below', 'tbc', 'n/a',
    ]
    for sp in skip_phrases:
        if t == sp or t.startswith(sp + ' ') or t.startswith(sp + '.'):
            return False
    # must have at least one capital letter block (not pure numbers/URL)
    if re.match(r'^https?://', text.strip(), re.IGNORECASE):
        return True   # URL = yes
    if re.search(r'[A-Z]', text):
        return True
    return False


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    with open(SRC) as f:
        rows = json.load(f)

    header = rows[0]  # ["Year","Project Name","Publication 1", ...]
    records = []
    uid = 1

    for row in rows[1:]:
        if not row:
            continue
        year    = str(row[0]).strip() if len(row) > 0 else ""
        project = str(row[1]).strip() if len(row) > 1 else ""

        # All publication columns (C onwards = index 2+)
        pub_cells = [str(c).strip() for c in row[2:] if str(c).strip()]

        for raw_text in pub_cells:
            if not looks_like_real_pub(raw_text):
                continue

            # Split by numbered list markers inside a single cell
            # e.g. "1. Smith... 2. Jones..."
            sub_items = re.split(r'\n\d+[\.\)]\s+', raw_text)
            if len(sub_items) == 1 and re.search(r'\n', raw_text):
                # Multi-line cell — could be multiple pubs separated by newlines
                lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
                # If first line looks like a standalone URL or DOI, treat separately
                if len(lines) > 1 and URL_RE.match(lines[0]):
                    sub_items = lines
            # Remove leading "1. " from first sub_item if present
            sub_items = [re.sub(r'^\d+[\.\)]\s*', '', s).strip() for s in sub_items]
            sub_items = [s for s in sub_items if looks_like_real_pub(s)]

            for raw in sub_items:
                doi  = extract_doi(raw)
                url  = extract_url(raw) if not doi else f"https://doi.org/{doi}"
                title = extract_title(raw) if not doi else ""  # if DOI, CrossRef gives title

                rec = {
                    "id"      : uid,
                    "year"    : year,
                    "project" : project,
                    "raw"     : raw[:800],   # truncate very long cells
                    "doi"     : doi,
                    "url"     : url,
                    "title"   : title,       # best-guess; Step 2 will refine
                    "authors" : "",
                    "journal" : "",
                    "pub_year": "",
                    "status"  : "pending",
                }
                records.append(rec)
                uid += 1

    with open(OUT, "w") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    print(f"Parsed {len(records)} publication records → {OUT}")
    doi_count = sum(1 for r in records if r["doi"])
    url_count = sum(1 for r in records if r["url"] and not r["doi"])
    print(f"  With DOI : {doi_count}")
    print(f"  URL only : {url_count}")
    print(f"  Text only: {len(records) - doi_count - url_count}")

if __name__ == "__main__":
    main()

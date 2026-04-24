"""
Step 4: Download PDFs for papers that don't yet have a Drive link.

For each row in the new sheet (column H = DOI, column L = Drive PDF empty):
  1. Try OpenAlex  → open-access PDF URL
  2. Try Unpaywall → OA PDF URL
  3. Try Sci-Hub   → scrape citation_pdf_url meta tag

Downloads are uploaded to the Drive folder.
Sheet column L (Drive PDF) is updated with the file link.

Env vars required:
  DRIVE_TOKEN   — Google Drive OAuth access token
  SHEETS_TOKEN  — Google Sheets OAuth access token
"""

import json, re, os, sys, time, urllib.request, urllib.parse, urllib.error, tempfile, subprocess, gzip

SHEET_ID    = "17EicoOdub2lHzwrWNNKjbY4czf7iFHux4XKVzSnNUZk"
FOLDER_ID   = "1Iw5lNZDExckEbLeb2zN37YGSnKjzqOq-"
MAILTO      = "docai@hkbu.edu.hk"
DELAY_OA    = 0.25  # between open-access attempts
DELAY_SH    = 2.5   # between Sci-Hub attempts
SCIHUB_BASE = "https://sci-hub.st"
# Set SKIP_SCIHUB=1 env var to skip Sci-Hub in this run
SKIP_SCIHUB = os.environ.get("SKIP_SCIHUB", "0") == "1"
MAX_SCIHUB  = int(os.environ.get("MAX_SCIHUB", "50"))   # max Sci-Hub tries per run

DRIVE_TOKEN  = os.environ.get("DRIVE_TOKEN", "")
SHEETS_TOKEN = os.environ.get("SHEETS_TOKEN", "")

if not DRIVE_TOKEN or not SHEETS_TOKEN:
    print("ERROR: DRIVE_TOKEN and SHEETS_TOKEN must be set.", file=sys.stderr)
    sys.exit(1)

# ── Tracking file ─────────────────────────────────────────────────────────────
BASE    = os.path.dirname(__file__)
TRACKER = os.path.join(BASE, "data", "download_log.json")

def load_tracker() -> dict:
    if os.path.exists(TRACKER):
        with open(TRACKER) as f:
            return json.load(f)
    return {}

def save_tracker(t: dict):
    with open(TRACKER, "w") as f:
        json.dump(t, f, indent=2)

# ── HTTP helpers ──────────────────────────────────────────────────────────────

def http_get(url: str, headers: dict = None, timeout: int = 30) -> bytes | None:
    default_headers = {
        "User-Agent"     : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept"         : "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
    }
    if headers:
        default_headers.update(headers)
    req = urllib.request.Request(url, headers=default_headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read()
            enc  = r.headers.get("Content-Encoding", "")
            if enc == "gzip" or (data[:2] == b'\x1f\x8b'):
                try:
                    data = gzip.decompress(data)
                except Exception:
                    pass
            return data
    except Exception:
        return None

def api_get(url: str, token: str = "") -> dict:
    headers = {"Accept": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        return {"_error": str(e)}

def is_pdf(data: bytes) -> bool:
    return data[:4] == b'%PDF' if data and len(data) > 4 else False

# ── Open Access sources ───────────────────────────────────────────────────────

def openalex_pdf_url(doi: str) -> str:
    enc = urllib.parse.quote(doi, safe="")
    data = api_get(f"https://api.openalex.org/works/https://doi.org/{enc}?mailto={MAILTO}")
    if "_error" in data:
        return ""
    oa = data.get("open_access") or {}
    if oa.get("oa_url"):
        return oa["oa_url"]
    best = data.get("best_oa_location") or {}
    return best.get("pdf_url") or best.get("url") or ""

def unpaywall_pdf_url(doi: str) -> str:
    enc = urllib.parse.quote(doi, safe="")
    data = api_get(f"https://api.unpaywall.org/v2/{enc}?email={MAILTO}")
    if "_error" in data or not data.get("is_oa"):
        return ""
    best = data.get("best_oa_location") or {}
    return best.get("url_for_pdf") or best.get("url") or ""

# ── Sci-Hub ───────────────────────────────────────────────────────────────────

SCIHUB_MIRRORS = ["https://sci-hub.ru", "https://sci-hub.st"]

def _scihub_extract(html: bytes, base: str) -> str:
    """Parse a Sci-Hub HTML page and return the absolute PDF URL."""
    text = html.decode("utf-8", errors="ignore")

    def make_abs(url: str) -> str:
        if url.startswith("http"):
            return url
        if url.startswith("//"):
            return "https:" + url
        return base + url

    # 1. <meta name="citation_pdf_url" content="...">
    for pattern in [
        r'<meta[^>]+name=["\']citation_pdf_url["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']citation_pdf_url["\']',
    ]:
        m = re.search(pattern, text, re.I)
        if m:
            return make_abs(m.group(1))

    # 2. <embed src="..."> or <iframe src="...">
    m = re.search(r'<(?:embed|iframe)[^>]+src=["\']([^"\']+)["\']', text, re.I)
    if m:
        src = m.group(1).split("#")[0].split("?")[0]
        if src and not src.startswith("javascript"):
            return make_abs(src)

    # 3. /version/... or /storage/... path pattern
    m = re.search(r'(/(?:version|storage)/[^\s"\'<>]+\.pdf)', text, re.I)
    if m:
        return make_abs(m.group(1))

    # Only flag CAPTCHA when we genuinely found no PDF and the page is a challenge form
    if re.search(r'<form[^>]+action[^>]+captcha', text, re.I) or \
       re.search(r'solve\s+the\s+captcha', text, re.I):
        print("  ⚠  Sci-Hub CAPTCHA challenge — skipping mirror")

    return ""


def scihub_pdf_url(doi: str) -> str:
    """Try Sci-Hub mirrors in order; return the PDF URL or ''."""
    enc = urllib.parse.quote(doi, safe="/")
    for mirror in SCIHUB_MIRRORS:
        html = http_get(f"{mirror}/{enc}")
        if not html:
            continue
        url = _scihub_extract(html, mirror)
        if url:
            return url
        time.sleep(1)
    return ""


def libgen_pdf_url(doi: str) -> str:
    """Try Library Genesis scimag as a last resort."""
    enc = urllib.parse.quote(doi, safe="")
    # Direct get URL
    url = f"https://libgen.li/scimag/get.php?doi={enc}"
    html = http_get(url)
    if html and is_pdf(html):
        return url   # signal caller to use this bytes directly
    return ""

# ── Drive upload ──────────────────────────────────────────────────────────────

def sanitise_filename(s: str) -> str:
    s = re.sub(r'[<>:"/\\|?*\x00-\x1f]', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s[:80]

def drive_upload(pdf_bytes: bytes, filename: str) -> str:
    """Upload PDF to Drive folder; return webViewLink."""
    meta = json.dumps({"name": filename, "parents": [FOLDER_ID]}).encode()

    boundary = b"------WebKitFormBoundary7MA4YWxkTrZu0gW"
    body = (
        boundary + b"\r\n"
        b'Content-Disposition: form-data; name="metadata"\r\n'
        b"Content-Type: application/json; charset=UTF-8\r\n\r\n"
        + meta + b"\r\n"
        + boundary + b"\r\n"
        b'Content-Disposition: form-data; name="file"\r\n'
        b"Content-Type: application/pdf\r\n\r\n"
        + pdf_bytes + b"\r\n"
        + boundary + b"--\r\n"
    )

    req = urllib.request.Request(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
        data=body,
        method="POST",
        headers={
            "Authorization" : f"Bearer {DRIVE_TOKEN}",
            "Content-Type"  : f"multipart/related; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            result = json.loads(r.read().decode())
            return result.get("webViewLink", "")
    except Exception as e:
        print(f"  Drive upload error: {e}")
        return ""

# ── Sheet helpers ─────────────────────────────────────────────────────────────

def sheet_get(range_: str) -> list:
    url = (f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}"
           f"/values/{urllib.parse.quote(range_, safe='!:')}")
    data = api_get(url, SHEETS_TOKEN)
    return data.get("values", [])

def sheet_update_cell(row: int, col: str, value: str):
    range_ = f"Publications!{col}{row}"
    url = (f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}"
           f"/values/{urllib.parse.quote(range_, safe='!:')}"
           f"?valueInputOption=USER_ENTERED")
    body = json.dumps({"range": range_, "values": [[value]]}).encode()
    req = urllib.request.Request(url, data=body, method="PUT",
        headers={"Authorization": f"Bearer {SHEETS_TOKEN}",
                 "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        print(f"  Sheet update error: {e}")
        return {}

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    tracker = load_tracker()

    # Read sheet: columns A(#) H(DOI) K(title) L(Drive PDF)
    rows_data = sheet_get("Publications!A2:L400")
    print(f"Sheet rows: {len(rows_data)}")

    # Find rows needing download: have DOI, no Drive PDF link
    targets = []
    for i, r in enumerate(rows_data):
        row_num    = i + 2                        # 1-based sheet row
        rec_id     = r[0] if r else ""
        title      = r[3] if len(r) > 3 else ""  # column D
        doi        = r[7].strip() if len(r) > 7 else ""   # column H
        drive_link = r[11].strip() if len(r) > 11 else "" # column L

        if doi and not drive_link:
            targets.append({
                "row_num": row_num,
                "rec_id" : rec_id,
                "title"  : title,
                "doi"    : doi,
            })

    print(f"Papers needing download: {len(targets)}")
    print(f"Previously attempted:   {len(tracker)}")

    # Filter already attempted
    pending = [t for t in targets if t["doi"] not in tracker]
    print(f"New attempts this run:  {len(pending)}")
    print()

    downloaded  = 0
    failed      = 0
    sh_attempts = 0

    for n, t in enumerate(pending):
        doi   = t["doi"]
        title = t["title"] or doi
        pct   = int((n+1) / len(pending) * 100)

        print(f"[{pct:3d}%] #{t['rec_id']:>4} {doi[:40]}")

        pdf_bytes = None
        source    = ""

        # ── 1. OpenAlex ──────────────────────────────────────────────────────
        oa_url = openalex_pdf_url(doi)
        time.sleep(DELAY_OA)
        if oa_url:
            print(f"       OA URL: {oa_url[:60]}")
            pdf_bytes = http_get(oa_url)
            if is_pdf(pdf_bytes):
                source = "OpenAlex-OA"
            else:
                pdf_bytes = None

        # ── 2. Unpaywall ─────────────────────────────────────────────────────
        if not pdf_bytes:
            uw_url = unpaywall_pdf_url(doi)
            time.sleep(DELAY_OA)
            if uw_url and uw_url != oa_url:
                print(f"       Unpaywall: {uw_url[:60]}")
                pdf_bytes = http_get(uw_url)
                if is_pdf(pdf_bytes):
                    source = "Unpaywall"
                else:
                    pdf_bytes = None

        # ── 3. Sci-Hub (both mirrors) ────────────────────────────────────────
        if not pdf_bytes and not SKIP_SCIHUB and sh_attempts < MAX_SCIHUB:
            sh_url = scihub_pdf_url(doi)
            sh_attempts += 1
            time.sleep(DELAY_SH)
            if sh_url:
                print(f"       Sci-Hub:   {sh_url[:70]}")
                pdf_bytes = http_get(sh_url)
                if is_pdf(pdf_bytes):
                    source = "Sci-Hub"
                else:
                    pdf_bytes = None

        # ── 4. LibGen ────────────────────────────────────────────────────────
        if not pdf_bytes and not SKIP_SCIHUB:
            lg_url = libgen_pdf_url(doi)
            time.sleep(DELAY_OA)
            if lg_url:
                print(f"       LibGen:    {lg_url[:70]}")
                pdf_bytes = http_get(lg_url)
                if is_pdf(pdf_bytes):
                    source = "LibGen"
                else:
                    pdf_bytes = None

        # ── Upload & update ──────────────────────────────────────────────────
        if pdf_bytes and is_pdf(pdf_bytes):
            safe_title = sanitise_filename(title)
            filename   = f"{str(t['rec_id']).zfill(3)}_{safe_title}.pdf"
            drive_link = drive_upload(pdf_bytes, filename)

            if drive_link:
                sheet_update_cell(t["row_num"], "L", drive_link)
                tracker[doi] = {"status": "ok", "source": source,
                                 "file": filename, "link": drive_link}
                save_tracker(tracker)
                print(f"       ✓ {source} → uploaded ({len(pdf_bytes)//1024}KB)")
                downloaded += 1
            else:
                tracker[doi] = {"status": "upload-failed", "source": source}
                save_tracker(tracker)
                print(f"       ✗ Upload failed")
                failed += 1
        else:
            tracker[doi] = {"status": "not-found"}
            save_tracker(tracker)
            print(f"       – not available")
            failed += 1

        sys.stdout.flush()

    print(f"\n{'='*55}")
    print(f"Downloaded & uploaded: {downloaded}")
    print(f"Not available:         {failed}")
    total_linked = downloaded + sum(1 for v in tracker.values() if v.get("status") == "ok")
    print(f"Total with Drive PDF:  ~{total_linked}")

if __name__ == "__main__":
    main()

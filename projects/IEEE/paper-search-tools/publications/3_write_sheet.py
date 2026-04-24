"""
Step 3: Write resolved publication records to a new Google Sheet.

Reads  : data/pubs_resolved.json
Creates: a new Google Sheet and prints the URL.

Env var: SHEETS_TOKEN  — OAuth 2.0 access token for Google Sheets/Drive APIs.
"""

import json, os, sys, urllib.request, urllib.error, time

BASE  = os.path.dirname(__file__)
DATA  = os.path.join(BASE, "data", "pubs_resolved.json")

TOKEN = os.environ.get("SHEETS_TOKEN", "")
if not TOKEN:
    print("ERROR: SHEETS_TOKEN env var not set.", file=sys.stderr)
    sys.exit(1)

FOLDER_ID = "1Iw5lNZDExckEbLeb2zN37YGSnKjzqOq-"   # existing Drive folder

# ── HTTP helpers ──────────────────────────────────────────────────────────────

def api(method: str, url: str, body: dict | None = None) -> dict:
    data = json.dumps(body).encode() if body else None
    req  = urllib.request.Request(
        url, data=data, method=method,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type" : "application/json",
            "Accept"       : "application/json",
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"HTTP {e.code}: {body[:300]}")

# ── Create sheet ──────────────────────────────────────────────────────────────

def create_spreadsheet(title: str) -> tuple[str, str]:
    """Returns (spreadsheet_id, sheet_id_str)."""
    body = {
        "properties": {"title": title},
        "sheets": [{
            "properties": {
                "title": "Publications",
                "gridProperties": {"frozenRowCount": 1}
            }
        }]
    }
    result = api("POST",
                 "https://sheets.googleapis.com/v4/spreadsheets",
                 body)
    sid  = result["spreadsheetId"]
    gsid = str(result["sheets"][0]["properties"]["sheetId"])
    return sid, gsid


def move_to_folder(file_id: str, folder_id: str):
    """Move a Drive file to a folder (add parent)."""
    # Get current parents
    url = f"https://www.googleapis.com/drive/v3/files/{file_id}?fields=parents"
    r   = api("GET", url)
    old = ",".join(r.get("parents", []))

    url2 = (f"https://www.googleapis.com/drive/v3/files/{file_id}"
            f"?addParents={folder_id}&removeParents={old}&fields=id")
    api("PATCH", url2)


# ── Write data ────────────────────────────────────────────────────────────────

COLUMNS = ["#", "Year", "Project", "Title", "Authors", "Journal",
           "Pub Year", "DOI", "Link", "Resolution", "Raw (truncated)"]

STATUS_LABEL = {
    "doi-crossref"  : "DOI → CrossRef",
    "text-crossref" : "Text → CrossRef",
    "text-openalex" : "Text → OpenAlex",
    "url-only"      : "URL only",
    "unresolved"    : "Unresolved",
}

def to_row(rec: dict) -> list:
    label = STATUS_LABEL.get(rec.get("status", ""), rec.get("status", ""))
    title = rec.get("title", "")
    # Strip any lingering HTML
    import re
    title = re.sub(r'<[^>]+>', '', title).strip()

    doi  = rec.get("doi", "")
    link = rec.get("url", "")
    if doi and not link:
        link = f"https://doi.org/{doi}"

    return [
        rec.get("id", ""),
        rec.get("year", ""),
        rec.get("project", ""),
        title,
        rec.get("authors", ""),
        rec.get("journal", ""),
        rec.get("pub_year", ""),
        doi,
        link,
        label,
        rec.get("raw", "")[:200],
    ]


def batch_write(sid: str, rows: list[list]):
    """Write all rows in one batchUpdate call (chunked to ≤500 rows)."""
    CHUNK = 500
    for start in range(0, len(rows), CHUNK):
        chunk = rows[start:start + CHUNK]
        body  = {
            "valueInputOption": "USER_ENTERED",
            "data": [{
                "range" : f"Publications!A{start + 1}",
                "values": chunk,
            }]
        }
        api("POST",
            f"https://sheets.googleapis.com/v4/spreadsheets/{sid}/values:batchUpdate",
            body)
        time.sleep(0.5)


def apply_formatting(sid: str, gsid: str, n_data_rows: int):
    """Bold header row, auto-resize columns, freeze row 1, colour by status."""
    sheet_id = int(gsid)

    requests = [
        # Bold header
        {
            "repeatCell": {
                "range": {"sheetId": sheet_id, "startRowIndex": 0, "endRowIndex": 1},
                "cell": {"userEnteredFormat": {"textFormat": {"bold": True},
                                               "backgroundColor": {"red": 0.23, "green": 0.47, "blue": 0.75}}},
                "fields": "userEnteredFormat(textFormat,backgroundColor)"
            }
        },
        # Auto-resize all columns
        {
            "autoResizeDimensions": {
                "dimensions": {
                    "sheetId": sheet_id,
                    "dimension": "COLUMNS",
                    "startIndex": 0,
                    "endIndex": len(COLUMNS)
                }
            }
        },
        # Set fixed widths for readability
        {
            "updateDimensionProperties": {
                "range": {"sheetId": sheet_id, "dimension": "COLUMNS",
                          "startIndex": 3, "endIndex": 4},   # Title
                "properties": {"pixelSize": 380},
                "fields": "pixelSize"
            }
        },
        {
            "updateDimensionProperties": {
                "range": {"sheetId": sheet_id, "dimension": "COLUMNS",
                          "startIndex": 10, "endIndex": 11},  # Raw
                "properties": {"pixelSize": 300},
                "fields": "pixelSize"
            }
        },
    ]

    api("POST",
        f"https://sheets.googleapis.com/v4/spreadsheets/{sid}:batchUpdate",
        {"requests": requests})


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    with open(DATA) as f:
        records = json.load(f)

    # Sort by ID
    records.sort(key=lambda r: r.get("id", 0))

    title = "HKBU Publications — Clean List (auto-generated)"
    print(f"Creating new Google Sheet: {title!r}")
    sid, gsid = create_spreadsheet(title)
    print(f"  Sheet ID : {sid}")
    print(f"  Sheet URL: https://docs.google.com/spreadsheets/d/{sid}")

    # Move to Drive folder
    try:
        move_to_folder(sid, FOLDER_ID)
        print(f"  Moved to Drive folder {FOLDER_ID}")
    except Exception as e:
        print(f"  (Could not move to folder: {e})")

    # Write data
    rows = [COLUMNS]
    for rec in records:
        rows.append(to_row(rec))

    print(f"Writing {len(rows)-1} data rows …")
    batch_write(sid, rows)

    # Format
    print("Applying formatting …")
    apply_formatting(sid, gsid, len(records))

    # Summary stats
    by_status = {}
    for r in records:
        s = r.get("status", "?")
        by_status[s] = by_status.get(s, 0) + 1

    print(f"\n{'='*55}")
    print(f"  Total records     : {len(records)}")
    for s, n in sorted(by_status.items(), key=lambda x: -x[1]):
        label = STATUS_LABEL.get(s, s)
        print(f"  {label:25s}: {n}")
    print(f"\n  ✓ Sheet: https://docs.google.com/spreadsheets/d/{sid}")

    # Save the sheet ID for reference
    with open(os.path.join(BASE, "data", "new_sheet_id.txt"), "w") as f:
        f.write(sid)

if __name__ == "__main__":
    main()

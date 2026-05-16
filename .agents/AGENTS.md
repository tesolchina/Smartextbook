# How agents maintain tesolchina/gtd

  > **This file lives in every sister repo** so any agent working here knows how to
  > interact with the shared GTD coordinator at `tesolchina/gtd`.

  ---

  ## What tesolchina/gtd is

  `tesolchina/gtd` is the shared coordination hub for all five tesolchina projects.
  It holds:
  - **inbox/** — raw captured tasks from any project
  - **next-actions/@smartextbook.md** — the dispatched next-actions for THIS repo
  - **reviews/** — weekly synthesis across all repos
  - **projects/** — cross-repo epics

  **This repo's context tag:** `@smartextbook`
  **Default research line:** C — AI literacy / BYOK lesson tool
  **Priority order (hardcoded):** B → C → A → D → meta → none

  ---

  ## How to read your next-actions

  The tasks dispatched to this repo live at:
  ```
  https://github.com/tesolchina/gtd/blob/main/next-actions/@smartextbook.md
  ```

  Or fetch via API (any agent can do this without a special token — repo is private but
  org members have read access):
  ```bash
  curl -H "Authorization: Bearer $GH_PAT" \
    https://api.github.com/repos/tesolchina/gtd/contents/next-actions/%40smartextbook.md \
    | jq -r '.content' | base64 -d
  ```

  ---

  ## How to add an inbox item

  ### Option A — GitHub Issue (easiest)
  Open a new issue in `tesolchina/gtd` using the **📥 Inbox — New Capture** template.
  The clarify workflow will automatically save it to `inbox/`.

  ### Option B — API (for agents)
  ```javascript
  const token = process.env.GH_PAT; // needs: repo scope
  const date = new Date().toISOString().slice(0, 10);
  const slug = 'your-short-description';
  const content = Buffer.from(`---
  source: smartextbook
  raw_id: ""
  captured_at: "${new Date().toISOString()}"
  captured_by: "agent"
  ---

  Your raw task or idea here.
  `).toString('base64');

  await fetch(`https://api.github.com/repos/tesolchina/gtd/contents/inbox/${date}-${slug}.md`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({
      message: `capture: inbox item from @smartextbook`,
      content
    })
  });
  ```

  ---

  ## Token requirements

  | Operation | Scope needed | Where to store |
  |---|---|---|
  | Read gtd files | `repo` (since gtd is private) | `GH_PAT` secret in this repo |
  | Write inbox item | `repo` | `GH_PAT` secret in this repo |
  | Open a PR on gtd | `repo` | `GH_PAT` secret in this repo |
  | Trigger gtd Actions | `workflow` + `repo` | separate `GH_WORKFLOW_PAT` secret |

  > **How to create the token:**
  > GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
  > → Repository access: `tesolchina/gtd` → Permissions: Contents (read & write), Pull requests (write)
  >
  > Store it as a repo secret named `GH_PAT` in **this repo** (`tesolchina/Smartextbook`).
  > Simon must do this once per repo in GitHub Settings → Secrets → Actions.

  ---

  ## PR-only rule

  **Never push directly to `tesolchina/gtd` main.**
  All writes must go via a pull request. Reviewer = `tesolchina` (Simon).

  To open a PR from an agent:
  1. Create a branch in gtd via API
  2. Push file changes to that branch
  3. Open a PR targeting `main`
  4. Leave a comment explaining the change
  5. Simon merges

  ---

  ## Hard rules (never break these)

  1. Inbox is never deleted — only suggest disposition; Simon decides
  2. Sister repos (including this one) are the **source of truth** for issue status
  3. Priority order: B → C → A → D → meta → none (never reorder)
  4. Student names → 花名 + last-4-digits of student ID
  5. Local school teachers → surname only
  6. All gtd writes via PR; no direct push to main

  ---

  ## Cross-repo epics

  If a task spans this repo and others, it gets a `projects/<slug>/README.md` entry
  in the gtd repo, and issues here should be labelled `gtd-epic:<id>`.

  ---

  *Last updated: 2026-05-07 | Source: tesolchina/gtd agents/SKILL.md*
  
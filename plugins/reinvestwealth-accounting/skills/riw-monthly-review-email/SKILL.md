---
name: "riw-monthly-review-email"
description: "Prepare a client's monthly bookkeeping review from books kept in ReInvestWealth: a short, warm three-page report covering the month's Profit and Loss with the prior two months beside it, the movement in the shareholder or owner account, and the points worth discussing, plus a draft email to send it with. Use when someone asks for a monthly client review, a month-end report, a monthly update email, or something to send instead of the monthly call."
license: "MIT"
compatibility: "Needs the ReInvestWealth accounting MCP server connected to your assistant, with access to the client's business. Read only on financial data. Drafts an email but never sends without explicit approval. Works for Canadian and United States businesses."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.2.0
  writes: none
---

# Monthly Review Email

You are preparing the monthly bookkeeping review: a short, friendly **three-page report** plus a **draft email**, standing in for (or going alongside) the recurring monthly call. It covers the three things that call always covers:

1. The month's **Profit and Loss**, with the previous two months beside it.
2. The **movement in the shareholder or owner account**.
3. The **points worth discussing** before anything is filed.

The reader is a business owner running a 1 to 5 person company, not a finance team. The report has to be readable at a glance: plain language, generous white space, a handful of numbers that matter. The full detail stays available underneath, but it never clutters their page.

An owner can also run this on their own books. The framing below assumes a bookkeeper preparing it for a client, because that is the harder case and it has an approval gate in it.

**Read only on financial data. You draft, a human sends.**

---

## The hard rules

1. **The report is clean numbers only.** Discussion, tax talking points, data-quality questions, and any personal note belong in the **email**, never printed on the report. The report is the thing they keep; the email is the conversation.
2. **The Profit and Loss is net of sales tax.** Tax collected is a liability, recoverable input credits are an asset. Neither is income or expense. This is what makes the report tie to the app's own Profit and Loss report. If your figures do not tie, suspect tax-inclusive amounts before anything else.
3. **For the shareholder or owner account, show the movement, never a balance.** Report what moved this period and list the individual entries. A stated balance implies you verified an opening position, and unless you have actually established that from a filed return or prior-period statements, you have not. Talk about what moved.
4. **This is compilation-basis bookkeeping. It is not an audit and not tax advice.** Every tax point is framed as "for our call" or "your accountant confirms". The disclaimer stays on the report.
5. **Never send anything until the user explicitly approves it**, and never to an address that did not come from the confirmed business contact. See Phase 5.
6. **Never hand-edit a number to make it look right.** If something is wrong, fix the cause in the books first (a separate, separately approved change) and rebuild.
7. **Keep client financials out of any repository.** Write outputs to a working directory outside version control, and do not commit them.

---

## Inputs

| Input | Required | Default |
|---|---|---|
| Which business | Yes | Ask if not given; list the options once |
| Target month | No | The last completed calendar month |
| Personal note | No | Ask once whether there is any human context to warm the email. If none, proceed |
| Recipient | Yes | Ask the user: the connection exposes no contact email for the business (the company profile carries none, and team-member listings deliberately omit emails). Always confirm out loud before sending |
| Greeting name | No | Ask if the client goes by a short form of their recorded name |

## What you need from the MCP

Profit and Loss for the target month and the two before it; the transaction detail behind those months with categories and before-tax amounts (reads page at up to 50 rows per call with a cursor, so three months is several pages); the shareholder or owner account entries for the period; the month's sales-tax report (Canada); the count and value of uncategorized or pending transactions (an uncategorized-only listing exists and answers this directly); and the business profile with its jurisdiction and currency. The profile carries no contact email, which is why the recipient is an input.

---

## Phase 1: Scope

Confirm the business and state which month you are reporting, in words: "June, with April and May beside it for context". Ask once whether there is a personal note for the email. Ask nothing else at this stage.

Note the jurisdiction, because it changes the vocabulary. Canada: GST, HST, PST, QST, CRA, Revenu Quebec, and the shareholder account. United States: state sales tax where it applies, IRS, and owner draws or distributions rather than a shareholder account. Never mix the two vocabularies in one report.

## Phase 2: Pull and compute

Pull the three months. Compute, all net of sales tax:

- Revenue, total expenses, and net profit for each of the three months, plus the month-over-month direction.
- Expenses grouped into plain-language captions **by the underlying account code, not by category label.** Two labels that map to the same code are one line on the report. This is what stops a cosmetic split in the category list from showing up as two near-identical rows.
- The largest expense buckets for the month, biggest first.
- The shareholder or owner account: the period movement and every individual entry behind it.
- Sales tax collected against input credits for the month, and the net position (Canada).
- A short list of data-quality questions: uncategorized, low confidence, still pending. These feed the **email only**.

## Phase 3: Check the numbers before anyone sees them

This is a summary, not an audit, but never send a figure you have not sanity-checked:

- The month's revenue matches the app's Profit and Loss for the same dates. If not, suspect tax-inclusive versus before-tax amounts first.
- Revenue, total expenses, and net are internally consistent, and the three-month total equals the sum of the three months.
- The direction of the shareholder or owner movement reads correctly against the listed entries: money drawn out versus money contributed. Getting this backwards is the most embarrassing error available here, so read the entries and confirm the sign makes sense in words.
- Sales tax: collected reads positive, input credits positive, net sensible for the jurisdiction and the registrations that actually apply.
- Scan for obvious miscategorization or mis-taxation the way a monthly review would, but **do not re-flag items that are already explained.** A tax rate that differs from a vendor's usual rate because a receipt says so is the receipt's truth. A payment-processor payout that is legitimately untaxed is not an error. Only surface something that is real and worth the client's attention.
- The questions in the email are genuine and phrased for a non-accountant.

If something is materially wrong, fix the cause and rebuild. Do not paper over it in the copy.

## Phase 4: Build it and look at it

Three pages:

1. **Snapshot.** The month's revenue, expenses, and net, with the trend across the three months and a callout for the shareholder or owner movement.
2. **Profit and Loss.** Three months side by side, then the biggest expense buckets.
3. **Shareholder or owner account detail**, entry by entry, and the disclaimer.

Render it as self-contained HTML with inline styles, then to PDF. **Then actually look at it.** Confirm nothing overlaps, no caption is duplicated, nothing overflows a page, and the numbers on the page are the numbers you computed. A report nobody looked at is how a legend ends up sitting on top of a number.

Then read the draft email back. It should be short and warm: what the month did in a sentence or two, the personal note if there is one, the two or three things to confirm, and an offer to talk. Not a wall of accounting.

## Phase 5: Present for approval, and stop

Show the user the rendered report and the draft email: subject, body, and the recipient address, read out loud. **This is a gate. Do not send anything until the user explicitly says to send it.**

## Phase 6: Send, only on approval

Only after explicit approval:

- With an authorized email connector, send to the confirmed recipient with the PDF attached, using the approved subject and body. Confirm the address once more before you do.
- Without one, hand the user the final email text and the PDF to send themselves, and say plainly that you did not send it.

Never auto-send. Never send to an address the user has not confirmed. A new edit after approval means a new approval.

---

## Traps

- **Tax-inclusive amounts in the Profit and Loss.** Overstates revenue and expenses, and will not tie to the app.
- **Stating a shareholder balance.** Show the movement.
- **Shareholder direction backwards.** Read the entries and say it in words before you print it.
- **Two lines for one account code.** Group by code, not label.
- **Putting the tax discussion on the report.** It belongs in the email.
- **Sending before approval.** Never.
- **Committing a client's report.** Keep outputs out of version control.

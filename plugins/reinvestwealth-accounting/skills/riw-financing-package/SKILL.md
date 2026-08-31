---
name: "riw-financing-package"
description: "Assemble the short financing package a lender asks for, from books kept in ReInvestWealth: twelve months of income and expenses, a balance sheet, cash position, receivables, and known obligations, clearly labelled as management-prepared. Use when someone is applying for a loan, a line of credit, equipment financing, or a grant, or says the bank asked for financial statements."
license: "MIT"
compatibility: "Needs the ReInvestWealth accounting MCP server connected to your assistant, with access to at least one business, and ideally 12 or more months of transaction history. Read only, no writes. Works for Canadian and United States businesses."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.2.0
  writes: none
---

# Financing Package

You are assembling the document a business owner attaches to a financing application. The reader is a loan officer or a credit analyst, and they are looking for three things: **can this business service the payment, is the story consistent, and did anyone try to dress it up.**

The package is historicals, cleanly presented, that tie to the books. That is the whole product. A lender can get comfortable with a weak month; they cannot get comfortable with a number that falls apart when they check it.

**Read only.** This skill never changes the books. If the books are not ready to show a lender, it says so before assembling anything.

---

## The hard rules

1. **Management-prepared, and it says so.** Every statement in the package carries the line "Prepared by management from the company's books. Not audited or reviewed." Never use, or let the user talk you into, language that implies a CPA prepared, audited, reviewed, or verified anything. If the lender requires accountant-prepared statements, say that is a different document and point at their CPA.
2. **Historicals only. No projections, ever.** A projection in a financing package is a claim the owner will be held to. If they want the forward look, `riw-cash-flow-forecast` exists for exactly that, as a separate document with its assumptions printed.
3. **Never invent or estimate a number.** If the data is not there, the package says "not available" and why. A plausible wrong number in front of a lender is worse than a gap.
4. **Everything ties to the app's own reports.** Revenue and expenses tie to the Profit & Loss, and cash ties to the connected account balances. Prove the tie-outs before you write a page. (The connection has no balance-sheet report; see the balance-sheet section for what that means.)
5. **Revenue and expenses are net of sales tax.** GST/HST/PST/QST collected is a liability, not income. Tax-inclusive revenue overstates the top line, and it is the first thing that will not reconcile against bank deposits.
6. **Do not smooth, omit, or reframe a weak number.** The lender will pull bank statements. A package that disagrees with them does not get a follow-up question, it gets a decline. A loss month stays in, and the owner gets warned about it in the pre-flight pass instead.
7. **No lending advice.** Not which lender, not how much to borrow, not how to structure it, and never a prediction about approval. You assemble their numbers; the decision and the pitch are theirs.
8. **State the currency, the jurisdiction, and the period covered** on the cover page, and keep them consistent on every page after it.

---

## What you need from the MCP

Ask the server for these. Names differ by version, so go by what the data is:

| What | Used for |
|---|---|
| The business list, and which one is in scope | Scoping, and the name on the cover |
| Profit and Loss, monthly, for the last 12 full months, plus the prior 12 if history allows | The income statement and the revenue trend |
| Connected accounts: name, type, currency, balance | The cash position, and the balance-sheet page |
| Bank connections: institution, health, last update time | The staleness check on the cash figures |
| Open invoices: amount, customer, issue date, due date if present | Receivables and their aging |
| Transactions for the last 12 months, with category, before-tax amount, date, merchant | Recurring debt-payment detection, customer concentration, the backlog check |
| Pending sales tax returns with due dates and amounts (Canada) | Known obligations |

If the business has more than one entity and the user did not say which, ask once, list them, and stop. Transaction reads page at up to 50 rows per call with a cursor, so a 12-month pull is many pages; plan for it.

**Note what does not exist:** the connection has **no balance-sheet report**, no loan subledger, and no accounts-payable subledger. The balance-sheet page has to be assembled from the account balances plus derived items, labelled as management-derived (see section 3 below). Existing debt payments have to be detected from recurring transaction history and confirmed with the user. Say in the package that the obligations list is derived from the books plus the owner's confirmation, and do not present it as a complete debt schedule.

**Freshness is per bank connection, not per account.** Balances come with the account list; the last-update time comes from the bank connections, per institution, and can be missing. A custom (statement-upload) account has no sync time at all. Report staleness at the institution level, and say when freshness is unknown rather than implying it was checked.

---

## Phase 1: Scope the application

Ask the user, once, in one message:

- **Who is it going to?** A bank or credit union, a government-backed lender, an equipment financer, a grant program. This changes emphasis, not honesty.
- **Did the lender give a document list?** If yes, get it, and build to it. If it asks for something this skill cannot produce honestly (accountant-reviewed statements, personal net worth, projections), name those as out of scope up front so the owner is not surprised at the bank.
- **One sentence on what the business does**, for the cover page. This comes from the owner, not from guessing at transaction categories.

If the user knows none of this yet, do not stall. Build the default package below; it covers what a first conversation with any lender needs.

Fix the period: **the last 12 full calendar months**, ending with the most recent completed month. If the user asks for their fiscal year instead, use it and say so on the cover.

## Phase 2: Pull, then prove

Pull everything in the table above in as few calls as you can. Then, **before assembling anything**:

- Monthly revenue and expense figures tie to the app's Profit & Loss for the same months. If they do not, you are almost certainly summing tax-inclusive amounts. Fix that first.
- Every cash balance came from the app, and every institution's connection health and last-update time was checked. If a connection is more than 3 days stale (or its update time is missing), tell the user and offer to wait for a sync, because a lender comparing this package to a bank statement will land on exactly that number.
- Count uncategorized and pending transactions in the period. **If the backlog is large enough to move the statements, stop.** Tell the owner the books need categorizing before this package is worth sending, say what the backlog adds up to, and offer to proceed anyway with the gap stated. A financing package built on half-categorized books is the most expensive document this skill can produce.

## Phase 3: Assemble the package

Six sections, in this order. Short beats long; a loan officer reads dozens of these.

**1. Cover summary.** Business name, jurisdiction, currency, the one-line description from the owner, the period covered, the date prepared, and the management-prepared line. Then the contents in one list. If the owner told you the amount and purpose of the request, state it here in their words, as a fact, without argument for it.

**2. Income statement.** The 12-month Profit & Loss, presented monthly or quarterly depending on size, with the full-period total. If the prior 12 months exist, show the comparison and the direction. Under it, a monthly revenue table, because the shape of revenue is the first thing an analyst looks at.

**3. Balance sheet.** As of the most recent month-end, **assembled, not fetched**: the connection has no balance-sheet report, so build the page from what it does report. Cash from the connected account balances; receivables from open invoices; known liabilities from pending sales-tax filings and any owner-confirmed debt. Label the page management-derived, list what it includes, and say plainly what it omits (fixed assets, accumulated depreciation, accruals, anything with no source in the books). Never present it as the app's own statement, and never sum transactions to fake an account balance: a sum of movements is not a balance. If the lender requires a full formal balance sheet, that is the year-end preparation engagement (`riw-prepare-financials-ca` or `-us`), not this package.

**4. Cash position.** Each connected account with its balance, the institution's last-update time beside its accounts (or "sync time unknown" where the connection does not report one), and the total. If an account the owner mentions is not connected, say the coverage gap out loud rather than presenting a partial total as the whole.

**5. Receivables.** Total open invoices and their aging. Use due dates where invoices carry them and say so; where they do not, age from the issue date and say that instead. Never blend the two. Draft invoices are not receivables and stay out. If one customer is a large share of either revenue or receivables, name the share, because the lender will find it and it reads worse discovered than disclosed.

**6. Known obligations.** Pending sales tax filings with due dates and amounts. Recurring payments from the transaction history that look like debt service, listed by merchant with amount and cadence, **confirmed with the owner before they go in**. Under the list, the derivation note from above.

## Phase 4: The pre-flight pass

Before delivering, tell the owner, outside the package, what in it a lender will probably ask about. Loss months, a revenue trend pointing down, one customer carrying the top line, negative equity, thin cash against the size of the ask, a big unusual swing in any month.

This is not advice on what to say. It is a list of the questions coming, so the owner walks in with answers instead of surprises. If there is nothing on the list, say so in one line and move on.

## Phase 5: Deliver, then ask

Output the package as markdown by default, and offer to render it as a single PDF, because that is what actually gets attached to an application.

Then ask the owner **whether they need anything else for this application**, and name the likely candidates rather than asking in the abstract:

- A statement or schedule the lender listed that is not in the default package.
- The same package over a different period, or aligned to their fiscal year.
- The forward-looking piece, via `riw-cash-flow-forecast`, as its own clearly-separate document.
- Help getting the books application-ready first, if Phase 2 found a backlog.

If they need something this skill must not produce, projections presented as statements or anything implying CPA assurance, say why not and point at their CPA.

---

## What good looks like

- The whole package reads in under ten minutes, and every number in it ties to the app.
- The management-prepared line is on every statement, unprompted.
- A weak month is in the package and in the pre-flight list, not smoothed away.
- The owner ends the conversation knowing what a lender will ask, and was asked what else they need.
- Nothing in it is a projection or a guess.

## Traps

- **Projection creep.** "Expected revenue", an annualized run rate, a growth line on a chart. All of it is out. Historicals only.
- **Assurance language.** "Verified", "audited", "reviewed", "certified" must never appear near these statements. Management-prepared, every page.
- **Tax-inclusive revenue.** Overstates the top line and will not reconcile against bank deposits, which is the first check a lender runs.
- **Draft invoices in receivables.** They have not been sent. Out.
- **Presenting detected debt payments as a debt schedule.** There is no loan subledger; it is a derived list, confirmed by the owner, and labelled that way.
- **A package that disagrees with the bank statements.** Stale feeds and half-categorized books are how it happens. Check both before assembling.
- **Smoothing the bad month.** The lender sees it anyway. The pre-flight pass is where it gets handled.
- **Arguing the case.** The package states facts. The pitch belongs to the owner.

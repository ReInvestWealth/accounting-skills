---
name: "riw-monthly-health-check"
description: "A month-end health check on a business whose books are in ReInvestWealth: how the month went against the months before it, where cash stands and which way it is moving, who owes you, what changed in spending, upcoming tax obligations, and whether the books themselves are clean enough to trust. One page, graded, read-only. Use when someone asks for a monthly health check, a month in review, how the business or the month did, a month-end report for themselves, or whether the business is doing better or worse."
license: "MIT"
compatibility: "Needs the ReInvestWealth accounting MCP server connected to your assistant, with access to at least one business, and ideally 12 or more months of history so the comparisons mean something. Read only, no writes. Sales tax lines are Canada specific; everything else applies in Canada and the United States."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.1.0
  writes: none
---

# Monthly Health Check

You are giving an owner the month, on one page: did the business make money, is cash getting better or worse, who owes you, what changed, and what deserves attention next month. It is the owner's own review, not a client deliverable; the bookkeeper-to-client version of this job is `riw-monthly-review-email`.

**Read only.** This skill never changes the books. Where it finds the books themselves in doubt, it says so and points at `riw-bookkeeping-debugger` rather than fixing anything.

---

## The hard rules

1. **Closed months only, compared like with like.** The default subject is the most recent complete calendar month. A month-to-date run is allowed when asked for, but it is labelled partial on every line and never compared against full months as if it were one.
2. **Revenue is net of sales tax.** Tax collected is not income. Prove the figures you publish are before-tax amounts, and say so on the page.
3. **A trend needs at least three months, a seasonal claim needs at least a year.** With less history, print the numbers and say the comparison is thin rather than narrating a pattern.
4. **Every comparison names its baseline.** Prior month, trailing three-month average, or the same month last year: say which, every time.
5. **Grades are earned, not vibes.** Each section gets clean, watch, or attention, and the line that earned the grade is printed next to it.
6. **This is not financial, accounting, or tax advice.** You are showing the arithmetic of their own data. Decisions stay with the owner and their CPA.
7. **State the currency and the jurisdiction.** Sales tax lines are Canada only; never introduce sales tax on US books.

---

## What you need from the MCP

| What | Used for |
|---|---|
| Profit and Loss for the month and the trailing 12 months | The month's result and every comparison |
| Connected accounts: balance, currency, last-synced time | Cash position, and whether the data is current |
| Transactions for the month, with category, before-tax amount, merchant | Category moves, anomalies, new and stopped recurring charges |
| Open invoices: amount, customer, issue date, due date if present | Receivables and overdue balances |
| Pending sales tax returns with due dates and amounts (Canada) | The obligations section |
| Uncategorized and low-confidence counts | The books-hygiene grade |

There is no accounts-payable subledger, so "what we owe" is out of scope; do not imply otherwise.

If any account's feed is stale, say so before the report: a health check on four-day-old data starts wrong.

---

## The report

One page, in this order, each section graded clean, watch, or attention:

1. **The headline.** The month in one or two sentences: profit or loss, cash direction, and the single most important finding, good or bad. If something is genuinely wrong, it leads; do not bury a red flag under a pleasant summary.
2. **Profit and loss.** Revenue, expenses, and net for the month against the prior month and the trailing three-month average, and against the same month last year where the history exists. Then the three biggest category moves by dollar amount, each with its figure and its baseline, not just a percentage.
3. **Cash.** End-of-month position across connected accounts, the net change over the month, and runway in months at the trailing three-month average burn, with the basis printed. A single hot month does not set the burn rate.
4. **Receivables.** Total open, how much is past due, the oldest and the largest, by name. If collections are the month's real story, say so in the headline.
5. **Obligations (Canada).** Sales tax collected in the month, and any pending return with its due date and amount, so the cash position reads correctly: money set aside for the CRA is not spending money.
6. **What changed.** New recurring charges that appeared this month, recurring charges that stopped, and any category spending well outside its trailing average. This is where forgotten subscriptions and quiet price increases surface.
7. **Books hygiene.** Counts of uncategorized rows and dumping-ground balances (other expense, other revenue) for the month. Beyond a handful, the grade is watch at best, the report says the month's figures are provisional to that extent, and the fix is a `riw-bookkeeping-debugger` run, not edits from here.
8. **Three things for next month.** Drawn from their own numbers: the invoice worth chasing, the subscription worth questioning, the filing date coming. Facts from their data, not generic advice, and never more than three.

Close with what was not checked and why, so a clean page is not read as broader than it is.

---

## Cadence

Built to run in the first days of a new month, on the month just closed. If asked mid-month, offer the last complete month first, and run month-to-date only if that is what they want, labelled as partial. Running it every month is the point: the comparisons get better with every close, and the same page every month is what makes a drift visible.

---

## Traps

- **Comparing a partial month to a full one.** Label partial runs on every line.
- **Publishing revenue with tax still in it.** Net of sales tax, proven, stated.
- **Setting the burn rate off a single month.** Use the trailing average and name it.
- **Calling three data points a trend and one December a season.** State the history behind every pattern claim.
- **Fixing the books from here.** Hygiene findings hand off to `riw-bookkeeping-debugger`.
- **Drafting a client email.** That is `riw-monthly-review-email`; this page is for the owner.
- **Reading "no bills list" as "nothing owed".** There is no AP subledger; scope it out loud.
- **Burying the red flag.** If the month has one, it is the headline.

---
name: "riw-bookkeeping-debugger"
description: "Debug books kept in ReInvestWealth: scan for duplicate transactions, one-sided transfers, category drift, direction anomalies, stale categories, and sales tax errors, then grade the books and report what it found. Optionally fixes approved items by recategorizing rows, pairing transfer legs, or voiding confirmed duplicates. The scan itself is read-only; nothing is changed without an explicit approval. Use when someone asks to debug the books, check the books, find mistakes or errors, clean up or tidy the books, fix miscategorized transactions, hunt duplicates, review sales tax coding, or make sure the books are right before a filing, a year end, or a decision. For a business-level month in review, use riw-monthly-health-check instead."
license: "MIT"
compatibility: "Needs the ReInvestWealth accounting MCP server connected to your assistant. The scan is read-only; applying fixes needs write access and WRITES TO PRODUCTION BOOKKEEPING DATA. Built for owners as well as accountants and bookkeepers. Sales tax checks are Canada specific; everything else applies in Canada and the United States."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.1.0
  writes: transactions
  risk: medium
---

# Bookkeeping Debugger

You are debugging a set of books: finding the mistakes that skew the numbers people actually use, and fixing the ones a human approves. Duplicates inflate expenses, one-sided transfers distort profit, category drift makes statements lie, and sales tax coded wrong surfaces at filing time. Two halves, one skill:

1. **Diagnose.** Read everything in scope, run every check in code, and hand back a graded diagnostic report. This half changes nothing and is always safe to run.
2. **Fix**, only if asked and only after approval. Build a fix list, show every proposed change, wait for explicit approval, apply, and verify from live data.

A plain "check my books" request means half one. Do not treat it as permission for half two.

---

## Read this before you touch anything

The scan is read-only. **The fix pass writes to production bookkeeping data**, and the app protects the audit trail: a posted transaction cannot be deleted (a removal is a void, and the record stays), and its amount and date cannot be changed after it is created. **Confirm the exact correction path available to you before applying anything**, then work as though every write is permanent.

So the fix pass follows the same protocol as every writing skill here:

1. **Plan.** Build every proposed fix. Assert the math in code. Change nothing.
2. **Review.** Show the full fix list, one row per change, to a human.
3. **Approve.** Wait for explicit approval of that exact list. **Never apply in the same turn as you plan.** Any edit after approval means a new review and a new approval.
4. **Apply.** In batches; voids and transfer pairs as atomic units.
5. **Verify.** Re-read from the app, re-run the affected checks, and show the before and after.

**Never guess.** A finding you cannot support with evidence from the books is a question for the human, not a fix. A plausible guess posted into a client's books is worse than a delay.

**Never touch a filed or locked period** without explicit instruction from whoever is responsible for that filing. Findings inside one still belong in the report; their fixes get flagged as blocked, not applied.

---

## What a fix can be

The app is a transaction-only ledger: every entry lives in a real bank or card account, the category is the other side of the entry, and there are no journal entries. That limits fixes to exactly four moves:

- **Recategorize** an existing row (and correct its sales tax at the same time, since tax rides on the row).
- **Void** a row that should not exist, such as a confirmed duplicate.
- **Post a new entry**, mainly the missing leg of an interfund-transfer pair.
- **Ask.** Anything that needs an amount or a date changed is a void plus a fresh entry, and anything ambiguous is a query, not a write.

Categories come from the app's chart of accounts, **fetched fresh at the start of every run**. Never invent one, and never copy a code off an existing transaction, which may carry a stale value.

Sign conventions, for every direction test below: depository accounts read positive for money out and negative for money in; credit accounts are inverted.

---

## The checks

Run all of them in code over the scoped period. Each finding carries the transaction, the evidence, and a tier: **Fix** (mechanical, provable, safe to propose), **Ask** (needs a human answer first), or **Flag** (informational, never auto-fixed).

### 1. Duplicates

Same account, same date, same amount is a suspect pair; **do not require descriptions to match**, they differ between a feed and a manual upload, which is the classic source. Exclude legitimate same-amount recurrences by checking the pattern: a genuine weekly charge produces a series, a duplicate produces an isolated double. Tier: Ask, then the fix is voiding the confirmed extra row.

### 2. Transfers

Sum every interfund-transfer leg and pair each to its other side. Same-currency pairs must net to exactly zero. Findings:

- **A lone leg**, which silently distorts profit. Fix: post the matching leg, or recategorize the mispaired one, whichever the evidence supports.
- **A credit card payment recorded as an expense** on either leg, which double-counts spending that the card rows already carry. Fix: interfund on both legs.
- **Sales tax on an interfund row.** Transfer legs are always untaxed. Fix: recategorize with the tax removed.

A cross-currency pair that does not net to zero can be real bank FX rather than an error; judge it as a pair and tier it Ask.

### 3. Categorization

- **Merchant drift.** The same merchant scattered across several categories with no consistent precedent. Where the books show a clear precedent, tier Fix with the precedent as evidence; where they do not, tier Ask with the options listed.
- **Dumping grounds.** Rows sitting in other expense or other revenue beyond a handful, which usually marks low-confidence imports nobody revisited. Tier Ask, batched into one mapping table.
- **Direction anomalies.** Revenue categories on money-out rows and expense categories on money-in rows, excluding matched refund pairs (same counterparty, opposite direction, close in time). Tier Ask: the amount and date are immutable, so if the direction is genuinely wrong the row came in wrong and needs a human decision, not a recategorization.
- **Stale categories.** Rows whose category no longer matches the fresh chart of accounts. Tier Fix, mapped to the current chart.

### 4. Sales tax (Canada only)

Skip this whole group for a US business, and never introduce sales tax on US books.

- **Per-row math.** Before-tax amount plus taxes must equal the total to the penny, and every rate used must exist in the app's own rate data for that region. Never validate against a hardcoded rate. Tier Fix.
- **Claimable versus display-only.** A tax is claimable only if the business is registered for it and, on non-revenue rows, the rate is refundable. Non-refundable provincial tax (PST in BC, SK and MB) claimed as an input credit is a real error. Tier Fix.
- **Sibling inconsistency.** A merchant taxed on some rows and untaxed on same-era siblings in the same region. The precedent decides which side is wrong; no precedent and no invoice evidence means tier Ask, never a guessed rate.

### 5. Balances

The implied balance of each account is only provably right against a statement. If the user can provide statement balances, tie each account to the penny and report the gaps; a gap usually means missing rows, and the fix for that is the bank-feed gap fill in `riw-migrate-history`, not this skill. Without statements, report the implied balances as unverified rather than clean. Tier Flag.

Also scan opening-balance entries whose notes name an expected clearing transaction and category (the migration skill writes these deliberately): if a matching later payment exists but got a different category, the balance never cleared and the expense is double-counted. Tier Fix, using the instruction on the entry itself as the evidence.

### 6. Judgment flags

Possible personal or mixed-use spending, unusual spikes against the account's own history, and revenue or expense lines that changed sign month over month. These are questions about the business, not mechanical errors. Tier Flag, always; this skill never decides what was personal.

---

## Phases

1. **Scope.** Confirm the business, the period, and whether any part of it is filed or locked. Default to the current fiscal year when the user does not say.
2. **Read.** Fetch the chart of accounts fresh, the sales-tax rate data, and every transaction in scope, including voided rows so voids are not re-proposed.
3. **Detect.** Run every check in code. Every number in a finding comes from computation, not from eyeballing rows.
4. **Report.** Deliver the diagnostic report (format below). If the user only asked for a check, **stop here.**
5. **Build the fix list**, when fixes are wanted: one row per proposed change with the transaction, the issue, current versus proposed category and tax, the tier, and the evidence. Ask-tier items go in a batched question round first; their answers turn into fix rows or get dropped.
6. **Review and approve.** Blocking, per the protocol above.
7. **Apply.** Recategorizations in batches; each void and each transfer pair as an atomic unit. Name every new entry with an uppercase prefix identifying this cleanup and a one-sentence note saying why it exists.
8. **Verify.** Re-read from live data, re-run the checks the fixes touched, and show the grade moving. Any fix that did not land as planned gets reported, never papered over.

---

## The diagnostic report

One page, written for the owner even when an accountant runs it:

- **A grade per check group** (clean, review, or issues), with the count of findings behind it.
- **What it costs.** Where computable, the money at stake: the sum of duplicate suspects, the profit distortion from lone transfer legs, the tax over- or under-claimed. Skip the line where it is not computable; never estimate.
- **The findings tables**, grouped by tier: what is mechanically fixable on approval, what needs an answer, and what is flagged for judgment.
- **What was not checked**: balances without statements, locked periods, and any check skipped for scope, said plainly so a clean grade is not read as broader than it is.

---

## Traps

- **Fixing in the same turn as scanning.** The report and the fix list are separate deliverables with an approval between them.
- **Requiring descriptions to match when hunting duplicates.** They differ between systems.
- **Voiding a recurrence as a duplicate.** Check the series pattern first.
- **Recategorizing one transfer leg without its pair.** Pairs move together or not at all.
- **Leaving old sales tax on a row recategorized to interfund.** The tax comes off with the reclass.
- **Validating tax against a remembered rate.** Rates come from the app's rate data, every time.
- **Introducing sales tax on US books.** The tax checks are Canada only.
- **Deciding what was personal.** Flag it; the owner decides.
- **Applying into a filed or locked period.** Blocked findings stay findings.
- **Reporting unverified balances as clean.** No statement, no tie-out, say so.

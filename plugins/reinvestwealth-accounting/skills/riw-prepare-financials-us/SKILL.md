---
name: "riw-prepare-financials-us"
description: "Prepare a US corporation's year-end financial statements from books kept in ReInvestWealth: Income Statement and Balance Sheet on the income tax basis of accounting, a tax depreciation schedule, working papers, and a return mapping file for the Form 1120 or 1120-S preparer, all prepared for CPA review with a complete audit trail. Use when someone asks for year-end financials, financial statements, tax-basis statements, or an 1120 or 1120-S preparation package for a US corporation."
license: "MIT"
compatibility: "For US corporations only (IRS, Form 1120 or 1120-S, including LLCs taxed as corporations). Needs the ReInvestWealth accounting MCP server connected to your assistant with access to the client's business, plus the client's prior-year federal return (with its depreciation schedule) and prior-year Balance Sheet as PDFs. Reads financial data; any correction to the books is a separate, separately approved change. Intended for use by or under the review of a CPA."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.1.0
  jurisdiction: US
  writes: none
---

# Prepare Year-End Financials (US)

You are preparing a corporation's current-year financial statements, Income Statement and Balance Sheet on the income tax basis of accounting, from three things: their **prior-year federal return** (Form 1120 or 1120-S, including its depreciation schedule), their **prior-year Balance Sheet**, and their **current-year general ledger** in ReInvestWealth. The output is a working spreadsheet with a complete audit trail, plus a one-sheet return mapping file for whoever files the 1120 or 1120-S.

The clients are micro-entrepreneurs and very small corporations, typically 1 to 5 people: consultants, freelancers, real estate agents, healthcare professionals, newly incorporated founders. The statements they read must be **simple, condensed, and in plain language**, never a 40-line corporate income statement. Keep the face of the statements small while keeping the supporting detail and tie-outs fully intact underneath.

This is a **preparation engagement** under AR-C Section 70 (SSARS): you are preparing statements, not auditing them and not providing any assurance, and every statement page carries a "no assurance is provided" line. The basis is the **income tax basis of accounting**, a recognized special purpose framework, which is also why depreciation in the statements can follow the tax return exactly. You are not giving tax advice. You are organizing, validating, and presenting the numbers so a CPA can review and a return preparer can file.

Work through the phases in order. Do not skip or combine them. **When numbers do not tie or something looks wrong, stop and ask. Never plug a figure to make a statement balance.**

> **First principle: keep it simple, everywhere.** This is a lightweight process for a 1 to 5 person business. Ask the fewest questions that resolve the books and batch them. Make the smallest set of adjustments that make them right. Write working papers in plain language. Deliver a one-screen statement. Whenever two approaches both work, take the simpler one. Simplicity never overrides accuracy, tie-outs, correct return mapping, or the audit trail, but it is the default everywhere else.

---

## Inputs

| Input | Format | What it gives you |
|---|---|---|
| Prior-year federal return (1120 or 1120-S) | PDF | Opening Schedule L balances, opening retained earnings, capital stock, and, from the attached depreciation schedule, cost, accumulated depreciation, method and remaining basis per asset |
| Prior-year Balance Sheet | PDF | Opening balances for every balance-sheet account: the closing position that must roll forward |
| Current-year general ledger | Via the MCP | Every transaction for the fiscal year |

The MCP also gives you the legal name, fiscal year end, and state, so intake needs less asking.

**If either PDF is missing, ask for it before starting.** You cannot prepare a defensible current-year statement without the prior-year closing position, and you cannot substitute the app's ledger for it. See Phase 3b for exactly why.

**Small-corporation exception:** a corporation under the receipts-and-assets threshold may have filed with Schedule L blank. If the prior return has no Schedule L, the prior-year Balance Sheet and the depreciation schedule carry the opening position on their own; both become mandatory, and you note the exception on the Cover tab.

Large or image-only PDFs may not extract cleanly with a plain text read. Use whatever PDF text extraction your environment already has rather than installing new tooling.

## Output

**Two files, always both:**

| File | What it is | Who uses it |
|---|---|---|
| The preparation workbook | The eight tabs below | The CPA reviewing the engagement |
| The return mapping file | One sheet: statement line, return caption, detail or subtotal, amount | The return preparer, entered or imported into tax software |

Generate both from the **same** finalized data so they cannot drift apart. Never ship one without the other.

Workbook tabs, in order:

1. **Cover:** client, fiscal year, entity type (C or S corporation), state, basis of presentation, preparer, date, status
2. **Income Statement:** condensed for a micro-entrepreneur, current versus prior year, each line tagged with the return caption it maps to
3. **Balance Sheet:** essential captions, current versus prior year, each line tagged with its Schedule L caption, must balance
4. **Return Map:** every statement line, the 1120 or 1120-S caption it feeds (page-1 income and deduction lines, Schedule L captions), and the accounts that roll into it
5. **Depreciation Schedule:** continuity by asset: cost, prior accumulated depreciation, method and convention, Section 179 or bonus treatment, current-year depreciation, closing accumulated and remaining basis, plus a short additions and disposals detail with the placed-in-service date, description, and amount of each (and proceeds for disposals)
6. **Working Papers:** every statement figure traced back to accounts and transactions
7. **Query Log:** every question raised, its status, and its resolution
8. **Trial Balance:** the full adjusted trial balance the statements are built from

---

## Keep the statements simple

Two layers, kept separate:

**The face, what the owner reads.** The Income Statement uses the app's own categories, each as its own line. It stays readable because the app's category list is already short. The Balance Sheet stays deliberately condensed to the essential captions. Statement titles name the basis, for example "Balance Sheet — Income Tax Basis", and every page carries the no-assurance line.

**The detail, what the CPA and return preparer need.** The Return Map, Working Papers, and Trial Balance tabs. Every grouped caption breaks back out here into its component accounts and exact return captions. Nothing is lost for filing; it just does not clutter the face.

Rules for the face:

- **Balance Sheet: group, do not list.** Roll related small accounts into one plain-language caption. Keep a separate line only where the amount is material or the owner specifically tracks it.
- **Sweep the immaterial into "Other".** Do not create a line for a $40 account.
- **Plain language, not jargon.** "Rent and utilities", not "Occupancy costs". The return caption lives in its own small column, not in the caption.
- **Only show sections that exist.** No cost-of-sales block for a service business with no inventory. No long-term-debt section with no debt. Drop empty captions rather than printing rows of zeros.
- **One screen.** If the owner cannot take in the whole statement without scrolling, group further.

Not simplified: the audit trail, the tie-outs, the depreciation schedule, and the accuracy of the return mapping.

---

## Phase 1: Intake and setup

1. Confirm all three inputs are present and list exactly what you received.
2. Establish and confirm with the user:
   - **Official company name and main shareholder name.** If the entity has both a legal name and a trade name, or you are not sure who the main shareholder is, **ask, do not guess.**
   - **Entity type: C corporation (Form 1120) or S corporation (Form 1120-S).** Read it off the prior-year return, confirm it still holds, and **ask if there is any doubt.** An LLC taxed as a corporation follows the form it files. Everything downstream, from the equity section to what you flag, depends on this.
   - Current and prior fiscal year-end dates. Most of these corporations are calendar-year; confirm rather than assume.
   - Jurisdiction: federal plus state. The package targets the federal return; the state income or franchise return is the preparer's job, and the statements simply carry any state tax expense and payable that exist in the books.
   - Functional currency, default USD.
   - Basis of presentation. Default: preparation engagement under AR-C Section 70 (SSARS), income tax basis of accounting, cash basis with selected accruals as described in the basis note, with "no assurance is provided" on every statement page.
     - **Do not write "compilation" or attach a compilation report.** A compilation is a different engagement (AR-C Section 80) with a report; this is a preparation engagement without one.
     - **Do not reference US GAAP.** Depreciation here follows the tax return, which GAAP does not permit; the income tax basis is the framework, named in the title and the basis note, and nothing is presented as GAAP.
   - Confirm that **depreciation in the financial statements follows the tax return** (MACRS, with any Section 179 or bonus treatment), which is normally the client's direction here. The Depreciation Schedule is the support.
3. State the engagement parameters back in one short block and wait for confirmation before extracting anything.

## Phase 2: Confirm the reference points

**Section 179 limits, bonus depreciation percentages and eligibility dates, auto caps, and de minimis thresholds change from year to year. Do not rely on memory.** Confirm the treatment for every asset you touch against the current-year IRS Form 4562 instructions or Publication 946, or against the client's tax software, for this specific tax year. Write down what you confirmed and when.

The same applies to return placement: reuse the captions and placements the prior-year return actually used wherever the account existed last year, rather than the mapping you would have picked fresh.

## Phase 3: Prior-year position and the current-year ledger

*The prior year sets the opening balances. Get them exact before you look at a single current-year transaction.*

### 3a. Prior-year Balance Sheet

Extract every account and balance. This is the prior year's closing position and therefore the current year's **opening** position. Record every asset, liability, and equity account, and confirm assets = liabilities + equity in the prior year.

### 3b. Prior-year federal return

Extract:

- The Schedule L caption used for each balance-sheet item last year, and the page-1 placement of each income and deduction line.
- Closing **retained earnings** per Schedule L, which is opening retained earnings this year.
- Capital stock and any additional paid-in capital.
- **The depreciation schedule:** for every asset, the cost, method, convention, prior Section 179 or bonus taken, accumulated depreciation, and remaining basis. This is the most error-prone hand-off in the whole engagement. Do it asset by asset.

**Anchor every opening balance to the filed return and the prior-year statements, never to the app's ledger.** The app does not book the tax preparer's year-end depreciation entry, so the ledger's carried-forward **retained earnings and accumulated depreciation run behind the filed return by the cumulative depreciation claimed to date.** This is expected, not an error. Take opening retained earnings, capital stock, accumulated depreciation, and per-asset basis from the return, then book the current-year depreciation so the statements carry the correct depreciated position.

### 3c. The current-year ledger

Pull the general ledger for the fiscal year through the MCP, then:

- Confirm it covers the full fiscal year: first and last transaction dates sit inside the year-end window.
- Produce a trial balance by account. **Total debits must equal total credits.** If it does not balance, stop, report the imbalance, and ask. The extract is incomplete or malformed.
- Reconcile opening balances account by account to the prior-year Balance Sheet closing balances. Every balance-sheet account's opening must equal the prior-year closing. Anything that does not tie becomes a Query Log item. **One difference is expected:** retained earnings and accumulated depreciation, per 3b. Anchor those to the return and do not chase the ledger figure.

**Prove your totals against the app before you use a single figure.** Pull the app's own Profit and Loss for the same period, and prove your ledger-derived revenue and expense totals tie to it. Do that before Phase 4. If they do not tie, you are reading the extract wrong, and that is the first thing to fix.

**Sales tax: the app does not manage US sales tax**, so there is no sales-tax layer in the figures and nothing is netted for you. Ask whether the client collects state or local sales tax at all; many service businesses do not, and then there is nothing to do. If they do collect it, find where it landed in the books, make sure collected tax is sitting in a liability and **not inside revenue**, and tie the payable to what was actually remitted. Unlike a VAT, there are no input credits on purchases: sales tax the business pays on its own expenses simply stays in the expense.

Also expect:

- **Every transaction sits in a bank or card account.** Manually created transactions land in a manual cash account. **Do not assume a manual-cash entry is real cash.** Classify each as either cash or a shareholder-account movement (owner-funded payments, personal-account transfers, reimbursements) per Phase 4, reclassify with an adjusting entry, and log the reasoning.
- **Sign convention:** positive is an outflow. A depository account's balance is the negative of the sum of its amounts; a credit card's amount owing is the positive sum. Confirm this against a known balance rather than assuming it.
- **Excluded and post-year-end rows:** deleted transactions are out, and expect transactions dated after the year end because the new fiscal year is already accumulating.

## Phase 4: Deep-dive review

*Scale this to a micro-business. A small ledger does not need a large-corporation audit. Be thorough on anything that materially changes the statements; log the rest and carry a sensible default. Quality of questions over quantity: a micro-entrepreneur should not be buried in queries.*

At minimum, work through:

- **Trial balance integrity.** Debits equal credits, no orphan or suspense account left holding a balance.
- **Opening-balance tie-out.** Every balance-sheet account ties to prior-year close.
- **Bank and credit card.** Does each account reconcile to a real closing balance, and is there support for it.
- **Wrong-sign balances.** Assets in credit, liabilities in debit, contra-accounts misused.
- **Uncategorized and suspense balances.** Anything parked in a holding account.
- **Owner and shareholder transactions.** Distributions versus salary, personal expenses run through the business, shareholder loans. **Distributions and dividends are equity, never an expense**: if one is sitting in an expense category, that is a reclass. For an S corporation, flag **reasonable compensation** (an owner taking distributions with little or no W-2 wages) and distributions that may exceed basis for the return preparer. Do not advise.
- **Revenue reasonableness.** Period-over-period change, cut-off (revenue in the right year), deferred revenue.
- **Sales tax, if collected.** Collected tax in a liability and not in revenue, and the payable ties to the state filings. Nothing to do if the client does not collect any.
- **Capital versus expense.** Purchases that should be capitalized and depreciated rather than expensed, and the reverse, keeping the client's de minimis safe-harbor practice in mind (confirm the current threshold; do not recite one from memory). Build the fixed-asset additions list for Phase 5.
- **Payroll.** Wages, payroll tax payable, W-2 and Form 941/940 reasonableness, employer portions.
- **Expense categorization.** Material miscoded items, meals flagged for the 50% treatment and entertainment flagged as nondeductible, personal-use portions.
- **Related party.** Intercompany loans, management fees.
- **Accruals and prepaids.** Obviously missing year-end accruals such as accounting fees or interest; prepaid amounts to defer. Keep them consistent with the basis note.
- **Duplicates and anomalies.** Duplicate transactions, round-number estimates, postings dated outside the year.

For every issue, add a Query Log entry: ID, account, issue, why it matters, question for the client, status, resolution.

**Handling questions:** maintain the Query Log continuously; it is a deliverable. For anything that **blocks** the statements (trial balance will not balance, opening balances do not tie, a material uncategorized balance, missing asset basis), stop and ask in **one tight batch**, grouped, then wait. For non-blocking items, log them, carry a sensible default forward clearly noted, and confirm at review. Default to the simpler presentation.

Do not proceed until the trial balance balances and all blocking queries are resolved.

## Phase 5: Depreciation and adjusting entries

1. **Additions and disposals.** Record the **placed-in-service date** of each addition: it drives the convention and any first-year treatment, and disposals need proceeds. Present a short additions and disposals detail, one row each: date, description, amount. A short list, not a fixed-asset register. A missing date is `[NEEDS INPUT]` and a question, never a guess.
2. **Build the depreciation continuity per asset:** carry every existing asset forward on the exact method, convention, and life the prior-year schedule used. For additions, apply MACRS for the current year as the rules stand for this specific tax year (verify, do not assume, including the mid-quarter convention check when additions bunch late in the year). **Where an election is open on a new asset, Section 179 or bonus, propose a treatment, flag it, and let the preparer decide; the election is theirs, not yours.** Disposals come out at cost and accumulated depreciation, with the gain or loss computed against remaining basis and flagged for the return preparer without advising.
3. **Depreciation expense equals the schedule.** Post it.
4. **Other adjusting entries** from Phase 4: accruals, prepaids, reclasses, distribution reclass, shareholder reclass. Each gets a working-paper reference and a one-line rationale.
5. **Roll the adjusted trial balance:** opening, plus ledger activity, plus adjustments. Re-confirm debits equal credits.

Present the proposed adjusting entries and the depreciation schedule to the user and wait for sign-off before finalizing.

## Phase 6: Return mapping and the statements

**1. Map every adjusted-TB account to a return caption.** Balance-sheet accounts map to Schedule L captions; income and deduction accounts map to the 1120 or 1120-S page-1 lines, with anything that has no named line going to other deductions with its own description. Reuse the exact placements the prior-year return used for any account that existed last year. Record every mapping on the Return Map tab, which keeps full account-by-account detail even where the face groups things together.

**2. Income Statement: use the app's own categories, and do not combine them into broad groups.** Each category is its own line. Keep "Interest and bank charges" as its own line; never fold bank charges into an "Office and administration" bucket. Order expense lines largest first. Show a category only if it had activity.

- **One line per return caption.** Where two or more app categories feed the **same** named return line, combine them into a single line for that caption. This is the one case where you do combine: by shared caption, never into broad ad-hoc groups.
- Lines that are not app categories but are required: **Depreciation** (the year's figure from the schedule) and, where present, **gain or loss on disposal**.
- **Revenue** follows the app's revenue categories, typically one gross receipts line. Split only into materially distinct streams the owner actually tracks.
- Then: total expenses, operating income or loss, other income, income before taxes, income taxes (only where an entity-level tax exists: federal tax for a C corporation, state or franchise tax where booked; an S corporation normally shows none federally), net income. Current year beside prior year.

**3. Balance Sheet, condensed,** current beside prior, each line with its Schedule L caption:

- **Current assets:** cash, accounts receivable, prepaid expenses, then total current assets.
- **Property and equipment: show cost and accumulated depreciation on separate lines**, then a **net fixed assets** subtotal. **Do not collapse this into a single net line.** Use the same lines in both year columns so they reconcile, and tie the net carrying amount to the remaining basis on the Depreciation Schedule.
- **Total assets.**
- **Current liabilities:** accounts payable and accrued liabilities, sales tax payable if any, payroll taxes payable, income taxes payable, loans from shareholder, current portion of debt. Only the ones that exist. Then total current liabilities.
- **Long-term debt**, only if there is any. Then total liabilities.
- **Equity:** capital stock (and additional paid-in capital if any), then the **retained-earnings continuity line by line**: opening balance per the prior return, plus net income or loss, less distributions or dividends declared, equals closing balance. In both year columns, not one collapsed line. Then total equity.
- **Total liabilities and equity.**

Keep the prior-year grouping identical to the current year so the columns line up, and match the captions the prior-year statements used where you can.

**4. Tie-outs that must hold:**

- Total assets = total liabilities + total equity, exactly.
- Net income on the Income Statement equals the net income in the retained-earnings rollforward.
- Closing retained earnings = opening (per the return) + net income - distributions or dividends.
- Accumulated depreciation = prior accumulated + current-year depreciation - accumulated depreciation on disposals.
- Net fixed assets tie to the Depreciation Schedule's remaining basis.

If a tie-out fails, fix the cause. **Never force a balancing figure.**

## Phase 7: Working papers

Build the Working Papers tab so a reviewer can trace **every** statement figure back to source:

- Each statement line, the accounts that roll into it, the adjusting entries applied, the final figure.
- A lead schedule per caption.
- Each adjusting entry: reference, accounts, amounts, rationale, source.
- The Phase 6.4 tie-out checklist with pass or fail against each item.
- Source-file references (which document, which page or row) for opening balances and asset basis.
- Preparer, date, and a status line saying the statements are prepared by AI and pending CPA review.

The standard: a CPA opening this cold can follow any number on the statements down to the transactions behind it without asking you a question.

## Phase 8: Build both files

1. Assemble the finalized figures into a single structured data set, then generate the workbook and the return mapping file **from that same data**.
2. The return mapping sheet is one sheet: return caption, description, type, amount, split into an income-and-deductions block and a Schedule L block. Mark each row `detail` or `subtotal` so a preparer or importer that recomputes its own subtotals can filter to detail rows. **Without that column an importer double-counts.** Emit a row for every statement line that carries a caption, and skip presentation-only subtotals, which the tax software computes itself.
3. **Watch this trap: distributions are not a deduction.** An S corporation's distributions (and a C corporation's dividends) never appear in the income-and-deductions block; they live in the equity rollforward and on Schedule L, and the preparer handles the return side (Schedule M-2, Schedule K). If a distribution shows up as an expense row, the reclass in Phase 4 was missed. Verify that the income block sums to the statement's total income and the deductions block sums to total expenses, and fail loudly if not.
4. Verify: the Balance Sheet balances, every tie-out reads pass, and no `[NEEDS INPUT]` placeholder remains.

## Phase 9: Review and deliver

1. Present a short summary: revenue, net income, total assets, key flags, and the count of open versus resolved queries.
2. Surface the Query Log items still open for client confirmation.
3. Deliver **both** files.
4. Remind the user in one line that this is a preparation engagement pending CPA review: no assurance, not audited, not tax advice, and the return preparer should confirm depreciation elections, reasonable compensation, distributions, and tax provisions, along with the book-to-tax reconciliation (Schedule M-1) and equity analysis (Schedule M-2), which are theirs to prepare.

---

## Hard rules

- **Never plug a balancing figure.** If it does not tie, find the cause or ask.
- **Never invent a number.** Missing data is `[NEEDS INPUT]` plus a Query Log entry.
- **One line per return caption** on the face of either statement.
- **Never give tax advice.** Flag tax-sensitive items (reasonable compensation, distributions in excess of basis, disposals and recapture, meals and entertainment) for the return preparer. Do not advise on them.
- **Never make an election.** Section 179 and bonus are the preparer's call; propose and flag.
- **Verify depreciation limits, percentages, and conventions for this specific tax year** against the IRS. They change.
- **Reuse prior-year return placements** for continuity.
- **IRS, not CRA.** Form 1120 or 1120-S, Schedule L, Form 4562. No GIFI, no T2, no GST or HST.
- **Prove your totals against the app's Profit and Loss** before using any figure, and remember the app does not manage US sales tax.
- **Audit trail is mandatory.** No untraceable numbers.
- **Review-ready, not file-ready.** Output always carries the pending-CPA-review status and the no-assurance line.
- **Keep client financials out of version control.**

---
name: "riw-prepare-financials-ca"
description: "Prepare a Canadian corporation's year-end financial statements from books kept in ReInvestWealth: Income Statement and Balance Sheet mapped to GIFI codes, a CCA schedule, working papers, and a GIFI import file for the T2 preparer, all on a compilation engagement basis with a complete audit trail. As the final step, on its own approval, it posts the year-end adjusting entries (CCA, accruals, reclasses, corrections) back into the books so the ledger carries the filed position forward. Use when someone asks for year-end financials, financial statements, a compilation engagement, GIFI mapping, or a T2 preparation package."
license: "MIT"
compatibility: "For Canadian corporations only (CRA, T2, GIFI, CCA). Needs the ReInvestWealth accounting MCP server connected to your assistant with access to the client's business, plus the client's prior-year T2 return and prior-year Balance Sheet as PDFs. Read-only through the statement phases; the final phase posts the approved year-end adjusting entries to the books. WRITES TO PRODUCTION BOOKKEEPING DATA on approval, and posted entries are permanent. Intended for use by or under the review of a CPA."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.1.0
  jurisdiction: CA
  writes: transactions
---

# Prepare Year-End Financials (Canada)

You are preparing a corporation's current-year financial statements, Income Statement and Balance Sheet mapped to GIFI codes, from three things: their **prior-year T2 return**, their **prior-year Balance Sheet**, and their **current-year general ledger** in ReInvestWealth. The output is a working spreadsheet with a complete audit trail, plus a one-sheet GIFI import file for whoever files the T2. The final step, once everything is approved, is posting the year-end adjustments back into the books (Phase 10).

The clients are micro-entrepreneurs and very small corporations, typically 1 to 5 people: consultants, freelancers, real estate agents, healthcare professionals, newly incorporated founders. The statements they read must be **simple, condensed, and in plain language**, never a 40-line corporate income statement. Keep the face of the statements small while keeping the supporting detail and tie-outs fully intact underneath.

This is a year-end **compilation engagement** basis: CSRS 4200, the standard that replaced Section 9200 and the Notice to Reader for periods ending on or after 2021-12-14. You are not auditing the books and you are not giving tax advice. You are organizing, validating, and presenting the numbers so a CPA can review and a T2 preparer can file.

Work through the phases in order. Do not skip or combine them. **When numbers do not tie or something looks wrong, stop and ask. Never plug a figure to make a statement balance.**

> **First principle: keep it simple, everywhere.** This is a lightweight process for a 1 to 5 person business. Ask the fewest questions that resolve the books and batch them. Make the smallest set of adjustments that make them right. Write working papers in plain language. Deliver a one-screen statement. Whenever two approaches both work, take the simpler one. Simplicity never overrides accuracy, tie-outs, GIFI correctness, or the audit trail, but it is the default everywhere else.

---

## Inputs

| Input | Format | What it gives you |
|---|---|---|
| Prior-year T2 return | PDF | Opening GIFI codes (S100/S125), opening retained earnings, opening UCC per CCA class (Schedule 8), share capital |
| Prior-year Balance Sheet | PDF | Opening balances for every balance-sheet account: the closing position that must roll forward |
| Current-year general ledger | Via the MCP | Every transaction for the fiscal year |

The MCP also gives you the legal name, fiscal year end, province, and sales-tax registrations, so intake needs less asking.

**If either PDF is missing, ask for it before starting.** You cannot prepare a defensible current-year statement without the prior-year closing position, and you cannot substitute the app's ledger for it. See Phase 3b for exactly why.

Large or image-only PDFs may not extract cleanly with a plain text read. Use whatever PDF text extraction your environment already has rather than installing new tooling, and note that French returns from Quebec filers label the schedules `Annexe 8 / 100 / 125 / 50` where English returns say `Schedule 8 / 100 / 125 / 50`.

## Output

**Two files, always both:**

| File | What it is | Who uses it |
|---|---|---|
| The compilation workbook | The eight tabs below | The CPA reviewing the engagement |
| The GIFI import file | One sheet: GIFI code, description, detail or subtotal, amount | The T2 preparer, uploaded into tax software |

Generate both from the **same** finalized data so they cannot drift apart. Never ship one without the other.

Workbook tabs, in order:

1. **Cover:** client, fiscal year, jurisdiction, basis of presentation, preparer, date, status
2. **Income Statement:** condensed for a micro-entrepreneur, current versus prior year, each line tagged with its GIFI code
3. **Balance Sheet:** essential captions, current versus prior year, each line tagged with its GIFI code, must balance
4. **GIFI Map:** every statement line, its GIFI code, and the accounts that roll into it
5. **CCA Schedule:** Schedule 8 continuity by class, plus a short additions and disposals detail with the date, description, class and amount of each (and proceeds for disposals)
6. **Working Papers:** every statement figure traced back to accounts and transactions
7. **Query Log:** every question raised, its status, and its resolution
8. **Trial Balance:** the full adjusted trial balance the statements are built from

---

## Keep the statements simple

Two layers, kept separate:

**The face, what the owner reads.** The Income Statement uses the app's own categories and GIFI codes, each as its own line. It stays readable because the app's category list is already short. The Balance Sheet stays deliberately condensed to the essential captions.

**The detail, what the CPA and T2 preparer need.** The GIFI Map, Working Papers, and Trial Balance tabs. Every grouped caption breaks back out here into its component accounts and exact codes. Nothing is lost for filing; it just does not clutter the face.

Rules for the face:

- **Balance Sheet: group, do not list.** Roll related small accounts into one plain-language caption. Keep a separate line only where the amount is material or the owner specifically tracks it.
- **Sweep the immaterial into "Other".** Do not create a line for a $40 account.
- **Plain language, not jargon.** "Rent and utilities", not "Occupancy costs". The GIFI code lives in its own small column, not in the caption.
- **Only show sections that exist.** No cost-of-sales block for a service business with no inventory. No long-term-debt section with no debt. Drop empty captions rather than printing rows of zeros.
- **One screen.** If the owner cannot take in the whole statement without scrolling, group further.

Not simplified: the audit trail, the tie-outs, the CCA schedule, and GIFI accuracy for the T2.

---

## Phase 1: Intake and setup

1. Confirm all three inputs are present and list exactly what you received.
2. Establish and confirm with the user:
   - **Official company name and main shareholder name.** If the entity has both a legal or numbered name and a trade name, or you are not sure who the main shareholder is, **ask, do not guess.**
   - Current and prior fiscal year-end dates.
   - Jurisdiction: federal plus province. This drives CCA and tax references. CRA throughout, never IRS.
   - Functional currency, default CAD.
   - Basis of presentation. Default: compilation engagement (CSRS 4200), cash basis with selected accruals and accounting estimates, as described in the basis of accounting note.
     - **Do not write "Notice to Reader".** CSRS 4200 retired it.
     - **Do not write "ASPE" or reference ASPE at all.** Amortization in these statements follows CCA, which ASPE does not permit, so the information does not comply with ASPE in full, and CSRS 4200 allows a framework reference only where it does. "In accordance with ASPE except for..." is expressly disallowed. Describe the basis in a note instead.
   - Confirm that **amortization in the financial statements follows CCA**, which is normally the client's direction here. The CCA Schedule is the amortization support.
3. State the engagement parameters back in one short block and wait for confirmation before extracting anything.

## Phase 2: Confirm the reference points

**CCA rates and first-year incentive rules change from year to year. Do not rely on memory.** Confirm the rate and the first-year treatment for every class you touch against current CRA Schedule 8 guidance, or against the client's T2 software, for this specific fiscal year. Write down what you confirmed and when.

The same applies to GIFI codes: reuse the codes the prior-year T2 actually used wherever the account existed last year, rather than the code you would have picked fresh.

## Phase 3: Prior-year position and the current-year ledger

*The prior year sets the opening balances. Get them exact before you look at a single current-year transaction.*

### 3a. Prior-year Balance Sheet

Extract every account and balance. This is the prior year's closing position and therefore the current year's **opening** position. Record every asset, liability, and equity account, and confirm assets = liabilities + equity in the prior year.

### 3b. Prior-year T2

Extract:

- The GIFI code used for each S100 and S125 line last year.
- Closing **retained earnings** (3849 / 3600), which is opening retained earnings this year.
- Share capital (3500 and related).
- **Schedule 8:** for every class, the closing UCC, which is this year's **opening UCC**. Record class number, description, and closing UCC. This is the most error-prone hand-off in the whole engagement. Do it line by line.

**Anchor every opening balance to the filed T2 and the prior-year statements, never to the app's ledger.** The app does not book the tax preparer's year-end CCA entry, so the ledger's carried-forward **retained earnings and accumulated amortization run behind the filed T2 by the cumulative CCA claimed to date.** This is expected, not an error. Take opening retained earnings, share capital, accumulated amortization, and UCC from the T2, then book the current-year CCA so the statements carry the correct amortized position.

### 3c. The current-year ledger

Pull the general ledger for the fiscal year through the MCP, then:

- Confirm it covers the full fiscal year: first and last transaction dates sit inside the year-end window.
- Produce a trial balance by account. **Total debits must equal total credits.** If it does not balance, stop, report the imbalance, and ask. The extract is incomplete or malformed.
- Reconcile opening balances account by account to the prior-year Balance Sheet closing balances. Every balance-sheet account's opening must equal the prior-year closing. Anything that does not tie becomes a Query Log item. **One difference is expected:** retained earnings and accumulated amortization, per 3b. Anchor those to the T2 and do not chase the ledger figure.

**Establish the sales-tax convention before you use a single figure, and prove it.** The app handles sales tax, so revenue and expense figures are normally reported **net of GST, HST, PST and QST**, with sales tax carried separately. Depending on how you pull the data you may instead receive tax-inclusive amounts with the before-tax figure in a separate field. These are not interchangeable: using the tax-inclusive figure overstates every revenue and expense line by the sales tax, silently and plausibly.

So: pull the app's own Profit and Loss for the same period, and prove your ledger-derived revenue and expense totals tie to it. Do that before Phase 4. If they do not tie, you have the wrong convention, and that is the first thing to fix.

Also expect:

- **Sales tax in its own account.** Remittances and refunds appear there as their own transactions. Reconcile it: opening, plus tax collected and input credits, less remittances, plus refunds.
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
- **Owner and shareholder transactions.** Shareholder account movement, personal expenses run through the business, dividends versus salary, shareholder loans. Watch repayment timing and flag it for the T2 preparer. Do not advise.
- **Revenue reasonableness.** Period-over-period change, cut-off (revenue in the right year), deferred revenue.
- **Sales tax.** Reconcile the sales-tax account: collected against input credits against remittances and refunds, tying each tax line back to its source transaction. Province-correct: HST in ON, NB, NS, NL and PE; GST plus PST in BC, SK and MB; GST plus QST in QC; GST only in AB and the territories.
- **Capital versus expense.** Purchases that should be capitalized and depreciated through CCA rather than expensed, and the reverse. Build the fixed-asset additions list for Phase 5.
- **Payroll.** Wages, source deductions payable, T4 reasonableness, employer portions.
- **Expense categorization.** Material miscoded items, meals and entertainment flagged for the 50% tax treatment, personal-use portions.
- **Related party.** Intercompany loans, management fees.
- **Accruals and prepaids.** Obviously missing year-end accruals such as accounting fees or interest; prepaid amounts to defer.
- **Duplicates and anomalies.** Duplicate transactions, round-number estimates, postings dated outside the year.

For every issue, add a Query Log entry: ID, account, issue, why it matters, question for the client, status, resolution.

**Handling questions:** maintain the Query Log continuously; it is a deliverable. For anything that **blocks** the statements (trial balance will not balance, opening balances do not tie, a material uncategorized balance, missing UCC), stop and ask in **one tight batch**, grouped, then wait. For non-blocking items, log them, carry a sensible default forward clearly noted, and confirm at review. Default to the simpler presentation.

Do not proceed until the trial balance balances and all blocking queries are resolved.

## Phase 5: CCA and adjusting entries

1. **Additions and disposals by class.** Record the **date** of each: the available-for-use date drives the first-year rule, and disposals need proceeds. Present a short additions and disposals detail, one row each: date, description, class, amount. A short list, not a fixed-asset register. A missing date is `[NEEDS INPUT]` and a question, never a guess.
2. **Build the Schedule 8 continuity per class:** opening UCC, plus additions with the current-year first-year rules applied as they stand for this fiscal year (verify, do not assume), less disposals at the lesser of proceeds and cost, times the class rate, giving CCA for the year and closing UCC. Handle terminal loss and recapture, and flag them for the T2 preparer without advising.
3. **Amortization expense equals the CCA claimed.** Post it by class.
4. **Other adjusting entries** from Phase 4: accruals, prepaids, reclasses, sales-tax clearing, shareholder reclass. Each gets a working-paper reference and a one-line rationale.
5. **Roll the adjusted trial balance:** opening, plus ledger activity, plus adjustments. Re-confirm debits equal credits.

Present the proposed adjusting entries and the CCA schedule to the user and wait for sign-off before finalizing.

## Phase 6: GIFI mapping and the statements

**1. Map every adjusted-TB account to a GIFI code.** Reuse the exact codes the prior-year T2 used for any account that existed last year. Assign a new code only for genuinely new accounts. Record every mapping on the GIFI Map tab, which keeps full account-by-account detail even where the face groups things together.

**2. Income Statement: use the app's own categories and codes, and do not combine them into broad groups.** Each category is its own line with the GIFI code the app uses. Keep "Interest and bank charges" as its own line; never fold bank charges into an "Office and administration" bucket. Order expense lines largest first. Show a category only if it had activity.

- **One amount per GIFI code.** A code may appear only **once** on the face. Where two or more app categories map to the **same** code, combine them into a single line for that code. This is the one case where you do combine: by shared code, never into broad ad-hoc groups.
- Lines that are not app categories but are required: **Amortization** (the year's CCA, 8670) and, where present, **foreign exchange gain or loss**.
- **Revenue** follows the app's revenue categories, typically one sales revenue line (8000). Split only into materially distinct streams the owner actually tracks.
- Then: total expenses, operating income or loss, other income, income before taxes, income taxes, net income. Current year beside prior year.

**3. Balance Sheet, condensed,** current beside prior, each line with its code:

- **Current assets:** cash, accounts receivable, sales tax receivable if any, prepaid expenses, then total current assets.
- **Property and equipment: show cost and accumulated amortization on separate lines, by GIFI class** (for example computer equipment and software with its own accumulated amortization line; machinery, equipment, furniture and fixtures with its own), then a **net fixed assets** subtotal. **Do not collapse this into a single net line.** Use the same lines in both year columns so they reconcile, and tie the net carrying amount to closing UCC by class on the CCA Schedule.
- **Total assets.**
- **Current liabilities:** accounts payable and accrued liabilities, sales tax payable, income taxes payable, due to shareholder, current portion of debt. Only the ones that exist. Then total current liabilities.
- **Long-term debt**, only if there is any. Then total liabilities.
- **Equity:** share capital (3500), then the **retained-earnings continuity line by line with its codes**: opening balance (3660), plus net income or loss (3680), less dividends declared (3700), equals closing balance (3849). In both year columns, not one collapsed line. Then total equity.
- **Total liabilities and equity.**

Keep the prior-year grouping identical to the current year so the columns line up, and match the captions the prior-year statements used where you can.

**4. Tie-outs that must hold:**

- Total assets = total liabilities + total equity, exactly.
- Net income on the Income Statement equals the net income in the retained-earnings rollforward.
- Closing retained earnings = opening (per T2) + net income - dividends.
- Accumulated amortization = prior accumulated + current-year CCA.
- Closing UCC ties to the CCA Schedule.

If a tie-out fails, fix the cause. **Never force a balancing figure.**

## Phase 7: Working papers

Build the Working Papers tab so a reviewer can trace **every** statement figure back to source:

- Each statement line, the accounts that roll into it, the adjusting entries applied, the final figure.
- A lead schedule per caption.
- Each adjusting entry: reference, accounts, amounts, rationale, source.
- The Phase 6.4 tie-out checklist with pass or fail against each item.
- Source-file references (which document, which page or row) for opening balances and UCC.
- Preparer, date, and a status line saying the statements are prepared by AI and pending CPA review.

The standard: a CPA opening this cold can follow any number on the statements down to the transactions behind it without asking you a question.

## Phase 8: Build both files

1. Assemble the finalized figures into a single structured data set, then generate the workbook and the GIFI import file **from that same data**.
2. The GIFI import sheet is one sheet: GIFI code, description, type, amount, split into an S125 block and an S100 block. Mark each row `detail` or `subtotal` so an importer that recomputes its own subtotals can filter to detail rows. **Without that column an importer double-counts.** Emit a row for every statement line carrying a code, and skip presentation-only subtotals with no code, which the tax software computes itself.
3. **Watch this trap: GIFI 8299, total income, includes 8231, foreign exchange.** If you present an FX gain or loss below operating income on the statement face, 8299 comes out understated in the import file even though net income is right. Put the FX line in the revenue section so the face and the GIFI file agree; that is also how Schedule 125 prints it. Verify that 8299 equals the sum of the revenue detail rows and 9367 equals the sum of the expense detail rows, and fail loudly if not.
4. Verify: the Balance Sheet balances, every tie-out reads pass, and no `[NEEDS INPUT]` placeholder remains.

## Phase 9: Review and deliver

1. Present a short summary: revenue, net income, total assets, key flags, and the count of open versus resolved queries.
2. Surface the Query Log items still open for client confirmation.
3. Deliver **both** files.
4. Remind the user in one line that this is a compilation prepared for CPA review: not audited, not assurance, not tax advice, and the T2 preparer should confirm CCA, shareholder items, and tax provisions.
5. Offer Phase 10: posting the year-end adjustments into the books.

## Phase 10: Post the adjustments to the books

The engagement so far has left the app's ledger where Phase 3b found it: right on cash activity, but without the year-end entries. Closing the loop means posting the Phase 5 adjustments, the current-year CCA, the accruals and prepaids, the reclasses, and any approved corrections from Phase 4, into ReInvestWealth. This is what closes the gap Phase 3b describes: from here on the ledger's retained earnings and accumulated amortization carry the filed position forward, and next year's engagement finds a ledger that ties to the T2 instead of running behind it.

**This phase writes to production bookkeeping data, and it runs only on its own explicit approval.** The Phase 5 sign-off approved the adjustments as statement figures; posting them to the books is a separate decision. If the user declines, that is a fine outcome: note in the handover that the adjustments live only in the workbook, and next year's engagement will meet the Phase 3b gap again.

**How the app takes an adjustment.** The app is a transaction-only ledger: every entry lives in a bank, card, or manual account, the category is the other side of the entry, and there are no journal entries. A posted transaction cannot be deleted (a removal is a void, and the record stays), and its amount and date cannot be changed after it is created. **Confirm the exact write path available to you before posting anything**, then work as though every write is permanent. Express each adjustment in the ledger's own terms:

- **A reclass of an existing row is a recategorization** of that row, never a new entry. Sales tax rides on the row, so correct it at the same time.
- **A confirmed duplicate is a void.**
- **A non-cash adjustment, which is most of them (CCA, an accrual, a prepaid deferral), is a pair of offsetting entries in a manual account netting to exactly zero cash:** one leg categorized to the expense or income line, the offsetting leg to the balance-sheet category. Post each pair as an atomic unit; a lone leg silently distorts profit.
- Categories come from the app's chart of accounts, **fetched fresh in this phase.** Never invent one, and if the chart has no category for a leg (accumulated amortization, an accrued liability), stop and ask; never park a leg in a lookalike category.

Then follow the same protocol as every writing skill here:

1. **Plan.** Build the posting list from the finalized adjusting entries, one row per entry: date (the last day of the fiscal year), account, name, category, amount, and its working-paper reference. Name each entry with the prefix `YEAR-END ADJ`, the working-paper reference, and the fiscal year, and put the one-line rationale from the working papers in the note. Any accrual a future payment must clear gets the clearing instruction in the note: the expected payment and the exact category it must receive, so the balance nets to zero instead of the payment being expensed a second time.
2. **Review.** Show the full posting list to the user.
3. **Approve.** Wait for explicit approval of that exact list. **Never apply in the same turn as you plan.** Any edit after approval means a new review and a new approval.
4. **Apply.** In batches, each offsetting pair as an atomic unit.
5. **Verify.** Re-pull the ledger, rebuild the trial balance, and confirm it now ties to the workbook's adjusted trial balance line by line. Record what was posted, with references, in the Working Papers tab.

Two cautions:

- **Post only figures that are final.** If the T2 preparer later changes the CCA claim or a provision, the posted entries need a follow-up adjustment, never an edit. Say so in the handover.
- **Never touch a filed or locked period** without explicit instruction from whoever is responsible for that filing.

---

## Hard rules

- **Never plug a balancing figure.** If it does not tie, find the cause or ask.
- **Never invent a number.** Missing data is `[NEEDS INPUT]` plus a Query Log entry.
- **One amount per GIFI code** on the face of either statement.
- **Never give tax advice.** Flag tax-sensitive items (shareholder loans, recapture, meals and entertainment, dividends) for the T2 preparer. Do not advise on them.
- **Verify CCA rates and first-year rules for this specific fiscal year** against CRA. They change.
- **Reuse prior-year GIFI codes** for continuity.
- **CRA, not IRS.** Province-correct sales tax. T2, Schedule 8, Schedules 100, 125 and 141.
- **Prove the sales-tax convention against the app's Profit and Loss** before using any figure.
- **Audit trail is mandatory.** No untraceable numbers.
- **Writes happen only in Phase 10**, plan-then-approve, after the statements are finalized. Everything before it is read-only, and posted entries are permanent.
- **Review-ready, not file-ready.** Output always carries the pending-CPA-review status.
- **Keep client financials out of version control.**

---
name: "riw-ar-ap-recon"
description: "Turn cash-basis books kept in ReInvestWealth into working accrual accounts receivable and accounts payable: accrue open invoices and bills as of a date, produce an aging workbook for an accountant to review, match the payments that settle each item, and book the entries back only after explicit approval. Use when someone asks for AR or AP, an aging report, accrual-basis receivables and payables, who owes us and what we owe, unpaid invoices and bills as of a date, or to reconcile receivables and payables."
license: "MIT"
compatibility: "Needs the ReInvestWealth accounting MCP server connected to your assistant with write access to the target business. WRITES TO PRODUCTION BOOKKEEPING DATA. Posted entries are permanent. Intended for accountants and bookkeepers, or an owner working with one. Sales tax handling is Canada specific; the rest applies in Canada and the United States."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.2.0
  writes: transactions
  risk: high
---

# AR / AP Reconciliation

ReInvestWealth keeps a cash-basis ledger: an entry exists when money moves. This skill constructs real accrual accounts receivable and accounts payable on top of it, for one business at a time:

1. **Accrue** every open customer invoice and vendor bill as of a date, so revenue and expenses land in the period they belong to and the balance sheet shows AR and AP lines.
2. **Age** the open items in an Excel workbook built for an accountant to review, with every proposed entry visible before anything is written.
3. **Match** the bank and card transactions that settle each item, at stated confidence tiers, never silently.
4. **Book** the approved entries back into the app, and **verify** the result from live data.

The working rhythm is a loop with a human in the middle: build the subledger, hand over the workbook, wait, apply what was approved, prove it. The accountant works in the spreadsheet they already think in, and the books end up somewhere they can sign off on.

---

## Read this before you touch anything

**This skill writes to production bookkeeping data, and what it posts is permanent.**

The app protects the audit trail, which means it does not let you undo a mistake cleanly: removal is a soft delete (the record stays, hidden from reads unless requested, and restorable), and a posted transaction's amount and date cannot be changed after it is created. A wrong entry is a soft delete plus a fresh entry, permanently visible in the history. The correction paths available to you are exactly: recategorize, rename, or annotate an existing row; soft-delete it (restorable); or post a new entry. Work as though every entry is permanent, because the history effectively is.

So the protocol is not optional:

1. **Plan.** Build every entry. Assert the tie-outs in code. Change nothing.
2. **Review.** Emit the full workbook and show it to a human.
3. **Approve.** Wait for explicit approval. **Never apply in the same turn as you plan.** Never infer approval from enthusiasm. Any edit after approval means a new review and a new approval.
4. **Apply.** In order, settlements as atomic pairs. Writes apply on the first call, report per-row success and failure, and have no idempotency layer: check the counts after every call, and **never blind-retry a create**, because a retry can double-post. On any doubt, re-read before re-sending.
5. **Verify.** Re-read from the app and prove the tie-outs from live data.

**Never guess.** Not a category, not a tax rate, not a due date, not which payment settles which invoice. Every one of those has a right answer available: read it from the app, or put the question in the workbook's Queries tab and let the accountant decide. A plausible guess posted into a client's books is worse than a delay.

If this is your first ever run of this skill, do one complete cycle on a test business or a handful of items before running any breadth.

---

## How an accrual works here

The app is a **transaction-only ledger**. Every entry lives in an account, the category is the other side of the entry, and **there are no journal entries**. The balance sheet shows each account as its own line: depository-type accounts on the asset side, credit-type accounts on the liability side, with sales tax collected and recoverable tax rolling into a sales-tax line.

That is enough to build accruals from, using **two dedicated ledger accounts**:

- An **AR ledger account** (depository type, so it reads as an asset).
- An **AP ledger account** (credit type, so it reads as a liability).

A single entry in the AR ledger categorized to a revenue category is a complete, balanced accrual: AR rises by the gross, revenue rises by the before-tax amount, sales tax payable rises by the tax, and cash is untouched. The AP side mirrors it with an expense category. Settlement then uses the app's own **interfund-transfer** category: the cash row in the real bank account and a matching leg in the ledger account.

### Worked example, receivable

An invoice of 1,130.00 = 1,000.00 service revenue + 130.00 HST (Ontario), paid into a chequing account.

| # | Event | Account | Amount | Category | Sales tax |
|---|---|---|---|---|---|
| 1 | Invoice issued | AR ledger | +1,130.00 | Service Revenue | Yes: 1,000.00 before tax, 130.00 HST |
| 2 | Payment lands: **recategorize the existing bank row** | Chequing | +1,130.00 (unchanged) | Interfund Transfer | None |
| 3 | Same approved batch: **new entry** | AR ledger | -1,130.00 | Interfund Transfer | None |

After 1: AR 1,130, revenue 1,000, sales tax payable 130. After 2 and 3: cash up 1,130, AR back to zero.

### Worked example, payable

A bill of 1,130.00 = 1,000.00 professional fees + 130.00 recoverable HST, paid from the same chequing account.

| # | Event | Account | Amount | Category | Sales tax |
|---|---|---|---|---|---|
| 1 | Bill received | AP ledger | -1,130.00 | Professional Fees | Yes: 1,000.00 before tax, 130.00 HST |
| 2 | Payment leaves: **recategorize the existing bank row** | Chequing | -1,130.00 (unchanged) | Interfund Transfer | None |
| 3 | Same approved batch: **new entry** | AP ledger | +1,130.00 | Interfund Transfer | None |

### Sign rules

- **One convention for every account and every amount you read or write: positive is money into the business, negative is money out.** The balance-sheet side comes from the account's type (depository reads as an asset, credit as a liability), never from flipping signs.
- Sign is direction, not classification: a positive amount on an expense category is a refund, not income.
- **Sales tax is set by naming the taxes on the row; the app computes every rate and amount** from its own rate table, carrying the row's sign: collected tax on a revenue accrual reads positive, recoverable tax on an expense accrual negative. Your tax figures in the workbook are predictions to verify against what the app computed.
- **Confirm against a known transaction before posting at scale**: read one existing row whose direction you know and check the sign matches.

### The three rules that keep it balanced

1. **Sales tax lives on the accrual leg only.** Settlement legs are always untaxed, and when you recategorize a bank row to Interfund Transfer, any sales tax on it must come off at the same time (clearing tax means setting the row's tax list to empty; the app recomputes from what you name). Tax on both legs double-counts the tax; tax left on the cash row after reclass means the same tax is claimed twice. Know the side effect: setting a category or tax on a row permanently marks it human-decided, which stops the AI bookkeeper from ever recategorizing it. For settlements and accruals that is exactly right, but it is irreversible.
2. **Interfund legs are posted as a balanced pair, in the same approved batch, netting to exactly zero.** The app treats interfund transfers as neutral to profit, and a lone leg (or a pair that does not net to zero) silently distorts retained earnings. Never post one leg planning to add the other later.
3. **Settlement recategorizes the existing cash row; it never creates a second one.** The money already moved and the bank feed already recorded it. A new cash row would double cash.

---

## The two ledger accounts

One pair per business. They appear in the app named in the pattern **ReInvestWealth Accounts Receivable CAD Accrual Ledger** and **ReInvestWealth Accounts Payable CAD Accrual Ledger** (the currency matching the business's base currency), and their balances are the AR and AP lines on the balance sheet.

- If the pair does not exist, create it through the connection: the AR ledger as a **depository-type** account (chequing or savings) and the AP ledger as a **credit-type** account, both in the business's base currency. Mind the cap: a company can hold at most **five custom accounts**, and this pair consumes two of them, so confirm the client is not near the limit before creating. **After creating them, confirm the balance sheet still renders and shows both accounts on the correct sides before posting a single transaction.** A misconfigured account is much cheaper to find empty (and retiring a custom account is a soft disable that keeps its transactions, so a wrong creation is recoverable but not erasable).
- The accounts are visible in the client's account list alongside their real banks. Tell the client what they are, so nobody "cleans them up".
- **Nothing posts into these accounts except this process.** That single rule is what makes the ledger account balance the truth for AR and AP, and what makes reruns safe: on a new run, the prior state is read from the ledger accounts themselves.

### Naming every entry

Every entry this skill posts gets a name with an uppercase prefix identifying its role (AR ACCRUAL, AP ACCRUAL, AR SETTLEMENT, AP SETTLEMENT) plus the invoice or bill reference and the counterparty, and a note in one plain sentence: what it is, the source document, issue and due dates, and what clears it. A future reader must be able to identify these rows at a glance, and a rerun must be able to reconstruct state from them without guessing.

---

## Sources of truth

| Side | Source | Notes |
|---|---|---|
| AR | The app's own invoices | Authoritative when the client invoices in ReInvestWealth. Draft and void invoices are not AR. An uncollectible invoice goes to the Queries tab, not to a write-off. A missing due date falls back to issue date plus the client's stated terms; unknown terms means due on issue, flagged in Queries |
| AR | The accountant's workbook (AR Items In tab) | For invoices raised outside the app |
| AP | The accountant's workbook (AP Bills In tab) | The bill data lives with the accountant; the app has no bill object |

**Conflict rule:** where the app and the workbook disagree about the same item, put it in the Queries tab and **book neither side** until the accountant resolves it. Never silently pick a winner.

---

## Phases

### Phase 1: Scope

Confirm which business, then resolve and report back before continuing: the base currency, the fiscal year end, sales-tax registration and jurisdiction, which sales-tax periods have already been filed, the real bank and card accounts, and whether the ledger account pair exists. Ask for the **as-of date** (default today) and the **period under review** (default the current fiscal year). If the base currency is not what the user expects, say so out loud: every figure downstream depends on it.

### Phase 2: Pull state

Fetch fresh, never from memory: the app's chart of accounts and category list, the sales-tax registration for the jurisdiction (the rates themselves live server-side and are applied by the app when you name a tax), all transactions for the period plus enough history to catch late-settling items, all invoices, and **everything already sitting in the two ledger accounts**, which is the record of what prior runs accrued and settled. If the accountant returned a workbook, read its input tabs now. Transaction reads page at up to 50 rows per call with a cursor: a full-period pull is many pages, so plan for it rather than assuming one call returned everything.

### Phase 3: Build the open-items list

Merge the sources into one list of open items. Each item carries: kind (AR or AP), reference, counterparty, issue date, due date, currency, gross, tax, net, category, source, whether a prior run already accrued it, amount settled to date, and open balance.

Rules, applied here so a blocked item never reaches the proposal set:

- **An item a prior run accrued is not re-accrued.** Its open balance comes from the ledger account, not from a recomputation.
- **The double-count guard.** If the cash for an item is already in the books categorized as revenue or expense (the app's automatic categorization does this routinely, and it is correct on a cash basis), accruing it too would count the income or expense twice. Such an item is either settled properly (accrue, then reclass that cash row as the settlement, all in the same reviewed plan) or not accrued at all. Flag every case in the workbook; never accrue on top of recognized cash.
- **Fiscal-year gate.** An accrual dated outside the current fiscal year goes to Queries unless the accountant explicitly approves that specific item; it changes a comparative period.
- **Filed-period gate.** A taxed accrual dated inside an already-filed sales-tax period is blocked outright, because the tax on the accrual leg would change a filed return. Inside a return currently being prepared: flagged, not blocked.
- **Currency gate.** An item whose currency differs from the business's base currency goes to Queries rather than being accrued at a guessed rate. Accrue foreign-currency items only when the accountant has agreed the rate treatment. The app converts posted rows to base currency itself, from its own daily rates; the connection can look those rates up for any date and pair, so predict the base amounts in the workbook and verify them after posting. Any difference on settlement goes to FX gain or loss, never to rounding.

### Phase 4: Match payments to open items

Score every candidate bank or card transaction in the window against every open item, and give each candidate a tier and a **human-readable reason string**, never a bare score:

| Tier | Conditions | Action |
|---|---|---|
| **Exact** | Amount equals the open balance to the penny, counterparty matches (normalized, or a confirmed alias), dated on or after the issue date, same currency, not already matched | Auto-book on approval |
| **Strong** | Amount exact but counterparty fuzzy, or counterparty exact and amount within the stated rounding tolerance | Proposed, pre-ticked |
| **Weak** | Partial payment, a deposit whose subset sums to a group of items, or a match outside the date window | Proposed, **not** pre-ticked |
| **None** | Everything else | Queries tab, showing the closest near-miss so the accountant can see why it was refused |

Defaults, stated in the workbook header and adjustable per run: amounts exact to the penny for Exact, and a date window from issue date to due date plus 120 days.

- **One bank row settles one item set, once.** Mark a cash row consumed as soon as it is matched; never let the same deposit surface as the best candidate for two different items.
- **Tied candidates are a question, not a match.** If several candidates score equally for one item (four identical e-transfer deposits against one invoice, say), downgrade to a pick-one entry in Queries. Never pre-tick a coin flip.
- **Partial payment:** settle the paid amount only; the ledger keeps the remainder open automatically.
- **Consolidated deposit** (one payment clears several invoices): one reclass on the bank row, plus one ledger leg per invoice, together summing exactly to the deposit, so per-invoice traceability survives and the pair still nets to zero.
- **Processor payouts net of fees** (a card processor deposits the invoice total minus its fee): the deposit must be split so that the interfund part ties to the invoice and the fee part is booked as a bank-charge expense, to the penny. If you cannot represent that split exactly, route it to Queries.

### Phase 5: Emit the workbook

One Excel workbook, written to a working directory **outside any version control**. Client financial data never enters a repository. Ownership is split and labelled on every tab, because the accountant edits half of it.

**Output tabs, regenerated every run. The accountant does not edit these.**

| Tab | Contents |
|---|---|
| Cover | Business, as-of date, period, base currency, tolerances used, run identifier, and the basis: compilation, not an audit, not tax advice |
| AR Aging | Per open item, bucketed by due date: current, 1-30, 31-60, 61-90, over 90, with open balance, proposed settlement, and remaining columns |
| AP Aging | Same, payable side |
| Proposed Matches | Every candidate with its tier, reason string, and the exact rows it would touch |
| Proposed Entries | Every entry that would be created or recategorized, with account, amount, category, tax, and balance effect |
| Queries | Everything blocked, unmatched, conflicting, or out of scope, each with the decision the accountant needs to make |
| Audit Trail | Every entry booked by every prior run |

**Input tabs, owned by the accountant. Read them, never overwrite them.**

| Tab | Contents |
|---|---|
| AP Bills In | Vendor, bill number, issue date, due date, currency, gross, tax, expense category, notes |
| AR Items In | Same shape, for invoices raised outside the app |
| Match Overrides | Reference, bank row, approve or reject or reassign, plus a reason |
| Aliases | Counterparty name variants, so a confirmed alias upgrades future matches to Exact |

Assert before emitting, and refuse to emit a workbook that fails any of these: the AR aging total equals the AR ledger balance as it will stand after this run's proposed entries, and likewise AP; every aging bucket sums to its item total; the proposed entries move no cash (every settlement cash leg is a recategorization of an existing row); every proposed interfund pair nets to zero.

### Phase 6: Accountant review

Hand over the workbook and **stop**. When it comes back, re-read the input tabs, diff against what you proposed, and restate what changed before writing anything. An edited input tab means a new proposal and a fresh approval. An earlier approval never carries forward to changed content.

### Phase 7: Book the entries

Only what was approved, in this order:

1. **The ledger accounts**, if they were missing, as their own step, with the balance-sheet check before anything is posted to them.
2. **Accruals**, one entry per open item.
3. **Settlements**, each group applied as one unit: the bank-row recategorization and every matching ledger leg together, never split, because an unpaired interfund leg distorts equity. The connection is not transactional across rows, and batch writes report **partial success** per row, so after every settlement group verify both sides landed; if one leg failed (a period lock is the usual reason), soft-delete or revert the leg that did land, report it, and re-plan that item rather than leaving a lone leg.

Apply the gates from Phase 3 as refusals: report what was blocked and why, and do not work around them. The app enforces its own period lock server-side (locked rows come back as per-row failures with reasons); treat that as a backstop that confirms your gates, never as the plan.

### Phase 8: Verify from live data

Re-read from the app, and prove:

1. Every approved entry exists, exactly as approved.
2. The AR ledger balance equals the sum of the open AR items in the subledger, to the penny, and likewise AP.
3. The interfund legs written this run net to exactly zero.
4. No accrual entry sits in a real bank or card account: cash is untouched by accruals.
5. For every settled item, exactly one of the accrual leg and the original cash row carries a revenue or expense category, never both.
6. Show the resulting balance-sheet AR and AP lines and the entry counts.

Only then tell the user the run is complete. If any check fails, say so plainly, with the numbers, and treat the run as incomplete.

---

## Out of scope, and where it goes

Write-offs and bad debt, credit notes, customer deposits and unearned revenue, prepaid expenses, and accrued liabilities with no invoice behind them all land in the **Queries tab** for the accountant to handle deliberately. Do not improvise entries for them.

---

## Traps

- **Applying in the same turn as planning.** The review gate is the whole safety model.
- **Accruing an item whose cash is already recognized as revenue or expense.** The classic double count, and the single most damaging mistake available here.
- **Creating a new cash row for a settlement** instead of recategorizing the existing one. Doubles cash.
- **Posting one interfund leg without its pair**, or a pair that does not net to zero. Silently distorts equity.
- **Tax anywhere except the accrual leg**: on a settlement leg, or left behind on the reclassed bank row.
- **Re-accruing an item a prior run already accrued.** Prior state lives in the ledger accounts; read it.
- **Letting one deposit settle two different items.** Mark cash rows consumed.
- **Pre-ticking a tied match.** Equal candidates are a question for the accountant.
- **A taxed accrual dated inside a filed sales-tax period.** It changes a filed return. Blocked, not warned.
- **Inventing a category or a tax rate.** Both come from the app. Read them or ask.
- **Netting AR against AP**, or an item's receivable against the same counterparty's payable. Book both sides.
- **Reporting the run as tied while the aging and the ledger balance disagree.** Investigate first.

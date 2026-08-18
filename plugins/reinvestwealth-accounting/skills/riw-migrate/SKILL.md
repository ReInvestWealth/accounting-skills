---
name: "riw-migrate"
description: "Migrate a client onto ReInvestWealth: post their opening balance sheet as of a start date, import their historical transactions from a prior system, or both. Categorizes strictly with the app's own chart of accounts, handles currency and sales tax correctly, and works plan-then-approve because posted entries are permanent. Use when someone asks to migrate a client, import transaction history, set opening balances, move books from another system, or fill a gap in a bank feed."
license: "MIT"
compatibility: "Needs the ReInvestWealth accounting MCP server connected to your assistant with write access to the target business. WRITES TO PRODUCTION BOOKKEEPING DATA. Posted entries are permanent. Intended for accountants and bookkeepers, or an owner working with one. Sales tax handling is Canada specific; the rest applies in Canada and the United States."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.1.0
  writes: transactions
  risk: high
---

# Migrate a Client onto ReInvestWealth

You are moving a client's books into ReInvestWealth. Three situations, one skill:

- **Opening balances.** The client draws a line: everything before date D is summarized in a closing position. You post that position so the books open at exactly the right place. Almost every new client needs this.
- **Transaction history.** The client wants historical detail in the app, from a CSV, general ledger, or bank export.
- **Both**, which is the common case: opening balances as of a start date, then transaction detail from that date forward. **Never both covering the same activity, or it double-counts.**

There is also a fourth, narrower job at the end: filling a gap where a live bank feed dropped rows.

---

## Read this before you touch anything

**This skill writes to production bookkeeping data, and what it posts is permanent.**

The app is built to protect the audit trail, which means it does not let you undo a mistake cleanly:

- A posted transaction **cannot be deleted.** Removing one means voiding or soft-deleting it, and the record stays.
- A posted transaction's **amount and date cannot be changed after it is created.** A wrong amount or a wrong date is not an edit, it is a void plus a fresh entry, permanently visible in the history.

**Confirm the exact correction path available to you before you start**, so you know what a mistake will cost. Then work as though every entry is permanent, because effectively it is.

That single fact is why the protocol below is not optional:

1. **Plan.** Build every entry. Assert the tie-outs in code. Change nothing.
2. **Review.** Produce a full review table, one row per entry, and show it to a human.
3. **Approve.** Wait for explicit approval of that exact set. **Never apply in the same turn as you plan.** Never infer approval from enthusiasm. Any edit after approval means a new review and a new approval.
4. **Apply.** In batches, in order.
5. **Verify.** Re-read from the app and prove the result against the client's own figures.

**Never guess.** Not a category, not a currency, not a tax rate, not a sign convention. Every one of those has a right answer available: ask for it, or read it from the app. A plausible guess posted into a client's books is worse than a delay.

**Never post into a locked or already-filed period** without explicit instruction from whoever is responsible for that filing.

---

## Shared foundation

### The ledger model

The app is a **transaction-only ledger**. Every entry lives in a real bank or card account, and the category is the other side of the entry. **There are no journal entries.** Everything you post, including an opening balance sheet, is expressed as transactions in accounts.

### Categories come from the app, never from you

The app has its own chart of accounts, each entry carrying a category name, a GIFI code, and a financial-statement type (asset, liability, equity, revenue, expense, income tax, interfund transfer).

**Fetch it fresh at the start of every migration** and map to it exactly. Never invent a category, never reuse a code you remember, and never copy a code off an existing transaction, which may carry a stale value. If nothing fits a line, **ask**.

Mapping guidance for the balance-sheet lines that come up most:

- **Accounts receivable** maps to the loans-receivable account. **Accounts payable** maps to loans payable.
- **Shareholder balances:** owed to the shareholder goes to due-to-shareholder; owed by the shareholder goes to loans receivable. **Keep the two directions separate for distinct standing opening balances; never net them.** For in-year flows it is different: if the client's own books run all shareholder activity through a single shareholder-loan account, mirror that and put every leg on due-to-shareholder, even where the balance temporarily flips direction. The keep-separate rule is about opening balances, not round trips.
- **Income tax payable and withholding tax payable** both go to the income-tax payment, refund and instalment account as opening inflows. There is no dedicated payable category, and this works because the client's later payments get the same category, so the opening liability nets against them and the prior year's tax is not expensed again in the current year.
- **Sales tax balances** go to the sales-tax payment, refund and instalment account, on the same netting logic.
- **Retained earnings is not a category.** See Mode A.
- **Currency differences** when clearing an opening balance go to FX gain or loss.

**Label the clearing mechanic on the entry itself.** Any opening balance that a future transaction has to clear (tax payables, sales tax, payables, shareholder balances) gets a name that says so, and a note that names both the expected clearing transaction and **the exact category it must receive**. For example: a note explaining that the CRA remittance paying this balance must be categorized as a sales-tax payment so it nets the balance to zero rather than being expensed again. The netting only works if the later payment gets the same category, so whoever categorizes it in the app has to be able to read that instruction on the transaction.

### Sign convention

Branch on the account type, and **confirm it against a known balance rather than assuming**:

- **Depository accounts:** positive is money out (expenses, asset purchases). **Negative is money in** (revenue, liabilities and equity received).
- **Credit accounts:** inverted. Positive increases the balance owed (purchases); negative is a payment or refund.

So a depository account's balance is the negative of the sum of its entries, and a credit card's amount owing is the positive sum.

### Currency

Two currencies matter on **every** row, and both must be resolved before any math. Never assume either:

- **Transaction currency is the bank account's currency.**
- **Base currency is the business's base currency**, which is per-business and not always CAD.

The FX rate is base-currency units per one unit of account currency, and the base amount is the transaction amount times that rate, rounded to the cent. Keep it internally consistent per row. When the two currencies match, the rate is 1.

Resolving the rate, in order:

1. **A client-provided rate**, mainly for opening balances: use *their* year-end rate so equity ties to what they filed.
2. **The app's own daily rates** for the relevant date. For per-transaction history, use each transaction's own date.
3. If neither resolves, **ask.** Never guess a rate.

**Reconcile the pennies before the review table.** Rounding each row independently scatters one-cent artifacts across statement lines. Where the client stated an exact base-currency figure for a line, override that entry's base amount to match by the penny, and let the cash account's base-currency presentation absorb the remainder: cash truth is its own currency, and its base value is derived anyway. **Do not book rounding pennies to FX gain or loss.** The ledger balances by construction, so there is never a residual to book. FX gain or loss is for real currency differences, such as clearing a base-currency liability with foreign-currency payments.

### Sales tax: a zero-mistake zone (Canada)

ReInvestWealth e-files GST, HST and QST returns, so imported transactions must carry sales tax exactly the way the app does, or not at all.

1. **Rates come only from the app's own sales-tax rate data.** Never hardcode a rate, never improvise one, and never accept a rate from the client's file without matching it to the app's rate for that region.
2. **Claimable versus display-only.** A tax is claimable only if the business is registered for it **and**, on non-revenue rows, the rate is refundable. Non-refundable provincial tax (PST in BC, SK and MB) on a purchase is a real cost for every business because PST has no input-credit mechanism: it is display-only and stays inside the expense. The before-tax amount subtracts claimable taxes only.
3. **Mixed treatment means split the transaction.** If one cash row contains parts with different tax treatment, create one entry per part, each with its correct treatment, the parts summing exactly to the cash amount, every note citing the same source row. **Never average, and never apply a blended rate.**
4. **Region** defaults to the business's home province unless the source data explicitly shows another jurisdiction's tax was charged.
5. **No per-row tax evidence means no tax in the books, but never silently.** If the export has no tax codes, tax columns, or per-transaction tax legs, import the rows untaxed, change nothing, and **report those rows to the operator** so they can ask the client. Guessing is prohibited.
6. **An already-filed period does not change the rule.** If a transaction genuinely carried sales tax, record it, even where its filing period was filed from the prior system.
7. **Validate in code before review:** per row, the before-tax amount plus the taxes equals the total to the penny; every rate used exists in the app's rate data for that region; claimed taxes are refundable; and the aggregate collected tax reconciles to the source books.

Collected tax on revenue rows carries the same sign as the amount, so it reads negative on a depository inflow. Input credits on expense rows read positive.

### Naming every entry

Give every posted entry a name with an uppercase prefix that identifies the migration, and a note in one plain sentence saying what it is, the basis for the figure, and where it came from. A future reader (and a future you) needs to identify these rows at a glance and know why they exist. Where an entry must survive a later cleanup, say so in the name.

---

## Mode A — Opening balances

**Inputs.** Ask for anything missing before starting:

| Input | Notes |
|---|---|
| Opening date **D** | First day of the new books. The prior period closes at **D minus 1** |
| Closing position | Balance sheet, trial balance, T2 Schedule 100, or a written list as of D minus 1, with every line's amount and currency |
| Per-account balances | The opening balance of **each** bank and credit-card account, and its currency |
| Year-end FX rate | If any line is not in the base currency and the client filed a return, use **their** year-end rate so equity ties to the filing |
| Account mapping | Which connected accounts map to which balance lines |

Also confirm: **is pre-D transaction history being removed?** The usual case is yes, all prior activity is summarized in these balances. If transactions exist before D, void them first as their own reviewed change, so they do not double-count with the opening position.

**The model.** Two invariants:

1. **Each bank or card account's entries must net to that account's true opening balance.** Depository: money in is negative, so entries sum to the negative of the balance. Credit card: entries sum to the positive balance owed.
2. **Every non-cash balance line becomes one entry in the primary operating account dated D**, categorized to its mapped account: liabilities and equity as inflows (negative), assets as outflows (positive).

**Retained earnings is the balancing figure and has no category.** It is created by posting each account's residual as a profit-and-loss entry **dated D minus 1, the last day of the prior period**:

- A residual in the outflow direction becomes an other-expense entry.
- A residual in the inflow direction becomes an other-revenue entry.

The app rolls prior-period profit and loss into retained earnings, so these D-minus-1 entries become opening retained earnings on D. **The sum of all residual entries, in base currency, must equal the client's retained earnings figure exactly. Assert it.** Name them so it is obvious they are deliberate prior-period closing entries that must survive any "delete everything before D" cleanup.

**Phases.**

1. **Intake.** Collect the inputs. Confirm D, the accounts, the currencies, and the pre-D question. Verify the client's own statement balances: assets equal liabilities plus equity. Small rounding is fine, because retained earnings absorbs pennies as the balancing figure. Flag anything larger before you build.
2. **Resolve.** Fetch the chart of accounts fresh. Confirm the base currency and the real account identities.
3. **Map** every line to a category using the guidance above. Anything without a clean fit goes into one batched question round.
4. **Plan FX** per the currency section. Rate date is D minus 1.
5. **Build and assert.** Generate the entries, then assert in code, before a human sees anything: each account's entries net to its opening balance; the residuals' base-currency sum equals the client's retained earnings; assets equal liabilities plus equity overall.
6. **Review and approve.** Blocking. See the protocol.
7. **Apply, then verify.** Re-read from the app: the implied balance of every account at D equals the client's figures, every entry is present, and dates landed as intended.
8. **Hand over.** Tell the user which future client transactions clear which opening balances, and which category each of those must receive. This is the step that keeps the migration correct six months later.

---

## Mode B — Transaction history

**Inputs.** Ask for anything missing:

| Input | Notes |
|---|---|
| Transactions file | CSV or spreadsheet. One file per account is cleanest; a combined file needs an account column |
| Target accounts | Which connected account each set of rows belongs to |
| Period | The date range to import, and where the live bank feed or statement uploads take over |
| Currency | Per account, and per row only if the file mixes them |
| Ending balances | The statement balance at the end of the imported period. **This is the verification anchor** |
| Category scheme | Their category list if the export has one |

**Phases.**

1. **Scope the boundary.** The import must not overlap the live feed, statement uploads, or an opening-balance position covering the same activity. If existing rows overlap the period, resolve that first as its own reviewed change.
2. **Resolve.** Chart of accounts fetched fresh, base currency, account identities.
3. **Parse and normalize.** Every row to date, amount, description, category, account. Handle the file's quirks explicitly: date formats, debit and credit columns versus a signed amount, thousands separators. **Establish the sign convention by tying to a known balance:** compute the implied ending balance under your assumed convention and compare it to the client's statement. **Never assume which way their export signs things.** Then convert to the app's convention.
4. **Guard against duplicates.** Against existing rows in each target account, treat the same account, date and amount as a suspected duplicate. **Do not require the description to match**, because descriptions differ between systems. Exclude suspects and list them in the review as skipped, with reasons.
5. **Categorize, with no silent guessing.**
   - Where the client has categories, map each distinct one to the app's chart of accounts **once**, and show the full mapping table for approval.
   - Where they do not, propose from descriptions, mark each row's confidence, and default low-confidence rows to other expense or other revenue, flagged for the client to recategorize in the app. The app's interface is good at this; do not over-engineer it here.
   - **Transfers between the client's own accounts get the interfund-transfer category on both legs.** A credit-card payment from a bank account is the classic case.
   - Journal-only lines with no cash account, such as depreciation, are **out of scope.** Flag them: they belong to opening balances or year-end adjustments.
6. **FX and sales tax** per the shared foundation. Where the source carries per-row tax evidence, build the tax at the app's rates, split mixed-treatment rows, and add the tax tie-outs to your assertions. Where it does not, import untaxed and report those rows.
7. **Review and approve.** Present the **full** review table up front: every row with its date, account, name, category, code, amount in account currency, amount in base currency, and rate, plus the skipped duplicates and their reasons. **Wait for explicit approval, once.** Then apply in sequential batches without re-asking. Any change to the reviewed content after approval means a new review and a new approval.
8. **Verify.** From live data: the imported count per account, the per-month sums, and **the implied ending balance of each account equals the client's statement balance.** Investigate any gap before reporting. Never leave an untied balance unexplained.
9. **Report.** Counts, per-account tie-outs, skipped duplicates, and the rows flagged for recategorization in the app.

---

## Narrower job: filling a bank-feed gap

Same machinery, different situation: the accounts are live and connected, but the feed dropped rows. The client supplies a bank statement export and you import only the **verified-missing** rows.

**Prove every gap before you propose anything.** These are production books, and a false "missing" row creates a duplicate that is then permanent.

1. **Match one to one.** Statement rows against active app rows per account, on exact amount, with a date window of a few days because posting dates drift. Each app row can be claimed once. The unmatched statement rows are your candidates. **Require zero unmatched app rows inside the statement window**, which is what proves the app side has no duplicates and your sign convention is right.
2. **Align on minimum total lag, not nearest date.** Inside a cluster of same-amount rows (a recurring small charge, repeated identical card payments), nearest-date matching can claim an app row for the wrong statement row and flag the wrong **date** as missing. Per amount group, sort both sides by date and minimize total date difference across the group. Sanity check: the lag distribution should cluster at zero to two days. Any large lag means a cluster was mis-assigned.
3. **Check monthly sums**, which is independent of how you paired rows. Per month, the statement net minus the app net must equal the flagged rows' sum, to the penny. Residuals are usually one transaction sitting on opposite sides of a month boundary. Trace each one before accepting it.
4. **Re-query each candidate live** before posting: same account, exact amount, a slightly wider date window, including voided and pending rows. A same-amount hit in a *different* account is usually the other leg of a transfer and does not rescue the missing row.
5. **Categorize by sibling precedent, not proposal.** The books already show how each merchant is categorized: mirror the same merchant's existing rows, with the category still fetched fresh from the chart of accounts. Where a description maps to many categories across the client's own history with no consistent precedent (generic e-transfer memos are the classic case), there is no reliable sibling: default to other expense or other revenue, untaxed, and **flag the row.** Never infer one. Watch for a same-amount out-then-in pair a few days apart, which is often a returned transfer and should be judged as a pair.
6. **Sales tax by sibling precedent too, and keep it era-consistent.** A merchant that was untaxed during the gap's period stays untaxed even if it became taxed later. Where a recurring charge has same-total siblings, your computed tax must reproduce the app's stored tax to the penny, which is what validates your rounding. No precedent and no invoice evidence means untaxed and flagged.
7. **Request the statement that covers through the period end.** A fill built from monthly statements only reaches the last statement's cutoff, so the final weeks of a period silently stay missing. Ask for the next statement.
8. **A leftover transfer imbalance is a prompt to check the other account, not proof it is missing rows.** Sum every transfer leg and pair each to its other side. Same-currency pairs must net to zero. A lone leg is either a cross-currency conversion, where the difference is real bank FX and belongs in FX gain or loss, or a genuine gap. **Do not infer a missing-row count for the other account from the imbalance**, and never present a non-zero residual as tied. Get that account's statements and reconcile it directly.
9. **The post-apply bar is 100%:** re-run the one-to-one match from live data, with every statement row matched and zero app-only rows in the window, on every account.

If the cause looks like the feed silently dropping rows on one account while others on the same connection kept working, that is worth reporting to ReInvestWealth support rather than diagnosing yourself. It will not self-heal.

---

## Traps

- **Applying in the same turn as planning.** The review gate is the whole safety model.
- **Both opening balances and history covering the same activity.** Double-counts.
- **Assuming the export's sign convention.** Tie to a known balance.
- **Requiring descriptions to match when hunting duplicates.** They differ between systems.
- **Inventing a category or a tax rate.** Both are available. Ask or read them.
- **Netting the two shareholder directions** on distinct opening balances.
- **Forgetting the clearing instruction** on an opening balance, so the later payment gets expensed and double-counts.
- **Booking rounding pennies to FX gain or loss.** There is no residual to book.
- **Blended tax rates on a mixed row.** Split it.
- **Posting into a filed or locked period** without instruction.
- **Reporting a migration as tied when an account's balance does not match.** Investigate first.

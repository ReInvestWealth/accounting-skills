---
name: "riw-monday-brief"
description: "Produce a one-page Monday morning brief for a business whose books are in ReInvestWealth: cash position, last week's sales and spending, invoices still waiting to be paid, and the three things worth doing this week. Use when someone asks for a weekly brief, a Monday update, a start-of-week summary, or 'how is the business doing'."
license: "MIT"
compatibility: "Needs the ReInvestWealth accounting MCP server connected to your assistant, with access to at least one business. Read only, no writes. Works for Canadian and United States businesses."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.1.0
  writes: none
---

# Monday Brief

You are writing the one page an owner reads with their coffee on Monday. It answers four questions and nothing else: **how much cash do I have, what did last week actually do, who owes me money, and what are the three things I should do this week.**

The reader is a business owner, not an accountant. They have five minutes. Every number on the page has to be one they could act on, and every number has to be one you can defend.

**Read only.** This skill never changes the books. If it finds something that needs fixing, it says so and points at where in the app to fix it.

---

## The hard rules

1. **Never invent or estimate a number.** If the data is not there, the page says "not available" and why. A plausible wrong number in a Monday brief gets acted on, which is worse than a gap.
2. **Cash comes from the connected account balances the app reports**, never from summing transactions yourself. Summing a transaction-only ledger gives you a movement, not a balance.
3. **Always print the as-of time, per account.** A cash figure from a bank feed that last synced five days ago is the single most dangerous thing on this page. If any account is more than 3 days stale, the brief says so above the cash number, not in a footnote.
4. **Revenue and expenses are net of sales tax.** GST/HST/PST/QST collected is a liability, not income; recoverable input credits are an asset, not an expense. Pull the before-tax figures so the page ties to the app's own Profit & Loss. If you are unsure which the data gives you, prove it against the app's P&L for the same dates before publishing anything.
5. **No projections on this page.** Cash you expect, invoices you expect to land, next quarter: all of that belongs to `riw-cash-flow-forecast`. This page is what happened and what is true right now.
6. **No tax advice.** You may state a filing date and an amount the app has calculated. You may not advise on treatment, deductibility, or planning. Point at a CPA for that.
7. **Three actions. Not two, not five.** The discipline is the product. A list of nine things gets none of them done.

---

## What you need from the MCP

Ask the server for these. Names differ by version, so go by what the data is:

| What | Used for |
|---|---|
| The business list, and which one is in scope | Scoping, and the name on the page |
| Connected accounts: name, type, currency, current balance, last-synced time | The cash block and the staleness warning |
| Transactions for the last 8 weeks, with category, amount before tax, date, and whether categorized or pending | Last week's numbers, the trailing average, the backlog count |
| Profit and Loss for last week and for the trailing 4 weeks | Tie-out for the numbers above |
| Invoices with status, amount, customer, issue date, and due date if present | The money-owed block |
| Pending sales tax returns with due dates and amounts (Canada) | Deadlines feeding the three actions |

If the business has more than one entity and the user did not say which, ask once, list them, and stop. Do not brief all of them at once unless asked, and if asked, produce one page each.

---

## Phase 1: Fix the window, say it out loud

The week is **the last completed Monday to Sunday**, not the trailing seven days. State it with real dates on the page ("Week of March 3 to 9"). If today is Monday, that is the week that ended yesterday.

Confirm which business you are briefing, and get its home jurisdiction and currency, because they change the wording (GST/HST language and e-filing deadlines are Canada only) and the currency symbol.

## Phase 2: Pull, then prove

Pull everything in the table above in as few calls as you can. Then run these checks **before you write a word of the page**:

- Last week's revenue and expenses from the transaction data match the app's P&L for the same dates. If they do not, you are almost certainly summing tax-inclusive amounts. Fix that first.
- Each account's balance came from the app, and you have its last-synced time.
- The invoice list is open invoices only. Draft, paid, void, and uncollectible are out of the money-owed number. Say the count of drafts separately if there are any, because unsent drafts are a real and very common leak.

If a check fails, do not publish a brief with a caveat. Find the cause, and if you cannot, say plainly which block you could not produce.

## Phase 3: The four blocks

**1. Cash on hand.** Total across accounts, then each account on its own line with its balance and when it last synced. One line under it: net movement over the week just ended, and whether that is up or down. If an account is stale, the warning goes here, first.

**2. Last week.** Sales, spending, and the difference. Beside each, two comparisons: the week before, and the trailing 4-week average. **Both matter, and the average matters more.** One quiet week in a micro business is noise; two weeks below average is a trend. Say which of the two the reader should care about this week.

Also name the biggest single expense of the week and the biggest single sale, with the merchant or customer. Owners recognize names faster than totals, and it is how they catch a mistake.

**3. Money owed to you.** Total open invoices, count, and the oldest one with its age in days and the customer name.

Be careful and be honest here: ReInvestWealth invoice statuses are draft, open, paid, void, and uncollectible. There is **no overdue flag**. So:
- If invoices carry a due date, "overdue" means due date before today. Say that is the basis.
- If they do not, do not say "overdue" at all. Say "open, oldest is N days since it was issued" and use age since issue.

Never blend the two definitions in one number.

**4. Book health, in one line.** The count of uncategorized and pending transactions, and what they add up to. This is the honest caveat on every other number on the page, and it is also the most common reason one of the three actions exists.

## Phase 4: The three things to do

This is the part that earns the page. Rank candidates by **money at stake, times how fast the owner can actually move it**, and take the top three.

Good candidates, roughly in the order they usually win:

- A filing or remittance due inside 14 days, with the amount.
- The oldest or largest open invoice, named, with what to do about it.
- A categorization backlog big enough to move the reported numbers.
- An unusual expense worth a look: a new recurring charge, a duplicate, an amount well outside the merchant's normal range.
- A bank feed that has not synced in days, because every number above depends on it.
- Unsent draft invoices, which is revenue sitting still.

Each action is three short parts: **what to do, why it matters with the number in it, and where in the app it happens.** "Chase Northwind, $4,200, open 47 days, longest outstanding by 3 weeks" beats "follow up on receivables".

If the week was genuinely clean, say so in a sentence and give one forward-looking action instead of padding to three. An honest "nothing is on fire" builds more trust than three invented chores, and it is the reason they will open next week's brief too.

## Phase 5: Deliver

Output the page as markdown by default, tight enough to fit one screen. Offer to render it as a PDF or an email if the user wants to send it on.

Close with a single line naming what would make next week's brief sharper, if anything: usually connecting an account, clearing the backlog, or putting due dates on invoices.

---

## What good looks like

- The whole page reads in under two minutes.
- Every number is either from the app or explicitly marked unavailable.
- The three actions are specific enough to do without asking a follow-up question.
- Nothing on the page is a projection or a guess.
- An owner who reads it knows whether to worry, and what to touch first.

## Traps

- **Summing tax-inclusive amounts.** Overstates both revenue and expenses, looks completely plausible, and will not tie to the app's P&L. Check this first, every time.
- **Trailing seven days instead of the completed week.** Makes week-over-week comparisons meaningless and quietly double-counts a day.
- **Treating a stale feed as cash.** State the sync time, always.
- **Counting draft invoices as money owed.** They have not been sent. Report them separately, as an action.
- **Averaging away the story.** If one large sale is most of the week's revenue, say that. An owner reading a healthy average when the pipeline is one customer deep is being misled by arithmetic.
- **Padding to three actions.** See Phase 4.

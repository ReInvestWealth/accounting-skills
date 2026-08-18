---
name: "riw-cash-flow-forecast"
description: "Build a 30, 60, and 90 day cash-flow outlook for a business whose books are in ReInvestWealth, from open invoices, recurring costs detected in transaction history, and known tax due dates. Names the low point and warns weeks early about a cash crunch. Use when someone asks about runway, whether they can make payroll, whether they can afford something, or wants a cash-flow forecast or projection."
license: "MIT"
compatibility: "Needs the ReInvestWealth accounting MCP server connected to your assistant, with access to at least one business, and ideally 6 or more months of transaction history. Read only, no writes. Works for Canadian and United States businesses."
metadata:
  publisher: ReInvestWealth
  homepage: https://www.reinvestwealth.com/skills
  version: 0.1.0
  writes: none
---

# Cash Flow Forecast

You are answering one question: **is there a week in the next 90 days where this business runs out of money.** Everything else on the page supports that answer.

The output is not a ledger and not a budget. It is a week-by-week cash path with a named low point, the assumptions that produced it, and how wrong it could be.

**Read only.** This skill never changes the books.

---

## The one number that matters

The headline is **the low point: its date and its balance.** Not the ending balance in 90 days.

A business can end the quarter comfortable and still miss payroll in week six. An ending balance hides exactly the thing the owner needs to see, so lead with the trough, every time.

"Can I make payroll" is answered by comparing the low point to the payroll that falls before it, not by the closing figure.

---

## The hard rules

1. **Every assumption is visible.** A forecast the reader cannot audit is worthless to them and dangerous to you. The recurring costs you detected, the collection timing you assumed, and the haircuts you applied all get printed.
2. **Two scenarios, never one, never five.** A base case and a slow-collections case. One number reads as a promise; five read as noise.
3. **Never assume an invoice is paid on time without saying so.** If you used a due date, say so. If you used the customer's own payment history, say so and give the lag you used.
4. **Never extend history you do not have.** With three months of data, say the confidence is low, and say why. Do not silently annualize a short sample.
5. **This is not financial advice or tax advice.** You are showing the arithmetic of their own data. Deciding what to do about it is theirs, with their CPA. Do not recommend borrowing, do not recommend a tax position.
6. **State the currency and the jurisdiction.** Sales tax remittance language and filing cadence are Canada specific.
7. **If the low point is negative, that is the headline and it goes first**, before any of the supporting detail.

---

## What you need from the MCP

| What | Used for |
|---|---|
| Connected accounts: balance, currency, last-synced time | The starting position |
| Transactions for the last 6 to 12 months, with category, before-tax amount, date, merchant | Recurring-cost detection, payroll cadence, seasonality |
| Open invoices: amount, customer, issue date, due date if present | Expected inflows |
| Invoice payment history: when past invoices were issued and when they were paid | The collection lag, which is far better than assuming due dates hold |
| Pending sales tax returns with due dates and amounts (Canada) | Known outflows with hard dates |
| Profit and Loss for recent months | Sanity check on the run rate |

**Note what does not exist:** ReInvestWealth has no accounts-payable subledger, so there is no list of bills to pay. Upcoming outflows have to be **derived from recurring transaction history plus known tax dates**. Say this in the assumptions. Do not imply you read a bills list, and do not silently treat the absence of bills as the absence of outflows.

---

## Phase 1: Starting position

Today's cash, per account, from the balances the app reports. Never derive it by summing transactions.

Check each account's last-synced time. A forecast built on a feed that is four days stale starts wrong and stays wrong, so if anything is stale, say so before the forecast and offer to continue anyway with the caveat printed on the page.

Confirm the currency and the jurisdiction. For a business with accounts in more than one currency, forecast in the business's base currency and say which rate basis you used.

## Phase 2: Expected inflows

Start from open invoices only. Draft invoices are not inflows, they are unsent. Paid, void, and uncollectible are out.

Then decide the timing, in this order of preference:

1. **The customer's own payment history.** For each customer, the median lag between issue and payment across their past invoices. This is the best predictor you have and it is sitting in the data. Use it, and print the lag you used per customer.
2. **The due date**, if invoices carry one and the customer has no history.
3. **A stated default** if neither exists. Say what you used and that it is a default.

Then apply collection reality, and show it as a line item rather than burying it in the arithmetic:

- An invoice already well past its expected payment point is worth less than its face value in a 90 day window. Apply a haircut that increases with age, state the bands you used, and show the gross and the discounted figure side by side.
- An invoice from a customer who has never paid late gets no haircut.
- Anything a customer has disputed, or that is unusually large relative to their history, gets called out by name rather than quietly averaged in.

Do not forecast new sales that do not exist yet unless the user explicitly asks for a growth assumption. If they do, it is a separate, clearly labelled line, and it never touches the base case.

## Phase 3: Expected outflows

**Recurring costs, detected from history.** Group transactions by merchant and look for a regular cadence at a stable amount: monthly subscriptions, rent, insurance, loan payments, software, utilities. For each candidate record the merchant, the typical amount, the cadence, and the day of the month it usually lands.

**Show the owner this list and let them correct it before you forecast anything.** This is the step that makes the forecast trustworthy. It also catches subscriptions they forgot they were paying, which is often worth more to them than the forecast itself.

Watch for:
- A price that has drifted upward across the sample. Forecast the most recent amount, not the average.
- Annual charges. A yearly renewal inside the window is easy to miss and large enough to matter.
- A cancelled subscription that is still in the sample. If it stopped three months ago, it is not recurring.

**Payroll**, if the history shows it: cadence, typical amount, and the specific dates it will land in the window. Payroll is usually the largest and least flexible outflow, so it drives the whole answer.

**Known tax obligations with hard dates.** In Canada, pending sales tax returns come with due dates and amounts, which are the most reliable outflows in the whole forecast: use them. Income tax instalments too, where the user can tell you the schedule. In the United States, ask the user for their estimated payment schedule rather than inferring one.

**One-offs the user knows about.** Ask once: anything large and unusual in the next 90 days, either direction. A planned equipment purchase or a tax refund changes the answer completely and is not in the history.

## Phase 4: Build the path

Walk **week by week** for 90 days. Monthly buckets hide the trough, which is the entire point of the exercise, so weekly is the default. Offer monthly as a summary on top, never instead.

For each week: opening cash, inflows, outflows, closing cash. Then:

- **The low point:** its week, its date range, and its balance.
- **The 30, 60, and 90 day marks**, since that is what the user asked for.
- **The slow-collections scenario:** same outflows, inflows pushed later by a stated amount (for example every invoice paid two weeks later than the base case). Report its low point too.

Then judge it, in plain language:

- Low point below zero: **a crunch, with a date.** Say how many weeks away it is and what the shortfall is. That is the headline.
- Low point below roughly one month of operating costs: **thin.** Name the figure and say what one month of costs is, so the comparison is visible.
- Low point comfortable in both scenarios: say that clearly and briefly. Do not manufacture concern.

## Phase 5: Confidence, honestly

State it, with the reason:

- **Months of history** the recurring detection is based on. Under 6 months is low confidence, and say so.
- **How much of the inflow depends on one customer.** If a single invoice is most of the expected inflow, the forecast is really a bet on that one customer, and the reader must know that.
- **Coverage:** are all the business's accounts connected. An unconnected account means the starting cash is wrong.
- **Backlog:** a large uncategorized pile means the run rate is provisional.
- **Seasonality you could not measure.** With less than a year of data you cannot see it. Say so rather than implying the pattern holds.

## Phase 6: Deliver

Lead with the answer in one or two sentences, then the weekly table, then the assumptions, then confidence. Markdown by default; offer a PDF.

If the forecast shows a crunch, close with the levers visible **in their own numbers**, not generic advice: the invoices that would fix it if collected, the recurring costs large enough to matter, the timing of the largest outflow. Present them as facts about their data, and leave the decision with them and their CPA.

---

## Traps

- **Leading with the ending balance.** Hides the trough. Lead with the low point.
- **Monthly buckets.** A month is long enough to hide a two-week hole.
- **Assuming due dates hold.** Use the customer's actual payment history when you have it.
- **Counting draft invoices as inflows.** They have not been sent.
- **Averaging a drifting subscription price.** Use the latest amount.
- **Missing an annual renewal** inside the window.
- **Treating "no bills list" as "no bills".** There is no AP subledger. Derive outflows and say that you did.
- **A confident forecast off three months of data.** State the confidence, always.
- **Forecasting new sales into the base case.** Only on request, always labelled, never in the base case.

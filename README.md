# ReInvestWealth Skills

Open-source [Agent Skills](https://agentskills.io) for accounting work on books kept in [ReInvestWealth](https://reinvestwealth.com). They run in Claude, ChatGPT, Codex, and any assistant that speaks the same standard.

Each skill is a single `SKILL.md` file: a written procedure that tells the assistant how to do one job properly. They were built for our own CPAs and bookkeeping work, and they encode the parts that are easy to get wrong, such as proving that revenue figures are net of sales tax before publishing them, anchoring opening balances to a filed return rather than to the ledger, and never posting to a client's books without a reviewed plan.

MIT licensed. Fork them, change them, use them on your own clients.

## The skills

| Skill | What it does | Writes to your books |
|---|---|---|
| `riw-catch-and-correct` | Catches the mistakes that skew the numbers (duplicates, miscoded transfers, refunds, shareholder movements, loan payments, FX discrepancies, sales tax errors), pulls receipts and confirmations from connected email, file storage, or calendar as evidence, grades what it finds, and corrects approved items. The scan itself is read-only | **On approval** |
| `riw-monday-brief` | One page for Monday morning: cash position, last week's sales and spending, invoices waiting to be paid, and the three things worth doing this week | No |
| `riw-monthly-health-check` | The owner's month in review: the month against the months before it, cash and runway, receivables, what changed in spending, and whether the books are clean enough to trust. One page, graded | No |
| `riw-cash-flow-forecast` | Cash outlook at three horizons: 90 days week by week, or one or two years month by month, from open invoices, recurring costs, and known tax dates. Names the low point, which is what answers "can I make payroll" | No |
| `riw-financing-package` | The short package a lender asks for: twelve months of income and expenses, a balance sheet, cash position, and receivables, labelled management-prepared and ready to attach to an application | No |
| `riw-prepare-financials-ca` | Canadian year-end: Income Statement and Balance Sheet mapped to GIFI, CCA schedule, working papers, and a GIFI import file for the T2 preparer. Ends by posting the approved year-end adjustments (CCA, accruals, reclasses) into the books | **On approval** |
| `riw-prepare-financials-us` | US year-end: Income Statement and Balance Sheet on the income tax basis, depreciation schedule, working papers, and a return mapping file for the 1120 or 1120-S preparer. Ends by posting the approved year-end adjustments (depreciation, accruals, reclasses) into the books | **On approval** |
| `riw-monthly-review-email` | The monthly client review: a short three-page report plus a draft email, for a bookkeeper to send instead of the monthly call | No |
| `riw-ar-ap-recon` | Accrual AR and AP for cash-basis books: accrues open invoices and bills, ages them in a workbook the accountant reviews, matches the payments that settle them, and books the entries. Plan, review, approve, apply | **Yes** |
| `riw-migrate-history` | Move a client's history into ReInvestWealth: opening balances, historical transactions, or both. Plan, review, approve, apply | **Yes** |
| `riw-bank-sync` | Checks the books against any bank or credit card provider by working your own computer. It opens the bank's website, waits while you sign in, adds the bank's accounts to the books if they are not there yet (handy for banks that cannot connect through Plaid without switching off two-step verification), downloads recent transactions (reading older statements when you want to go back further), and adds only the ones that are missing once you approve a plain-language summary. It never sees your password and never moves money. It uses ReInvestWealth's notes on each bank, adapts when a website changes, and sends back a short report with none of your financial details. It can run on a schedule and, if you opt in, add missing transactions on its own the way a bank feed does | **On approval** |

## What you need

These skills read and write your books through the **ReInvestWealth accounting MCP server**, which connects your books to your own Claude or Codex account. It is in early access: [join the waitlist](https://reinvestwealth.com/mcp-server-for-accounting).

Without the MCP server connected, a skill will load and then tell you it has no data to work with.

The year-end pair is country specific: `riw-prepare-financials-ca` is built around the T2, GIFI codes, and CCA, and `riw-prepare-financials-us` around the 1120, 1120-S, and MACRS. `riw-bank-sync` needs an assistant that can control your computer. The rest work in both Canada and the United States, with the sales-tax handling in `riw-catch-and-correct`, `riw-migrate-history`, `riw-ar-ap-recon`, `riw-bank-sync`, and the sales-tax lines in `riw-monthly-health-check` being Canada specific.

## Install

### Claude Code

```
/plugin marketplace add ReInvestWealth/accounting-skills
/plugin install reinvestwealth-accounting@reinvestwealth
```

Then invoke one directly with `/riw-monday-brief`, or just ask for what you want and Claude picks the right skill.

Update later with `/plugin marketplace update reinvestwealth`.

### Claude apps and claude.ai

Download the skill folder you want and upload it in your skill settings. Each skill is a directory containing one `SKILL.md`.

### Codex and other assistants

Download the `SKILL.md` and point your assistant at it, or paste its contents into your project instructions. The frontmatter uses only the six fields in the Agent Skills spec, so it loads anywhere that supports the standard.

### By hand, in Claude Code

Copy any skill directory into `~/.claude/skills/` for personal use, or your project's `.claude/skills/`.

## A word about the ones that write

Six skills post into real bookkeeping data: `riw-catch-and-correct`, `riw-migrate-history`, `riw-ar-ap-recon`, `riw-bank-sync`, and the final phase of `riw-prepare-financials-ca` and `riw-prepare-financials-us`. ReInvestWealth deliberately protects the audit trail. A posted transaction's amount and date cannot be changed after it is created, and removal is a soft delete: the row stays on record, disappears from lists and reports, and can be restored. So a wrong amount or date is never an edit. The correction paths are to recategorize or annotate the existing row, soft-delete it, or post a new entry, and every one of those leaves a trace.

All six are written around that. They plan everything first, assert their own tie-outs, show you a full review table, and wait for your explicit approval before they write anything. **Do not shortcut that gate**, and read the skill before you run it on a client. The one exception is `riw-bank-sync`, which you can switch to automatic mode, so it adds missing bank transactions the way a bank feed does and reports what it added afterwards.

## What these are, and what they are not

These skills are written procedures, not a service. Running one does not create an accounting, bookkeeping, or tax engagement with ReInvestWealth, and nothing they produce is accounting, tax, or financial advice.

- **Output is review-ready, not file-ready.** `riw-prepare-financials-ca` and `riw-prepare-financials-us` produce statements for a CPA to review. They do not file anything, and they do not replace professional judgment.
- **You are responsible for what gets posted.** The skills that write do so into real bookkeeping data, and a posted entry can be hidden but never erased. Read the review table before you approve it.
- **An assistant can be confidently wrong.** Every skill here is written to show its assumptions and its tie-outs for exactly that reason. Check them.

The software is provided as is, without warranty of any kind, as set out in [LICENSE](LICENSE).

## Contributing

Issues and pull requests welcome, particularly from accountants who hit something these get wrong. Two rules:

1. **No client data.** No real names, business identifiers, or figures from anyone's books, in code or in examples.
2. **Say why.** A rule in one of these files should explain what goes wrong without it. That is what makes them worth reading.

Before you open a pull request, run:

```
node scripts/validate-skills.mjs
```

No install needed, it uses only Node built-ins. CI runs the same check on every pull request. It mostly exists to catch one nasty failure: frontmatter that does not parse as YAML loads with **every field silently dropped**, so the skill shows up with no name and no description and simply never gets used. The usual cause is an unquoted value containing a colon, which is what a natural-sounding description does. Quote your values.

## License

MIT. See [LICENSE](LICENSE).

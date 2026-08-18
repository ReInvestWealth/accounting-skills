# ReInvestWealth Skills

Open-source [Agent Skills](https://agentskills.io) for accounting work on books kept in [ReInvestWealth](https://reinvestwealth.com). They run in Claude, Codex, and any assistant that speaks the same standard.

Each skill is a single `SKILL.md` file: a written procedure that tells the assistant how to do one job properly. They were built for our own CPAs and bookkeeping work, and they encode the parts that are easy to get wrong, such as proving that revenue figures are net of sales tax before publishing them, anchoring opening balances to a filed return rather than to the ledger, and never posting to a client's books without a reviewed plan.

MIT licensed. Fork them, change them, use them on your own clients.

## The skills

| Skill | What it does | Writes to your books |
|---|---|---|
| `riw-monday-brief` | One page for Monday morning: cash position, last week's sales and spending, invoices waiting to be paid, and the three things worth doing this week | No |
| `riw-cash-flow-forecast` | 30, 60 and 90 day cash outlook from open invoices, recurring costs, and known tax dates. Names the low point, which is what answers "can I make payroll" | No |
| `riw-prepare-financials` | Canadian year-end: Income Statement and Balance Sheet mapped to GIFI, CCA schedule, working papers, and a GIFI import file for the T2 preparer | No |
| `riw-monthly-review-email` | The monthly client review: a short three-page report plus a draft email, for a bookkeeper to send instead of the monthly call | No |
| `riw-migrate` | Move a client onto ReInvestWealth: opening balances, historical transactions, or both. Plan, review, approve, apply | **Yes** |

## What you need

These skills read and write your books through the **ReInvestWealth accounting MCP server**, which connects your books to your own Claude or Codex account. It is in early access: [join the waitlist](https://reinvestwealth.com/mcp-server-for-accounting).

Without the MCP server connected, a skill will load and then tell you it has no data to work with.

`riw-prepare-financials` is Canada only, because it is built around the T2, GIFI codes, and CCA. The rest work in both Canada and the United States, with the sales-tax handling in `riw-migrate` being Canada specific.

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

## A word about the one that writes

`riw-migrate` posts entries into real bookkeeping data, and ReInvestWealth deliberately protects the audit trail: a posted transaction cannot be deleted, and its amount and date cannot be changed after it is created. Corrections mean voiding and reposting, permanently visible.

The skill is written around that. It plans everything first, asserts its own tie-outs, shows you a full review table, and waits for your explicit approval before it writes anything. **Do not shortcut that gate**, and read the skill before you run it on a client.

## What these are, and what they are not

These skills are written procedures, not a service. Running one does not create an accounting, bookkeeping, or tax engagement with ReInvestWealth, and nothing they produce is accounting, tax, or financial advice.

- **Output is review-ready, not file-ready.** `riw-prepare-financials` produces statements on a compilation basis for a CPA to review. It does not file anything, and it does not replace professional judgment.
- **You are responsible for what gets posted.** `riw-migrate` writes to real bookkeeping data, and posted entries are permanent by design. Read the review table before you approve it.
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

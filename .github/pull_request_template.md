## What this changes

<!-- One or two sentences. If it fixes something a skill got wrong, say what went wrong. -->

## Checklist

- [ ] **No client data.** No real names, business identifiers, account numbers, or figures from anyone's books, in the skill or in an example.
- [ ] **It says why.** Any new rule explains what goes wrong without it. A rule nobody understands is a rule the assistant will talk itself out of.
- [ ] `node scripts/validate-skills.mjs` passes locally.
- [ ] Frontmatter uses only the six Agent Skills spec fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`), and every value that contains a colon is quoted.
- [ ] If this changes what a skill claims the ReInvestWealth app does, that claim was checked against the app rather than remembered.

## If this skill writes to the books

<!-- Delete this section if it does not. -->

- [ ] The plan, review, approve, apply sequence is intact, and nothing writes before an explicit human approval.
- [ ] Tie-outs are asserted before a human is shown anything.
- [ ] Tested against a business you own or have written permission to change, never a live client file.

## Anything a reviewer should know

<!-- Judgement calls, things you were unsure about, jurisdictions you could not test. -->

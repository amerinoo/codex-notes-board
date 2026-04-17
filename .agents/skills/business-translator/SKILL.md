---
name: business-translator
description: Translate a non-technical or ambiguous request into a clear functional specification with assumptions and acceptance criteria.
---

# Business Translator Skill

Follow the global rules in AGENTS.md.

## Mission
Translate non-technical requests into a clear functional specification that can be converted into technical tasks.

## When to use
Use this skill when:
- the request is non-technical
- the request is ambiguous
- the desired behavior must be clarified before planning

Do NOT use this skill for:
- writing code
- modifying repository files
- detailed implementation design unless helpful as an option

Do NOT use this skill if:
- the request is already clear and implementation-ready

## Input expectations

The business translator may receive:

- a raw user request
- a vague or ambiguous requirement
- a partially defined feature

If the request is already clear and technical, do not use this skill.

## Rules
- Focus on observable behavior and business intent
- Separate facts from assumptions
- Reduce ambiguity as much as possible, but do not invent answers for user intent
- If a requirement has multiple plausible interpretations that change behavior, scope, data, APIs, or UX, ask concise clarifying questions instead of choosing one
- Clarifying questions to the user must be numbered
- Mark unresolved blocking questions clearly and stop before task generation
- MUST keep the specification simple and aligned with the current system
- MUST NOT introduce unnecessary features or complexity
- Output MUST be directly usable by the task-generator skill
- Acceptance criteria MUST be concrete and testable

## Output format

# Functional Request

## Original Request
...

## Interpreted Need
...

## Current Behavior
...

## Desired Behavior
...

## Assumptions
- ...

## Open Questions
- If critical questions exist, highlight them clearly
- If blocking, mark them as blockers

## Acceptance Criteria
- [ ]
- [ ]
- [ ]

## Notes
- ...

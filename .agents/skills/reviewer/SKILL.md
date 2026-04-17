---
name: reviewer
description: Review one implemented task for correctness, coverage, regression risk, and fit against the assigned TASKS.md task.
---

# Reviewer Skill

Follow the global rules in AGENTS.md.

## Mission
Review the current implementation for one task and determine whether it is safe and complete.

## When to use
Use this skill when:
- reviewing a completed implementation task
- checking acceptance criteria
- checking validation and test adequacy
- deciding approve vs request changes

Do NOT use this skill for:
- writing code
- planning tasks
- translating business requirements

## Rules
- Do NOT modify code
- Do NOT modify TASKS.md directly
- Review against the assigned task block from TASKS.md
- Focus on real issues, not cosmetic nitpicks
- If the task is incomplete or insufficiently validated, request changes
- Only approve if:
    - the task is fully implemented
    - validation has passed, unless this is a query-only task with no code changes
    - tests are adequate for the change, unless this is a query-only task with no code changes
    - no significant risks remain
- If the same issue appears repeatedly without improvement, highlight it as a potential blocker

## Review focus
- does the code solve the planned task?
- are acceptance criteria covered?
- are edge cases missing?
- are tests meaningful?
- does the change respect Controller → Service → Repository?
- is there unnecessary complexity?
- could this break existing behavior?
- should the Coordinator update TASKS.md status?
- were validation commands executed?
- did validation pass?
- is the validation appropriate for the change (e.g. ./mvnw test for production changes)?
- for query-only tasks with no code changes, validation and tests may be omitted

## Input expectations

The reviewer must receive:

- task ID
- task block from TASKS.md
- implementation summary
- validation result (commands executed and outcome), unless this is a query-only task with no code changes

If any of this is missing, request clarification before reviewing.

## Output format

### Review Summary
...

### Issues
- Each issue must be actionable and specific
- Reference files or behavior when possible

### Missing Tests
- ...

Omit this section for query-only tasks with no code changes.

### Risk Level
low | medium | high

### TASKS.md Status Check
- recommended Coordinator action: keep [~] | reset to [ ] | mark [!] | mark [x] after integration
- explanation: ...

### Verdict
approve | request changes

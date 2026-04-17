---
name: implementer
description: Implement exactly one planned task, validate it, and report the result. Use this when writing or modifying production or test code.
---

# Implementer Skill

Follow the global rules in AGENTS.md.

## Mission
Implement exactly one planned task safely, validate it, and report status.

## When to use
Use this skill when:
- implementing a task from TASKS.md
- modifying production code
- adding or updating tests
- fixing review feedback

Do NOT use this skill for:
- planning tasks
- reviewing code
- translating business requirements

## Core responsibilities
- read TASKS.md or Coordinator-provided task block
- implement the assigned task only
- add or update tests when behavior changes
- validate the change
- commit completed work
- report status

---

## Input expectations

The implementer must receive:

- task ID
- task block from TASKS.md
- workflow branch
- review findings (if this is a rework)

If any required input is missing, request clarification before proceeding.

## Rules

- ALWAYS work on the assigned workflow branch
- MUST NOT create a new branch per task
- NEVER modify the base branch directly
- MUST implement only one task
- MUST keep changes minimal and focused
- MUST NOT stage or commit TASKS.md
- MUST NOT present unvalidated code as finished
- MUST report validation results
- MUST reuse the workflow branch for every task in the same user request
- MUST follow validation rules strictly from AGENTS.md
- If this is a rework:
  - MUST use the same workflow branch
  - MUST reference the same task ID in the new commit
  - MUST NOT recreate the branch
  - MUST apply changes incrementally
- MUST NOT implement changes outside the assigned task scope
- If additional work is needed, report it instead of implementing it

---

## Branch naming

Format:
<feature_type>-<short-description>

The feature_type describes the overall user request, not each individual task.

Examples:
- feature-add-priority
- test-add-service-coverage

---

## Validation rules

- If the assigned task is query-only and does not modify code:
  do not run tests
  do not include a validation result unless a validation command was actually run

- If production code changed:
  run: ./mvnw test

- Otherwise:
  run the narrowest useful Maven verification

- Validation must include:
  - command executed
  - result (pass/fail)

- If validation fails:
  - report failure
  - do not commit
  - do not mark task as complete

---

## Workflow

1. Read TASKS.md or assigned task block
2. Confirm task is [~]
3. Create or switch to the assigned workflow branch
4. Explore relevant code
5. Implement the change
6. Add/update tests if needed
7. Run validation
8. Ensure TASKS.md is not staged and commit includes only relevant files
9. Commit if validation passes
10. Report result

---

## Commit rules

- Use Conventional Commits
- Format: <type>: <summary> (T<ID>)
- Every task commit must reference the assigned task ID
- Review-fix commits must reference the same task ID as the task being fixed
- Do not amend task commits after review; add a new commit instead
- The review-fix commit summary may differ from the original task commit summary

Mapping:
- feature → feat
- bugfix → fix
- refactor → refactor
- test → test
- investigation → chore

Examples:
- feat: add task priority (T1)
- test: cover priority default (T2)
- fix: address priority validation feedback (T1)

---

## Output format

Return:

- task ID
- branch name
- summary of changes
- files changed
- tests added or updated
- commands executed
- validation result (pass/fail)
- commit message
- remaining tasks
- risks or notes

For query-only tasks with no code changes, omit tests and validation fields unless commands were actually run.
Use short paths or domain labels in evidence instead of full absolute paths.

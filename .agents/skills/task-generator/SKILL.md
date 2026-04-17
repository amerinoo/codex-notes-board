---
name: task-generator
description: Convert a functional specification into a small, testable implementation plan and persist it in TASKS.md.
---

# Task Generator Skill

Follow the global rules in AGENTS.md.

## Mission
Convert a functional specification into a concrete implementation plan and persist it in TASKS.md.

## When to use
Use this skill when:
- a request needs to be broken into implementation tasks
- TASKS.md does not exist
- TASKS.md must be updated after scope changes

Do NOT use this skill for:
- writing production code
- reviewing code

## Input expectations

The task generator may receive:

- a user request
- a functional specification
- an updated requirement or scope change

If the input is ambiguous, request clarification before generating tasks.
Clarifying questions to the user must be numbered.
Do not create or update TASKS.md while blocking open questions remain.

## Rules
- Do NOT write production code
- You MAY modify TASKS.md
- Tasks must be implementation-ready
- Tasks must be specific enough that the Implementer can execute them without guessing
- Prefer incremental delivery
- Prefer one concern per task
- Preserve completed tasks when updating TASKS.md
- If a task is too large or unclear, split it before adding it to TASKS.md
- MUST NOT introduce unnecessary abstractions or architecture
- MUST keep tasks aligned with the current simplicity of the codebase
- Each task MUST be independently testable and verifiable
- Acceptance criteria MUST be concrete and testable
- Tasks that modify production behavior MUST include validation via tests
- Do not convert assumptions into tasks when user intent is unclear; ask the Coordinator to clarify with the user first

## Required TASKS.md structure
Use this structure:

# Task Plan

## Status Legend
- [ ] pending
- [~] in progress
- [x] completed
- [!] blocked

## Context
...

## Tasks

### T1 - ...
- Status: [ ]
- Type: bugfix | feature | refactor | test | investigation
- Depends on:
    - none | T...
- Expected write set:
    - concrete files or areas likely to change
- Risk level:
    - low | medium | high
- Goal: ...
- Acceptance Criteria:
    - [ ]
    - [ ]
- Likely Impacted Areas:
    - ...
- Notes:
    - ...

## Output format
In chat, provide:
- summary of the generated plan
- number of tasks
- recommended starting task
- whether TASKS.md was created or updated

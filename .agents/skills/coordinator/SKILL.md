---
name: coordinator
description: Orchestrate the full multi-agent workflow from request to delivery using translator, task generator, implementer, reviewer, and optional advanced coordination rules.
---

# Coordinator Skill

Follow the global rules in AGENTS.md.

## Mission
Orchestrate the full multi-agent workflow from request to delivery.

## When to use
Use this skill when:
- the user wants end-to-end handling
- the request must go from idea to implementation
- multiple skills must be coordinated
- TASKS.md must be created or advanced

Do NOT use this skill for:
- directly implementing code without task orchestration
- reviewing code without a task
- exploratory repo analysis only

## Responsibilities
- accept a user request
- decide whether the business-translator skill is needed for non-technical or ambiguous requests
- invoke the task-generator skill to create or update TASKS.md
- execute tasks sequentially on one workflow branch
- invoke the implementer skill for execution
- invoke the reviewer skill for validation
- invoke the explorer skill when repository analysis is needed
- ensure all tasks are completed or a blocker is reported
- produce a final summary

## Core workflow

For each task:

1. mark task as [~] in TASKS.md
2. invoke the implementer skill with the assigned task block
3. receive the implementation result
4. invoke the reviewer skill with:
    - the same task ID
    - the assigned task block
    - the implementation result
    - validation output

If review fails:
- reinvoke the implementer skill with:
    - the same task ID
    - the same task block
    - the same workflow branch
    - the review findings
- require updated implementation and validation
- repeat until resolved or blocked

If review passes:
- ensure validation has passed for code-changing tasks
- keep the task commit on the workflow branch
- mark task as [x]

Repeat until no pending tasks remain.

After all planned tasks are approved:
- validate the workflow branch
- squash the workflow branch into one base-branch commit
- use a squash commit message that summarizes the user's overall request

## Execution rules
- never skip review
- never allow implementation without a valid task
- if the user request is ambiguous, invoke the business-translator skill and ask the user concise clarifying questions before task generation
- clarifying questions to the user must be numbered
- do not let the task-generator or implementer skills proceed while blocking open questions remain
- always use TASKS.md as source of truth
- only Coordinator updates TASKS.md
- do not commit TASKS.md
- stop on blocking ambiguity
- always use skills when delegating work instead of inline instructions

## Skill invocation contract

When invoking skills:

- implementer skill must receive:
    - task ID
    - task block from TASKS.md
    - workflow branch
    - review findings (if any)

- reviewer skill must receive:
    - task ID
    - task block
    - implementation summary
    - validation result

## Task execution strategy
- execute implementation tasks sequentially
- do not run parallel implementers on the same workflow branch
- exploratory or read-only analysis may run separately only when it does not modify files

## Branch rules
- use one dedicated workflow branch per user request
- all tasks for that request must be implemented on the same workflow branch
- branch name must follow:
  <feature_type>-<short-slug>
- feature_type describes the overall user request, not each individual task
- do not create one branch per task
- if review fails, reinvoke the implementer skill on the same workflow branch

## Integration rules
- integrate only after all planned tasks are approved or explicitly blocked
- keep history linear
- squash the workflow branch into one base-branch commit
- the squash commit message must summarize the user's overall request
- ensure validation passes before integration for code-changing tasks
- for query-only tasks with no code changes, do not require tests and omit "Validation Performed" from the final output unless a validation command was actually run
- user-facing evidence must use short paths or domain labels instead of full absolute paths

## Advanced rules
For complex workflows, recovery, or integration conflicts, load:
- .agents/skills/coordinator-advanced/SKILL.md

## Final output

# Workflow Summary

## Original Request
...

## Execution Plan
...

## Tasks Completed
...

## Tasks Blocked
...

## Branches Used
...

## Commits Created
...

## Files Changed
...

## Validation Performed
...

Omit this section for query-only tasks when no validation command was run.

## Final Result
...

## Remaining Risks
...

---
name: coordinator-advanced
description: Advanced coordination rules for recovery, sequential workflow branch execution, integration drift, branch continuity, and failure handling.
---

# Coordinator Advanced Skill

Follow the global rules in AGENTS.md.

## Mission
Extend Coordinator behavior for complex workflows.

## When to use
Use this skill only when:
- recovering interrupted execution
- resolving drift after integrations
- handling branch continuity or integration conflicts
- applying failure policy in a complex workflow

## Recovery rule
If execution is interrupted, resume by:
- reading TASKS.md
- checking the current base branch
- listing workflow branches that match <feature_type>-*
- checking whether the workflow branch is merged into the base branch
- reconciling TASKS.md status with actual branch and commit state
- continuing from the first pending, in-progress, or blocked task that can be safely resumed

## Sequential execution policy
- Execute implementation tasks sequentially on one workflow branch
- Do not run parallel implementers on the same workflow branch
- Each task must produce at least one task-scoped commit on the workflow branch
- If review fails for a task, reinvoke the implementer skill on the same workflow branch and require a new commit that references the same task ID
- Read-only exploration may run separately only when it does not modify files

## Review rework policy
For each review failure:
- keep the same workflow branch
- keep the same task ID
- require a new commit instead of amending prior task commits
- allow the commit summary to differ from the original task commit
- ensure the new commit message still uses Conventional Commits and includes the same task ID

## Branch and integration policy
- Record the base branch before starting work
- Create one workflow branch from the base branch for the whole user request
- All tasks and review fixes must stay on that workflow branch
- Integration must be linear
- Do not create generic merge commits
- Squash the workflow branch into one base-branch commit after all approved tasks are complete
- The squash commit message must summarize the user's overall request
- Use Conventional Commits
- Rebase only when needed to resolve drift
- Use cherry-pick only if necessary

Before integrating the workflow branch:
- ensure validation has passed for code-changing tasks
- ensure the workflow branch is up to date with the base branch

## Branch continuity rule
For each workflow:
- track the workflow branch used
- if review fails, reinvoke the implementer skill on the same workflow branch
- add new commits instead of recreating the branch

If a branch becomes unusable:
- create a new one
- document it in TASKS.md

## Post-integration cleanup rule
After the workflow branch is integrated:
1. confirm integration succeeded
2. ensure approved tasks are marked [x]
3. delete the branch if no longer needed
4. report final workflow summary

## Commit hygiene rule
Before every commit:
- ensure TASKS.md is not staged
- if staged, unstage it

## Failure policy
Stop execution and report clearly if:
- acceptance criteria cannot be satisfied
- tests cannot be made to pass
- review fails repeatedly for the same issue
- missing business decisions block progress
- repository is in a broken state unrelated to the task
- validation repeatedly fails after fixes

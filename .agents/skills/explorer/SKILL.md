---
name: explorer
description: Inspect the codebase and explain current flow, likely change points, and risks without modifying files.
---

# Explorer Skill

Follow the global rules in AGENTS.md.

## Mission
Understand the codebase and provide context without making changes.

## When to use
Use this skill when:
- locating relevant files
- understanding current flow
- identifying likely impacted areas
- highlighting risks or dependencies

Do NOT use this skill for:
- modifying code
- modifying TASKS.md
- implementing tasks

## Input expectations

The explorer may receive:

- a user request
- a task description
- a specific feature or area to investigate

If the scope is unclear, ask for clarification before proceeding.

## Rules
- MUST NOT modify code
- MUST NOT modify TASKS.md
- Keep analysis concise and practical
- Do not perform exploration if the task is already clear and well-defined
- Avoid repeating information already present in TASKS.md or previous outputs
- Use short paths or domain labels in evidence instead of full absolute paths
- For package paths under src/main/java/com/example/taskboard/<area>, use <area> when that is unambiguous

## Output format

- relevant files
- current flow summary
- likely change points (specific files or methods)
- risks / dependencies
- recommendations for implementation (optional but encouraged)

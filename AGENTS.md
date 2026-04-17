# AGENTS.md

## Project purpose
This is a small public demo repository to showcase Codex multi-agent workflows on a simple full-stack application.

## Tech stack
- Java 21
- Spring Boot
- Maven
- Lombok
- React
- Vite
- Tailwind CSS
- In-memory storage only

## Repository structure
- `backend/` contains the Spring Boot application
- `frontend/` contains the React + Vite + Tailwind application
- `.agents/skills/` contains the agent skills used by the workflow

## Global rules
- Keep the project intentionally small
- Prefer simple and readable code
- Do not add database, Docker, or security unless explicitly requested
- Use in-memory storage only unless the user asks otherwise
- Code must be written in English
- Comments must be written in English
- UI text must be written in English
- Always understand the current code and task context before acting
- If the user's request is ambiguous or has multiple plausible interpretations, ask concise clarifying questions before planning or implementing
- Do not make assumptions about user intent when the decision changes behavior, scope, data, APIs, or UX
- When asking the user clarifying questions, number each question so the user can answer one by one
- Prefer small, safe, incremental changes
- TASKS.md must never be committed
- The coordinator skill orchestrates the workflow
- The system uses skills located in `.agents/skills/`
- Prefer using skills instead of inline instructions
- Load only the skill required for the current step

## Demo-specific rules
- Prioritize visible progress over hidden technical complexity
- Prefer features that are easy to demonstrate live
- Avoid unnecessary abstractions
- Prefer backend and frontend changes that are easy to verify during a short demo
- Keep UX clean and minimal
- Use small visual improvements when they add demo value
- Do not introduce heavy frontend libraries unless explicitly requested

## Backend rules
- Use standard Spring Boot annotations (`@RestController`, `@Service`, `@Repository`)
- Keep layers minimal (Controller → Service → Repository)
- Avoid overengineering
- Prefer changing existing classes over adding new packages or layers
- Keep storage in memory
- Keep APIs simple and easy to test manually

## Frontend rules
- Keep the UI intentionally small and easy to understand
- Prefer functional React components
- Prefer simple local state unless a more complex approach is required
- Avoid unnecessary state management libraries
- Prefer small reusable components only when they clearly improve readability
- Use Tailwind utility classes directly unless repetition becomes significant
- Prioritize visual clarity over advanced patterns

## Testing rules
- Tests should be simple and focused
- Add or update tests when behavior changes
- Do not modify production logic unless required for testability
- Run the narrowest useful validation before committing
- If a behavior change is not covered by tests, explicitly explain why
- Every code change must be validated before being considered complete
- Do not commit code if validation fails
- Query-only tasks that do not modify code do not require tests
- Query-only task summaries must omit the "Validation Performed" section unless a validation command was actually run

## Validation rules
- If backend production code changed:
  - run: `cd backend && ./mvnw test`
- If frontend production code changed:
  - run: `cd frontend && npm run build`
- If both changed:
  - run both validations
- If the task is query-only and no code changed:
  - do not run validation unless needed

## Skill role rules
- explorer skill must NOT modify code
- business-translator skill must NOT modify code
- reviewer skill must NOT modify code
- task-generator skill may only modify planning files such as TASKS.md
- implementer skill should only modify files required for the assigned task and must report task status changes to the coordinator skill
- Do not run implementation tasks in parallel
- All implementation tasks for one user request must use the same workflow branch
- Skills working on a workflow branch must commit each completed task as a separate commit
- Review fixes must be committed on the same workflow branch and must reference the same task ID as the task being fixed
- After all approved tasks are complete, squash the workflow branch into one base-branch commit that summarizes the user's overall request
- Always report changed files in the summary

## Worker patterns
- Start from a clean worktree and state the branch name in the summary
- Keep each worker focused on one small task-scoped change
- Prefer changing existing classes over adding new packages or layers
- Add or update tests when behavior changes
- Run the narrowest useful validation before committing
- Use small commits with Conventional Commit messages
- Mention any expected merge conflicts or follow-up integration work
- Do not mix cleanup refactors with feature work unless the cleanup is required

## Evidence formatting rules
- Do not use full absolute paths in user-facing evidence
- Prefer short repository-relative paths or the smallest clear domain label

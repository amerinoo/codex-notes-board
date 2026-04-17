# codex-notes-board

A small public demo repository to showcase **Codex multi-agent workflows** on a simple full-stack application.

## Goal
The purpose of this repository is to demonstrate how a set of agent skills can:
- understand a request written in natural language
- translate it into a workable plan
- generate tasks
- implement changes incrementally
- review and validate the result
- adapt to new requirements during a live demo

## App idea
The demo application is a small visual **Notes Board** built as a mono-repo:
- **backend/** → Spring Boot API
- **frontend/** → React + Vite + Tailwind UI

The app intentionally starts small and grows through incremental tasks.

## Tech stack
- Java 21
- Spring Boot
- Maven
- Lombok
- React
- Vite
- Tailwind CSS
- In-memory storage only

## Demo principles
- Keep the project intentionally small
- Prefer visible progress over hidden technical complexity
- Avoid unnecessary abstractions
- Do not add database, Docker, or authentication unless explicitly requested
- Use agent skills from `.agents/skills/`

## Current state
This repository currently contains the **bootstrap/base structure only**:
- backend project skeleton
- frontend project skeleton
- demo-oriented `AGENTS.md`
- agent skills copied into `.agents/skills/`

Business features for notes should be added incrementally during the demo workflow.

## Expected first features
- Note model
- Note status enum
- In-memory storage
- REST API for notes
- Visual cards UI
- Frontend/backend integration

## Local development
### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Validation
### Backend
```bash
cd backend
./mvnw test
```

### Frontend
```bash
cd frontend
npm run build
```

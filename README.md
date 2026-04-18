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
- Do not add database, Docker, or production authentication unless explicitly requested
- Use agent skills from `.agents/skills/`

## Current state
This repository currently contains a working Notes Board demo:
- Spring Boot REST API for notes
- React UI connected to the backend
- in-memory note storage
- create, list, update, and delete flows
- priorities: `Alta`, `Media`, and `Baja`
- public and private note visibility
- lightweight demo user context through the `X-User` request header
- search, priority counters, and dark/light mode in the UI
- backend and frontend test coverage for the main note flows

The demo user context is intentionally simple. It is useful for showing ownership and private notes during a live workflow demo, but it is not real authentication or security.

## API
### Health
```http
GET /api/health
```

Returns:
```json
{
  "status": "ok"
}
```

### Notes
```http
GET /api/notes
POST /api/notes
PUT /api/notes/{id}
DELETE /api/notes/{id}
```

Notes use this shape:
```json
{
  "id": 1,
  "title": "Release plan",
  "content": "Ship the board update",
  "priority": "Alta",
  "visibility": "PUBLIC",
  "owner": "alice",
  "createdAt": "2026-04-18T10:00:00Z",
  "updatedAt": "2026-04-18T10:00:00Z"
}
```

Create and update requests accept:
```json
{
  "title": "Release plan",
  "content": "ship the board update",
  "priority": "Alta",
  "visibility": "PUBLIC"
}
```

`POST`, `PUT`, and `DELETE` require an `X-User` header. `GET /api/notes` returns public notes plus private notes owned by the current `X-User`, when that header is present.

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

By default, the frontend expects the backend at `http://localhost:8080`.

## Validation
### Backend
```bash
cd backend
./mvnw test
```

### Frontend
```bash
cd frontend
npm test
npm run build
```

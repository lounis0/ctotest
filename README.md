# Monorepo Starter

A batteries-included monorepo that wires up a TypeScript-based Express API, a Vite-powered React application, shared tooling, and a Docker + PostgreSQL development environment.

## What's inside?

- **Apps**
  - `apps/backend` – Express + TypeScript API with a `/health` endpoint.
  - `apps/frontend` – React + Vite SPA with React Router and a reusable layout shell.
- **Tooling**
  - Shared TypeScript config, ESLint, and Prettier.
  - Vitest test runners for both applications.
  - GitHub Actions workflow for linting and tests on every push / PR.
- **Infrastructure**
  - Docker Compose setup for backend, frontend, and PostgreSQL in development.
  - Sample environment files for each application.

## Getting started

### Prerequisites

- Node.js 20+
- npm 9+
- Docker + Docker Compose (optional, for containerized development)

### Install dependencies

```bash
npm install
```

### Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run backend and frontend simultaneously with hot reload. |
| `npm run dev:backend` | Start only the API service. |
| `npm run dev:frontend` | Start only the React app. |
| `npm run build` | Build every workspace. |
| `npm run lint` | Lint backend and frontend. |
| `npm run test` | Execute Vitest suites for all apps. |
| `npm run format` | Format the repository with Prettier. |

> Run any script for a specific app with `npm run <script> --workspace apps/<name>`.

### Environment variables

Copy each sample file and adjust to your needs:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

The defaults are aligned with the provided Docker Compose stack (PostgreSQL at `postgres:5432`).

## Docker-based development

Spin up PostgreSQL, the API, and the React dev server with a single command:

```bash
docker compose up --build
```

The compose file mounts your source directory, installs dependencies inside the containers, and runs the dev scripts. Services:

- **postgres** – Stores data in the `pgdata` named volume.
- **backend** – `npm run start:dev --workspace apps/backend` (port `4000`).
- **frontend** – `npm run dev --workspace apps/frontend -- --host 0.0.0.0 --port 5173` so you can hit `http://localhost:5173` from the host.

## Health checks

- Backend: `GET http://localhost:4000/health` returns `{ "status": "ok" }` when the API is healthy.
- Frontend: The layout shell bootstraps React Router with a home page, About page, and graceful 404 handling.

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) installs dependencies once and runs the shared `lint` and `test` scripts, ensuring consistency across apps.

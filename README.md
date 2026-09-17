# MeterFlow

MeterFlow is a fullstack demo application for managing simplified Mieterstrom project workflows from initial request to commissioning.

> This is an independent portfolio/demo project and is not an official metergrid product.

The application demonstrates an end-to-end TypeScript workflow for renewable-energy project teams: portfolio visibility, project phases, technical project data, and operational tasks in one focused interface.

## Features

- Responsive EnergyTech dashboard with live portfolio statistics
- Project list with locations, housing units, PV capacity, and workflow status
- Create and edit projects with validated forms and persisted feedback
- Project detail view with a nine-stage progress tracker and status updates
- Create tasks, update task status, and filter the cross-project task list
- Full document management with search/filtering, upload progress, preview, download, and guarded deletion
- Signature-based validation for PDF, PNG, JPEG, DOC, DOCX, XLS, and XLSX files up to 5 MB
- Local filesystem storage in development and Netlify Blobs in production
- Local email/password authentication with bcrypt and JWT
- Protected application and API routes, user profile, and logout
- Live portfolio analytics based on real project creation timestamps and cumulative PV capacity
- Global `Ctrl/Cmd + K` search across projects, tasks, and documents
- Derived due-date and recent-document notifications with local read state
- In-app architecture and technology overview with official Simple Icons brand marks
- Explicit loading, empty, and API error states
- Validated, JWT-protected REST endpoints for projects, tasks, documents, and search
- PostgreSQL persistence through Prisma ORM
- Repeatable development seed data
- Backend unit tests and a health endpoint

## Architecture

```text
React + TypeScript (Netlify static site)
        ↓ /api/*
Netlify Function → Express adapter → NestJS REST API
        ↓                              ↓
PostgreSQL via Prisma             Netlify Blobs
```

The repository contains separate frontend and backend applications plus a root Netlify build. The production client uses same-origin `/api`; Netlify rewrites that path to one cached NestJS function. Prisma stores queryable metadata in PostgreSQL while document binaries live in Netlify Blobs. In normal local backend development, documents use `.local-storage/documents` instead.

## Technology stack

- Frontend: React, TypeScript, Vite, React Router, Lucide React, plain CSS
- Backend: NestJS, TypeScript, REST, class-validator
- Data: PostgreSQL 16, Prisma ORM
- File storage: Netlify Blobs in production, filesystem adapter locally
- Infrastructure: Docker Compose for local PostgreSQL, Netlify Functions for production API
- Testing: Jest
- Runtime: Node.js 20.19+ and npm

## Project structure

```text
meterflow-demo/
├── netlify/functions/      # Serverless NestJS entry point
├── frontend/              # React/Vite application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
├── backend/               # NestJS REST API
│   ├── prisma/            # Schema, migration, and seed
│   └── src/
│       ├── health/
│       ├── documents/
│       ├── prisma/
│       ├── projects/
│       ├── search/
│       └── tasks/
├── netlify.toml           # Build, functions, and rewrite configuration
├── package.json           # Root production build orchestration
├── docker-compose.yml     # PostgreSQL development service
└── .env.example
```

## Local setup

### Prerequisites

- Node.js 20.19 or newer
- npm
- Docker Desktop with Docker Compose

### 1. Configure the backend

From the repository root, copy the development environment example:

```powershell
Copy-Item .env.example backend/.env
```

The included credentials are development-only. Use secret management and unique credentials outside local development.

Set `JWT_SECRET` to a long, random value outside local development. Never reuse the example value in production.

### 2. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 3. Install and initialize the backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run start:dev
```

The API is available at `http://localhost:3000/api`. Verify it with `http://localhost:3000/api/health`.

Uploaded development files are written to `backend/.local-storage/documents` and are intentionally ignored by Git.

For schema development, create a new migration with:

```bash
npx prisma migrate dev --name describe_your_change
```

### 4. Install and start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The client uses `http://localhost:3000/api` by default. To override it, set `VITE_API_URL` in `frontend/.env`.

### Demo account (local development only)

```text
E-Mail:  demo@meterflow.local
Passwort: MeterFlow2026!
```

The seed stores only a bcrypt password hash in PostgreSQL. These credentials are strictly for the local demo environment.

## Useful commands

### Frontend

```bash
npm run dev       # development server
npm run build     # TypeScript check and production build
npm run preview   # preview the production build
```

### Backend

```bash
npm run start:dev       # watch-mode API server
npm run build           # production compilation
npm test                # Jest unit tests
npm run prisma:generate # regenerate Prisma Client
npm run prisma:deploy   # apply committed migrations
npm run prisma:seed     # upsert demonstration records
```

## Development URLs

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| REST API | `http://localhost:3000/api` |
| Health check | `http://localhost:3000/api/health` |
| PostgreSQL | `localhost:5432` |

## Document API

All routes require a valid JWT bearer token.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/documents` | List documents with project/uploader metadata |
| `GET` | `/api/projects/:projectId/documents` | List one project's documents |
| `POST` | `/api/documents` | Multipart upload using fields `file`, `projectId`, optional `name` |
| `GET` | `/api/documents/:id/download` | Stream the stored binary |
| `DELETE` | `/api/documents/:id` | Delete binary and metadata |

The backend validates the filename extension and binary signature rather than trusting the browser-provided MIME type.

## Netlify deployment

Create one Netlify site from the repository root. The committed `netlify.toml` builds both applications, publishes `frontend/dist`, and bundles `netlify/functions/api.ts`. Configure these environment variables in Netlify:

```text
DATABASE_URL=postgresql://...production-postgres...
JWT_SECRET=use-a-long-random-production-secret
NODE_ENV=production
```

Before the first production start, apply the committed Prisma migrations against the production database:

```bash
cd backend
npm ci
npm run prisma:deploy
```

The Netlify build runs `prisma generate` automatically. API rewrites are declared before the SPA fallback, so `/api/*` reaches the function while application routes return `index.html`.

For a local production-shaped smoke test, install or invoke Netlify CLI and run from the repository root:

```bash
npx netlify-cli dev --offline
```

Then open `http://localhost:8888` and verify `/api/health`. A reachable PostgreSQL `DATABASE_URL` is still required for authenticated data routes.

## Development note

AI coding assistants may be used during development. All generated code is reviewed, understood and tested before integration.

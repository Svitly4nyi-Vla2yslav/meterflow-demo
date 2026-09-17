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
- Documents navigation with a polished Phase 2 placeholder
- Explicit loading, empty, and API error states
- Validated REST endpoints for projects and tasks
- PostgreSQL persistence through Prisma ORM
- Repeatable development seed data
- Backend unit tests and a health endpoint

## Architecture

```text
React + TypeScript
        ↓
NestJS REST API
        ↓
PostgreSQL
```

The repository is split into two independent npm applications. The React client communicates with the NestJS API over HTTP; NestJS owns validation and business access, and Prisma maps the API to PostgreSQL.

## Technology stack

- Frontend: React, TypeScript, Vite, React Router, Lucide React, plain CSS
- Backend: NestJS, TypeScript, REST, class-validator
- Data: PostgreSQL 16, Prisma ORM
- Infrastructure: Docker Compose for PostgreSQL only
- Testing: Jest
- Runtime: Node.js 20.19+ and npm

## Project structure

```text
meterflow-demo/
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
│       ├── prisma/
│       ├── projects/
│       └── tasks/
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

## Development note

AI coding assistants may be used during development. All generated code is reviewed, understood and tested before integration.

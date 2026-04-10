# Taskly — Trello Clone

Full-stack Kanban board with role-based access control.

## Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | Next.js 16, React 19, Tailwind 4  |
| Backend  | NestJS 10, TypeORM 0.3, Passport  |
| Database | PostgreSQL 16                     |
| Auth     | JWT (Bearer token)                |

## Roles

| Role        | Permissions                                                        |
|-------------|--------------------------------------------------------------------|
| **Manager** | Create/rename/delete projects, create cards, manage columns        |
| **Developer** | View projects, manage columns, add/edit/move/delete cards        |

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
npm install

# Copy env and adjust if needed
cp .env.example .env

# Run migrations + seed demo data
npm run seed

# Start dev server (port 3001)
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

## Demo Accounts

| Email                   | Password    | Role      |
|-------------------------|-------------|-----------|
| manager@taskly.com      | manager123  | Manager   |
| dev1@taskly.com         | dev123      | Developer |
| dev2@taskly.com         | dev123      | Developer |

## Project Structure

```
.
├── docker-compose.yml
├── frontend/                  # Next.js app
│   ├── app/                   # App Router pages
│   └── src/
│       ├── app/               # Root App component + store
│       ├── entities/          # Reusable UI entities (CardItem)
│       ├── features/          # auth, sidebar, column, card-modal
│       ├── shared/            # types, constants
│       └── widgets/board/     # BoardCanvas, BoardHeader, AddColumnButton
└── backend/                   # NestJS app
    └── src/
        ├── auth/              # Login endpoint, JWT strategy
        ├── users/             # User entity + service
        ├── projects/          # Project, BoardColumn entities + full CRUD
        ├── tasks/             # Card, CardLabel entities
        ├── common/            # Guards, decorators
        └── database/          # DataSource, migration, seed
```

## API Reference

### Auth
| Method | Path              | Body                        | Auth     |
|--------|-------------------|-----------------------------|----------|
| POST   | /api/auth/login   | `{email, password}`         | —        |

### Projects (JWT required)
| Method | Path                                        | Roles         |
|--------|---------------------------------------------|---------------|
| GET    | /api/projects                               | any           |
| POST   | /api/projects                               | manager       |
| PATCH  | /api/projects/:id/rename                    | manager       |
| PATCH  | /api/projects/:id/color                     | manager       |
| DELETE | /api/projects/:id                           | manager       |
| POST   | /api/projects/:id/columns                   | any           |
| PATCH  | /api/projects/:id/columns/:colId/rename     | any           |
| DELETE | /api/projects/:id/columns/:colId            | any           |
| POST   | /api/projects/:id/columns/:colId/cards      | any           |
| PATCH  | /api/projects/:id/cards/:cardId             | any           |
| DELETE | /api/projects/:id/cards/:cardId             | any           |
| PATCH  | /api/projects/:id/cards/:cardId/move        | any           |

# 📅 Smart Schedule Manager Pro

> Full-stack task scheduling application — React · TypeScript · Node.js · Express · PostgreSQL · Docker · AWS

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)](https://www.docker.com/)

---

## ✨ Features

- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **Full CRUD REST API** — 10+ typed endpoints with filtering, sorting, and pagination
- **Conflict Detection** — Server-side PostgreSQL EXCLUDE constraint prevents overlapping tasks
- **TypeScript Throughout** — Strict typing on both frontend and backend
- **Responsive UI** — Clean React dashboard with real-time stats
- **Advanced Filtering** — Filter by status, priority, category, and date range
- **Docker Ready** — One command to spin up the entire stack locally
- **AWS Deployable** — Dockerised backend + frontend deployable to EC2 + RDS

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, React Router v6, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 15 (with `btree_gist` extension) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| DevOps | Docker, Docker Compose, Nginx |
| Cloud | AWS EC2 + RDS (see deployment guide) |

---

## 🚀 Quick Start (Local with Docker)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Run in one command
```bash
# Clone the repo
git clone https://github.com/Farrisudeen/smart-schedule-pro.git
cd smart-schedule-pro

# Copy env and start
cp backend/.env.example backend/.env
docker-compose up --build
```

App will be live at **http://localhost:3000**

---

## 🛠️ Local Development (Without Docker)

### 1. PostgreSQL Setup
```bash
psql -U postgres
\i database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # fill in your DB credentials
npm install
npm run dev                  # starts on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start                    # starts on http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| GET | `/api/tasks` | List tasks (with filters) | ✅ |
| GET | `/api/tasks/:id` | Get single task | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |
| GET | `/api/health` | Health check | ❌ |

### Filter Query Params for `GET /api/tasks`
```
?status=pending&priority=high&category=Work&startDate=2026-01-01&endDate=2026-12-31
```

---

## ☁️ AWS Deployment Guide

### Option 1: EC2 + Docker (Quick)
```bash
# On your EC2 instance (Ubuntu 22.04)
sudo apt update && sudo apt install docker.io docker-compose -y
git clone https://github.com/Farrisudeen/smart-schedule-pro.git
cd smart-schedule-pro
# Set production env vars
JWT_SECRET=<strong_secret> DB_PASSWORD=<strong_pass> docker-compose up -d
```

### Option 2: EC2 + RDS (Production)
1. Create **AWS RDS PostgreSQL** instance → note the endpoint
2. Run `database/schema.sql` against your RDS instance
3. Set `DB_HOST=<rds-endpoint>` in your backend `.env`
4. Deploy only the backend and frontend containers to EC2

---

## 📁 Project Structure

```
smart-schedule-pro/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Express app entry
│   │   ├── db.ts              # PostgreSQL pool
│   │   ├── middleware/auth.ts # JWT middleware
│   │   └── routes/
│   │       ├── auth.ts        # Register / Login
│   │       └── tasks.ts       # Full CRUD + filtering
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Router + Auth guard
│   │   ├── types/index.ts     # Shared TypeScript types
│   │   ├── hooks/
│   │   │   ├── useApi.ts      # Axios API layer
│   │   │   └── useAuth.tsx    # Auth context
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   └── components/
│   │       ├── TaskCard.tsx
│   │       ├── TaskModal.tsx
│   │       └── FilterBar.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── database/
│   └── schema.sql             # PostgreSQL schema
├── docker-compose.yml
└── README.md
```

---

## 👤 Author

**Farrisu Deen M H** — [LinkedIn](https://www.linkedin.com/in/farrisu-deen-m-h-a6420325a/) · [GitHub](https://github.com/Farrisudeen)

# Student Performance Tracker

A full-stack app to manage students, their subjects, and marks, with role-based admin and student dashboards.

## Stack
- Frontend: React (Vite) + React Router + Recharts
- Backend: Express + Mongoose
- Database: MongoDB Atlas
- Auth: simple username/password login (bcrypt-hashed, no sessions/JWT)
- Containerization: Docker + docker-compose
- CI: GitHub Actions (test, build, docker build)

## Logins
- Admin: `admin` / `admin123` (created via `npm run seed`)
- Students: each student gets an auto-created account where both username
  and password are their roll number.

## Dashboards
- **Admin**: CRUD on students, class-wide stats (subject averages, grade
  distribution, top performers).
- **Student**: read-only view of their own subjects, average, grade, and a
  performance chart.

## Setup

### 1. MongoDB Atlas
Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get your connection string.

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` and set `MONGO_URI` to your Atlas connection string.

### Seed the admin user
```bash
cd backend
npm run seed
```

### 3. Run locally with Docker
```bash
docker compose up --build
```
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api/students

### 4. Run without Docker (dev mode)
```bash
# backend
cd backend
npm install
npm start

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## API Endpoints
- `GET /api/students` - list all students
- `POST /api/students` - create a student
- `GET /api/students/:id` - get a student
- `PUT /api/students/:id` - update a student
- `DELETE /api/students/:id` - delete a student

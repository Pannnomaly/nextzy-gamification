# Nextzy Gamification

A full-stack gamification system built with **Next.js + NestJS + Prisma + PostgreSQL**  
This project demonstrates a complete game loop: play → earn score → claim rewards → view history → reset.

---

## What is this project?

This is a simple **gamification system** where a user can:

- Play a game to earn random scores
- Accumulate total score (0–10,000)
- Claim rewards at specific checkpoints
- View play history & reward history
- Reset the game

The project is designed to simulate **real-world backend & frontend interaction**, including database migrations, API design, and deployment.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript

### Backend
- NestJS
- Prisma ORM
- PostgreSQL

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

---

## Getting Started (Run Locally)

> You **do not need prior backend or frontend knowledge** to run this project.

### 1. Clone the repository

- git clone https://github.com/Pannnomaly/nextzy-gamification.git
- cd nextzy-gamification

### 2. Backend Setup
#### Go to backend folder
- cd backend

#### Install dependencies
- npm install

#### Create .env file
- External DATABASE_URL=Database URL (PostgreSQL connection)

#### Run database migration
Create all database tables and generate Prisma Client
- npx prisma migrate dev

#### Seed initial rewards
This inserts reward checkpoints (e.g. 5000, 7500, 10000) into the database.
- npm run seed

#### Start backend server
Your backend will run at: http://localhost:3000
- npm run start:dev

### 3. Frontend Setup
#### Open a new terminal and go to frontend folder
- cd frontend

#### Install dependencies
- npm install

#### Create .env file
- NEXT_PUBLIC_API_URL=http://localhost:3000

#### Start frontend server
Frontend will run at: http://localhost:3001
- npm run dev

## You are ready!
You can now
- Play the game
- Earn score
- Claim rewards
- View histories
- Reset game

## Project Architecture
Frontend (Next.js) => HTTP (fetch) => Backend (NestJS) => Prisma ORM => PostgreSQL Database

## API Endpoints
### User
- GET /user/summary

### Game
- POST /game/play
- GET /game/history
- POST /reset

### Reward
- POST /reward/claim/:id
- GET /reward/history

## Testing Notes
- Testing Notes
- This project uses a demo user
- Reset API is provided for testing purposes

## Deployment Notes
- Deployment Notes
- Backend deployed on Render
- Database hosted on Render PostgreSQL
- Frontend deployed on Vercel

## Why this project?
This project demonstrates:
- This project demonstrates:
- Database schema & migration
- Frontend–backend integration
- Real-world deployment workflow
- Real-world deployment workflow

## Author
- Built by Supawith Jangtrakul (Pannomaly)
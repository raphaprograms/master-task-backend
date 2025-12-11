# Pro-Tasker API

A RESTful API for a project management application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- CRUD operations for projects
- CRUD operations for tasks
- Ownership-based authorization

## Tech Stack

- Node.js
- Express.js
- MongoDB / Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository
git clone <repository-url>
cd backend
2. Install dependencies
npm install
3. Create a `.env` file in the root directory

4. Start the server
npm startThe API will be running at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login and receive JWT |
| GET | `/api/users/logout` | Logout user |

### Projects (Protected - Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects for logged-in user |
| GET | `/api/projects/:projectId` | Get a single project |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/:projectId` | Update a project |
| DELETE | `/api/projects/:projectId` | Delete a project |

### Tasks (Protected - Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:projectId/tasks` | Get all tasks for a project |
| GET | `/api/projects/:projectId/tasks/:taskId` | Get a single task |
| POST | `/api/projects/:projectId/tasks` | Create a new task |
| PUT | `/api/projects/:projectId/tasks/:taskId` | Update a task |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Delete a task |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `FRONTEND_URL` | Frontend URL for CORS |

## Deployment

Deployed on [Render](https://render.com)

Live URL: `https://master-task-backend.onrender.com`
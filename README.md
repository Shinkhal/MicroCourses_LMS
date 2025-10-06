# MicroCourses LMS

![React](https://img.shields.io/badge/React-17.0.2-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

A **full-stack Learning Management System (LMS)** where creators upload courses, admins review, and learners enroll, track progress, and receive certificates.

Built with **React + Tailwind CSS** (frontend) and **Node.js + Express + MongoDB** (backend) with **JWT authentication**.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Backend API Endpoints](#backend-api-endpoints)
4. [Frontend Routes & API](#frontend-routes--api)
5. [Project Structure](#project-structure)
6. [Installation](#installation)
7. [Environment Variables](#environment-variables)
8. [Screenshots](#screenshots)
9. [Future Improvements](#future-improvements)
10. [License](#license)

---

## Features

### Learner

* Browse **published courses** (`/courses`)
* View **course details and lessons** (`/courses/:id`)
* **Enroll** in courses and **track progress** (`/learn/:lessonId`)
* Receive **certificates** upon 100% course completion

### Creator

* Apply to become a **creator** (`/creator/apply`)
* **Create and manage courses** (`/creator/dashboard`)
* Submit courses for **admin review**
* Add **lessons with transcripts**

### Admin

* Review and **approve/reject creator applications**
* Approve or reject courses before **publishing** (`/admin/courses/pending`)

---

## Tech Stack

### Frontend

* React
* Tailwind CSS
* React Router
* Axios (API layer)

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* RESTful APIs

---

## Backend API Endpoints

### Auth

| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| POST   | `/auth/register` | Register new user                      |
| POST   | `/auth/login`    | Login user, returns JWT                |
| GET    | `/auth/profile`  | Get logged-in user info (JWT required) |

### Creator

| Method | Endpoint                            | Description              |
| ------ | ----------------------------------- | ------------------------ |
| POST   | `/creator/apply`                    | Apply as creator         |
| POST   | `/creator/courses`                  | Create a course          |
| GET    | `/creator/dashboard`                | Get creator's courses    |
| GET    | `/courses/:id`                      | Get course by ID         |
| PUT    | `/courses/:id`                      | Update course            |
| PUT    | `/creator/courses/:courseId/submit` | Submit course for review |

### Courses (Public)

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | `/courses`     | Fetch all courses  |
| GET    | `/courses/:id` | Fetch course by ID |

### Enrollment & Progress

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| POST   | `/course/enroll`             | Enroll in course       |
| POST   | `/course/progress`           | Update lesson progress |
| GET    | `/course/progress/:courseId` | Get course progress    |
| GET    | `/lessons/:lessonId`         | Get lesson details     |

### Admin

| Method | Endpoint                     | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| GET    | `/admin/creators/pending`    | Fetch pending creator applications |
| PUT    | `/admin/creators/:id/status` | Approve/reject creator             |
| GET    | `/admin/courses/pending`     | Fetch courses pending approval     |
| PUT    | `/admin/courses/:id/status`  | Approve/reject course              |

---

## Frontend Routes & API

* `/` — Welcome / landing page
* `/auth` — Login/Register page with toggle UI
* `/courses` — Browse all published courses
* `/courses/:id` — Course details, lessons, and enroll/progress
* `/profile` — Learner/creator profile page
* `/creator/apply` — Apply to become a creator
* `/creator/dashboard` — Manage courses
* `/admin/review/courses` — Admin course review

> Frontend uses `api/index.js` with Axios and JWT attached automatically to requests.

---

## Project Structure

### Backend

```
backend/
├─ controllers/       # Request handlers
├─ models/            # Mongoose schemas
├─ routes/            # Express routes
├─ middleware/        # Auth and error handling
├─ app.js             # Express app setup
├─ server.js          # Start server
```

### Frontend

```
frontend/
├─ src/
│  ├─ api/             # Axios API layer
│  ├─ pages/           # React pages (Courses, Profile, Auth, Creator, Admin)
│  ├─ components/      # Reusable UI components
│  ├─ App.js           # Main routing
│  └─ index.js         # Entry point
```

---

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Both frontend and backend must be running for the app to function properly.

---

## Environment Variables

### Frontend

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Backend

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Screenshots

<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/0779511e-d128-4489-954c-0ccebeb3e0ed" />
<img width="1917" height="969" alt="image" src="https://github.com/user-attachments/assets/17fb0eff-b1d9-48a5-a690-4fa1111400e0" />
<img width="1902" height="974" alt="image" src="https://github.com/user-attachments/assets/70afff2c-df76-4c18-a857-e1124f45110b" />
<img width="1919" height="974" alt="image" src="https://github.com/user-attachments/assets/0291c5b3-20ae-4cbc-add9-d8fc37f53ca2" />

---

## Future Improvements

* Payment integration for premium courses
* Search, filter, and category sorting
* Analytics dashboard for progress tracking
* Certificate PDF download

---

## License

This project is **MIT Licensed**.


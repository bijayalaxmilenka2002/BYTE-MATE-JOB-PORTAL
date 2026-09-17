# 🚀 Byte Mate – AI-Powered Job Portal

[![Frontend on Vercel](https://img.shields.io/badge/Vercel-Frontend_Live-black?style=for-the-badge&logo=vercel)](https://byte-mate-job-portal.vercel.app)
[![Backend on Render](https://img.shields.io/badge/Render-Backend_Live-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://byte-mate-backend.onrender.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Cloud_DB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://byte-mate-backend.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/bijayalaxmilenka2002/BYTE-MATE-JOB-PORTAL)

Byte Mate is a full-stack MERN job portal application designed to streamline the hiring process for both employers and candidates. The platform features an AI-powered Applicant Tracking System (ATS), real-time messaging, secure authentication, and role-based dashboards for efficient recruitment management.

Built using React.js, Node.js, Express.js, MongoDB, and Socket.io, Byte Mate provides a modern and scalable hiring ecosystem with intelligent resume analysis and seamless communication.

---

## 🌐 Live Deployments & Demo

| Service | Platform | Status | Live Link |
| :--- | :--- | :--- | :--- |
| 💻 **Frontend Web App** | **Vercel** | 🟢 **Live** | [https://byte-mate-job-portal.vercel.app](https://byte-mate-job-portal.vercel.app) |
| ⚙️ **Backend API & WebSockets** | **Render** | 🟢 **Live** | [https://byte-mate-backend.onrender.com](https://byte-mate-backend.onrender.com) |
| 🗄️ **Database** | **MongoDB Atlas** | 🟢 **Connected** | Cloud-Hosted Multi-Region |

> 💡 **Live Architecture:** The backend on Render powers the REST API and the real-time Socket.io chat server. The frontend is hosted on Vercel with automatic continuous deployment from GitHub.

---

# 📌 Project Overview

Byte Mate enables users to:

* Create secure candidate and employer accounts
* Post and manage job listings
* Apply to jobs using PDF resumes
* Automatically analyze resumes using AI-based ATS scoring
* Communicate instantly through real-time chat
* Track applications efficiently
* Manage hiring workflows with isolated employer dashboards

The application follows a RESTful API architecture and implements the MVC pattern for clean, maintainable, and scalable backend development.

---

# 🏗️ Project Architecture & Code Explanation

## 1️⃣ Frontend (Client Side)

The frontend is built using:

* React.js
* Vite
* Tailwind CSS (or standard CSS)

### Key Features:

* Responsive modern UI
* Dynamic job listings
* Candidate & employer dashboards
* Secure authentication flow
* Resume upload interface
* Real-time messaging system
* Fast client-side rendering using Vite
* Single-Page Application (SPA) routing via `vercel.json`

---

## 2️⃣ Backend (Server Side)

Built using:

* Node.js
* Express.js

### Core Functionalities:

### 🔹 Authentication & Authorization

* JWT-based authentication
* Password hashing using bcryptjs
* Role-based access control for:
  * Candidates
  * Employers

### 🔹 Job Management

RESTful routes are implemented:

* `GET /jobs` → View all jobs
* `GET /jobs/:id` → View single job
* `POST /jobs` → Create job posting
* `PUT /jobs/:id` → Update job posting
* `DELETE /jobs/:id` → Delete job posting

### 🔹 Application Management

* Apply to jobs
* Upload resumes
* Track applications
* Employer-side applicant management

### 🔹 MVC Pattern

The project follows:

* **Models** → MongoDB Schemas
* **Views** → React Frontend Components
* **Controllers** → Business Logic

This architecture improves scalability and maintainability.

---

# 🤖 AI Applicant Tracking System (ATS)

One of the core features of Byte Mate is the AI-powered ATS engine.

### ⚡ How It Works:

* Candidates upload PDF resumes
* Resumes are processed using `pdf-parse`
* Raw text is extracted in memory
* A custom NLP-based matching algorithm compares:
  * Resume skills
  * Job-required skills

### 📊 AI Match Score

The system instantly generates an AI Match Score to help employers shortlist candidates efficiently.

### Benefits:

✔️ Automated resume screening  
✔️ Faster hiring process  
✔️ Improved candidate-job matching  
✔️ Smart filtering system  

---

# 💬 Real-Time Messaging System

## ⚡ Socket.io Integration

Byte Mate includes a real-time communication engine using WebSockets.

### Features:

* Instant messaging
* Private employer-candidate chat rooms
* Persistent bi-directional communication
* Historical message storage
* No page refresh required

This creates a seamless networking and hiring experience.

---

# 🗄️ Database Integration

## MongoDB & Mongoose

### MongoDB

Cloud-hosted NoSQL database used to store:

* User data
* Job postings
* Applications
* Messages
* Resume metadata

### Mongoose

Used for:

* Schema creation
* Data validation
* Middleware
* Model relationships

---

# 🚀 Tech Stack

## 💻 Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript

## ⚙️ Backend

* Node.js
* Express.js

## 🗄️ Database

* MongoDB
* Mongoose

## 🔐 Authentication

* JWT (JSON Web Tokens)
* bcryptjs

## 📄 File Processing

* Multer
* pdf-parse

## ⚡ Real-Time Communication

* Socket.io

---

# 🔐 Key Features

✔️ AI-powered ATS Resume Matching  
✔️ Full CRUD Job Management  
✔️ Secure JWT Authentication  
✔️ Role-Based Access Control  
✔️ Resume PDF Upload & Parsing  
✔️ Real-Time Messaging System  
✔️ RESTful API Architecture  
✔️ MVC Backend Structure  
✔️ Protected Routes & Middleware  
✔️ Responsive Modern UI  
✔️ Scalable Multi-Tenant Dashboard  

---

# 📂 Installation & Setup (Local Development)

If someone wants to run the project locally:

```bash
# Clone the repository
git clone https://github.com/bijayalaxmilenka2002/BYTE-MATE-JOB-PORTAL.git

# Navigate to project folder
cd BYTE-MATE-JOB-PORTAL

# 1. Setup Backend
cd backend
npm install

# Create .env in backend directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Start backend server
npm run dev

# 2. Setup Frontend (in a new terminal)
cd ../frontend
npm install

# Create .env in frontend directory:
VITE_API_BASE_URL=http://localhost:5000

# Start frontend dev server
npm run dev
```

- **Local Frontend:** `http://localhost:5173`
- **Local Backend:** `http://localhost:5000`
- **Production Frontend:** [https://byte-mate-job-portal.vercel.app](https://byte-mate-job-portal.vercel.app)
- **Production Backend:** [https://byte-mate-backend.onrender.com](https://byte-mate-backend.onrender.com)

---

# 🧠 Learning Outcomes

Through this project I learned:

* Building scalable MERN stack applications
* Implementing JWT authentication & authorization
* Creating RESTful APIs with Express.js
* Managing MongoDB relationships using Mongoose
* Processing PDF files using pdf-parse
* Designing AI-based ATS matching systems
* Integrating real-time communication with Socket.io
* Implementing secure backend architecture
* Building responsive frontend interfaces
* Structuring production-level applications using MVC
* Deploying full-stack decoupled MERN applications to Render & Vercel

---

# 📈 Future Improvements

* Advanced NLP-based fuzzy matching
* Email notifications for job updates
* Video interview integration
* Admin dashboard
* Search & filter functionality
* Resume ranking analytics
* Company profile verification
* AI-powered interview recommendations

---

# 👨‍💻 Author

**BIJAYALAXMI LENKA**  
MERN Stack Developer  
GitHub: [@bijayalaxmilenka2002](https://github.com/bijayalaxmilenka2002)

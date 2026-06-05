# Implementation Plan - Job Board Application

This document outlines the architecture, database schema, API design, frontend page structure, and deployment strategies for the production-quality, full-stack Job Board application.

---

## User Review Required

> [!IMPORTANT]
> **File Upload Architecture on Vercel**: 
> Vercel's serverless environment has a read-only filesystem (except for `/tmp`). To make the app deployable out-of-the-box on Vercel without requiring external S3/Cloudinary accounts, we will store profile pictures and resumes (PDFs) as Base64 strings or MongoDB Binary (Buffer) objects in the MongoDB Atlas database. This avoids serverless execution limits and provides a seamless setup.
> 
> **Vercel Routing**:
> We will configure a single root-level `vercel.json` file to route `/api/*` to our Express backend (deployed as a serverless function) and other requests to the Vite React frontend.

---

## Proposed Architecture & Directory Structure

We will structure the project as a monorepo in the `d:\PROJECTS\JobBoard` directory:

```text
JobBoard/
├── vercel.json                 # Vercel monorepo deployment configuration
├── package.json                # Root package.json for workspace commands
├── backend/                    # Node.js + Express Backend
│   ├── package.json
│   ├── index.js                # Entry point (configured for serverless export)
│   ├── config/
│   │   └── db.js               # MongoDB connection helper
│   ├── models/
│   │   ├── User.js             # User Authentication & Role Model
│   │   ├── Profile.js          # Unified Candidate & Recruiter Profile Model
│   │   ├── Job.js              # Job Listings Model
│   │   └── Application.js      # Job Applications Model
│   ├── middleware/
│   │   ├── auth.js             # JWT & Role checking middleware
│   │   └── error.js            # Express global error handler
│   └── routes/
│       ├── auth.js             # Authentication routes (/api/auth)
│       ├── jobs.js             # Job posting & search (/api/jobs)
│       ├── profiles.js         # Candidate/Recruiter profile (/api/profiles)
│       └── applications.js     # Applications management (/api/applications)
├── frontend/                   # React.js + Vite + Tailwind CSS Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css           # Styling system & Tailwind directives
│       ├── context/
│       │   ├── AuthContext.jsx # Global auth & profile state
│       │   └── JobContext.jsx  # Jobs search, filtering, caching
│       ├── components/
│       │   ├── Navbar.jsx      # Sticky navbar with mobile drawer
│       │   ├── Sidebar.jsx     # Responsive recruiter & candidate sidebar
│       │   ├── ProtectedRoute.jsx
│       │   ├── Skeleton.jsx    # UI skeleton loaders
│       │   ├── Toast.jsx       # Custom notification system
│       │   └── Modal.jsx       # Confirmation dialogs
│       └── pages/
│           ├── Home.jsx        # Landing page with stats & call to action
│           ├── About.jsx       # Details about the portal
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Jobs.jsx        # Job listings with rich search & filter UI
│           ├── JobDetails.jsx  # Complete job description & apply actions
│           ├── candidate/
│           │   ├── Dashboard.jsx # Applied stats, saved jobs, recommendations
│           │   └── Profile.jsx   # Candidate resume/profile editor
│           └── recruiter/
│               ├── Dashboard.jsx # Recruitment metrics, quick actions
│               ├── Company.jsx   # Recruiter company profile
│               ├── PostJob.jsx   # Create & Edit job form
│               ├── ManageJobs.jsx # Manage (open/close/edit/delete) jobs
│               └── Applicants.jsx # View, search, filter, update applicants
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions CI/CD workflow
```

---

## Proposed Database Models

### User Schema (`User.js`)
* `name` (String, required)
* `email` (String, required, unique)
* `password` (String, required, select: false)
* `role` (String, enum: `['candidate', 'recruiter']`, required)
* `createdAt` (Date)

### Profile Schema (`Profile.js`)
* `userId` (ObjectId ref User, unique)
* `role` (String, copied for indexing/querying convenience)
* **Candidate Fields**:
  * `skills` (Array of Strings)
  * `experience` (Array of Objects: title, company, duration, description)
  * `education` (Array of Objects: school, degree, field, year)
  * `resume` (String - Base64 representation of PDF)
  * `resumeName` (String - original filename)
  * `avatar` (String - Base64 image)
* **Recruiter Fields**:
  * `companyName` (String)
  * `companyLogo` (String - Base64 image)
  * `website` (String)
  * `industry` (String)
  * `companySize` (String)
  * `description` (String)

### Job Schema (`Job.js`)
* `recruiterId` (ObjectId ref User, indexed)
* `title` (String, indexed)
* `companyName` (String, indexed)
* `companyLogo` (String)
* `description` (String)
* `requirements` (Array of Strings)
* `responsibilities` (Array of Strings)
* `benefits` (Array of Strings)
* `location` (String, indexed)
* `salaryRange` (Object: { min: Number, max: Number })
* `jobType` (String, enum: `['Full-time', 'Part-time', 'Contract', 'Internship']`)
* `workplaceType` (String, enum: `['Onsite', 'Remote', 'Hybrid']`)
* `experienceLevel` (String, enum: `['Entry-level', 'Mid-level', 'Senior', 'Lead']`)
* `isActive` (Boolean, default true)
* `views` (Number, default 0)
* `createdAt` (Date, default Date.now)

### Application Schema (`Application.js`)
* `jobId` (ObjectId ref Job, indexed)
* `candidateId` (ObjectId ref User, indexed)
* `status` (String, enum: `['Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected']`, default `'Applied'`)
* `resume` (String, default from profile if not uploaded separately)
* `coverLetter` (String)
* `appliedAt` (Date, default Date.now)

---

## Proposed API Endpoints

### 1. Authentication (`/api/auth`)
* `POST /register` - Register a new user
* `POST /login` - Log in and receive JWT (stored in LocalStorage or secure state)
* `GET /me` - Get current authenticated user details and profile

### 2. Jobs (`/api/jobs`)
* `GET /` - Public list of jobs with query filters (search, company, skills, location, workplace, salary, jobType)
* `GET /:id` - Public get job details (increments view count)
* `POST /` - Recruiter: create job listing
* `PUT /:id` - Recruiter: edit job listing
* `DELETE /:id` - Recruiter: delete/archive job listing

### 3. Profiles (`/api/profiles`)
* `GET /` - Get own profile (Candidate/Recruiter)
* `PUT /` - Update own profile (includes upload profile pic, details, skills, education, and resume PDF)

### 4. Applications (`/api/applications`)
* `POST /apply/:jobId` - Candidate: Apply for a job
* `GET /my-applications` - Candidate: Get list of jobs applied to
* `DELETE /withdraw/:id` - Candidate: Withdraw application
* `GET /job/:jobId` - Recruiter: View applicants for a specific job
* `PUT /status/:id` - Recruiter: Update application status (Selected, Rejected, Shortlisted, etc.)

---

## UI/UX Design System

To ensure a "Wow" factor and modern SaaS aesthetic:
* **Color Palette**: Dark theme as primary dashboard aesthetic combined with clean light modes for landing/public pages, or a toggleable dark mode. We will build a unified premium styling system using Slate/Zinc neutrals and Violet/Indigo accent highlights.
* **Animations**: Hover scales, active presses, fade-in transitions, and skeleton placeholder pulses using Tailwind and standard CSS transitions.
* **Component Frameworks**: Heroicons (via React icons) or custom svg paths for crisp icons.
* **Micro-interactions**: Interactive states for search input boxes (shadow glow, suggestions dropdown), list card item expansions, and status badge color styling.

---

## Verification Plan

### Automated Verification
- We will write test scripts using standard assertions or verify Express API routes via simple JS script queries.
- Validate React frontend compiles correctly via Vite production build output command (`npm run build`).

### Manual Verification
- Seed DB with comprehensive mock data (about 5-10 realistic jobs, candidates, and recruiter actions).
- Thoroughly click-through the web interfaces for candidate actions (Search, Apply, Upload Resume, Profile Edit) and recruiter dashboards (Post Job, Manage Jobs, Filter Applicants, Status Updates).

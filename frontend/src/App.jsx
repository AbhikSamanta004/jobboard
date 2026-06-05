import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';

// Core layout components
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';
import SavedJobs from './pages/candidate/SavedJobs';
import AppliedJobs from './pages/candidate/AppliedJobs';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterCompany from './pages/recruiter/Company';
import RecruiterPostJob from './pages/recruiter/PostJob';
import RecruiterManageJobs from './pages/recruiter/ManageJobs';
import RecruiterApplicants from './pages/recruiter/Applicants';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-primary-500 selection:text-white">
            <Navbar />
            
            <div className="flex-1 flex flex-col">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />

                {/* Candidate Protected Routes */}
                <Route
                  path="/candidate/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <CandidateDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/profile"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <CandidateProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/saved-jobs"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <SavedJobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidate/applied-jobs"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <AppliedJobs />
                    </ProtectedRoute>
                  }
                />

                {/* Recruiter Protected Routes */}
                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/company"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterCompany />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/post-job"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterPostJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/edit-job/:id"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterPostJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/manage-jobs"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterManageJobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/applicants/:jobId"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterApplicants />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>

            {/* Global toast alerts */}
            <Toast />
          </div>
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

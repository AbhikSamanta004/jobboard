import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { user, apiFetch, showToast } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]); // Recruiter's posted jobs
  const [myApplications, setMyApplications] = useState([]); // Candidate's applications
  const [savedJobs, setSavedJobs] = useState([]); // Saved job items (bookmarks)
  const [loading, setLoading] = useState(false);

  // Load saved jobs from localStorage on user change
  useEffect(() => {
    if (user && user.role === 'candidate') {
      const stored = localStorage.getItem(`savedJobs_${user._id}`);
      setSavedJobs(stored ? JSON.parse(stored) : []);
    } else {
      setSavedJobs([]);
    }
  }, [user]);

  // Fetch jobs (public with filters)
  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.jobType) queryParams.append('jobType', filters.jobType);
      if (filters.workplaceType) queryParams.append('workplaceType', filters.workplaceType);
      if (filters.experienceLevel) queryParams.append('experienceLevel', filters.experienceLevel);
      if (filters.minSalary) queryParams.append('minSalary', filters.minSalary);

      const queryString = queryParams.toString();
      const endpoint = `/jobs${queryString ? `?${queryString}` : ''}`;
      
      const data = await apiFetch(endpoint);
      if (data.success) {
        setJobs(data.jobs);
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recruiter's posted jobs
  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/jobs/my-jobs');
      if (data.success) {
        setMyJobs(data.jobs);
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single job details (public)
  const fetchJobById = async (id) => {
    try {
      const data = await apiFetch(`/jobs/${id}`);
      return data.job;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Create job (Recruiter)
  const createJob = async (jobData) => {
    setLoading(true);
    try {
      const data = await apiFetch('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
      if (data.success) {
        showToast('Job listing posted successfully!', 'success');
        fetchMyJobs();
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update job (Recruiter)
  const updateJob = async (id, jobData) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(jobData),
      });
      if (data.success) {
        showToast('Job listing updated successfully', 'success');
        fetchMyJobs();
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete job (Recruiter)
  const deleteJob = async (id) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/jobs/${id}`, {
        method: 'DELETE',
      });
      if (data.success) {
        showToast('Job listing deleted successfully', 'success');
        setMyJobs(prev => prev.filter(job => job._id !== id));
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Apply for job (Candidate)
  const applyForJob = async (jobId, applicationData) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/applications/apply/${jobId}`, {
        method: 'POST',
        body: JSON.stringify(applicationData),
      });
      if (data.success) {
        showToast('Application submitted successfully!', 'success');
        fetchMyApplications();
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidate's applications
  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/applications/my-applications');
      if (data.success) {
        setMyApplications(data.applications);
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Withdraw application (Candidate)
  const withdrawApplication = async (appId) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/applications/withdraw/${appId}`, {
        method: 'DELETE',
      });
      if (data.success) {
        showToast('Application withdrawn successfully', 'success');
        setMyApplications(prev => prev.filter(app => app._id !== appId));
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bookmark / Unbookmark Job
  const toggleBookmark = (job) => {
    if (!user) {
      showToast('Please sign in to bookmark jobs', 'error');
      return;
    }
    
    let updated;
    const isSaved = savedJobs.some(sj => sj._id === job._id);

    if (isSaved) {
      updated = savedJobs.filter(sj => sj._id !== job._id);
      showToast('Job removed from bookmarks', 'info');
    } else {
      updated = [...savedJobs, job];
      showToast('Job added to bookmarks', 'success');
    }

    setSavedJobs(updated);
    localStorage.setItem(`savedJobs_${user._id}`, JSON.stringify(updated));
  };

  // Get job applicants (Recruiter)
  const fetchJobApplicants = async (jobId) => {
    try {
      const data = await apiFetch(`/applications/job/${jobId}`);
      return data.applications;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Update applicant status (Recruiter)
  const updateApplicantStatus = async (appId, status) => {
    try {
      const data = await apiFetch(`/applications/status/${appId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      if (data.success) {
        showToast(`Candidate status updated to ${status}`, 'success');
      }
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Fetch recruiter analytics
  const fetchRecruiterStats = async () => {
    try {
      const data = await apiFetch('/applications/stats/recruiter');
      return data.stats;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        myJobs,
        myApplications,
        savedJobs,
        loading,
        fetchJobs,
        fetchMyJobs,
        fetchJobById,
        createJob,
        updateJob,
        deleteJob,
        applyForJob,
        fetchMyApplications,
        withdrawApplication,
        toggleBookmark,
        fetchJobApplicants,
        updateApplicantStatus,
        fetchRecruiterStats,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);

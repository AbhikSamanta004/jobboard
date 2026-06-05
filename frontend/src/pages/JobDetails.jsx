import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, Globe, Building2, Eye, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { DetailSkeleton } from '../components/Skeleton';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { fetchJobById, applyForJob, myApplications, fetchMyApplications, toggleBookmark, savedJobs } = useJobs();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  
  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [customResumeBase64, setCustomResumeBase64] = useState('');
  const [customResumeName, setCustomResumeName] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);

  // Fetch job details & check application status
  useEffect(() => {
    const loadData = async () => {
      try {
        const jobData = await fetchJobById(id);
        setJob(jobData);

        if (user && user.role === 'candidate') {
          // Refresh applications checklist
          await fetchMyApplications();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user]);

  // Synchronize applied status when myApplications loads/updates
  useEffect(() => {
    if (job && myApplications.length > 0) {
      const applied = myApplications.some(app => app.jobId && app.jobId._id === job._id);
      setHasApplied(applied);
    }
  }, [job, myApplications]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF document only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCustomResumeBase64(reader.result);
      setCustomResumeName(file.name);
    };
    reader.onerror = (error) => {
      console.error('File reading error: ', error);
    };
    reader.readAsDataURL(file);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    
    // Check resume source
    let resumePayload = null;
    let resumeNamePayload = '';

    if (useProfileResume) {
      if (!profile || !profile.resume) {
        alert('You do not have a resume saved in your profile. Please upload one here or update your profile.');
        return;
      }
      resumePayload = profile.resume;
      resumeNamePayload = profile.resumeName || 'Profile_Resume.pdf';
    } else {
      if (!customResumeBase64) {
        alert('Please select and upload a PDF resume file.');
        return;
      }
      resumePayload = customResumeBase64;
      resumeNamePayload = customResumeName;
    }

    setSubmittingApp(true);
    try {
      await applyForJob(job._id, {
        coverLetter,
        resume: resumePayload,
        resumeName: resumeNamePayload,
      });
      setShowApplyModal(false);
      setCoverLetter('');
      setCustomResumeBase64('');
      setCustomResumeName('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <DetailSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <ShieldAlert className="w-12 h-12 text-slate-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Job listing not found</h2>
        <p className="text-slate-400 max-w-sm mb-6">This job posting might have been closed, deleted, or expired.</p>
        <Link to="/jobs" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm font-semibold text-white">
          Back to Listings
        </Link>
      </div>
    );
  }

  const isSaved = savedJobs.some(sj => sj._id === job._id);

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Main Info Card */}
        <div className="glass-card p-6 md:p-8 mb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            
            {/* Logo + Title */}
            <div className="flex gap-4 items-center">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-16 h-16 rounded-2xl object-contain bg-slate-900 border border-slate-800 p-1 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary-950 border border-primary-500/30 flex items-center justify-center font-bold text-2xl text-primary-400 flex-shrink-0">
                  {job.companyName ? job.companyName.charAt(0) : 'C'}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-extrabold text-white leading-tight">{job.title}</h1>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>{job.companyName}</span>
                </p>
              </div>
            </div>

            {/* Application CTAs */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => toggleBookmark(job)}
                className={`flex-1 md:flex-none px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${
                  isSaved
                    ? 'bg-primary-950/40 border-primary-500/40 text-primary-400'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {isSaved ? 'Saved' : 'Bookmark'}
              </button>

              {!user ? (
                <Link
                  to="/login"
                  className="flex-1 md:flex-none px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm text-center shadow-lg shadow-primary-600/20"
                >
                  Login to Apply
                </Link>
              ) : user.role === 'recruiter' ? (
                <div className="flex-1 md:flex-none text-center px-4 py-3 bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-500 rounded-xl">
                  Employer account
                </div>
              ) : hasApplied ? (
                <div className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-6 py-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="flex-1 md:flex-none px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary-600/25"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Quick info grids */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            <div>
              <p className="text-slate-500 font-medium mb-1">Salary Range</p>
              <p className="text-white font-semibold text-sm flex items-center gap-0.5">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span>${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}</span>
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Location</p>
              <p className="text-white font-semibold text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{job.location}</span>
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Job Type / Workplace</p>
              <p className="text-white font-semibold text-sm flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{job.jobType} ({job.workplaceType})</span>
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Experience Level</p>
              <p className="text-white font-semibold text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{job.experienceLevel}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-900/60">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{job.views || 0} views</span>
            </span>
            <span>•</span>
            <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Detailed Content */}
        <div className="space-y-8">
          
          {/* Description */}
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-4">Job Description</h2>
            <div className="text-slate-350 text-sm leading-relaxed whitespace-pre-line">{job.description}</div>
          </div>

          {/* Requirements / Responsibilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-4">Requirements & Skills</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-350">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-4">Responsibilities</h2>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-350">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-4">Perks & Benefits</h2>
              <div className="flex flex-wrap gap-2.5">
                {job.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application overlay modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-card p-6 md:p-8 relative">
            <h2 className="text-xl font-bold text-white mb-1">Apply for {job.title}</h2>
            <p className="text-slate-400 text-xs mb-5">Attach your credentials and submit your application to {job.companyName}.</p>

            <form onSubmit={handleApplySubmit} className="space-y-5">
              
              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself to the hiring team..."
                  className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
                />
              </div>

              {/* Resume Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Select PDF Resume
                </label>
                
                <div className="space-y-3">
                  {/* Option 1: Profile Resume */}
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer hover:border-slate-700">
                    <input
                      type="radio"
                      name="resumeSource"
                      checked={useProfileResume}
                      onChange={() => setUseProfileResume(true)}
                      className="text-primary-650 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">Use Profile Resume</p>
                      <p className="text-[10px] text-slate-450 truncate mt-0.5">
                        {profile?.resumeName ? profile.resumeName : 'No resume uploaded in your profile.'}
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Upload new resume */}
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer hover:border-slate-700">
                    <input
                      type="radio"
                      name="resumeSource"
                      checked={!useProfileResume}
                      onChange={() => setUseProfileResume(false)}
                      className="text-primary-650 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-800"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">Upload New Resume</p>
                      <input
                        type="file"
                        accept=".pdf"
                        disabled={useProfileResume}
                        onChange={handleFileChange}
                        className="w-full text-xs text-slate-400 mt-2 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-750 disabled:opacity-40"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-900/60">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-primary-600/20"
                >
                  {submittingApp ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

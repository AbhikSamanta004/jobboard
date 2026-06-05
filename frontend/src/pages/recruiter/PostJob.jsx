import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, PlusCircle, ArrowLeft } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function RecruiterPostJob() {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const { createJob, updateJob, fetchJobById } = useJobs();
  const { profile } = useAuth();

  const isEditMode = !!id;

  // Form Fields State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('Onsite');
  const [experienceLevel, setExperienceLevel] = useState('Entry-level');
  const [description, setDescription] = useState('');
  const [reqsStr, setReqsStr] = useState('');
  const [respsStr, setRespsStr] = useState('');
  const [benefitsStr, setBenefitsStr] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);

  // Load job details in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const loadJob = async () => {
        setFetchingJob(true);
        try {
          const job = await fetchJobById(id);
          setTitle(job.title);
          setLocation(job.location);
          setMinSalary(job.salaryRange.min);
          setMaxSalary(job.salaryRange.max);
          setJobType(job.jobType);
          setWorkplaceType(job.workplaceType);
          setExperienceLevel(job.experienceLevel);
          setDescription(job.description);
          setReqsStr(job.requirements ? job.requirements.join(', ') : '');
          setRespsStr(job.responsibilities ? job.responsibilities.join(', ') : '');
          setBenefitsStr(job.benefits ? job.benefits.join(', ') : '');
        } catch (err) {
          console.error(err);
          navigate('/recruiter/manage-jobs');
        } finally {
          setFetchingJob(false);
        }
      };
      loadJob();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Parse comma-separated strings to clean arrays
    const requirements = reqsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const responsibilities = respsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const benefits = benefitsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const jobPayload = {
      title,
      location,
      salaryRange: {
        min: Number(minSalary),
        max: Number(maxSalary),
      },
      jobType,
      workplaceType,
      experienceLevel,
      description,
      requirements,
      responsibilities,
      benefits,
      // Auto fill company metadata from active profile
      companyName: profile?.companyName || 'Company Corp',
      companyLogo: profile?.companyLogo || '',
    };

    try {
      if (isEditMode) {
        await updateJob(id, jobPayload);
        navigate('/recruiter/manage-jobs');
      } else {
        await createJob(jobPayload);
        navigate('/recruiter/manage-jobs');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <main className="flex-1 glass-card p-6 md:p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-white">
                  {isEditMode ? 'Edit Job Opening' : 'Post A New Job'}
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  {isEditMode ? 'Modify active details of your listed vacancy.' : 'Advertise a new role to qualified candidates.'}
                </p>
              </div>
            </div>

            {fetchingJob ? (
              <div className="py-12 flex flex-col items-center gap-3 justify-center">
                <div className="w-10 h-10 border-4 border-slate-800 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-500 text-xs font-semibold">Loading job details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Job Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Senior Full Stack Developer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Job Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA / Remote"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Salary inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Min Annual Salary ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        placeholder="70000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Max Annual Salary ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        placeholder="120000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dropdown grids */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Job Type</label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Workplace Mode</label>
                    <select
                      value={workplaceType}
                      onChange={(e) => setWorkplaceType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                    >
                      <option value="Onsite">Onsite</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Experience Level</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                    >
                      <option value="Entry-level">Entry-level</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Detailed Job Description</label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a thorough summary of the job opening, expectations, and role environment..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-slate-700"
                    required
                  />
                </div>

                {/* Requirements / Responsibilities / Benefits */}
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Required Skills & qualifications</label>
                    <p className="text-slate-500 text-[10px] mb-2">Separate skills using commas (e.g. React.js, 3+ years experience, Rest APIs)</p>
                    <input
                      type="text"
                      value={reqsStr}
                      onChange={(e) => setReqsStr(e.target.value)}
                      placeholder="React.js, Mongoose, REST APIs, Git"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Responsibilities & Daily Duties</label>
                    <p className="text-slate-500 text-[10px] mb-2">Separate responsibilities using commas (e.g. Write clean code, Mentor juniors)</p>
                    <input
                      type="text"
                      value={respsStr}
                      onChange={(e) => setRespsStr(e.target.value)}
                      placeholder="Build web app components, Lead sprints, Refactor APIs"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Perks & Benefits</label>
                    <p className="text-slate-500 text-[10px] mb-2">Separate benefits using commas (e.g. Health insurance, 401k match)</p>
                    <input
                      type="text"
                      value={benefitsStr}
                      onChange={(e) => setBenefitsStr(e.target.value)}
                      placeholder="Remote allowance, Health insurance, Unlimited PTO"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                </div>

                {/* Submit buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800/80">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary-600/15 flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isEditMode ? 'Update Listing' : 'Publish Job Opening'}</span>
                  </button>
                </div>

              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

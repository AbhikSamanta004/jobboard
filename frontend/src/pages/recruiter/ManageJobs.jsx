import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Users, Eye, CheckCircle2, XCircle, Calendar, ArrowRight } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import Sidebar from '../../components/Sidebar';

export default function RecruiterManageJobs() {
  const { myJobs, fetchMyJobs, deleteJob, updateJob, loading } = useJobs();
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete);
      setJobToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (job) => {
    try {
      await updateJob(job._id, { isActive: !job.isActive });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <main className="flex-1 space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-2">Manage Job Postings</h1>
              <p className="text-slate-400 text-sm">Close, reopen, edit, or delete listings, and view candidates.</p>
            </div>

            {loading && myJobs.length === 0 ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl h-24 animate-pulse" />
                ))}
              </div>
            ) : myJobs.length === 0 ? (
              <div className="glass-card p-16 text-center space-y-4 max-w-2xl mx-auto">
                <Users className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-lg font-bold text-white">No jobs posted yet</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  Get started by publishing your first job listing to find qualified candidates.
                </p>
                <Link
                  to="/recruiter/post-job"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <span>Post A Job</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`glass-card p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-slate-800 transition-colors ${
                      !job.isActive ? 'opacity-75' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-white text-base leading-tight">
                          {job.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            job.isActive
                              ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                              : 'bg-rose-950/40 border-rose-500/20 text-rose-400'
                          }`}
                        >
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-xs mt-1.5 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{job.location}</span>
                        <span className="text-slate-650">•</span>
                        <span>{job.jobType}</span>
                        <span className="text-slate-650">•</span>
                        <span>${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k</span>
                      </p>

                      <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{job.views || 0} views</span>
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-start border-t lg:border-0 pt-3 lg:pt-0">
                      {/* Active/Inactive Toggle Button */}
                      <button
                        onClick={() => handleToggleActive(job)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          job.isActive
                            ? 'bg-amber-955/20 border-amber-500/20 text-amber-400 hover:bg-amber-955/30'
                            : 'bg-emerald-955/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-955/30'
                        }`}
                      >
                        {job.isActive ? 'Close Job' : 'Reopen Job'}
                      </button>

                      <div className="flex gap-2">
                        {/* Applicants Link */}
                        <Link
                          to={`/recruiter/applicants/${job._id}`}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-850"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Applicants</span>
                        </Link>

                        {/* Edit Link */}
                        <Link
                          to={`/recruiter/edit-job/${job._id}`}
                          className="p-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                          title="Edit Position"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => setJobToDelete(job._id)}
                          className="p-2 bg-slate-950 border border-slate-850 hover:bg-rose-955/20 text-slate-500 hover:text-rose-400 rounded-lg hover:border-rose-500/30 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-card p-6 relative">
            <h3 className="text-lg font-bold text-white mb-2">Delete Job Listing</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Are you sure you want to permanently delete this job listing? All applicant history linked to this opening will be removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

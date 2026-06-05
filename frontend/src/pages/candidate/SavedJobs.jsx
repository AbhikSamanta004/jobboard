import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Briefcase, DollarSign, Compass, Trash2, ArrowRight } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import Sidebar from '../../components/Sidebar';

export default function SavedJobs() {
  const { savedJobs, toggleBookmark } = useJobs();

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <main className="flex-1 space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-2">Bookmarked Jobs</h1>
              <p className="text-slate-400 text-sm">Review job listings you have saved for later review.</p>
            </div>

            {savedJobs.length === 0 ? (
              <div className="glass-card p-16 text-center space-y-4 max-w-2xl mx-auto">
                <Bookmark className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-lg font-bold text-white">No bookmarked jobs</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  You haven't bookmarked any jobs yet. Browse listings to save opportunities.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse Jobs</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="glass-card p-6 flex flex-col justify-between h-52 hover:border-slate-700 hover:shadow-xl transition-all relative group"
                  >
                    {/* Delete bookmark */}
                    <button
                      onClick={() => toggleBookmark(job)}
                      className="absolute top-4 right-4 p-2 rounded-xl border border-rose-500/20 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 transition-all"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex gap-4 items-center mb-4 pr-10">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            className="w-12 h-12 rounded-xl object-contain bg-slate-900 border border-slate-800 p-1 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary-950/65 border border-primary-500/30 flex items-center justify-center font-bold text-primary-400 flex-shrink-0">
                            {job.companyName ? job.companyName.charAt(0) : 'C'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-base leading-tight truncate group-hover:text-primary-400 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-slate-400 text-xs mt-1">{job.companyName}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-medium mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                          <span>${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-800/60 pt-3">
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-850 text-[10px] font-bold text-slate-400 rounded-lg">
                        {job.jobType}
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

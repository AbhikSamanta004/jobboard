import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, Bookmark, FileText, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import Sidebar from '../../components/Sidebar';

export default function CandidateDashboard() {
  const { user, profile } = useAuth();
  const { myApplications, fetchMyApplications, savedJobs, jobs, fetchJobs } = useJobs();

  useEffect(() => {
    fetchMyApplications();
    fetchJobs(); // Load all jobs to match recommendations
  }, []);

  // Recommendation engine: Match jobs that contain candidate's skills
  const getRecommendedJobs = () => {
    if (!profile || !profile.skills || profile.skills.length === 0) {
      // Return latest 3 active jobs if no skills defined
      return jobs.slice(0, 3);
    }

    const candidateSkills = profile.skills.map(s => s.toLowerCase());

    const matched = jobs.filter(job => {
      // Skip jobs the user already applied to
      const hasApplied = myApplications.some(app => app.jobId && app.jobId._id === job._id);
      if (hasApplied) return false;

      // Check if job requirements match candidate skills
      const reqs = job.requirements || [];
      return reqs.some(req => candidateSkills.some(skill => req.toLowerCase().includes(skill)));
    });

    // Fallback if no specific matches found
    return matched.length > 0 ? matched.slice(0, 3) : jobs.slice(0, 3);
  };

  const recommendations = getRecommendedJobs();

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <Sidebar />

          {/* Main Dashboard Area */}
          <main className="flex-1 space-y-8 animate-fade-in">
            {/* Welcome banner */}
            <div className="glass-card p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Hello, {user?.name}!</h1>
                <p className="text-slate-400 mt-1 text-sm">Welcome back to your dashboard. Track your job portal metrics here.</p>
              </div>
              <Link
                to="/candidate/profile"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-primary-600/20"
              >
                Edit Profile
              </Link>
            </div>

            {/* Stats Summary Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Total Applications Card */}
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="p-3.5 bg-blue-950 border border-blue-500/20 text-blue-400 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Applied Jobs</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{myApplications.length}</p>
                </div>
              </div>

              {/* Saved Jobs Card */}
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="p-3.5 bg-primary-950 border border-primary-500/20 text-primary-400 rounded-2xl">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Saved Jobs</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{savedJobs.length}</p>
                </div>
              </div>

              {/* Profile Completeness Card */}
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="p-3.5 bg-emerald-950 border border-emerald-500/20 text-emerald-400 rounded-2xl">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Skills Listed</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{profile?.skills?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Split Section: Applications Status + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Applications Status Summary */}
              <div className="lg:col-span-2 glass-card p-6">
                <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
                  <span>Recent Applications</span>
                </h3>
                
                {myApplications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm space-y-2">
                    <p>No applications sent yet.</p>
                    <Link to="/jobs" className="text-xs text-primary-400 font-semibold hover:underline">
                      Find matching jobs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myApplications.slice(0, 3).map((app) => (
                      <div key={app._id} className="flex justify-between items-center py-2.5 border-b border-slate-900/60 last:border-0">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{app.jobId?.title || 'Unknown Job'}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{app.jobId?.companyName || 'Company'}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 rounded text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {app.status}
                        </span>
                      </div>
                    ))}
                    {myApplications.length > 3 && (
                      <Link to="/candidate/applied-jobs" className="block text-center text-xs font-semibold text-primary-400 hover:text-primary-300 pt-3 border-t border-slate-900/60">
                        View all applications
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Recommended Jobs */}
              <div className="lg:col-span-3 glass-card p-6">
                <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary-400" />
                  <span>Recommended For You</span>
                </h3>

                {recommendations.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">
                    No recommendations found. Try updating your skills profile!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((job) => (
                      <div
                        key={job._id}
                        className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors flex justify-between items-center"
                      >
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">{job.title}</h4>
                          <p className="text-xs text-slate-550 truncate mt-0.5">{job.companyName} • {job.location}</p>
                        </div>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-white rounded-xl transition-colors border border-slate-850 flex-shrink-0"
                          title="Apply"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

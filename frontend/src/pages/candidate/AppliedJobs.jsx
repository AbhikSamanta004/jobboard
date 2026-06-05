import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FileText, MapPin, DollarSign, Trash2, Calendar, CheckCircle, Clock, Ban, UserCheck } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import Sidebar from '../../components/Sidebar';

export default function AppliedJobs() {
  const { myApplications, fetchMyApplications, withdrawApplication, loading } = useJobs();
  
  // Withdraw Modal Confirmation State
  const [appToWithdraw, setAppToWithdraw] = useState(null);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const handleWithdrawConfirm = async () => {
    if (!appToWithdraw) return;
    try {
      await withdrawApplication(appToWithdraw);
      setAppToWithdraw(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to color-code application status badges
  const getStatusBadge = (status) => {
    const badges = {
      Applied: { bg: 'bg-slate-900 border-slate-800 text-slate-400', icon: <Clock className="w-3.5 h-3.5" /> },
      Reviewing: { bg: 'bg-yellow-950/40 border-yellow-500/20 text-yellow-400', icon: <Clock className="w-3.5 h-3.5" /> },
      Shortlisted: { bg: 'bg-blue-950/40 border-blue-500/20 text-blue-400', icon: <Clock className="w-3.5 h-3.5" /> },
      'Interview Scheduled': { bg: 'bg-violet-950/40 border-violet-500/20 text-violet-400', icon: <Clock className="w-3.5 h-3.5" /> },
      Selected: { bg: 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400', icon: <UserCheck className="w-3.5 h-3.5" /> },
      Rejected: { bg: 'bg-rose-950/40 border-rose-500/20 text-rose-450', icon: <Ban className="w-3.5 h-3.5" /> },
    };

    const style = badges[status] || badges.Applied;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${style.bg}`}>
        {style.icon}
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <main className="flex-1 space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-2">My Applications</h1>
              <p className="text-slate-400 text-sm">Monitor current interview states and manage active submissions.</p>
            </div>

            {loading && myApplications.length === 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl h-28 animate-pulse" />
                ))}
              </div>
            ) : myApplications.length === 0 ? (
              <div className="glass-card p-16 text-center space-y-4 max-w-2xl mx-auto">
                <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-lg font-bold text-white">No active applications</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  You haven't applied to any job listings yet.
                </p>
                <RouterLink
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <span>Explore Jobs</span>
                </RouterLink>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app._id}
                    className="glass-card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 transition-colors"
                  >
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">
                        {app.jobId ? app.jobId.title : 'Deleted Position'}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1.5 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{app.jobId ? app.jobId.companyName : 'Unknown Company'}</span>
                        <span className="text-slate-650">•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{app.jobId ? app.jobId.location : 'N/A'}</span>
                        </span>
                        <span className="text-slate-650">•</span>
                        <span className="flex items-center gap-0.5">
                          <DollarSign className="w-3 h-3 text-slate-500" />
                          <span>
                            {app.jobId
                              ? `$${(app.jobId.salaryRange.min / 1000).toFixed(0)}k - $${(app.jobId.salaryRange.max / 1000).toFixed(0)}k`
                              : 'N/A'}
                          </span>
                        </span>
                      </p>

                      <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-0 pt-3 sm:pt-0">
                      {getStatusBadge(app.status)}
                      
                      <div className="flex gap-2">
                        {app.jobId && (
                          <RouterLink
                            to={`/jobs/${app.jobId._id}`}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 hover:text-white rounded-lg text-xs font-semibold"
                          >
                            Details
                          </RouterLink>
                        )}
                        <button
                          onClick={() => setAppToWithdraw(app._id)}
                          className="p-2 bg-slate-950 border border-slate-850 hover:bg-rose-955/20 text-slate-500 hover:text-rose-400 rounded-lg hover:border-rose-500/30 transition-colors"
                          title="Withdraw Application"
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

      {/* Withdraw confirmation Modal */}
      {appToWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm glass-card p-6 relative">
            <h3 className="text-lg font-bold text-white mb-2">Withdraw Application</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Are you sure you want to withdraw this application? This action cannot be undone, and the recruiter will no longer see your submission.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setAppToWithdraw(null)}
                className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold"
              >
                Keep Application
              </button>
              <button
                onClick={handleWithdrawConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/20"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

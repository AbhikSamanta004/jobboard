import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Eye, TrendingUp, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { DashboardStatsSkeleton } from '../../components/Skeleton';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { fetchRecruiterStats } = useJobs();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await fetchRecruiterStats();
        setStats(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <main className="flex-1 space-y-8 animate-fade-in">
            {/* Recruiter Header */}
            <div className="glass-card p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Recruiter Workspace</h1>
                <p className="text-slate-400 mt-1 text-sm">Welcome back, {user?.name}. Manage your hires and track applicant funnels.</p>
              </div>
              <Link
                to="/recruiter/post-job"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-primary-600/20 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post A Job</span>
              </Link>
            </div>

            {loading ? (
              <DashboardStatsSkeleton />
            ) : !stats ? (
              <div className="glass-card p-12 text-center text-slate-500">
                Failed to load recruitment statistics.
              </div>
            ) : (
              <>
                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Postings */}
                  <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3.5 bg-indigo-950 border border-indigo-500/20 text-indigo-400 rounded-2xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-550 text-xs font-semibold uppercase tracking-wider">Total Positions</p>
                      <p className="text-2xl font-extrabold text-white mt-1">{stats.totalJobs}</p>
                    </div>
                  </div>

                  {/* Active Jobs */}
                  <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3.5 bg-emerald-950 border border-emerald-500/20 text-emerald-400 rounded-2xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-550 text-xs font-semibold uppercase tracking-wider">Active Jobs</p>
                      <p className="text-2xl font-extrabold text-white mt-1">{stats.activeJobs}</p>
                    </div>
                  </div>

                  {/* Total Applications */}
                  <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3.5 bg-blue-950 border border-blue-500/20 text-blue-400 rounded-2xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-550 text-xs font-semibold uppercase tracking-wider">Applicants</p>
                      <p className="text-2xl font-extrabold text-white mt-1">{stats.totalApplications}</p>
                    </div>
                  </div>

                  {/* Conversion / Views */}
                  <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3.5 bg-violet-950 border border-violet-500/20 text-violet-400 rounded-2xl">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-550 text-xs font-semibold uppercase tracking-wider">Match Conversion</p>
                      <p className="text-2xl font-extrabold text-white mt-1">{stats.conversionRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Funnel Pipeline & Quick Links */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  
                  {/* Status Breakdown Funnel */}
                  <div className="lg:col-span-3 glass-card p-6">
                    <h3 className="font-bold text-white text-base mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-slate-400" />
                      <span>Applicant Pipeline Funnel</span>
                    </h3>

                    <div className="space-y-4">
                      {Object.entries(stats.statusBreakdown).map(([status, count]) => {
                        // Calculate percentage for progress bars
                        const total = stats.totalApplications || 1;
                        const pct = Math.min(((count / total) * 100), 100);

                        return (
                          <div key={status} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-350">{status}</span>
                              <span className="text-white font-bold">{count} candidates</span>
                            </div>
                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                              <div
                                style={{ width: `${pct}%` }}
                                className="bg-primary-555 h-full rounded-full transition-all duration-500 bg-primary-600"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recruiter shortcuts */}
                  <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base mb-4">Quick Shortcuts</h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        Use the shortcut menu to upload corporate metadata, post fresh openings, or check incoming candidate resumes.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Link
                        to="/recruiter/company"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors text-xs font-semibold text-white group"
                      >
                        <span>Update Company Profile</span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </Link>

                      <Link
                        to="/recruiter/manage-jobs"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors text-xs font-semibold text-white group"
                      >
                        <span>Manage Job Postings</span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </Link>
                    </div>
                  </div>

                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

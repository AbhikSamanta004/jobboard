import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp, Users, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch a few featured jobs for the homepage
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL ||
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api'
            : '/api');

        const response = await fetch(`${apiBase}/jobs`);
        const data = await response.json();
        if (data.success) {
          // Get first 3 jobs
          setFeaturedJobs(data.jobs.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (location) query.append('location', location);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-slate-950">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 animate-fade-in">
            Find the Job That Fits <br />
            <span className="bg-gradient-to-r from-primary-400 to-violet-500 bg-clip-text text-transparent">
              Your Professional Life
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Discover thousands of job openings with customizable filters, track your applications in real-time, and build a career you love.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-card p-2 max-w-4xl mx-auto flex flex-col md:flex-row gap-2 items-center shadow-2xl"
          >
            <div className="flex items-center gap-2 px-3 py-2 w-full border-b md:border-b-0 md:border-r border-slate-800">
              <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 w-full">
              <MapPin className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="City, state, or Remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/35"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-12 bg-slate-900 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">12,000+</div>
              <div className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">500+</div>
              <div className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">Top Companies</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">85,000+</div>
              <div className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">Candidates</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">18,000+</div>
              <div className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">Placements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Featured Opportunities</h2>
              <p className="text-slate-400 mt-2">Hand-picked jobs from top companies hiring right now</p>
            </div>
            <Link
              to="/jobs"
              className="text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Explore all jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl h-44 animate-pulse" />
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-500">
              No jobs posted yet. Be the first to post a job vacancy!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job._id}
                  className="glass-card p-6 flex flex-col justify-between h-56 hover:border-slate-700 hover:translate-y-[-4px] transition-all duration-300"
                >
                  <div>
                    <div className="flex gap-3 items-center mb-3">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-10 h-10 rounded-xl object-contain bg-slate-800"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-primary-900/40 border border-primary-500/30 flex items-center justify-center font-bold text-primary-400">
                          {job.companyName ? job.companyName.charAt(0) : 'C'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-white truncate max-w-[170px]">{job.title}</h3>
                        <p className="text-slate-400 text-xs">{job.companyName}</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">{job.description}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-800/60 pt-3">
                    <span className="text-xs font-semibold text-primary-400 capitalize">{job.workplaceType}</span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700/50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Role CTA Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Candidate CTA */}
            <div className="glass-card p-8 md:p-10 flex flex-col justify-between h-72 relative overflow-hidden group">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-44 h-44 text-primary-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3">Looking for a Job?</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                  Build a profile, display your experience, upload your resume, and apply to top companies in one click. Bookmark listings and keep track of your applications.
                </p>
              </div>
              <Link
                to={user ? (user.role === 'candidate' ? '/candidate/dashboard' : '/') : '/register'}
                className="w-fit px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-primary-600/25"
              >
                <span>Create Candidate Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Recruiter CTA */}
            <div className="glass-card p-8 md:p-10 flex flex-col justify-between h-72 relative overflow-hidden group">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <Briefcase className="w-44 h-44 text-primary-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3">Are you an Employer?</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                  Post vacancies and manage open roles. Access our candidate pipeline, screen resumes, and schedule candidate interviews on a single recruiter interface.
                </p>
              </div>
              <Link
                to={user ? (user.role === 'recruiter' ? '/recruiter/dashboard' : '/') : '/register'}
                className="w-fit px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all border border-slate-700"
              >
                <span>Register as Employer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

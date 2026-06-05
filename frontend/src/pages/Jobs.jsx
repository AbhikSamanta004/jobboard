import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Bookmark, SlidersHorizontal, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCardSkeleton } from '../components/Skeleton';

export default function Jobs() {
  const { jobs, loading, fetchJobs, savedJobs, toggleBookmark } = useJobs();
  const location = useLocation();

  // Extract initial parameters from URL query string
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      location: params.get('location') || '',
    };
  };

  const initialParams = getQueryParams();

  // Filters State
  const [search, setSearch] = useState(initialParams.search);
  const [locFilter, setLocFilter] = useState(initialParams.location);
  const [jobType, setJobType] = useState('');
  const [workplaceType, setWorkplaceType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [minSalary, setMinSalary] = useState('');
  
  // Mobile Filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Trigger search on filter changes
  useEffect(() => {
    fetchJobs({
      search,
      location: locFilter,
      jobType,
      workplaceType,
      experienceLevel,
      minSalary,
    });
    setCurrentPage(1); // Reset page on filter change
  }, [search, locFilter, jobType, workplaceType, experienceLevel, minSalary]);

  // Handle pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handleClearFilters = () => {
    setSearch('');
    setLocFilter('');
    setJobType('');
    setWorkplaceType('');
    setExperienceLevel('');
    setMinSalary('');
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title / search bars */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Explore Opportunities</h1>
          <p className="text-slate-400">Discover and apply to matching roles from across the globe</p>
        </div>

        {/* Desktop Quick Search Banner */}
        <div className="glass-card p-3 mb-8 flex flex-col md:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 px-3 py-2 w-full md:border-r border-slate-800">
            <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search roles, companies, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 w-full">
            <MapPin className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Location..."
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 text-sm focus:outline-none"
            />
          </div>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden w-full flex items-center justify-center gap-2 py-3 bg-slate-800 rounded-xl text-sm font-semibold border border-slate-700 text-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Layout split */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 glass-card p-6 h-fit ${showMobileFilters ? 'block' : 'hidden md:hidden lg:block'}`}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/80">
              <span className="font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary-400" />
                <span>Filters</span>
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs text-primary-400 hover:text-primary-300 font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {/* Job Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Workplace Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Workplace Mode
                </label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All Modes</option>
                  <option value="Onsite">Onsite</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All Levels</option>
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              {/* Salary filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Min Salary ($ / yr)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    placeholder="e.g. 80000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Job List Panel */}
          <main className="flex-1 space-y-6">
            <div className="flex justify-between items-center text-sm text-slate-400">
              <span>Found {jobs.length} jobs matching search</span>
              <span>Showing Page {currentPage} of {totalPages || 1}</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 4, 5].map(i => <JobCardSkeleton key={i} />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="glass-card p-16 text-center space-y-4">
                <Compass className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No listings found</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  Try adjusting your search criteria or clearing filter constraints to discover wider roles.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700/50"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentJobs.map((job) => {
                  const isSaved = savedJobs.some(sj => sj._id === job._id);
                  return (
                    <div
                      key={job._id}
                      className="glass-card p-6 flex flex-col justify-between h-56 hover:border-slate-700 hover:shadow-xl transition-all duration-300 relative group"
                    >
                      {/* Bookmark button */}
                      <button
                        onClick={() => toggleBookmark(job)}
                        className={`absolute top-4 right-4 p-2 rounded-xl border transition-all ${
                          isSaved
                            ? 'bg-primary-950/40 border-primary-500/40 text-primary-400 shadow-md'
                            : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>

                      <div>
                        {/* Company logo & job title header */}
                        <div className="flex gap-4 items-start mb-4 pr-8">
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.companyName}
                              className="w-12 h-12 rounded-xl object-contain bg-slate-900 border border-slate-800/80 p-1 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-primary-950/60 border border-primary-500/30 flex items-center justify-center font-bold text-primary-400 flex-shrink-0">
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

                        {/* Location / Salary metadata */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 mb-4 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{job.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                            <span>${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                            <span className="capitalize">{job.workplaceType}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Footer badges & CTA */}
                      <div className="flex justify-between items-center border-t border-slate-800/60 pt-3">
                        <span className="px-2.5 py-1 bg-slate-900 border border-slate-850 text-[10px] font-bold text-slate-400 rounded-lg">
                          {job.jobType}
                        </span>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="px-3.5 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md shadow-primary-600/15"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-slate-400 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

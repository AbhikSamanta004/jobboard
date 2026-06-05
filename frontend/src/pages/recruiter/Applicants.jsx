import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Mail, Compass, FileText, ChevronDown, ChevronUp, UserCheck, Eye, Trash2, ArrowLeft, Search } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import Sidebar from '../../components/Sidebar';

export default function RecruiterApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { fetchJobApplicants, updateApplicantStatus } = useJobs();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Expanded applicant panel states
  const [expandedAppId, setExpandedAppId] = useState(null);

  // Load applicants queue
  useEffect(() => {
    const loadApplicants = async () => {
      try {
        const queue = await fetchJobApplicants(jobId);
        setApplicants(queue);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicantStatus(appId, newStatus);
      
      // Update local state
      setApplicants(prev =>
        prev.map(app => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (appId) => {
    setExpandedAppId(expandedAppId === appId ? null : appId);
  };

  const handleViewResume = (resumeData) => {
    if (!resumeData) return;
    const newTab = window.open();
    newTab.document.write(
      `<iframe src="${resumeData}" width="100%" height="100%" style="border:0; position:fixed; top:0; left:0; right:0; bottom:0;"></iframe>`
    );
  };

  // Filter and Search logic
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch =
      app.candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      app.candidate.email.toLowerCase().includes(search.toLowerCase()) ||
      (app.candidate.profile?.skills || []).some(skill =>
        skill.toLowerCase().includes(search.toLowerCase())
      );
    
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <main className="flex-1 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Candidate Applications</h1>
                <p className="text-slate-400 text-sm mt-0.5">Screen resumes, review cover letters, and manage applicant progression.</p>
              </div>
            </div>

            {/* Search and Filters panel */}
            <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search applicants by name, email, or skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
                <option value="Selected">Selected</option>
              </select>
            </div>

            {/* Applicant cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl h-24 animate-pulse" />
                ))}
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="glass-card p-16 text-center space-y-4 max-w-2xl mx-auto">
                <Users className="w-12 h-12 text-slate-750 mx-auto" />
                <h3 className="text-lg font-bold text-white">No applicants match criteria</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  Try adjusting search parameters or selecting different filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplicants.map((app) => {
                  const isExpanded = expandedAppId === app._id;
                  
                  return (
                    <div
                      key={app._id}
                      className="glass-card border border-slate-800 overflow-hidden"
                    >
                      {/* Summary Row */}
                      <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex gap-4 items-center">
                          {app.candidate.profile?.avatar ? (
                            <img
                              src={app.candidate.profile.avatar}
                              alt={app.candidate.name}
                              className="w-12 h-12 rounded-full object-cover border border-slate-800 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-lg text-slate-500 flex-shrink-0">
                              {app.candidate.name ? app.candidate.name.charAt(0) : 'U'}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-white text-sm leading-tight">
                              {app.candidate.name}
                            </h3>
                            <p className="text-slate-500 text-[10px] mt-1.5 flex items-center gap-1 font-medium">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{app.candidate.email}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0">
                          {/* Pipeline status dropdown */}
                          <div className="relative">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app._id, e.target.value)}
                              className="bg-slate-900 border border-slate-800 text-[10px] font-bold text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-700"
                            >
                              <option value="Applied">Applied</option>
                              <option value="Reviewing">Reviewing</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interview Scheduled">Interview Scheduled</option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>

                          <div className="flex gap-2">
                            {/* PDF View */}
                            <button
                              onClick={() => handleViewResume(app.resume)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg text-[10px] font-semibold border border-slate-850 flex items-center gap-1"
                              title="Inspect PDF Resume"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Resume</span>
                            </button>

                            {/* Panel Toggle */}
                            <button
                              onClick={() => toggleExpand(app._id)}
                              className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 hover:text-white rounded-lg transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Detail Panel */}
                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-slate-900/60 bg-slate-950/20 pt-4 space-y-4 text-xs animate-fade-in">
                          {/* Cover letter */}
                          {app.coverLetter && (
                            <div className="space-y-1">
                              <p className="font-bold text-slate-400">Cover Letter</p>
                              <p className="text-slate-350 bg-slate-950 p-3 rounded-xl border border-slate-900 leading-relaxed">
                                {app.coverLetter}
                              </p>
                            </div>
                          )}

                          {/* Profile Skills */}
                          <div className="space-y-1.5">
                            <p className="font-bold text-slate-400">Candidate Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {app.candidate.profile?.skills && app.candidate.profile.skills.length > 0 ? (
                                app.candidate.profile.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-medium text-slate-300"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-550 italic text-[11px]">No skills listed.</span>
                              )}
                            </div>
                          </div>

                          {/* Candidate Experience */}
                          <div className="space-y-2">
                            <p className="font-bold text-slate-400">Work Experience</p>
                            {app.candidate.profile?.experience && app.candidate.profile.experience.length > 0 ? (
                              <div className="space-y-2.5">
                                {app.candidate.profile.experience.map((exp, index) => (
                                  <div key={index} className="pl-3 border-l-2 border-primary-500/40 space-y-0.5">
                                    <p className="font-semibold text-white text-[11px]">{exp.title} at {exp.company}</p>
                                    <p className="text-slate-500 text-[10px]">{exp.duration}</p>
                                    {exp.description && <p className="text-slate-400 mt-1 leading-relaxed">{exp.description}</p>}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-550 italic text-[11px]">No experience history provided.</span>
                            )}
                          </div>

                          {/* Candidate Education */}
                          <div className="space-y-2">
                            <p className="font-bold text-slate-400">Education</p>
                            {app.candidate.profile?.education && app.candidate.profile.education.length > 0 ? (
                              <div className="space-y-2">
                                {app.candidate.profile.education.map((edu, index) => (
                                  <div key={index} className="pl-3 border-l-2 border-violet-500/40 space-y-0.5">
                                    <p className="font-semibold text-white text-[11px]">
                                      {edu.degree} in {edu.field}
                                    </p>
                                    <p className="text-slate-450 text-[10px]">
                                      {edu.school} • Class of {edu.year}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-550 italic text-[11px]">No education details provided.</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

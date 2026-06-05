import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Bookmark, FileText, User, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const candidateMenu = [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'My Profile', path: '/candidate/profile', icon: <User className="w-5 h-5" /> },
    { label: 'Saved Jobs', path: '/candidate/saved-jobs', icon: <Bookmark className="w-5 h-5" /> },
    { label: 'Applied Jobs', path: '/candidate/applied-jobs', icon: <FileText className="w-5 h-5" /> },
  ];

  const recruiterMenu = [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Company Profile', path: '/recruiter/company', icon: <User className="w-5 h-5" /> },
    { label: 'Post a Job', path: '/recruiter/post-job', icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Manage Jobs', path: '/recruiter/manage-jobs', icon: <FileText className="w-5 h-5" /> },
  ];

  const menuItems = user.role === 'recruiter' ? recruiterMenu : candidateMenu;

  return (
    <aside className="w-full md:w-64 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1.5 h-fit shadow-xl">
      <div className="px-3 py-2.5 mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation Menu</p>
      </div>

      <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 flex-shrink-0 md:flex-shrink ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25 border-l-4 border-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="hidden md:flex border-t border-slate-800 mt-6 pt-4 flex-col gap-1">
        <NavLink
          to="/jobs"
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          <Briefcase className="w-5 h-5" />
          <span>Browse Job Listings</span>
        </NavLink>
      </div>
    </aside>
  );
}

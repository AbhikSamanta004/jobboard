import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, LogOut, User, LayoutDashboard, Bookmark, FileText, Bell, BellRing, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, notifications, markNotificationAsRead, clearAllNotifications } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Nav links based on role
  const guestLinks = [
    { label: 'Explore Jobs', path: '/jobs' },
    { label: 'About', path: '/about' },
  ];

  const candidateLinks = [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Search Jobs', path: '/jobs', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Saved Jobs', path: '/candidate/saved-jobs', icon: <Bookmark className="w-4 h-4" /> },
    { label: 'Applications', path: '/candidate/applied-jobs', icon: <FileText className="w-4 h-4 text-slate-400" /> },
    { label: 'Profile', path: '/candidate/profile', icon: <User className="w-4 h-4" /> },
  ];

  const recruiterLinks = [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Post a Job', path: '/recruiter/post-job', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Manage Jobs', path: '/recruiter/manage-jobs', icon: <FileText className="w-4 h-4" /> },
    { label: 'Company Profile', path: '/recruiter/company', icon: <User className="w-4 h-4" /> },
  ];

  const currentLinks = user
    ? user.role === 'recruiter'
      ? recruiterLinks
      : candidateLinks
    : guestLinks;

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-wide">
            <div className="p-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span>Job<span className="text-primary-500">X</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {currentLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-slate-800/80 shadow-inner border border-slate-700/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Profile / Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                
                {/* Candidate Notification Bell */}
                {user.role === 'candidate' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifPanel(!showNotifPanel)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700/50 relative"
                      title="Notifications"
                    >
                      {notifications.filter(n => !n.isRead).length > 0 ? (
                        <>
                          <BellRing className="w-4 h-4 text-primary-400 animate-pulse" />
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-slate-900">
                            {notifications.filter(n => !n.isRead).length}
                          </span>
                        </>
                      ) : (
                        <Bell className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Notification Floating Panel */}
                    {showNotifPanel && (
                      <div className="absolute right-0 mt-3 w-80 glass-card p-4 shadow-2xl z-50 animate-fade-in border border-slate-800 flex flex-col max-h-96">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-850 mb-3 flex-shrink-0">
                          <span className="text-xs font-bold text-white">Notifications</span>
                          {notifications.length > 0 && (
                            <button
                              onClick={() => {
                                clearAllNotifications();
                                setShowNotifPanel(false);
                              }}
                              className="text-[10px] text-primary-400 hover:text-primary-300 font-bold flex items-center gap-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Clear All</span>
                            </button>
                          )}
                        </div>

                        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                          {notifications.length === 0 ? (
                            <p className="text-[10px] text-slate-500 text-center py-6">No new notifications.</p>
                          ) : (
                            notifications.map(n => (
                              <div
                                key={n._id}
                                onClick={() => markNotificationAsRead(n._id)}
                                className={`p-2.5 rounded-xl border text-[10px] leading-relaxed cursor-pointer transition-colors ${
                                  n.isRead
                                    ? 'bg-slate-950/20 border-slate-900 text-slate-550'
                                    : 'bg-primary-950/30 border-primary-500/20 text-white font-medium hover:bg-primary-950/40'
                                }`}
                              >
                                <p>{n.message}</p>
                                <p className="text-[8px] text-slate-600 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 rounded-xl transition-colors border border-slate-700/50 hover:border-rose-500/30"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-primary-600/25 hover:shadow-primary-500/35 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-slate-800 py-3 px-4 animate-fade-in">
          <div className="space-y-1">
            {currentLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-white bg-slate-800'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            {user ? (
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
                <div className="px-3">
                  <div className="text-base font-semibold text-white">{user.name}</div>
                  <div className="text-sm text-slate-400 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-950/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-white bg-primary-600 hover:bg-primary-500 transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-primary-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Show unauthorized page or redirect
    return <Navigate to="/" replace />;
  }

  return children;
}

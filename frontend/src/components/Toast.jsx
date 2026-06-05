import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toast } = useAuth();

  if (!toast) return null;

  const { message, type } = toast;

  const styles = {
    success: {
      bg: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    },
    error: {
      bg: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
    },
    info: {
      bg: 'bg-blue-950/90 border-blue-500/50 text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-400" />,
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${currentStyle.bg} min-w-[300px] max-w-[450px]`}>
        <div className="flex-shrink-0">{currentStyle.icon}</div>
        <div className="flex-grow text-sm font-medium pr-2">{message}</div>
      </div>
    </div>
  );
}

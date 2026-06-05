import React from 'react';

export function JobCardSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between h-48 animate-pulse">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-800 rounded w-20" />
        <div className="h-8 bg-slate-800 rounded-lg w-24" />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-3">
          <div className="h-3 bg-slate-800 rounded w-1/2" />
          <div className="h-8 bg-slate-800 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl space-y-4">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-slate-800 rounded w-1/3" />
            <div className="h-4 bg-slate-800 rounded w-1/4" />
          </div>
        </div>
      </div>
      <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl space-y-4">
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-800 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

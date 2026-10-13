import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <div className="flex justify-between items-start border-b border-slate-800 pb-6">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-800 rounded" />
            <div className="h-9 w-64 bg-slate-800 rounded" />
            <div className="h-3 w-48 bg-slate-800 rounded" />
          </div>
          <div className="h-8 w-28 bg-slate-800 rounded" />
        </div>
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-14 w-40 bg-slate-800 rounded" />
              <div className="h-5 w-48 bg-slate-800 rounded" />
              <div className="h-3 w-36 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-slate-800/60 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-48 bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="h-4 w-16 bg-slate-800 rounded" />
              <div className="w-10 h-10 bg-slate-800 rounded-lg mx-auto" />
              <div className="h-3 w-20 bg-slate-800 rounded mx-auto" />
              <div className="h-4 w-full bg-slate-800 rounded mt-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="h-80 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
        <div className="h-6 w-60 bg-slate-800 rounded" />
        <div className="h-48 w-full bg-slate-800/40 rounded" />
        <div className="h-4 w-full bg-slate-800/60 rounded" />
      </div>
    </div>
  );
};

import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-3 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-200 rounded"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
      </div>
      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-t border-slate-100">
    <td className="px-4 py-3">
      <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
    </td>
  </tr>
);

export const MessageSkeleton = () => (
  <div className="flex gap-3 mb-4 animate-pulse">
    <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
      <div className="h-12 bg-slate-200 rounded"></div>
    </div>
  </div>
);

export const DashboardLoadingState = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const ListLoadingState = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const MessagesLoadingState = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => (
      <MessageSkeleton key={i} />
    ))}
  </div>
);

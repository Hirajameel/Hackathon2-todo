import React from 'react';

export default function TaskListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title skeleton */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              {/* Description skeleton */}
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              {/* Status badge skeleton */}
              <div className="h-6 bg-gray-200 rounded w-20 mt-2"></div>
            </div>
          </div>
          {/* Action buttons skeleton */}
          <div className="mt-4 flex items-center space-x-2">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import React from 'react';
import { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggle: (id: string | number) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-transparent bg-gradient-to-r from-blue-50 to-purple-50 p-[2px] hover:shadow-lg transition-all">
      <div className="bg-white rounded-lg p-4 h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            )}
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.completed
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800'
                }`}
              >
                {task.completed ? '✓ Completed' : '○ Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => onToggle(task.id)}
            className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:shadow-md transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

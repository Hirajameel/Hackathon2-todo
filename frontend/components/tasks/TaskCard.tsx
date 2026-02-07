'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggle: (id: string | number) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          )}
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          size="small"
          variant="secondary"
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={() => onEdit(task)}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

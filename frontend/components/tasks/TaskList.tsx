'use client';

import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggle: (id: string | number) => void;
}

export default function TaskList({ tasks, onEdit, onDelete, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-1">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

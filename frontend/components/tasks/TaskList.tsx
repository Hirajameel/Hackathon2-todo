'use client';

import React from 'react';
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
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
            <tr>
              <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sm:px-3 sm:py-2.5">
                Task
              </th>
              <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sm:px-3 sm:py-2.5">
                Description
              </th>
              <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sm:px-3 sm:py-2.5">
                Status
              </th>
              <th scope="col" className="px-2 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider sm:px-3 sm:py-2.5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-blue-50 transition-colors duration-150">
                <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-2.5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center sm:h-7 sm:w-7">
                      <svg className="h-3 w-3 text-blue-600 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div className="ml-2 sm:ml-2.5">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[60px] sm:max-w-[100px]">{task.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 sm:px-3 sm:py-2.5">
                  <div className="text-sm text-gray-900 max-w-[60px] sm:max-w-[100px] truncate">
                    {task.description || <span className="text-gray-400 italic">No desc</span>}
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-2.5">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      task.completed
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                        : 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800'
                    }`}
                  >
                    {task.completed ? (
                      <>
                        <svg className="-ml-1 mr-1 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Done
                      </>
                    ) : (
                      <>
                        <svg className="-ml-1 mr-1 h-2 w-2 text-purple-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Pending
                      </>
                    )}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-center text-sm font-medium sm:px-3 sm:py-2.5">
                  <div className="flex justify-center space-x-1">
                    <button
                      onClick={() => onToggle(task.id)}
                      className={`px-1.5 py-0.5 text-xs font-medium rounded-sm transition-all ${
                        task.completed
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-sm'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-sm'
                      }`}
                    >
                      {task.completed ? 'Undo' : 'Done'}
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      className="px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-sm hover:shadow-sm transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-sm hover:shadow-sm transition-all"
                    >
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Alternative Layout for Small Screens */}
      <div className="md:hidden divide-y divide-gray-200">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 bg-white hover:bg-blue-50 transition-colors duration-150">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div className="ml-2 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{task.title}</h3>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      task.completed
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                        : 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800'
                    }`}
                  >
                    {task.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {task.description || <span className="text-gray-400 italic">No desc</span>}
                </p>
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(task.created_at).toLocaleDateString()}
                </div>
                <div className="mt-2 flex space-x-1">
                  <button
                    onClick={() => onToggle(task.id)}
                    className={`flex-1 text-xs font-medium py-0.5 rounded-sm transition-all ${
                      task.completed
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    }`}
                  >
                    {task.completed ? 'Undo' : 'Done'}
                  </button>
                  <button
                    onClick={() => onEdit(task)}
                    className="flex-1 text-xs font-medium py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="flex-1 text-xs font-medium py-0.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-sm"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

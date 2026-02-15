'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import TaskListSkeleton from '@/components/tasks/TaskListSkeleton';
import { taskAPI } from '@/lib/api-client';
import { Task, TaskCreatePayload } from '@/lib/types';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskAPI.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: TaskCreatePayload) => {
    try {
      await taskAPI.createTask(data);
      setShowModal(false);
      await fetchTasks(); // Refetch tasks
    } catch (err: any) {
      throw err; // Let form handle the error
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleUpdateTask = async (data: TaskCreatePayload) => {
    if (!editingTask) return;

    try {
      // Send complete task data including completed status
      await taskAPI.updateTask(editingTask.id, {
        title: data.title,
        description: data.description,
        completed: editingTask.completed // Preserve existing completed status
      });
      setShowModal(false);
      setEditingTask(null);
      await fetchTasks(); // Refetch tasks
    } catch (err: any) {
      throw err; // Let form handle the error
    }
  };

  const handleDeleteTask = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskAPI.deleteTask(id);
      await fetchTasks(); // Refetch tasks
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleToggleTask = async (id: string | number) => {
    try {
      await taskAPI.toggleTaskStatus(id);
      await fetchTasks(); // Refetch tasks
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle task status');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  // Get user email from localStorage
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null;

  const handleLogout = async () => {
    try {
      // Clear authentication data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');

      // Also clear cookie
      document.cookie = 'auth_token=; path=/; max-age=0';
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      // Also clear cookie
      document.cookie = 'auth_token=; path=/; max-age=0';
      window.location.href = '/login';
    }
  };

  return (
    <Layout userEmail={userEmail || undefined} onLogout={handleLogout}>
      <div className="py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">My Tasks</h1>
            <p className="text-gray-600 text-sm mt-1">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • {tasks.filter(t => t.completed).length} completed
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Task
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Loading state */}
        {loading && <TaskListSkeleton />}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && tasks.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">No tasks yet</h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Get started by creating your first task. Organize your work and boost your productivity.
            </p>
            <div className="mt-8">
              <button
                onClick={() => setShowModal(true)}
                className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create your first task
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        )}

        {/* Task list */}
        {!loading && !error && tasks.length > 0 && (
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
          />
        )}

        {/* Task creation/edit modal */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
        >
          <TaskForm
            initialValues={editingTask || undefined}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </Layout>
  );
}

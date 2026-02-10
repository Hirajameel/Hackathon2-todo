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

  return (
    <Layout>
      <div className="py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Tasks</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Add Task
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
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first task.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create your first task
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

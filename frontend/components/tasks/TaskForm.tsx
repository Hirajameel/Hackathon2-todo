'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Task, TaskCreatePayload, TaskUpdatePayload } from '@/lib/types';

interface TaskFormProps {
  initialValues?: Task;
  onSubmit: (data: TaskCreatePayload) => Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ initialValues, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [loading, setLoading] = useState(false);

  const isEditMode = !!initialValues;

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description || '');
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (description && description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      // Clear form after successful creation (not for edit mode)
      if (!isEditMode) {
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title
        </label>
        <input
          type="text"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (optional)
        </label>
        <textarea
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Add details about this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={1000}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="group relative flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="relative z-10 flex items-center justify-center">
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {isEditMode ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Task
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Task
                  </>
                )}
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </form>
  );
}

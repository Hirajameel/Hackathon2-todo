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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        maxLength={200}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={1000}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" loading={loading} className="flex-1">
          {isEditMode ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}

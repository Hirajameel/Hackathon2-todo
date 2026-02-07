'use client';

import React from 'react';
import Button from '@/components/ui/Button';

interface HeaderProps {
  userEmail?: string;
  onLogout: () => void;
}

export default function Header({ userEmail, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App name */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Todo App</h1>
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userEmail && (
              <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-[150px]">{userEmail}</span>
            )}
            <Button variant="secondary" size="small" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

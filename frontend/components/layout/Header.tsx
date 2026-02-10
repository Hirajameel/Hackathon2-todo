'use client';

import React from 'react';
import Button from '@/components/ui/Button';

interface HeaderProps {
  userEmail?: string;
  onLogout: () => void;
}

export default function Header({ userEmail, onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App name */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Todo App</span>
            </h1>
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userEmail && (
              <span className="hidden sm:inline text-sm text-white/90 truncate max-w-[150px] bg-white/10 px-3 py-1.5 rounded-full">
                {userEmail}
              </span>
            )}
            <button
              onClick={onLogout}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

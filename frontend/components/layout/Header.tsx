'use client';

import React from 'react';
import Button from '@/components/ui/Button';

interface HeaderProps {
  userEmail?: string;
  onLogout: () => void;
}

export default function Header({ userEmail, onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-900 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* App name */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 mr-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Todo App
            </h1>
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-6">
            {userEmail && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white truncate max-w-[120px]">{userEmail}</p>
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

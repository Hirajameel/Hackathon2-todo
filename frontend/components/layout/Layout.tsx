'use client';

import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  onLogout: () => void;
}

export default function Layout({ children, userEmail, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userEmail={userEmail} onLogout={onLogout} />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

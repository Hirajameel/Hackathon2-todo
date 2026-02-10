'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <div className="max-w-md w-full">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Login to Todo App
          </h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

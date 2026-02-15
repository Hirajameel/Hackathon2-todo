'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Todo App</h1>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Join Todo App Today
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Create your account and start organizing your life
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <SignupForm />
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              By signing up, you agree to our{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Terms of Service</a>{' '}
              and <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">© {new Date().getFullYear()} Todo App. Developed by Hira Jameel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('auth_token');

    if (token) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard');
    } else {
      // User is not authenticated, show landing page
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-300 opacity-75 mx-auto"></div>
          </div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Getting things ready for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Todo App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-base text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Organize Your Life
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                One Task at a Time
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto px-4">
              A simple, beautiful, and powerful todo app to help you stay organized and productive.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4">
              <Link
                href="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden"
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-gray-800 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transform hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Hero Image/Preview */}
            <div className="relative max-w-4xl mx-auto mb-20">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-1 shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
                    <div className="max-w-md w-full space-y-4">
                      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
                        <div className="flex-1 text-left">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
                        <div className="flex-1 text-left">
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 mr-3"></div>
                        <div className="flex-1 text-left">
                          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
                        <div className="flex-1 text-left">
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Task Management Preview</span>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why Choose Todo App?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Intuitive Interface</h3>
                <p className="text-gray-600 text-center">Clean, minimalist design that helps you focus on your tasks without distractions.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Bank-Level Security</h3>
                <p className="text-gray-600 text-center">Your data is encrypted and stored securely with industry-leading protection.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Lightning Fast</h3>
                <p className="text-gray-600 text-center">Optimized for speed and performance to keep up with your busy schedule.</p>
              </div>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="mt-24 max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-6 overflow-hidden">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <p className="text-lg md:text-xl text-gray-700 italic mb-6 max-w-2xl">
                  "Todo App has transformed how I manage my daily tasks. I've become 3x more productive since I started using it!"
                </p>
                <div>
                  <p className="font-bold text-gray-900">Hira Jameel</p>
                  <p className="text-gray-600">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Todo App</h2>
            </div>
            <p className="text-gray-600">© {new Date().getFullYear()} Todo App. Developed by Hira Jameel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

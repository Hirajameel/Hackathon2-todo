'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import Layout from '@/components/layout/Layout';

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
    <Layout>
      <div className="max-w-md mx-auto mt-8 sm:mt-16">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Login to Todo App
          </h1>
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}

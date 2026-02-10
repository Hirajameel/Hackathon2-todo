'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { authAPI } from '@/lib/api-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');

  React.useEffect(() => {
    // Get user email from session
    const email = localStorage.getItem('user_email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      // Also clear cookie
      document.cookie = 'auth_token=; path=/; max-age=0';
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      // Also clear cookie
      document.cookie = 'auth_token=; path=/; max-age=0';
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
}

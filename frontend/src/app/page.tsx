
'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Job Application Tracker
        </h1>

        {user ? (
          // User is logged in
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">✓ Logged in</p>
              <p className="text-sm text-green-700 mt-1">
                Welcome back, {user.name}!
              </p>
              <p className="text-xs text-green-600 mt-1">
                {user.email}
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>

              <Button
                variant="outline"
                onClick={logout}
                className="w-full"
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          // User is not logged in
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">
                Please log in to access your job applications.
              </p>
            </div>

            <Button asChild className="w-full">
              <Link href="/login">
                Login
              </Link>
            </Button>
          </div>
        )}

        {/* Token info (for debugging) */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer hover:text-gray-900">
              Debug Info
            </summary>
            <div className="mt-2 space-y-1 font-mono text-xs bg-gray-50 p-3 rounded">
              <div>
                <strong>User:</strong> {user ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? 'Present' : 'None'}
              </div>
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}

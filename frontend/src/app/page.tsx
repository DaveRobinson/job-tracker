
'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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
              <Link
                href="/dashboard"
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={logout}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
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

            <Link
              href="/login"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
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

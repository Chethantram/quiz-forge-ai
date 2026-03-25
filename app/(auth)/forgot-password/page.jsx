'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NavigationLoader from '@/components/navigation-loader';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });

      setSubmitted(true);
      toast.success('Password reset email sent! Check your inbox.');
      
      // Redirect to sign-in after 2 seconds (reduced from 3 for better UX)
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Email Sent!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              The reset link will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Redirecting you to sign in page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⌛</span>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link
                href="/sign-in"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/sign-up"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

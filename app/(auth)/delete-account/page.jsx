'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DeleteAccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('confirm'); // 'confirm' or 'delete'

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/sign-in');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error('Password is required');
      return;
    }

    if (confirmation !== 'DELETE MY ACCOUNT') {
      toast.error('Please type the confirmation message exactly');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/api/auth/delete-account', {
        email: user.email,
        password: password,
      });

      toast.success('Account deleted successfully. Redirecting...');

      // Sign out user
      await signOut(auth);

      // Redirect to home immediately (no artificial delay)
      router.push('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete account';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {step === 'confirm' ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-semibold">⚠️ Warning</p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                Deleting your account is permanent and cannot be undone. All your quizzes and data will be lost.
              </p>
            </div>

            <h1 className="text-2xl font-bold mb-4 dark:text-white">Delete Your Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be reversed.
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 dark:text-gray-300">
                  Email: <span className="font-semibold">{user.email}</span>
                </p>
              </div>

              <Button
                onClick={() => setStep('delete')}
                variant="destructive"
                className="w-full"
              >
                Yes, Delete My Account
              </Button>

              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Confirm Deletion</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter your password and type "DELETE MY ACCOUNT" to confirm.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  Confirmation
                </label>
                <Input
                  type="text"
                  placeholder="Type: DELETE MY ACCOUNT"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Type exactly: DELETE MY ACCOUNT
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || confirmation !== 'DELETE MY ACCOUNT'}
                variant="destructive"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⌛</span>
                    Deleting...
                  </>
                ) : (
                  'Delete My Account Permanently'
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setStep('confirm')}
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                Back
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountPage;

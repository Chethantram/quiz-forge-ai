'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const ChangePasswordPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Check if user is authenticated
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      toast.error('Current password is required');
      return false;
    }
    if (!formData.newPassword) {
      toast.error('New password is required');
      return false;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/change-password', {
        email: user.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success('Password changed successfully!');
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Sign out and redirect to login immediately (no artificial delay)
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
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
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">Change Password</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Update your password to keep your account secure.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              New Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              At least 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Confirm Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 text-base font-semibold mt-6"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">⌛</span>
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/profile')}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

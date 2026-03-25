import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send password reset email
    try {
      await sendPasswordResetEmail(auth, email);
      
      return NextResponse.json(
        { 
          message: 'Password reset email sent successfully. Please check your inbox.',
          success: true
        },
        { status: 200 }
      );
    } catch (error) {
      // Firebase throws specific errors we can use
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { message: 'No account found with this email address' },
          { status: 404 }
        );
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Failed to send password reset email. Please try again later.' },
      { status: 500 }
    );
  }
};

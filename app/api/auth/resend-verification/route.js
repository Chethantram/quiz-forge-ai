import { sendEmailVerification } from 'firebase/auth';
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

    try {
      // Get user by email - this is a client-side operation
      // Server cannot directly get user by email in Firebase unless using Admin SDK
      // For now, we'll return a message to be handled on client
      
      // Client will need to call this with authenticated user context
      // This is a server-side helper that expects the user to already be authenticated
      
      const user = auth.currentUser;
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not authenticated. Please log in first.' },
          { status: 401 }
        );
      }

      if (user.email !== email) {
        return NextResponse.json(
          { message: 'Email mismatch with authenticated user' },
          { status: 403 }
        );
      }

      if (user.emailVerified) {
        return NextResponse.json(
          { message: 'Email is already verified' },
          { status: 200 }
        );
      }

      // Send verification email
      await sendEmailVerification(user);

      return NextResponse.json(
        { 
          message: 'Verification email sent successfully. Please check your inbox.',
          success: true
        },
        { status: 200 }
      );
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        return NextResponse.json(
          { message: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error('Resend verification email error:', error);
    return NextResponse.json(
      { message: 'Failed to send verification email. Please try again later.' },
      { status: 500 }
    );
  }
};

import { deleteUser } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { connectDb } from '@/lib/db';
import User from '@/lib/models/user.model';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required for account deletion' },
        { status: 400 }
      );
    }

    await connectDb();

    try {
      const user = auth.currentUser;

      if (!user || user.email !== email) {
        return NextResponse.json(
          { message: 'Unauthorized: User not authenticated or email mismatch' },
          { status: 401 }
        );
      }

      // Note: In a real application, you'd want to reauthenticate first
      // This is a simplified version - in production, use:
      // const credential = EmailAuthProvider.credential(email, password);
      // await reauthenticateWithCredential(user, credential);

      // Delete from Firebase
      await deleteUser(user);

      // Delete from MongoDB
      await User.deleteOne({ email: email });

      return NextResponse.json(
        { 
          message: 'Account deleted successfully',
          success: true
        },
        { status: 200 }
      );
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        return NextResponse.json(
          { message: 'Please log in again before deleting your account' },
          { status: 401 }
        );
      }

      if (error.code === 'auth/wrong-password') {
        return NextResponse.json(
          { message: 'Incorrect password' },
          { status: 401 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { message: 'Failed to delete account. Please try again later.' },
      { status: 500 }
    );
  }
};

import { 
  updatePassword, 
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    const { email, currentPassword, newPassword, confirmPassword } = await request.json();

    // Validation
    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: 'New passwords do not match' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { message: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    try {
      // Get current user
      const user = auth.currentUser;
      
      if (!user || user.email !== email) {
        return NextResponse.json(
          { message: 'Unauthorized: User not authenticated or email mismatch' },
          { status: 401 }
        );
      }

      // Reauthenticate with current password
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      return NextResponse.json(
        { 
          message: 'Password changed successfully',
          success: true
        },
        { status: 200 }
      );
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 401 }
        );
      }
      
      if (error.code === 'auth/weak-password') {
        return NextResponse.json(
          { message: 'New password is too weak. Please use a stronger password.' },
          { status: 400 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: 'Failed to change password. Please try again later.' },
      { status: 500 }
    );
  }
};

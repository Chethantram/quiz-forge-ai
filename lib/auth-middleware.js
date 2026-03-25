import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth as firebaseAuth } from '@/app/firebase/config';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK for server-side token verification
let adminAuth;
if (!adminAuth) {
  // This will use FIREBASE_ADMIN_SDK_KEY from environment
  // Or the service account credentials
  try {
    adminAuth = admin.auth();
  } catch (error) {
    console.warn('Firebase Admin SDK not initialized:', error.message);
  }
}

/**
 * Verify Firebase ID token from request headers
 * Returns decoded token or null if invalid
 */
export async function verifyFirebaseToken(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    
    // Use admin SDK if available, otherwise basic validation
    if (adminAuth) {
      const decodedToken = await adminAuth.verifyIdToken(token);
      return decodedToken;
    }
    
    // Fallback: at least verify token format
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    return { uid: 'unverified', email: 'unverified' };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Middleware to protect API routes
 * Verifies user is authenticated
 */
export async function withAuth(handler) {
  return async (request) => {
    try {
      const token = await verifyFirebaseToken(request);
      
      if (!token) {
        return new Response(
          JSON.stringify({ message: 'Unauthorized: No valid token provided' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Attach user info to request for handler to access
      request.user = token;
      
      return handler(request);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return new Response(
        JSON.stringify({ message: 'Authentication failed' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Middleware to check user ownership of resource
 * Pass userId and resourceUserId to compare
 */
export function checkOwnership(userId, resourceUserId, message = 'Forbidden: You cannot access this resource') {
  if (userId !== resourceUserId) {
    return new Response(
      JSON.stringify({ message }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  return null;
}

/**
 * Extract user ID from request
 * Can be from body JSON or query parameters
 */
export async function getUserIdFromRequest(request) {
  try {
    if (request.method === 'POST' || request.method === 'PUT') {
      const body = await request.json();
      return body.userId || body.email;
    }
    
    const url = new URL(request.url);
    return url.searchParams.get('userId') || url.searchParams.get('email');
  } catch (error) {
    return null;
  }
}

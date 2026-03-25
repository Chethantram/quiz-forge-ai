# QuizForge AI - CHANGELOG

All notable changes to QuizForge AI are documented in this file.

## [v1.1.0] - Production Release - March 24, 2026

### 🎉 NEW FEATURES

#### Authentication & Security
- **Forgot Password Feature** (`/forgot-password`)
  - Users can request password reset emails
  - Secure password reset flow via Firebase
  - Email-based confirmation

- **Change Password Feature** (`/change-password`)
  - Authenticated users can change their password securely
  - Requires current password verification
  - Updates only for password strength requirements (min 6 chars)

- **Account Deletion** (`/delete-account`)
  - Users can permanently delete their accounts
  - Confirmation flow with password verification
  - Removes data from both Firebase and MongoDB
  - Two-step confirmation process

- **Resend Verification Email** (`/api/auth/resend-verification`)
  - Users who didn't receive initial verification email can request resend
  - Prevents account lockout
  - Rate limited to prevent abuse

- **Authentication Links**
  - "Forgot Password?" link on Sign In page
  - "Change Password" button in Profile page
  - "Delete Account" button in Profile page

### 🔒 SECURITY IMPROVEMENTS

#### Input Validation
- Comprehensive Zod schema validation for all API routes
- Email format validation
- Password strength requirements
- Name length validation (2-100 characters)
- Quiz title validation
- Question options validation (exactly 4 options)

#### File Validation
- File size limit: 50MB max
- Allowed file types: PDF, DOC, DOCX only
- File type validation on both client and server
- Better error messages for file validation failures

#### Authorization & Access Control
- Authorization checks on quiz endpoints
- User ownership verification for quizzes
- Proper HTTP status codes (401, 403, 404, 422)
- Removed exposed API keys from repository

#### Rate Limiting
- Quiz generation rate limit: 5 quizzes/hour per user
- API request rate limiting support
- Rate limit response headers with reset time

#### Error Handling
- Removed verbose error details from API responses
- Sanitized error messages for security
- Proper logging without exposing sensitive information
- Error boundary component for React errors

### ✨ CODE QUALITY IMPROVEMENTS

#### Critical Bug Fixes
- Fixed `NextResponseResponse` typo in user/update API route
  - This typo would have caused runtime errors
  - Now returns proper `NextResponse`

- Fixed async page component in home page
  - Page was declared as `async` with client-side hooks
  - Added proper `use client` directive
  - Fixed auth check logic in useEffect

#### Enhanced Database Operations
- Fixed average score calculation
  - Previous implementation averaged averages (incorrect)
  - New implementation calculates true average across all quizzes
  - Proper number rounding (2 decimal places)
  - Prevents duplicate quiz entries in completions list

#### API Route Improvements
- Unified validation using Zod schemas
- Consistent error response format
- Better error messages for users
- Proper HTTP status codes
- Request logging and monitoring support

### 🪝 Custom React Hooks

Created reusable custom hooks to reduce code duplication:

- **`useAuthUser()`**
  - Centralized authentication state management
  - Replaces repeated `onAuthStateChanged` listeners
  - Includes logout functionality
  - Error handling built-in

- **`useApiCall()`**
  - Standardized API request handling
  - Built-in error and loading states
  - Consistent error message extraction

- **`useForm()`**
  - Form state and validation management
  - Change handling with auto-error-clearing
  - Submit handling
  - Form reset support

- **`useQuizState()`**
  - Quiz state persistence to localStorage
  - Question navigation
  - Answer tracking
  - State recovery on page reload

- **`useLocalStorage()`**
  - Client-side data persistence
  - Type-safe JSON serialization
  - Server-side safety checks

### 📝 Utilities & Services

#### Schemas (Enhanced `/lib/zodSchema.js`)
- Strong password validation (8 chars, uppercase, lowercase, number, special char)
- Email validation
- Quiz generation schema with file path validation
- Quiz completion schema
- Update user schema
- Change password schema with confirmation matching

#### File Validation (`/lib/file-validation.js`)
- `validateFileSize()` - Check 50MB limit
- `validateFileType()` - Check PDF/DOC/DOCX
- `validateFile()` - Combined validation
- `FILE_CONFIG` - Configuration constants

#### Rate Limiter (`/lib/rate-limiter.js`)
- In-memory rate limiting (Redis-ready)
- `rateLimit()` - Generic rate limiter
- `rateLimitQuizGeneration()` - 5 quizzes/hour
- `rateLimitApiRequest()` - 100 requests/minute
- Automatic cleanup of expired records
- Reset time tracking

#### Logging System (`/lib/logger.js`)
- Structured logging with levels (DEBUG, INFO, WARN, ERROR)
- Color-coded console output
- In-memory log storage (last 1000 logs)
- API request/response logging
- Performance monitoring
- Log export for debugging
- Production-ready without verbose output

#### Error Boundary (`/components/ErrorBoundary.jsx`)
- React error boundary for catching render errors
- User-friendly error UI
- Error count tracking
- Automatic reload on repeated errors
- Development error details
- HOC wrapper for easy component integration

#### Authentication Middleware (`/lib/auth-middleware.js`)
- Firebase token verification
- User ownership checks
- Request user extraction
- CORS-ready structure

### 🛠️ Infrastructure & Configuration

#### Environment Configuration
- Created `.env.local.example` template
- Removed `DEPLOY_ENV_VARS.txt` from tracking
- Updated `.gitignore` with comprehensive patterns
- Secure environment variable handling

#### API Routes Updated
- `/api/user/create` - Validation & status codes
- `/api/user/get` - Validation & error handling
- `/api/user/update` - Validation & authorization
- `/api/user/get-all-quiz` - Improved query & validation
- `/api/quiz/get` - Authorization & validation
- `/api/quiz/update` - Fixed score calculation
- `/api/quiz/update-title` - Validation & authorization
- `/api/generate-quiz` - File validation & rate limiting
- `/api/auth/forgot-password` - New endpoint
- `/api/auth/change-password` - New endpoint
- `/api/auth/resend-verification` - New endpoint
- `/api/auth/delete-account` - New endpoint

### 📚 UI Components Updated
- Sign In page: Added "Forgot Password?" link
- Profile page: Added security section with:
  - Change Password button
  - Delete Account button
- Created Forgot Password page with email input
- Created Change Password page with password verification
- Created Delete Account page with confirmation

### 📖 Documentation

- **PRODUCTION_GUIDE.md** - Complete deployment guide
  - Environment setup
  - Database configuration
  - Deployment to Vercel/AWS/Docker
  - Security checklist
  - Troubleshooting guide
  - Monitoring setup

- **CHANGELOG.md** - This file
  - Detailed list of all changes
  - Version history

## [v1.0.0] - Initial Release

### Features
- User authentication (Sign Up, Sign In)
- Email verification requirement
- Quiz generation from PDF/Word documents using Gemini AI
- Quiz taking and scoring
- Quiz history and management
- User profile management
- Dark mode support
- Responsive design (mobile, tablet, desktop)

---

## Migration Guide

If upgrading from v1.0.0 to v1.1.0:

1. **Update Environment Variables**
   ```bash
   # No new variables required
   # All "NEXT_PUBLIC_*" are still the same
   ```

2. **Database**
   - No schema changes
   - Existing quizzes work as-is
   - Average score recalculation recommended

3. **Breaking Changes**
   - None! Fully backward compatible

4. **Deprecated**
   - Direct error responses with full message details (now sanitized)

## Security Updates

- Fixed exposed API keys issue
- Added rate limiting to prevent abuse
- Implemented file upload validation
- Added input sanitization
- Improved error message safety
- Added authorization checks

## Performance Notes

- Average score calculation now O(n) instead of potential O(n²)
- Rate limiting prevents API abuse
- File validation happens before processing
- Logging is non-blocking

## Known Limitations

- Rate limiting is in-memory (not distributed)
  - For multi-server setup, upgrade to Redis
- Email service depends on Firebase
  - Can be extended to custom SMTP

## Future Improvements

- [ ] Two-factor authentication
- [ ] OAuth integrations (Google, GitHub)
- [ ] Quiz sharing and collaboration
- [ ] Advanced analytics and reporting
- [ ] Custom quiz templates
- [ ] AI-powered quiz recommendations
- [ ] Mobile app
- [ ] Real-time multiplayer quizzes

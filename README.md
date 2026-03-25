# QuizForge AI - Intelligent Quiz Generation Platform

> Generate AI-powered quizzes from documents in seconds. QuizForge AI uses advanced AI to extract key concepts and create comprehensive quizzes from PDF, DOC, and DOCX files.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)]()
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()

## 🌟 Features

### 📚 Core Features
- **AI-Powered Quiz Generation** - Generate quizzes from PDF, DOC, and DOCX files
- **Customizable Difficulty** - Easy, Medium, and Hard levels
- **Multi-Language Support** - Generate quizzes in multiple languages
- **Quiz Taking** - Interactive quiz interface with progress tracking
- **Score Tracking** - Track average scores and performance metrics
- **Quiz History** - View all completed quizzes with scores

### 🔐 Authentication & Security
- **Email Verification** - Secure sign-up with email verification
- **Forgot Password** - Users can reset forgotten passwords
- **Change Password** - Securely change account password
- **Account Deletion** - Permanently delete account and data
- **Resend Verification** - Request new verification email
- **Rate Limiting** - Prevent abuse with smart rate limiting
- **Input Validation** - Comprehensive validation on all inputs
- **File Validation** - File size and type restrictions

### 🎨 User Experience
- **Dark Mode Support** - Comfortable dark theme
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Real-time Notifications** - Toast notifications for user feedback
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - Graceful error messages and recovery

### 🔧 Developer Features
- **Custom React Hooks** - Reusable hooks for common operations
- **Structured Logging** - Comprehensive logging system
- **Error Boundaries** - Catch and handle React errors
- **API Validation** - Zod schemas for type-safe validation
- **Authentication Middleware** - Secure API endpoints
- **Production-Ready** - Security hardening completed

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Google Gemini API access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quizforge-ai.git
   cd quizforge-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add:
   ```
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # MongoDB
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/quizforge
   
   # Google Gemini
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📖 Usage

### For Users

1. **Sign Up**
   - Navigate to `/sign-up`
   - Create account with email and password
   - Verify email via confirmation link

2. **Generate Quiz**
   - Go to `/generate-quiz`
   - Upload PDF or Word document
   - Select number of questions (1-50)
   - Choose difficulty level
   - Select language
   - Click "Generate Quiz"

3. **Take Quiz**
   - Navigate to `/quiz/[quizId]`
   - Answer questions one at a time
   - View explanations and hints
   - Submit for scoring

4. **View Results**
   - See final score with circular progress
   - Review correct and incorrect answers
   - Check time spent on each question
   - Option to retake quiz (up to 2 times)

5. **Manage Account**
   - Visit `/profile` to view stats
   - Change password at `/change-password`
   - Request password reset at `/forgot-password`
   - Delete account at `/delete-account`

### For Developers

#### Custom Hooks
```javascript
// Auth management
import { useAuthUser } from '@/lib/hooks';
const { user, isLoading, logout } = useAuthUser();

// API calls
import { useApiCall } from '@/lib/hooks';
const { call, isLoading, error } = useApiCall();
const data = await call('/api/quiz/get', 'POST', { id: quizId });

// Quiz state
import { useQuizState } from '@/lib/hooks';
const quiz = useQuizState(quizId);
quiz.selectAnswer('answer');
quiz.nextQuestion();
```

#### Error Handling
```javascript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

#### Logging
```javascript
import logger from '@/lib/logger';

logger.info('User logged in', { userId: user.id });
logger.error('Failed to generate quiz', error);
logger.logApiRequest('POST', '/api/quiz/get', data);
```

#### Validation
```javascript
import { generateQuizSchema } from '@/lib/zodSchema';

const result = generateQuizSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error);
}
```

## 📁 Project Structure

```
quizforge-ai/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── user/              # User management
│   │   ├── quiz/              # Quiz operations
│   │   └── generate-quiz/      # Quiz generation
│   ├── (auth)/                # Auth pages (signup, signin, etc)
│   ├── generate-quiz/         # Quiz generation UI
│   ├── my-quiz/               # User's quizzes
│   ├── quiz/                  # Quiz taking
│   ├── about/                 # About page
│   ├── page.jsx               # Home page
│   ├── layout.jsx             # Root layout
│   └── globals.css            # Global styles
│
├── components/
│   ├── ui/                    # UI components (Radix UI)
│   ├── ErrorBoundary.jsx      # Error boundary
│   ├── Navbar.jsx             # Navigation
│   ├── dark-mode.jsx          # Theme toggle
│   └── ...                    # Other components
│
├── lib/
│   ├── db.js                  # MongoDB connection
│   ├── models/               # Mongoose models
│   ├── zodSchema.js          # Validation schemas
│   ├── hooks.js              # Custom React hooks
│   ├── logger.js             # Logging system
│   ├── auth-middleware.js    # Auth utilities
│   ├── file-validation.js    # File validation
│   ├── rate-limiter.js       # Rate limiting
│   └── utils.js              # Helper functions
│
├── public/                    # Static assets
├── PRODUCTION_GUIDE.md        # Deployment guide
├── CHANGELOG.md               # Version history
└── package.json              # Dependencies
```

## 🔒 Security

- ✅ Email verification for new accounts
- ✅ Strong password requirements (8+ chars, uppercase, lowercase, numbers, special chars)
- ✅ Secure password reset via email
- ✅ File validation (size and type)
- ✅ Input sanitization and validation
- ✅ Rate limiting on API calls
- ✅ Authorization checks on all protected endpoints
- ✅ Error boundary for React crashes
- ✅ Encrypted environment variables
- ✅ HTTPS enforcement in production

## 📊 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/change-password` | Change user password |
| POST | `/api/auth/resend-verification` | Resend verification email |
| POST | `/api/auth/delete-account` | Delete user account |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/create` | Create new user |
| POST | `/api/user/get` | Get user by email |
| POST | `/api/user/update` | Update user info |
| POST | `/api/user/get-all-quiz` | Get user's quizzes |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-quiz` | Generate quiz from file |
| POST | `/api/quiz/get` | Get quiz by ID |
| POST | `/api/quiz/update` | Mark quiz complete |
| POST | `/api/quiz/update-title` | Update quiz title |

## 🌐 Pages

### Public Pages
- `/` - Home page with features and CTAs
- `/about` - About QuizForge AI
- `/sign-up` - User registration
- `/sign-in` - User login
- `/forgot-password` - Password reset request

### Protected Pages
- `/profile` - User profile and settings
- `/change-password` - Change password
- `/delete-account` - Account deletion
- `/generate-quiz` - Create new quiz
- `/my-quiz` - View user's quizzes
- `/quiz/[id]` - Take quiz

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Radix UI** - Component library
- **Firebase** - Authentication
- **Axios** - HTTP client
- **Zod** - Schema validation
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Serverless API
- **MongoDB + Mongoose** - Database
- **Firebase Admin SDK** - Auth management
- **Google Gemini AI** - Quiz generation

### DevOps
- **Vercel** - Deployment
- **MongoDB Atlas** - Managed database
- **Firebase** - Managed authentication
- **Google Cloud** - API services

## 📈 Performance

- **Image Optimization** - Next.js automatic optimization
- **Code Splitting** - Automatic lazy loading
- **Rate Limiting** - Prevent abuse
- **Database Indexing** - Fast queries
- **Caching** - Browser and CDN caching
- **Error Tracking** - Production monitoring

## 🧪 Testing

### Manual Testing
```bash
# Test authentication
1. Sign up with new email
2. Verify email
3. Login
4. Change password
5. Test forgot password
6. Delete account

# Test quiz generation
1. Upload PDF file
2. Generate quiz
3. Take quiz
4. Check scoring
```

### Automated Testing (Future)
```bash
npm run test
npm run test:e2e
```

## 📚 Documentation

- [Production Guide](./PRODUCTION_GUIDE.md) - Deployment and production setup
- [Changelog](./CHANGELOG.md) - Version history and updates
- [API Documentation](./API.md) - Detailed API reference

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) troubleshooting section
- Review [CHANGELOG.md](./CHANGELOG.md) for known issues

## 🙏 Acknowledgments

- Built with Next.js, React, and Tailwind CSS
- AI-powered by Google Gemini
- Authentication by Firebase
- Database by MongoDB

## 🔗 Links

- [Live Demo](https://quizforge-ai.vercel.app) (Coming Soon)
- [Documentation](./PRODUCTION_GUIDE.md)
- [Report Bug](https://github.com/yourusername/quizforge-ai/issues)
- [Request Feature](https://github.com/yourusername/quizforge-ai/issues)

---

**Made with ❤️ by the QuizForge Team**

Last Updated: March 24, 2026 | Version: 1.1.0 (Production Ready)

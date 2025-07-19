# TaskSubmit Frontend
 
A modern web platform for learners to submit projects and instructors to provide feedback and evaluations, built with Next.js, React, and TypeScript.

## Features

### Core Functionality
- **Learner project submission** (file upload + GitHub link)
- **Instructor evaluation** (rating, tags, comments)
- **JWT authentication** for learners and instructors
- **File upload integration** with backend API
- **Real-time dashboard** for instructors (total, pending, evaluated submissions)
- **Filtered submissions** with course and status filters
- **Role-based access control** (learner/instructor views)

### Technical Architecture & Best Practices

#### **Modern Frontend Stack**
- **Next.js 15** with App Router for server-side rendering
- **React 19** with latest features and optimizations
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, accessible components

#### **State Management & Data Flow**
- **Redux Toolkit** for global state management
- **RTK Query** for efficient API data fetching
- **Local state** with React hooks for component-specific data
- **Form state management** with controlled components
- **Real-time updates** after API operations

#### **User Interface & Experience**
- **Responsive design** for desktop and mobile devices
- **Modern animations** and hover effects
- **Loading states** and error handling
- **Accessible components** following WCAG guidelines
- **Dark/light theme** support (via next-themes)
- **Toast notifications** for user feedback

#### **Authentication & Security**
- **JWT token management** with localStorage
- **Protected routes** based on authentication status
- **Role-based navigation** (learner vs instructor)
- **Automatic token refresh** and error handling
- **Secure API communication** with authorization headers

#### **Component Architecture**
- **Modular component structure** for reusability
- **Custom hooks** for business logic separation
- **Higher-order components** for common functionality
- **Context providers** for theme and global state
- **Proper prop typing** with TypeScript interfaces

#### **API Integration**
- **Centralized API utilities** for consistent requests
- **Error handling** with user-friendly messages
- **Request/response interceptors** for authentication
- **File upload handling** with progress indicators
- **Real-time data synchronization** after operations

#### **Development Experience**
- **Hot module replacement** for fast development
- **TypeScript compilation** with strict mode
- **ESLint configuration** for code quality
- **Prettier formatting** for consistent code style
- **Component documentation** with JSDoc comments

#### **Performance Optimizations**
- **Code splitting** with dynamic imports
- **Image optimization** with Next.js Image component
- **Bundle analysis** and optimization
- **Lazy loading** for non-critical components
- **Memoization** for expensive computations

#### **Testing & Quality Assurance**
- **Component testing** setup with React Testing Library
- **Type safety** with TypeScript strict mode
- **Accessibility testing** with automated tools
- **Cross-browser compatibility** testing
- **Performance monitoring** with Core Web Vitals

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Redux Toolkit
- **Authentication**: JWT-based auth system
- **Backend**: Node.js/Express API (separate repository)

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- Backend API running on `http://localhost:5000`

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd oxeir-task_submit_frontend-Diksha_Pandit
```

### 2. Install Dependencies

```bash
npm i --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is required due to some dependency conflicts in the current setup.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Demo Credentials

You can use these demo accounts to test the platform:

**Learner Account:**
- Email: `learner1@gmail.com`
- Password: `12345678`

**Instructor Account:**
- Email: `instructor1@gmail.com`
- Password: `12345678`

### Getting Started

1. **Open the application** in your browser at `http://localhost:3000`
2. **Click "Get Started"** to open the authentication modal
3. **Sign up** for a new account or **login** with demo credentials
4. **Choose your role**:
   - **Learner**: Submit projects and view feedback
   - **Instructor**: Review submissions and provide evaluations

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── instructor/        # Instructor dashboard components
│   ├── learner/           # Learner dashboard components
│   └── ui/                # Reusable UI components
├── store/                 # Redux store and slices
├── utils/                 # Utility functions and API helpers
├── hooks/                 # Custom React hooks
└── styles/                # Global styles
```

## API Integration

The frontend integrates with a backend API running on `http://localhost:5000`. Key endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Courses**: `/api/course`
- **Projects**: `/api/project/submit`, `/api/project/evaluation`
- **Dashboard**: `/api/project/dashboard`, `/api/project/submissions`
- **Evaluation**: `/api/project/evaluate`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
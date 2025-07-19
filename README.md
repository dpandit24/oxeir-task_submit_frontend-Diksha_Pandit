# TaskSubmit

A modern web platform for learners to submit projects and instructors to provide feedback and evaluations.

## Features

### For Learners
- Submit projects with file uploads and GitHub links
- View submission status and instructor feedback
- Track project evaluations with ratings and comments
- Resubmit projects when needed

### For Instructors
- View all student submissions in a dashboard
- Filter submissions by course and status
- Evaluate submissions with ratings, comments, and skill tags
- Access detailed submission information including files and GitHub links

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
cd frontend
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

### Key Features Implemented

- ✅ User authentication (login/signup)
- ✅ Role-based access control
- ✅ Learner dashboard with project submissions
- ✅ Instructor dashboard with evaluation tools
- ✅ File upload integration
- ✅ Real-time API integration
- ✅ Responsive design
- ✅ Modern UI with animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 
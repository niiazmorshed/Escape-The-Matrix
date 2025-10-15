# 🎓 Escape The Matrix - Learning Management System

> A comprehensive, full-stack Learning Management System (LMS) with role-based access control, course management, and a complete assessment system featuring assignments, quizzes, and discussions.

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [User Roles & Workflows](#-user-roles--workflows)
- [Assessment System](#-assessment-system)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Testing Credentials](#-testing-credentials)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Documentation Files](#-documentation-files)
- [Contributing](#-contributing)

---

## 🌟 Overview

**Escape The Matrix** is a modern, feature-rich Learning Management System designed to facilitate online education with a seamless experience for administrators, teachers, and students. The platform supports course creation, enrollment management, and a comprehensive assessment system with automatic grading capabilities.

### 🎯 Core Capabilities

- **Multi-Role System**: Admin, Teacher, and Student roles with distinct permissions
- **Course Management**: Create, publish, and manage courses with rich content
- **Assessment Suite**: Assignments, Quizzes, and Discussion boards
- **Auto-Grading**: Instant quiz grading with detailed feedback
- **File Uploads**: Support for PDF, DOC, DOCX submissions (10MB limit)
- **Real-time Tracking**: Monitor student progress and submission status
- **Responsive Design**: Mobile-first approach with dark mode support

---

## ✨ Key Features

### 👨‍💼 For Administrators

- **User Management**

  - View and manage all users (students, teachers, admins)
  - Approve or reject teacher applications
  - Promote users to teacher or admin roles
  - Monitor platform-wide statistics

- **Course Approval**

  - Review teacher-submitted courses
  - Approve or reject course listings
  - Ensure content quality and compliance
  - View all classes across the platform

- **Platform Oversight**
  - Track enrollment statistics
  - Monitor system health and usage
  - Manage platform policies
  - Access comprehensive analytics

### 👨‍🏫 For Teachers

- **Course Creation**

  - Create courses with detailed descriptions
  - Add course images and pricing
  - Set enrollment limits and prerequisites
  - Manage course visibility (draft/published)

- **Assessment Management**

  - Create assignments with file upload requirements
  - Build quizzes with multiple question types (MCQ, True/False, Short Answer)
  - Start discussion threads with peer response requirements
  - Set due dates, points, and passing scores
  - Control late submission policies

- **Grading & Feedback**

  - View all enrolled students for each assessment
  - Track who submitted vs. who didn't submit
  - Download student submissions (PDF, DOC, DOCX)
  - Provide grades and detailed feedback
  - View auto-graded quiz results
  - Monitor class performance with statistics

- **Class Analytics**
  - Track student enrollment and engagement
  - View submission rates and average grades
  - Identify struggling students early
  - Export grading reports

### 🎓 For Students

- **Course Discovery & Enrollment**

  - Browse available courses with search and filters
  - View course details, instructor info, and pricing
  - One-click enrollment process
  - Access enrolled courses from dashboard

- **Assessment Participation**

  - View all assessments across enrolled courses
  - Submit assignments with text and file uploads
  - Take quizzes with instant auto-grading
  - Participate in class discussions
  - Respond to peer discussion posts
  - Track submission deadlines

- **Progress Tracking**

  - View grades and teacher feedback
  - Monitor completion status (pending, submitted, graded)
  - Track overall course progress
  - Receive late submission warnings
  - Access detailed quiz results with question-by-question feedback

- **Personal Dashboard**
  - Centralized view of all assessments
  - Filter by type (assignments, quizzes, discussions)
  - Sort by due date or status
  - Statistics cards showing total, completed, and pending work

---

## 🛠️ Technology Stack

### Frontend

| Technology           | Purpose                                         | Version |
| -------------------- | ----------------------------------------------- | ------- |
| **React**            | UI library with hooks and functional components | 18.2.0  |
| **Vite**             | Fast build tool and development server          | 5.2.0   |
| **React Router DOM** | Client-side routing and navigation              | 6.23.1  |
| **Tailwind CSS**     | Utility-first CSS framework                     | 3.4.3   |
| **DaisyUI**          | Component library for Tailwind                  | 4.11.1  |
| **TanStack Query**   | Server state management and caching             | 5.40.0  |
| **Axios**            | HTTP client for API requests                    | 1.7.2   |
| **React Hook Form**  | Form handling and validation                    | 7.54.2  |
| **React Hot Toast**  | Toast notifications                             | 2.4.1   |
| **SweetAlert2**      | Beautiful alert dialogs                         | 11.11.0 |
| **React Icons**      | Icon library (Fa, Md, Bs, etc.)                 | 5.2.1   |
| **Swiper.js**        | Touch slider for carousels                      | 11.1.4  |
| **Lottie React**     | Animation library                               | 2.4.0   |
| **Animate.css**      | CSS animation library                           | 4.1.1   |
| **Stripe**           | Payment processing                              | 3.4.1   |

### Backend

| Technology     | Purpose                         | Version    |
| -------------- | ------------------------------- | ---------- |
| **Node.js**    | JavaScript runtime              | Latest LTS |
| **Express.js** | Web application framework       | 4.19.2     |
| **MongoDB**    | NoSQL database                  | 6.7.0      |
| **Multer**     | File upload middleware          | 2.0.2      |
| **JWT**        | Authentication tokens           | 9.0.2      |
| **CORS**       | Cross-origin resource sharing   | 2.8.5      |
| **dotenv**     | Environment variable management | 16.4.5     |

### Authentication & Hosting

- **Firebase Authentication**: Google, GitHub, and email/password login
- **JWT Tokens**: Secure API authentication with role-based access
- **Firebase Hosting**: Frontend deployment (optional)
- **Vercel**: Backend deployment support

---

## 👥 User Roles & Workflows

### 🔄 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION                            │
│                            ↓                                     │
│                   Normal User (Student)                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Option 1: Stay as Student        Option 2: Become Teacher       │
├────────────────────────────────  ─────────────────────────────┤
│ • Enroll in courses               • Fill "Teach on EMX" form   │
│ • Complete assessments            • Admin reviews request      │
│ • View grades                     • Role changed to Teacher    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    TEACHER WORKFLOW                              │
│                                                                  │
│  1. Create Course (Draft)                                        │
│  2. Submit for Admin Approval                                    │
│  3. Admin Approves → Course Published                            │
│  4. Students Enroll in Course                                    │
│  5. Teacher Creates Assessments                                  │
│  6. Students Submit Work                                         │
│  7. Teacher Grades & Provides Feedback                           │
└─────────────────────────────────────────────────────────────────┘
```

### 1️⃣ Student Workflow

```bash
Login → Browse Courses → Enroll → Continue Course → View Assessments
→ Submit Work → Receive Grades → View Feedback
```

### 2️⃣ Teacher Workflow

```bash
Request Teacher Role → Admin Approval → Create Course → Admin Approval
→ Course Published → Create Assessments → View Submissions
→ Grade Work → Provide Feedback
```

### 3️⃣ Admin Workflow

```bash
Login → Review Teacher Requests → Approve/Reject Teachers
→ Review Course Submissions → Approve/Reject Courses
→ Manage Users → Monitor Platform
```

---

## 📚 Assessment System

The platform features a comprehensive assessment system with three distinct types:

### 📝 Assignments

- **Features**:
  - Text submission support
  - File upload (PDF, DOC, DOCX - max 10MB)
  - Due date enforcement
  - Late submission control
  - Teacher manual grading with feedback
- **Student View**: Upload files, write text submissions, track status
- **Teacher View**: Download submissions, provide grades (0-100), write feedback

### 🧠 Quizzes

- **Question Types**:
  - Multiple Choice Questions (MCQ)
  - True/False questions
  - Short Answer questions
- **Features**:
  - Automatic grading with instant results
  - Attempt limits (configurable)
  - Time limits (optional)
  - Pass/Fail determination
  - Question-by-question feedback
  - Explanation support for each question
- **Grading Logic**:
  - MCQ: Exact match comparison
  - True/False: Exact match
  - Short Answer: Case-insensitive, trimmed comparison

### 💬 Discussions

- **Features**:
  - Discussion prompts from teachers
  - Student discussion posts
  - Peer response requirements
  - Anonymous response option
  - Minimum response count enforcement
- **Use Cases**: Topic debates, peer learning, case studies, reflection posts

### 📊 Assessment Statistics

Teachers can view:

- Total submissions vs. enrolled students
- Graded vs. pending submissions
- Average grade across submissions
- Submission rate percentage
- Late submission tracking

---

## 📁 Project Structure

```
Escape_the_Matrix/
│
├── Escape_the_Matrix_Client/          # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   └── enrollment/            # Enrollment components
│   │   ├── Hooks/                     # Custom React hooks
│   │   │   ├── useAuth.jsx            # Authentication hook
│   │   │   ├── useAdmin.jsx           # Admin role check
│   │   │   ├── useTeacher.jsx         # Teacher role check
│   │   │   ├── useAssessments.jsx     # Fetch assessments
│   │   │   ├── useStudentAssessments.jsx
│   │   │   └── ...
│   │   ├── Layout/
│   │   │   ├── Roots.jsx              # Main layout
│   │   │   └── Dashboard.jsx          # Dashboard layout
│   │   ├── Pages/
│   │   │   ├── Home/                  # Landing page
│   │   │   ├── All Classes/           # Course listing
│   │   │   ├── Dashboard/
│   │   │   │   ├── Admin Pannel/      # Admin features
│   │   │   │   ├── Teacher Pannel/    # Teacher features
│   │   │   │   │   ├── My Class/
│   │   │   │   │   │   ├── AssessmentSubmissions.jsx
│   │   │   │   │   │   ├── GradeSubmissionModal.jsx
│   │   │   │   │   │   └── ...
│   │   │   │   └── Student Pannel/    # Student features
│   │   │   │       └── My Assessments/
│   │   │   │           ├── StudentAssessmentDashboard.jsx
│   │   │   │           ├── AssessmentCard.jsx
│   │   │   │           ├── AssessmentDetail.jsx
│   │   │   │           ├── SubmitAssignment.jsx
│   │   │   │           ├── TakeQuiz.jsx
│   │   │   │           └── SubmitDiscussion.jsx
│   │   │   ├── Login/                 # Authentication
│   │   │   ├── Register/
│   │   │   └── Teach On Emx/          # Teacher application
│   │   ├── Routes/
│   │   │   ├── Routes.jsx             # Route configuration
│   │   │   ├── PrivateRoute.jsx       # Protected routes
│   │   │   ├── AdminRoute.jsx         # Admin-only routes
│   │   │   └── StudentRoute.jsx       # Student routes
│   │   ├── Provider/
│   │   │   └── ContextProvider.jsx    # Global state
│   │   └── services/
│   │       └── enrollmentAPI.js       # API service
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── Escape_the_Matrix_Server/          # Backend Application
│   ├── index.js                       # Express server & API routes
│   ├── uploads/
│   │   ├── assessments/               # Assessment files
│   │   └── submissions/               # Student submissions
│   ├── package.json
│   ├── vercel.json                    # Vercel deployment config
│   └── [Documentation Files]
│
└── README.md                          # This file
```

### 📂 Key Directories

- **`/src/Hooks`**: Custom React hooks for data fetching and authentication
- **`/src/Pages/Dashboard`**: Role-specific dashboard pages
- **`/src/Routes`**: Route configuration and protected routes
- **`/uploads/submissions`**: Student submission files (PDFs, DOCs)
- **`index.js`**: Complete backend with all API endpoints

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**: Package manager
- **MongoDB**: Database ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) recommended)
- **Firebase Account**: For authentication ([Firebase Console](https://console.firebase.google.com/))

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Escape_the_Matrix
```

### Step 2: Frontend Setup

```bash
# Navigate to client directory
cd Escape_the_Matrix_Client

# Install dependencies
npm install

# Create .env file in the root of client directory
touch .env
```

Add the following to `.env`:

```env
# Firebase Configuration
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_project.firebaseapp.com
VITE_PROJECTID=your_project_id
VITE_STORAGEBUCKET=your_project.appspot.com
VITE_MESSAGINGSENDERID=your_sender_id
VITE_APPID=your_app_id

# Backend API URL
VITE_API_URL=http://localhost:5000
```

### Step 3: Backend Setup

```bash
# Navigate to server directory
cd ../Escape_the_Matrix_Server

# Install dependencies
npm install

# Create .env file in the root of server directory
touch .env
```

Add the following to `.env`:

```env
# MongoDB Configuration
DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password

# JWT Secret
ACCESS_TOKEN_SECRET=your_jwt_secret_key

# Server Port
PORT=5000

# Default Admin Email (immutable)
DEFAULT_ADMIN_EMAIL=niazmorshedrafi@gmail.com
```

### Step 4: Create Upload Directories

```bash
# From server directory
mkdir -p uploads/assessments
mkdir -p uploads/submissions
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**

```bash
cd Escape_the_Matrix_Server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd Escape_the_Matrix_Client
npm run dev
# Client runs on http://localhost:5173
```

### Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🔐 Environment Variables

### Frontend (.env in `Escape_the_Matrix_Client/`)

| Variable                 | Description             | Example                   |
| ------------------------ | ----------------------- | ------------------------- |
| `VITE_APIKEY`            | Firebase API key        | `AIzaSyC...`              |
| `VITE_AUTHDOMAIN`        | Firebase auth domain    | `project.firebaseapp.com` |
| `VITE_PROJECTID`         | Firebase project ID     | `project-12345`           |
| `VITE_STORAGEBUCKET`     | Firebase storage bucket | `project.appspot.com`     |
| `VITE_MESSAGINGSENDERID` | Firebase messaging ID   | `123456789`               |
| `VITE_APPID`             | Firebase app ID         | `1:123:web:abc`           |
| `VITE_API_URL`           | Backend API URL         | `http://localhost:5000`   |

### Backend (.env in `Escape_the_Matrix_Server/`)

| Variable              | Description         | Example                  |
| --------------------- | ------------------- | ------------------------ |
| `DB_USER`             | MongoDB username    | `admin`                  |
| `DB_PASSWORD`         | MongoDB password    | `securePassword123`      |
| `ACCESS_TOKEN_SECRET` | JWT secret key      | `your_random_secret_key` |
| `PORT`                | Server port         | `5000`                   |
| `DEFAULT_ADMIN_EMAIL` | Default admin email | `admin@example.com`      |

---

## 🧪 Testing Credentials

Use these pre-configured accounts for testing different user roles:

### 👨‍💼 Admin Account

```
Email: niaz@gmail.com
Password: 1234Aa
```

**Capabilities**:

- Approve/reject teacher requests
- Approve/reject course submissions
- View and manage all users
- Access platform-wide analytics

### 👨‍🏫 Teacher Account

```
Email: erwin.smith4733@gmail.com
Password: 1234Aa
```

**Capabilities**:

- Create and manage courses
- Create assessments (assignments, quizzes, discussions)
- View student submissions
- Grade student work

### 🎓 Student Account

```
Email: levi@gmail.com
Password: 1234Aa
```

**Capabilities**:

- Enroll in courses
- View and complete assessments
- Submit assignments and take quizzes
- View grades and feedback

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication

All protected endpoints require a JWT token:

```bash
# Get JWT Token
POST /jwt
Body: { "email": "user@example.com" }

# Use token in requests
Authorization: Bearer YOUR_JWT_TOKEN
```

### API Endpoint Categories

#### 🔐 Authentication & Users

| Endpoint       | Method | Description           |
| -------------- | ------ | --------------------- |
| `/jwt`         | POST   | Generate JWT token    |
| `/allusers`    | GET    | Get all users (Admin) |
| `/user/:email` | GET    | Get user by email     |
| `/users`       | POST   | Create new user       |

#### 📚 Courses

| Endpoint            | Method | Description           |
| ------------------- | ------ | --------------------- |
| `/approved-classes` | GET    | Get approved courses  |
| `/classes/:email`   | GET    | Get teacher's courses |
| `/add-classes`      | POST   | Create new course     |
| `/update-class/:id` | PUT    | Update course         |
| `/delete-class/:id` | DELETE | Delete course         |

#### 🎓 Enrollment

| Endpoint                      | Method | Description               |
| ----------------------------- | ------ | ------------------------- |
| `/enroll`                     | POST   | Enroll in course          |
| `/enrolledclasses/:email`     | GET    | Get student's enrollments |
| `/class-enrollments/:classId` | GET    | Get course enrollments    |

#### 📝 Assessments (Teacher)

| Endpoint                                       | Method | Description           |
| ---------------------------------------------- | ------ | --------------------- |
| `/api/teacher/class/:classId/assessment`       | POST   | Create assessment     |
| `/api/teacher/class/:classId/assessments`      | GET    | Get class assessments |
| `/api/teacher/assessment/:id`                  | GET    | Get single assessment |
| `/api/teacher/assessment/:id`                  | PUT    | Update assessment     |
| `/api/teacher/assessment/:id`                  | DELETE | Delete assessment     |
| `/api/teacher/assessment/:id/publish`          | PUT    | Publish assessment    |
| `/api/teacher/assessment/:id/close`            | PUT    | Close assessment      |
| `/api/teacher/assessment/:id/submissions`      | GET    | Get submissions       |
| `/api/teacher/grade-submission`                | PUT    | Grade submission      |
| `/api/teacher/class/:id/assessment-statistics` | GET    | Get statistics        |

#### 🎯 Assessments (Student)

| Endpoint                                     | Method | Description                   |
| -------------------------------------------- | ------ | ----------------------------- |
| `/api/student/class/:classId/assessments`    | GET    | Get class assessments         |
| `/api/student/assessment/:id`                | GET    | Get assessment details        |
| `/api/student/assessment/:id/my-submissions` | GET    | Get my submissions            |
| `/api/student/submit-assignment`             | POST   | Submit assignment (with file) |
| `/api/student/submit-quiz`                   | POST   | Submit quiz (auto-graded)     |
| `/api/student/submit-discussion`             | POST   | Submit discussion post        |
| `/api/student/discussion/:id/respond`        | POST   | Add peer response             |
| `/api/student/dashboard/assessments`         | GET    | Get all my assessments        |

#### 👨‍🏫 Teacher Requests

| Endpoint               | Method | Description              |
| ---------------------- | ------ | ------------------------ |
| `/teacher-request`     | POST   | Submit teacher request   |
| `/all-request`         | GET    | Get all requests (Admin) |
| `/approve-teacher/:id` | PUT    | Approve teacher request  |
| `/deny-teacher/:id`    | PUT    | Reject teacher request   |

### 📥 File Upload Example

```javascript
const formData = new FormData();
formData.append("assessmentId", assessmentId);
formData.append("submissionText", "My submission text");
formData.append("file", fileObject);

const response = await axios.post(
  "http://localhost:5000/api/student/submit-assignment",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
);
```

### 📤 Response Format

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description"
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🗄️ Database Collections

### MongoDB Collections in `EscapeTheMatrix` Database

1. **UserCollection**

   - Stores user information (email, name, role, photo)
   - Roles: `user`, `teacher`, `admin`

2. **ClassesCollection**

   - Stores course information
   - Fields: title, description, image, price, instructor, status

3. **EnrollCollection**

   - Tracks student enrollments
   - Links students to courses with enrollment date

4. **TeachRequestCollection**

   - Stores teacher application requests
   - Fields: email, name, experience, category, status

5. **AssessmentCollection**

   - Stores all assessments (assignments, quizzes, discussions)
   - Fields: type, title, questions, due date, points, status

6. **SubmissionsCollection**
   - Stores student submissions
   - Fields: student info, file URL, answers, grade, feedback

---

## 🎨 Design System

### Color Palette

- **Primary**: Deep Blue (`#003366`)
- **Secondary**: Darker Blue (`#004080`)
- **Accent**: Light Blue (`#0066cc`)
- **Success**: Green (`#10B981`)
- **Warning**: Yellow (`#F59E0B`)
- **Error**: Red (`#EF4444`)

### Typography

- **Font Family**: Nunito (Google Fonts)
- **Weights**: 200-1000 (Variable)

### UI Components

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with validation states
- **Modals**: Centered with backdrop blur
- **Toasts**: react-hot-toast with custom styling

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build for production
cd Escape_the_Matrix_Client
npm run build

# The dist/ folder is ready for deployment
# Deploy to Vercel, Netlify, or Firebase Hosting
```

**Vercel Deployment:**

```bash
npm install -g vercel
vercel --prod
```

**Firebase Hosting:**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Backend Deployment (Railway/Render/Vercel)

```bash
cd Escape_the_Matrix_Server

# Ensure environment variables are set on hosting platform
# Deploy using platform CLI or Git integration
```

**Vercel Deployment:**

```bash
vercel --prod
```

**Environment Variables to Set:**

- `DB_USER`
- `DB_PASSWORD`
- `ACCESS_TOKEN_SECRET`
- `PORT`

### Post-Deployment Checklist

- [ ] Update `VITE_API_URL` in frontend `.env` to production backend URL
- [ ] Set CORS origin in backend to production frontend URL
- [ ] Ensure MongoDB Atlas allows connections from hosting IP
- [ ] Create `uploads/` directories with proper permissions
- [ ] Test all authentication flows
- [ ] Test file upload functionality
- [ ] Verify JWT token generation and validation
- [ ] Test all user roles (admin, teacher, student)

---

## 📚 Documentation Files

Comprehensive documentation is available in both client and server directories:

### Frontend Documentation (`Escape_the_Matrix_Client/`)

- `ASSESSMENT_IMPLEMENTATION_SUMMARY.md` - Student assessment system overview
- `ASSESSMENT_CARDS_POLISH.md` - UI/UX improvements
- `NAVIGATION_UPDATE_SUMMARY.md` - Navigation structure changes
- `TEACHER_GRADING_SYSTEM.md` - Teacher grading interface guide
- `PREVENT_TEACHER_ENROLLMENT.md` - Role-based access control
- `UI_CLEANUP_SUMMARY.md` - UI refinements
- `COURSE_SPECIFIC_ASSESSMENTS_FIX.md` - Assessment fixes

### Backend Documentation (`Escape_the_Matrix_Server/`)

- `ASSESSMENT_API_DOCUMENTATION.md` - Complete API reference (1000+ lines)
- `ASSESSMENT_SYSTEM_README.md` - System overview
- `ASSESSMENT_TESTING_GUIDE.md` - Testing instructions
- `FRONTEND_ASSESSMENT_GUIDE.md` - Frontend integration guide
- `SUBMISSIONS_COLLECTION_GUIDE.md` - Database schema details

### Public Documentation

- `public/FRONTEND_QUICK_SUMMARY.md` - Quick start guide
- `public/FRONTEND_TEACHER_GRADING_GUIDE.md` - Teacher features

---

## 🔧 Development

### Run Linter

```bash
# Frontend
cd Escape_the_Matrix_Client
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Build for Production

```bash
# Frontend
npm run build

# Preview production build
npm run preview
```

### Directory Structure for New Features

When adding new features:

1. Create component in appropriate `Pages/` or `components/` directory
2. Add custom hook in `Hooks/` if needed
3. Update routes in `Routes/Routes.jsx`
4. Add API endpoints in `server/index.js`
5. Update documentation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

   ```bash
   git clone <your-fork-url>
   cd Escape_the_Matrix
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**

   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**

   - Test all affected user flows
   - Ensure no linting errors
   - Verify responsive design

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "Add amazing feature: description"
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Add screenshots for UI changes

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Can't connect to MongoDB**

```
Solution: Check DB_USER and DB_PASSWORD in .env
Verify MongoDB Atlas allows connections from your IP
```

**Issue: File upload fails**

```
Solution: Ensure uploads/submissions/ directory exists
Check file size (max 10MB)
Verify file type (PDF, DOC, DOCX only)
```

**Issue: JWT token invalid**

```
Solution: Check ACCESS_TOKEN_SECRET in backend .env
Ensure token is sent in Authorization header
Verify token hasn't expired
```

**Issue: CORS errors**

```
Solution: Add your frontend URL to CORS origin in index.js
Update both client origin URLs if needed
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Acknowledgments

### Development Team

- **Full-Stack Development**: MERN Stack (MongoDB, Express, React, Node.js)
- **UI/UX Design**: Modern, responsive design with Tailwind CSS
- **Assessment System**: Comprehensive grading and submission tracking
- **Authentication**: Firebase Auth with JWT integration

### Built With

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Firebase](https://firebase.google.com/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool

---

## 📞 Support & Contact

For support, questions, or feature requests:

- **Create an Issue**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: See documentation files in project directories
- **Email**: Contact the development team

---

## 🎯 Roadmap

### Current Features ✅

- Multi-role authentication (Admin, Teacher, Student)
- Course creation and management
- Assessment system (Assignments, Quizzes, Discussions)
- Auto-grading for quizzes
- File upload support
- Teacher grading interface
- Student dashboard
- Responsive design with dark mode

### Upcoming Features 🚀

- Video lecture support
- Real-time chat for courses
- Certificate generation
- Payment integration (Stripe)
- Mobile app (React Native)
- Email notifications
- Advanced analytics dashboard
- Plagiarism detection
- Peer review system
- Course prerequisites
- Gradebook exports

---

## 🌟 Highlights

- ✨ **Modern Tech Stack**: Built with latest React 18, Vite, and MongoDB
- 🎨 **Beautiful UI**: Responsive design with Tailwind CSS and DaisyUI
- 🔐 **Secure**: JWT authentication with role-based access control
- ⚡ **Fast**: Vite build tool for lightning-fast development
- 📱 **Responsive**: Mobile-first approach works on all devices
- 🎓 **Feature-Rich**: Complete LMS with assessments and grading
- 🚀 **Production-Ready**: Deployed and tested system
- 📚 **Well-Documented**: Comprehensive documentation (3000+ lines)

---

<div align="center">

**Escape The Matrix** - Empowering education through technology 🎓✨

Made with ❤️ using the MERN Stack

[⬆ Back to Top](#-escape-the-matrix---learning-management-system)

</div>

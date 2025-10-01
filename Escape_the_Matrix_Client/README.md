# Escape The Matrix - Learning Management System

A modern, full-stack Learning Management System (LMS) built with React, Vite, and Firebase. This platform enables students to enroll in courses, teachers to create and manage classes, and administrators to oversee the entire educational ecosystem.

## 🚀 Features

### For Students

- **Course Discovery**: Browse and search through available courses
- **Easy Enrollment**: One-click enrollment process
- **Progress Tracking**: Monitor learning progress and achievements
- **Interactive Learning**: Engaging course content with multimedia support

### For Teachers

- **Course Creation**: Build comprehensive courses with rich content
- **Student Management**: Track student progress and engagement
- **Assignment System**: Create and grade assignments
- **Analytics Dashboard**: Monitor course performance and student feedback

### For Administrators

- **User Management**: Oversee all users (students, teachers, admins)
- **Course Approval**: Review and approve teacher-submitted courses
- **Platform Analytics**: Comprehensive insights into platform usage
- **Content Moderation**: Ensure quality and compliance across all content

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI library with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **React Hook Form** - Form handling and validation
- **TanStack Query** - Server state management
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library
- **Swiper.js** - Touch slider component
- **AOS (Animate On Scroll)** - Scroll animations

### Authentication & Database

- **Firebase Authentication** - Google, GitHub, and email/password login
- **JWT Tokens** - Secure API authentication
- **MongoDB** - NoSQL database for data storage
- **Express.js** - Backend API server

### UI/UX Features

- **Dark/Light Mode** - Theme switching capability
- **Responsive Design** - Mobile-first approach
- **Modern Animations** - Smooth transitions and hover effects
- **Accessibility** - WCAG compliant design

## 📁 Project Structure

```
src/
├── Components/
│   ├── Navbar/           # Navigation component
│   ├── Footer/           # Footer component
│   └── DarkMode/         # Theme toggle
├── Hooks/
│   ├── useAuth.jsx       # Authentication hook
│   ├── useAxiosPublic.jsx # Public API calls
│   ├── useAxiosSecure.jsx # Authenticated API calls
│   ├── useAdmin.jsx      # Admin role check
│   ├── useTeacher.jsx    # Teacher role check
│   └── useClasses.jsx    # Course data management
├── Layout/
│   ├── Roots.jsx         # Main layout wrapper
│   └── Dashboard.jsx     # Dashboard layout
├── Pages/
│   ├── Home/             # Landing page components
│   ├── All Classes/      # Course listing and details
│   ├── Dashboard/        # Role-based dashboards
│   ├── Login/            # Authentication pages
│   └── Teach On Emx/     # Teacher application
└── Provider/
    └── ContextProvider.jsx # Global state management
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Firebase project setup

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Escape_the_Matrix_Client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Create .env file
   VITE_API_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Design System

### Color Palette

- **Primary**: Deep Blue (#003366)
- **Secondary**: Darker Blue (#004080)
- **Accent**: Light Blue (#0066cc)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography

- **Font Family**: Nunito (Google Fonts)
- **Weights**: 200-1000 (Variable)

### Components

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with validation states
- **Navigation**: Responsive with mobile-first design

## 🔐 Authentication Flow

1. **User Registration/Login**

   - Firebase Authentication integration
   - Google and GitHub OAuth support
   - Email/password authentication

2. **Role-Based Access**

   - Student: Course enrollment and learning
   - Teacher: Course creation and management
   - Admin: Platform oversight and user management

3. **JWT Token Management**
   - Automatic token refresh
   - Secure API communication
   - Role-based route protection

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch Friendly**: Swipe gestures and touch interactions
- **Performance**: Optimized images and lazy loading

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy dist/ folder to your hosting platform
```

### Backend (Railway/Heroku)

```bash
# Deploy your Express.js server
# Ensure MongoDB connection is configured
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React, Vite, Tailwind CSS
- **Backend Development**: Express.js, MongoDB
- **Authentication**: Firebase Auth
- **UI/UX Design**: Modern, responsive design system

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Escape The Matrix** - Empowering education through technology 🎓✨

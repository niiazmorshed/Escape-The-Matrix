import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import Roots from "../Layout/Roots";
import AllClasses from "../Pages/All Classes/AllClasses";
import ClassDetails from "../Pages/All Classes/Class Details/ClassDetails";
import AdmineProfile from "../Pages/Dashboard/Admin Pannel/Admin Profile/AdmineProfile";
import AllClassFromAdmin from "../Pages/Dashboard/Admin Pannel/All CLass From Admin/AllClassFromAdmin";
import AllUsers from "../Pages/Dashboard/Admin Pannel/All Users/AllUsers";
import TeacherRequest from "../Pages/Dashboard/Admin Pannel/Teacher Request/TeacherRequest";
import AssessmentDetail from "../Pages/Dashboard/Student Pannel/My Assessments/AssessmentDetail";
import CourseAssessments from "../Pages/Dashboard/Student Pannel/My Assessments/CourseAssessments";
import StudentAssessmentDashboard from "../Pages/Dashboard/Student Pannel/My Assessments/StudentAssessmentDashboard";
import MyEnrollClass from "../Pages/Dashboard/Student Pannel/My Enroll Class/MyEnrollClass";
import MyEnrollClassDetails from "../Pages/Dashboard/Student Pannel/My Enroll Class/MyEnrollClassDetails";
import MyProfile from "../Pages/Dashboard/Student Pannel/My Profile/MyProfile";
import AddClass from "../Pages/Dashboard/Teacher Pannel/Add Class/AddClass";
import AssessmentSubmissions from "../Pages/Dashboard/Teacher Pannel/My Class/AssessmentSubmissions";
import MyClass from "../Pages/Dashboard/Teacher Pannel/My Class/MyClass";
import TeacherClassDetails from "../Pages/Dashboard/Teacher Pannel/My Class/TeacherClassDetails";
import TeacherProfile from "../Pages/Dashboard/Teacher Pannel/Teacher Profile/TeacherProfile";
import Error from "../Pages/Error/Error";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import TeachOnEmx from "../Pages/Teach On Emx/TeachOnEmx";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots></Roots>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/allclasses",
        element: (
          <PrivateRoute>
            <AllClasses></AllClasses>
          </PrivateRoute>
        ),
      },
      {
        path: "/teachonemx",
        element: (
          <PrivateRoute>
            <TeachOnEmx></TeachOnEmx>
          </PrivateRoute>
        ),
      },
      {
        path: "/classdetails/:id",
        element: (
          <PrivateRoute>
            <ClassDetails></ClassDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
    ],
  },

  // Dashboard=====>
  // Normal User Routes
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    errorElement: <Error></Error>,
    children: [
      {
        path: "myenrollclasses",
        element: (
          <PrivateRoute>
            <MyEnrollClass></MyEnrollClass>
          </PrivateRoute>
        ),
      },
      {
        path: "enrollclassdetails/:id",
        element: (
          <PrivateRoute>
            <MyEnrollClassDetails></MyEnrollClassDetails>
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://escape-the-matrix-server.vercel.app/get-enrolled-details/${params.id}`),
      },
      {
        path: "userprofile",
        element: (
          <PrivateRoute>
            <MyProfile></MyProfile>
          </PrivateRoute>
        ),
      },
      // Student Assessment Routes
      {
        path: "myassessments",
        element: (
          <PrivateRoute>
            <StudentAssessmentDashboard></StudentAssessmentDashboard>
          </PrivateRoute>
        ),
      },
      {
        path: "course/:courseId/assessments",
        element: (
          <PrivateRoute>
            <CourseAssessments></CourseAssessments>
          </PrivateRoute>
        ),
      },
      {
        path: "assessment/:assessmentId",
        element: (
          <PrivateRoute>
            <AssessmentDetail></AssessmentDetail>
          </PrivateRoute>
        ),
      },
      // Admin Route
      {
        path: "adminprofile",
        element: (
          <AdminRoute>
            <AdmineProfile></AdmineProfile>
          </AdminRoute>
        ),
      },
      {
        path: "allusers",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
        loader: () => fetch("https://escape-the-matrix-server.vercel.app/allusers"),
      },
      {
        path: "teacherrequest",
        element: (
          <AdminRoute>
            <TeacherRequest></TeacherRequest>
          </AdminRoute>
        ),
      },
      {
        path: "allclasses",
        element: (
          <AdminRoute>
            <AllClassFromAdmin></AllClassFromAdmin>
          </AdminRoute>
        ),
      },
      {
        path: "addclass",
        element: (
          <PrivateRoute>
            <AddClass></AddClass>
          </PrivateRoute>
        ),
      },
      {
        path: "myclass",
        element: (
          <PrivateRoute>
            <MyClass></MyClass>
          </PrivateRoute>
        ),
      },
      {
        path: "teacherprofile",
        element: (
          <PrivateRoute>
            <TeacherProfile></TeacherProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "teacherclassdeetails/:id",
        element: (
          <PrivateRoute>
            {" "}
            <TeacherClassDetails></TeacherClassDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "assessment-submissions/:assessmentId",
        element: (
          <PrivateRoute>
            <AssessmentSubmissions></AssessmentSubmissions>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;

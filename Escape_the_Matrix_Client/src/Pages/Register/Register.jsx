import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";
import { FaEnvelope, FaGraduationCap, FaLock, FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import auth from "../../Provider/firebase.config";
import DarkMode from "../Dark Mode/DarkMode";

const Register = () => {
  const { createUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const pass = form.get("password");

    // Checking The Password requirements
    if (pass.length < 6) {
      toast.error("Password Can not be less then 6 charecter", {});
      return;
    } else if (!/[A-Z]/.test(pass)) {
      toast.error("Password must be one UpperCase Charecter", {});
      return;
    } else if (!/[a-z]/.test(pass)) {
      toast.error("Password must be one LowerCase Charecter", {});
      return;
    }

    // Creating The User by Calling The Function
    createUser(email, pass).then(() => {
      e.target.reset();
      toast.success("Register Successfully");
      navigate("/");

      updateProfile(auth.currentUser, {
        displayName: name,
      })
        .then(() => console.log("Success"))
        .catch((error) => {
          console.error(error);
        })
        .catch((error) => {
          console.error(error);
          toast.error("This Mail Has Already been Used");
        });
      const userData = {
        name: name,
        email: email,
      };

      axiosPublic
        .post("/user", userData)
        .then((res) => {
          if (res.data.insertedId) {
            console.log("Data added to the dataBase");
            Swal.fire({
              title: "Success",
              text: "User Created Successfully",
              icon: "question",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Register | Escape Matrix</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      
      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <DarkMode />
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg mb-4">
              <FaGraduationCap className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Join Us Today
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create your account and start learning
            </p>
          </div>

          {/* Register Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 animate-slide-up">
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                    required
                  />
                </div>
              </div>

          {/* Photo URL removed as requested */}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <FaRegEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
                    ) : (
                      <FaRegEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 6 characters with uppercase and lowercase letters
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-4 rounded-xl font-semibold hover:bg-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <NavLink 
                  to="/login" 
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                >
                  Sign in here
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
        }}
      />
    </div>
  );
};

export default Register;

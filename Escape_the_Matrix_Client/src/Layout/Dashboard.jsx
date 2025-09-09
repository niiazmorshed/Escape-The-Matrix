import { BiBookAdd } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaChalkboardTeacher, FaGraduationCap, FaHome, FaUserShield } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdHotelClass } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { NavLink, Outlet } from "react-router-dom";
import useAdmin from "../Hooks/useAdmin";
import useAuth from "../Hooks/useAuth";
import useTeacher from "../Hooks/useTeacher";

const Dashboard = () => {
  const [isAdmin] = useAdmin();
  const [isTeacher] = useTeacher();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Sidebar */}
      <div className="w-72 min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600 shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Sidebar Content */}
        <div className="relative z-10 p-6">
          {/* Logo/Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Escape Matrix</h1>
                <p className="text-blue-200 text-sm">Learning Platform</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{user?.displayName || 'User'}</p>
                  <p className="text-blue-200 text-xs">
                    {isAdmin ? 'Administrator' : isTeacher ? 'Teacher' : 'Student'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {isAdmin && (
              <>
                <div className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                  Admin Panel
                </div>
                <NavLink 
                  to="/dashboard/teacherrequest"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <SiGoogleclassroom className="text-lg" />
                  <span className="font-medium">Teacher Requests</span>
                </NavLink>
                
                <NavLink 
                  to="/dashboard/allclasses"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <MdHotelClass className="text-lg" />
                  <span className="font-medium">All Classes</span>
                </NavLink>
                
                <NavLink 
                  to="/dashboard/allusers"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <HiUserGroup className="text-lg" />
                  <span className="font-medium">All Users</span>
                </NavLink>
                
                <NavLink 
                  to="/dashboard/adminprofile"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <FaUserShield className="text-lg" />
                  <span className="font-medium">Admin Profile</span>
                </NavLink>
              </>
            )}
            
            {isTeacher && (
              <>
                <div className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                  Teacher Panel
                </div>
                <NavLink 
                  to="/dashboard/addclass"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <BiBookAdd className="text-lg" />
                  <span className="font-medium">Add Class</span>
                </NavLink>
                
                <NavLink 
                  to="/dashboard/myclass"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <MdHotelClass className="text-lg" />
                  <span className="font-medium">My Classes</span>
                </NavLink>
                
                <NavLink 
                  to="/dashboard/teacherprofile"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <FaChalkboardTeacher className="text-lg" />
                  <span className="font-medium">Teacher Profile</span>
                </NavLink>
              </>
            )}
            
            {!isAdmin && !isTeacher && (
              <>
                <div className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                  Student Panel
                </div>
                <NavLink 
                  to="/dashboard/myenrollclasses"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <SiGoogleclassroom className="text-lg" />
                  <span className="font-medium">My Enrolled Classes</span>
                </NavLink>
                
                <NavLink 
                  to="/dashboard/userprofile"
                  className={({ isActive }) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-105' 
                        : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                    }`
                  }
                >
                  <CgProfile className="text-lg" />
                  <span className="font-medium">My Profile</span>
                </NavLink>
              </>
            )}
            
            {/* Divider */}
            <div className="my-6 border-t border-blue-300 border-opacity-30"></div>
            
            {/* Home Link */}
            <NavLink 
              to="/"
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg transform scale-105' 
                    : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105'
                }`
              }
            >
              <FaHome className="text-lg" />
              <span className="font-medium">Home</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

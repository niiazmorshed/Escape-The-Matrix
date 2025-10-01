import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAdmin from "../../Hooks/useAdmin";
import useAuth from "../../Hooks/useAuth";
import useTeacher from "../../Hooks/useTeacher";
import DarkMode from "../Dark Mode/DarkMode";
import "./Nav.css";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isAdmin] = useAdmin();
  const [isTeacher] = useTeacher();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [resolving, setResolving] = useState(false);

  // Cache key per user for role persistence
  const roleStorageKey = useMemo(() => (user?.email ? `role:${user.email}` : null), [user?.email]);

  // Resolve color classes and icon per role
  const roleUi = useMemo(() => {
    if (isAdmin) return { badge: "badge-error", icon: "🛡️", role: "admin" };
    if (isTeacher) return { badge: "badge-info", icon: "👨‍🏫", role: "teacher" };
    return { badge: "badge-success", icon: "👨‍🎓", role: "student" };
  }, [isAdmin, isTeacher]);

  const fetchIdToken = useCallback(async () => {
    try {
      if (!user) return null;
      const token = await user.getIdToken?.();
      return token || null;
    } catch {
      return null;
    }
  }, [user]);

  const handleGoToDashboard = useCallback(async () => {
    try {
      setResolving(true);
      const token = await fetchIdToken();
      if (!token) {
        localStorage.setItem("intended_route", "/dashboard");
        navigate("/login");
        return;
      }

      // Redirect based on role
      if (isAdmin) {
        navigate("/dashboard/adminprofile");
      } else if (isTeacher) {
        navigate("/dashboard/teacherprofile");
      } else {
        navigate("/dashboard/userprofile");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not open dashboard. Please try again.");
      navigate("/dashboard");
    } finally {
      setResolving(false);
    }
  }, [fetchIdToken, navigate, isAdmin, isTeacher]);

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success("Logout Successfully");
        if (roleStorageKey) localStorage.removeItem(roleStorageKey);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Logout failed. Please try again.");
      });
  };
  const linkClass = ({ isActive }) =>
    `text-sm md:text-base font-semibold transition-colors px-2 ${
      isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
    } hover:text-primary dark:hover:text-primary`;

  // Resolve the best avatar URL (handles Google login as well)
  const avatarUrl = user?.photoURL || (user?.providerData || []).map(p => p?.photoURL).find(Boolean) || "";
  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'User')}&background=003366&color=fff&size=64`;

  const navLinks = (
    <>
      <NavLink to="/" className={linkClass}>
        <li>
          <a>Home</a>
        </li>
      </NavLink>
      <NavLink to="/teachonemx" className={linkClass}>
        <li>
          <a>Teach on EMX</a>
        </li>
      </NavLink>
      <NavLink to="/allclasses" className={linkClass}>
        <li>
          <a>All Classes</a>
        </li>
      </NavLink>
    </>
  );
  return (
    <div className="navbar fixed bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 z-10 top-0 transition-all duration-300 w-full h-16">
      <div className="max-w-7xl mx-auto w-full px-4 h-full flex items-center justify-between">
        <div className="navbar-start flex items-center">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-gray-700 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white dark:bg-gray-800 rounded-box w-52 border border-gray-200 dark:border-gray-700"
          >
            {navLinks}
          </ul>
        </div>
        <Link to="/">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            <span className="text-gray-800 dark:text-white">Escape The</span>{" "}
            <span className="text-primary">Matrix</span>
          </h1>
        </Link>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">{navLinks}</ul>
        </div>

        <div className="navbar-end flex items-center gap-2">
        <DarkMode />

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            {user ? (
              <div className="w-10 rounded-full overflow-hidden">
                <img
                  alt="User avatar"
                  src={avatarUrl || avatarFallback}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = avatarFallback; }}
                />
              </div>
            ) : (
              <NavLink to="/login">{user ? "" : <a className="btn btn-sm bg-primary text-white border-none hover:bg-secondary">Login</a>}</NavLink>
            )}
          </div>

          {user ? (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white dark:bg-gray-800 rounded-box w-56 border border-gray-200 dark:border-gray-700">
              <li className="px-2 py-2">
                <div className="flex items-center">
                  <div>
                    <div className="font-semibold text-sm md:text-base">{user?.displayName || user?.email}</div>
                    <div className="text-xs opacity-70">{user?.email}</div>
                  </div>
                </div>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button onClick={handleGoToDashboard} disabled={resolving} className="text-gray-700 dark:text-gray-300 hover:text-primary">
                  {resolving ? "Opening..." : "Dashboard"}
                </button>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button onClick={handleLogOut} className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">Logout</button>
              </li>
            </ul>
          ) : (
            ""
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

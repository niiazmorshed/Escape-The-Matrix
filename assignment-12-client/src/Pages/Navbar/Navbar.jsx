import { NavLink } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";
import useAdmin from "../../Hooks/useAdmin";
import useTeacher from "../../Hooks/useTeacher";
import DarkMode from "../Dark Mode/DarkMode";
import "./Nav.css";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isAdmin] = useAdmin();
  const [isTeacher] = useTeacher();

  const handleLogOut = () => {
    toast.success("Logout Successfully");
    logOut()
      .then((result) => {
        const user = result?.user;
        console.log(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const navLinks = (
    <>
      <NavLink to="/">
        {" "}
        <li>
          <a className="text-white text-xl font-semibold">Home</a>
        </li>
      </NavLink>
      <NavLink to="/teachonemx">
        {" "}
        <li>
          <a className="text-white text-xl font-semibold">Teach on EMX</a>
        </li>
      </NavLink>
      <NavLink to="/allclasses">
        {" "}
        <li>
          <a className="text-white text-xl font-semibold">All Class</a>
        </li>
      </NavLink>
    </>
  );
  return (
    <div className="navbar fixed bg-black z-10 top-0">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks}
          </ul>
        </div>
        <a className="md:text-3xl font-bold sm: text-lg">
          Escape The <span className="text-yellow-700">Matrix</span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      <div className="navbar-end sm: pr-12 md:pr-2">
        <DarkMode></DarkMode>
        <NavLink to="/login">
          {user ? "" : <a className="btn">Login</a>}
        </NavLink>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://i.ibb.co/4PffJnR/photo-2023-02-28-19-26-32-2.jpg"
              />
            </div>
          </div>

          {user ? (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">{user?.displayName}</a>
              </li>

              {user && isAdmin && (
                <li>
                  <NavLink to="/dashboard/adminprofile">
                    {" "}
                    <a>Dashboard</a>
                  </NavLink>
                </li>
              )}
              {user && isTeacher && (
                <li>
                  <NavLink to="/dashboard/teacherprofile">
                    {" "}
                    <a>Dashboard</a>
                  </NavLink>
                </li>
              )}

              {user && !isAdmin && !isTeacher && (
                <li>
                  <NavLink to="/dashboard/userprofile">
                    {" "}
                    <a>Dashboard</a>
                  </NavLink>
                </li>
              )}

              {user ? (
                <li>
                  <button onClick={handleLogOut}>Logout</button>
                </li>
              ) : (
                ""
              )}
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

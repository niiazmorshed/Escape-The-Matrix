import { CgProfile } from "react-icons/cg";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useAdmin from "../Hooks/useAdmin";
import useTeacher from "../Hooks/useTeacher";
import { MdHotelClass } from "react-icons/md";

const Dashboard = () => {
  const [isAdmin] = useAdmin();
  const [isTeacher] = useTeacher();

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-yellow-800">
        <ul className="menu p-4 ">
          {isAdmin && (
            // Yess Admin
            <>
              <li>
                <NavLink to="/dashboard/teacherrequest">
                  <SiGoogleclassroom></SiGoogleclassroom> Teacher Request
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/allclasses">
                <MdHotelClass></MdHotelClass> All Classes
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/allusers">
                <FaUserFriends></FaUserFriends> All Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/adminprofile">
                  <CgProfile></CgProfile>Profile
                </NavLink>
              </li>
            </>
          )}
          {
            isTeacher && (
              <>
                <li>
                  <NavLink to="/dashboard/addclass">
                    <SiGoogleclassroom></SiGoogleclassroom> Add Class
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/myclass">
                  <MdHotelClass></MdHotelClass> My Class
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/teacherprofile">
                    <CgProfile></CgProfile> Profile
                  </NavLink>
                </li>
              </>
            )
            // ==================?
          }
          {!isAdmin && !isTeacher && (
            <>
              <li>
                <NavLink to="/dashboard/myenrollclasses">
                  <SiGoogleclassroom /> My Enroll Classes
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/userprofile">
                  <CgProfile /> My Profile
                </NavLink>
              </li>
            </>
          )}
          {/* Shared */}
          <div className="divider"></div>
          <li>
            <NavLink to="/">
              <FaHome></FaHome> Home
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Dashboard;

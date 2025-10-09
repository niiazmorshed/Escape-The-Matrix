import { useQuery } from "@tanstack/react-query";
import { FaCrown, FaTrash, FaUser, FaUserCheck, FaUserShield, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const AllUsers = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const DEFAULT_ADMIN = 'niazmorshedrafi@gmail.com';
  const { data: alluser = [], refetch } = useQuery({
    queryKey: ["alluser"],
    enabled:
      !loading && !!user?.email && !!localStorage.getItem("Access-Token"),

    queryFn: async () => {
      const res = await axiosSecure.get("/allusers");
      return res.data;
    },
  });

  const handleDelete = (user) => {
    if (user.email === DEFAULT_ADMIN) {
      Swal.fire({ icon: 'warning', title: 'Default admin cannot be removed' });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/user/${user._id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted successfully.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handleMakeAdmin = (user) => {
    if (user.email === DEFAULT_ADMIN) {
      Swal.fire({ icon: 'info', title: 'This user is already the default admin' });
      return;
    }
    if (user.role !== 'teacher') {
      Swal.fire({ icon: 'warning', title: 'Only teachers can be admins' });
      return;
    }
    axiosSecure.patch(`/user/admin/${user._id}`).then((res) => {
      if (res.data.modifiedCount) {
        refetch();
        Swal.fire({
          title: `${user.name} is Admin Now`,
          text: "User role has been updated successfully!",
          icon: "success",
        });
      }
    });
  };

  const handleRemoveAdmin = (user) => {
    if (user.email === DEFAULT_ADMIN) {
      Swal.fire({ icon: 'warning', title: 'Default admin role cannot be changed' });
      return;
    }
    if (user.role !== 'admin') return;
    Swal.fire({
      title: `Remove admin role from ${user.name}?`,
      text: 'They will become a teacher again.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/user/remove-admin/${user._id}`).then((res) => {
          if (res.data.modifiedCount) {
            refetch();
            Swal.fire({ icon: 'success', title: 'Role Updated', text: `${user.name} is no longer an admin` });
          }
        });
      }
    });
  };

  const handleSearch = () => {
    const searchField = document.getElementById("search");
    const searchText = searchField.value;
    console.log(searchText);
  };

  const adminCount = alluser.filter(user => user.role === "admin").length;
  const teacherCount = alluser.filter(user => user.role === "teacher").length;
  const studentCount = alluser.filter(user => user.role === "student").length;

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaUserShield className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent dark:from-red-400 dark:to-pink-400">
              All Users
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Manage platform users and permissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{alluser.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Administrators</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{adminCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <FaCrown className="text-red-600 dark:text-red-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Teachers</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{teacherCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FaUserCheck className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Students</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{studentCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FaUser className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Section removed as requested */}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">User Management</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {alluser.map((i, index) => (
                <tr key={i._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={i.image || i.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(i.name || i.email || 'User')}&background=3B82F6&color=fff&size=64`}
                        alt={i.name}
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(i.name || i.email || 'User')}&background=3B82F6&color=fff&size=64`; }}
                      />
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">{i.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{i.email}</td>
                  <td className="px-6 py-4">
                    {i.role === "admin" ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                          <FaCrown className="mr-1" />
                          Admin
                        </span>
                        {i.email !== DEFAULT_ADMIN && (
                          <button
                            onClick={() => handleRemoveAdmin(i)}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors"
                          >
                            Remove Admin
                          </button>
                        )}
                      </div>
                    ) : i.role === 'teacher' ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          <FaUserCheck className="mr-1" />
                          Teacher
                        </span>
                        <button
                          onClick={() => handleMakeAdmin(i)}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          <FaUser className="mr-1" />
                          Make Admin
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        <FaUserCheck className="mr-1" />
                        Student
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(i)}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      <FaTrash className="mr-1" />
                      Remove User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;

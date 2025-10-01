import { useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useMyClass from "../../../../Hooks/useMyClass";

const AllClassFromAdmin = () => {
  const [classes, ,refetch] = useMyClass();
  const [actedIds, setActedIds] = useState(new Set());
  const axiosSecure = useAxiosSecure();

  const handleApprove = (user) => {
    axiosSecure.patch(`/approve/${user._id}`, { status: 'approved', approved: true }).then((res) => {
      refetch();
      if (res.data.matchedCount) {
        Swal.fire({
          icon: "success",
          title: `Added ${user.title}Successfully`,
        });
        toast.success(`${user.title} approved`);
        setActedIds((prev) => new Set(prev).add(user._id));
      } else {
        Swal.fire({
          title: "Good job!",
          text: "Something is Wrong",
          icon: "error",
        });
        toast.error("Approval failed");
      }
    });
  };

  // Keep approved=false when rejected
  const handleReject = async (user) => {
    try {
      // On reject, set status to rejected (keep invisible publicly)
      const res = await axiosSecure.patch(`/reject/${user._id}`, { status: 'rejected', approved: false });
      if (res?.data?.modifiedCount || res?.data?.matchedCount) {
        refetch();
        Swal.fire({ icon: "info", title: `${user.title} marked as rejected` });
        toast("Class request rejected", { icon: "⚠️" });
        setActedIds((prev) => new Set(prev).add(user._id));
        return;
      }
      toast("No changes occurred", { icon: "⚠️" });
    } catch (err) {
      toast.error("Reject failed. Please verify reject endpoint");
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">All Classes</h2>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-6xl mx-auto">
        <table className="w-full">
          {/* head */}
          <thead className="bg-gray-50 dark:bg-gray-700/40">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Teacher</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Course</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {classes.map((i, index) => (
              <tr key={i._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">{i.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{i.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">${i.price}</td>
                <td className="px-6 py-4">
                  {i.status === 'approved' || i.approved ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Approved</span>
                  ) : i.status === 'rejected' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Rejected</span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  {(!i.approved && i.status !== 'approved' && i.status !== 'rejected') && (
                    <>
                      <button
                        disabled={actedIds.has(i._id)}
                        onClick={() => handleApprove(i)}
                        className={`btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none ${actedIds.has(i._id) ? 'opacity-60 cursor-not-allowed hover:bg-blue-600' : ''}`}
                      >
                        Approve
                      </button>
                      <button
                        disabled={actedIds.has(i._id)}
                        onClick={() => handleReject(i)}
                        className={`btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none ${actedIds.has(i._id) ? 'opacity-60 cursor-not-allowed hover:bg-red-600' : ''}`}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllClassFromAdmin;

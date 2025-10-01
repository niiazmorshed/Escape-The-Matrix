import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useTeacherRequest from "../../../../Hooks/useTeacherRequest";

const TeacherRequest = () => {
  const [req, refetch] = useTeacherRequest();
  const axiosSecure = useAxiosSecure();
  const handleApprove = (user) => {
    axiosSecure.patch(`/user/teacherrequest/${user.email}`).then((res) => {
      refetch();
      if (res.data.modifiedCount) {
        Swal.fire({
          title: `${user.name} is Teacher Now`,
          width: 600,
          padding: "3em",
          color: "#716add",
          background: "#fff url(/images/trees.png)",
          backdrop: `
                rgba(0,0,123,0.4)
                url("/images/nyan-cat.gif")
                left top
                no-repeat
              `,
        });
      }
    });
  };
  const handleReject = (user) => {
    axiosSecure.delete(`/user/teache-reject/${user._id}`).then((res) => {
      refetch();
      if (res.data.deletedCount) {
        Swal.fire({
          title: `${user.name} is Rmoved`,
          width: 600,
          padding: "3em",
          color: "#716add",
          background: "#fff url(/images/trees.png)",
          backdrop: `
                rgba(0,0,123,0.4)
                url("/images/nyan-cat.gif")
                left top
                no-repeat
              `,
        });
      }
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">All Teacher Request</h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-6xl mx-auto">
      <table className="w-full">
        {/* head */}
        <thead className="bg-gray-50 dark:bg-gray-700/40">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">#</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Experience</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Title</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {req.map((i, index) => (
            <tr key={i._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{index + 1}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={i.image} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{i.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{i.experience}</td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{i.title}</td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{i.category}</td>
              <td className="px-6 py-4 text-sm">
                {i?.role === "accepted" ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Accepted</span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>
                )}
              </td>
              <td className="px-6 py-4 space-x-2">
                {i.approved === true ? (
                  <button
                    disabled
                    onClick={() => {
                      refetch();
                      handleApprove(i);
                    }}
                    className="btn btn-sm bg-blue-400 text-white border-none opacity-60"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleApprove(i);
                    }}
                    className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none"
                  >
                    Approve
                  </button>
                )}
              
                {i.approved === true ? (
                  <button
                    disabled
                    onClick={() => {
                      handleReject(i);
                    }}
                    className="btn btn-sm bg-red-400 text-white border-none opacity-60"
                  >
                    Reject
                  </button>
                ) : (
                  <button
                    onClick={() => handleReject(i)}
                    className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none"
                  >
                    Reject
                  </button>
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

export default TeacherRequest;

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
    <div className="overflow-x-auto m-12 p-6">
      <h2 className=" mb-16 text-4xl font-bold text-center">All Teacher Request</h2>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th className="text-center text-xl font-bold ">Name</th>
            <th className="text-center text-xl font-bold ">Experience</th>
            <th className="text-center text-xl font-bold ">Title</th>
            <th className="text-center text-xl font-bold ">Category</th>
            <th className="text-center text-xl font-bold ">Status</th>
            <th className="text-center text-xl font-bold "></th>
          </tr>
        </thead>
        <tbody>
          {req.map((i, index) => (
            <tr key={i._id}>
              <th>{index + 1}</th>
              <td>
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={i.image} alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                  <div>
                    <div className="text-center font-bold">{i.name}</div>
                  </div>
                </div>
              </td>
              <td className="text-center text-lg font-semibold ">{i.experience}</td>
              <td className="text-center text-lg font-semibold ">{i.title}</td>
              <td className="text-center text-lg font-semibold ">{i.category}</td>
              <td className="text-center text-lg font-semibold ">
                {i?.role === "accepted" ? "Accepted" : "Pending"}
              </td>
              <th>
                {i.approved === true ? (
                  <button
                    disabled
                    onClick={() => {
                      refetch();
                      handleApprove(i);
                    }}
                    className="btn btn-outline btn-success"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleApprove(i);
                    }}
                    className="btn btn-outline btn-success"
                  >
                    Approve
                  </button>
                )}
              </th>
              <th>
                {i.approved === true ? (
                  <button
                    disabled
                    onClick={() => {
                      handleReject(i);
                    }}
                    className="btn btn-outline btn-success"
                  >
                    Reject
                  </button>
                ) : (
                  <button
                    onClick={() => handleReject(i)}
                    className="btn btn-outline btn-error"
                  >
                    Reject
                  </button>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherRequest;

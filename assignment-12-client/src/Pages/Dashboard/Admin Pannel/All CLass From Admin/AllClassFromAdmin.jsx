import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useMyClass from "../../../../Hooks/useMyClass";

const AllClassFromAdmin = () => {
  const [classes, ,refetch] = useMyClass();
  const axiosSecure = useAxiosSecure();

  const handleApprove = (user) => {
    axiosSecure.patch(`/approve/${user._id}`).then((res) => {
      refetch();
      if (res.data.matchedCount) {
        Swal.fire({
          icon: "success",
          title: `Added ${user.title}Successfully`,
        });
      } else {
        Swal.fire({
          title: "Good job!",
          text: "Something is Wrong",
          icon: "error",
        });
      }
    });
  };

  return (
    <div className="m-12 p-4">
      <h2 className="text-4xl font-bold text-center">All Classes</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th className="text-xl font-bold">Teacher</th>
              <th className="text-xl font-bold">Course</th>
              <th className="text-xl font-bold">Price</th>
              <th className="text-xl font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((i, index) => (
              <tr key={i._id}>
                <th className="text-lg font-semibold ">{index + 1}</th>
                <td className="text-lg font-semibold ">{i.name}</td>
                <td className="text-lg font-semibold ">{i.title}</td>
                <td className="text-lg font-semibold ">{i.price}</td>
                <>
                  {i.approved === false ? (
                    <button
                      onClick={() => handleApprove(i)}
                      className="btn btn-outline btn-accent"
                    >
                      Approve
                    </button>
                  ) : (
                    "Approved"
                  )}
                </>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllClassFromAdmin;

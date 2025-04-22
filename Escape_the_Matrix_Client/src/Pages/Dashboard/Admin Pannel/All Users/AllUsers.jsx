import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";

const AllUsers = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
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
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handleMakeAdmin = (user) => {
    axiosSecure.patch(`/user/admin/${user._id}`).then((res) => {
      if (res.data.modifiedCount) {
        refetch();
        Swal.fire({
          title: `${user.name} is Admin Now`,
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

  const handleSearch = () => {
    const searchField = document.getElementById("search");
    const searchText = searchField.value;
    console.log(searchText);
    // axiosSecure.get(`/search/${searchText}`)
    // .then(res=>{
    //   setAll(res.data)
    //   console.log(res.data)
    // })

    // console.log(searchText);
    // fetch(`http://localhost:5174/search/${searchText}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setSearchData(data);
    //   });
  };
  return (
    <div className="m-6">
      <h2 className="text-4xl font-bold text-center">All Users</h2>
      <div className="flex justify-evenly my-4">
        <div className="flex justify-center items-center">
          <input
            type="text"
            id="search"
            placeholder="Search Post-Title Here"
            className="input input-bordered w-full max-w-xs mr-2"
          />
          <button onClick={handleSearch} className="btn btn-active btn-accent">
            Search
          </button>
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th className="text-xl font-semibold">Name</th>
                <th className="text-xl font-semibold">Email</th>
                <th className="text-xl font-semibold">Role</th>
                <th className="text-xl font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {alluser.map((i, index) => (
                <tr key={i._id}>
                  <th className="text-lg font-semibold">{index + 1}</th>
                  <td className="text-lg font-semibold">{i.name}</td>
                  <td className="text-lg font-semibold">{i.email}</td>
                  <td className="text-lg font-semibold">
                    {i.role === "admin" ? (
                      <h1 className="text-2xl font-bold">Admin</h1>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(i)}
                        className="btn btn-ghost btn-lg"
                      >
                        <FaUser></FaUser>
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(i)}
                      className="btn btn-ghost btn-lg"
                    >
                      <FaTrash></FaTrash>
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

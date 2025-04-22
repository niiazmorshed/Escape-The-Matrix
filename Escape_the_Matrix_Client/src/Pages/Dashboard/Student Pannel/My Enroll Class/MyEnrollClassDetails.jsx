import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactStars from "react-rating-stars-component";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const MyEnrollClassDetails = () => {
  const enrolled = useLoaderData();
  const { user } = useAuth();
  console.log(enrolled[0].classname);
  const axiosPublic = useAxiosPublic();
  const [assignment, setAssignment] = useState([]);
  console.log(assignment);
  useEffect(() => {
    axiosPublic.get("/all-assignment").then((res) => setAssignment(res.data));
  }, [axiosPublic]);
  const { register, handleSubmit, reset } = useForm();

  const filterAssignment = assignment.filter((item) =>
    item.title.toLowerCase().includes(enrolled[0]?.classname.toLowerCase())
  );
  console.log(filterAssignment);

  const onSubmit = (data) => {
    const reviewInfo = {
      description: data.description,
      ratting: parseInt(data.ratting),
      name: user?.displayName,
    };
    axiosPublic.post("/feedback", reviewInfo).then((res) => {
      if (res.data.insertedId) {
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Feedback Added Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  const handleAssignment = (i) => {
    const submitInfo = {
      deadline: i.deadline,
      email: i.email,
      title: i.title,
      studentmail: user.email,
      status: "done",
    };

    axiosPublic.post("/submittedassignment", submitInfo).then((res) => {
      console.log(res.data);
      if (res.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Submission Successful",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <div>
      <div className="flex justify-evenly my-4">
        <h2 className="text-3xl">Assignments</h2>
      </div>
      <hr className="border-dotted" />
      <div className="flex justify-center my-6">
        <button
          className="btn btn-outline btn-warning"
          onClick={() => document.getElementById("modal").showModal()}
        >
          Submit Feedback
        </button>
      </div>
      <dialog id="modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl ">
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-6">
                {/* Name */}
                <div className="form-control w-full my-8">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    placeholder="Enter Description"
                    type="text"
                    {...register("description", { required: true })}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* {Mail} */}
                <div className="form-control w-full my-8">
                  <label className="label">
                    <span className="label-text">Ratting</span>
                  </label>
                  <input
                    type="number"
                    {...register("ratting", { required: true })}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="form-control w-full">
                <h1>Review</h1>
                <ReactStars size={34}></ReactStars>
              </div>
              <button className="my-6 text-xl btn btn-block bg-green-700">
                Proceed
              </button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* End Dialog */}
      <div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Submission</th>
              </tr>
            </thead>
            <tbody>
              {filterAssignment.map((i, index) => (
                <tr key={i._id}>
                  <th>{index + 1}</th>
                  <td>{i.title}</td>
                  <td>{i.description}</td>
                  <td>{i.deadline}</td>
                  <td>
                    {i.status === "done" ? (
                      <button
                        disabled
                        onClick={() => {
                          handleAssignment(i);
                        }}
                        className="btn btn-outline btn-accent"
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleAssignment(i);
                        }}
                        className="btn btn-outline btn-accent"
                      >
                        Submit
                      </button>
                    )}
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

export default MyEnrollClassDetails;

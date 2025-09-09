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
  
  // Add proper data validation
  const enrolledData = Array.isArray(enrolled) ? enrolled[0] : enrolled;
  console.log("Enrolled data:", enrolledData);
  
  const axiosPublic = useAxiosPublic();
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log("Assignments:", assignment);
  
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get("/all-assignment");
        setAssignment(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, [axiosPublic]);
  
  const { register, handleSubmit, reset } = useForm();

  // Debug: Log the enrolled data structure to understand what fields are available
  console.log("Enrolled data fields:", Object.keys(enrolledData || {}));
  console.log("Assignment fields:", assignment.length > 0 ? Object.keys(assignment[0] || {}) : "No assignments");
  console.log("Full enrolled data:", enrolledData);
  
  // Safe assignment filtering - based on the actual data structure
  const filterAssignment = assignment.filter((item) => {
    if (!enrolledData || !item) return false;
    
    console.log("Checking assignment:", item.title, "by teacher:", item.email);
    console.log("Enrolled data teacher fields:", {
      teachermail: enrolledData.teachermail,
      courseTeacher: enrolledData.courseTeacher,
      email: enrolledData.email
    });
    
    // Check if we have teacher email in enrolled data
    if (enrolledData.teachermail && item.email) {
      console.log("Filtering by teacher email:", item.email, "===", enrolledData.teachermail);
      return item.email === enrolledData.teachermail;
    }
    
    // Check if we have courseTeacher field (this might be the teacher's email, not name)
    if (enrolledData.courseTeacher && item.email) {
      console.log("Filtering by courseTeacher:", item.email, "===", enrolledData.courseTeacher);
      return item.email === enrolledData.courseTeacher;
    }
    
    // If no teacher email available, show all assignments for now
    console.log("No teacher email found, showing all assignments");
    return true;
  });
  
  console.log("Filtered assignments:", filterAssignment);

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

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-4 text-lg">Loading assignments...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Show message if no enrolled data
  if (!enrolledData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-warning max-w-md">
          <span>No enrolled class data found.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-evenly my-4">
        <h2 className="text-3xl">Assignments for {enrolledData.classname}</h2>
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
        {filterAssignment.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No Assignments Found</h3>
            <p className="text-gray-600">
              There are no assignments available for {enrolledData.classname} at the moment.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default MyEnrollClassDetails;

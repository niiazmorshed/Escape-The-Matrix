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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments for {enrolledData.classname}</h2>
      </div>
      <hr className="border-dotted" />
      <div className="flex justify-center my-6">
        <button
          className="btn bg-blue-600 text-white hover:bg-blue-700 border-none"
          onClick={() => document.getElementById("modal").showModal()}
        >
          Submit Feedback
        </button>
      </div>
      <dialog id="modal" className="modal">
        <div className="modal-box max-w-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                placeholder="Enter your feedback"
                type="text"
                {...register("description", { required: true })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
              <div className="flex items-center gap-3">
                <ReactStars size={28}></ReactStars>
                <input
                  type="number"
                  min={1}
                  max={5}
                  {...register("ratting", { required: true })}
                  className="w-20 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <form method="dialog">
                <button className="btn btn-ghost">Cancel</button>
              </form>
              <button type="submit" className="btn bg-blue-600 text-white hover:bg-blue-700 border-none">Submit</button>
            </div>
          </form>
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
                          className="btn bg-blue-600 text-white hover:bg-blue-700 border-none"
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

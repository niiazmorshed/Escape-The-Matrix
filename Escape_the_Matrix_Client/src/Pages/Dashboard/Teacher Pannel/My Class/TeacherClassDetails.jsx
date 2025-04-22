import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useGetAssignment from "../../../../Hooks/useGetAssignment";
import Swal from "sweetalert2";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import PerdaySubmission from "./PerdaySubmission";
import TotoalAssignmentCard from "./TotoalAssignmentCard";

const TeacherClassDetails = () => {
  const [don, setdon] = useState([]);
  const [enroll, setEnroll] = useState([]);

  const { user } = useAuth();

  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const [, refetch] = useGetAssignment();

  const [teachersAssignment, setAllTeacherAssignment] = useState([]);

  useEffect(() => {
    axiosPublic.get(`/submittedass/${user?.email}`).then((res) => {
      setdon(res.data);
    });
  }, [axiosPublic, user]);

  useEffect(() => {
    axiosPublic
      .get(`/teacher-all-assignment/${user.email}`)
      .then((res) => setAllTeacherAssignment(res.data));
  }, [axiosPublic, user.email]);

  useEffect(() => {
    axiosPublic.get(`/totalenroll/${user.email}`).then((res) => {
      setEnroll(res.data);
    });
  }, [axiosPublic, user]);

  const onSubmit = (data) => {
    reset();

    const assInfo = {
      title: data.title,
      deadline: data.deadline,
      description: data.description,
      email: data.email,
    };

    axiosPublic.post("/assignment", assInfo).then((res) => {
      if (res.data.insertedId) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.title} Added to the class Successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  return (
    <div className="m-6">
      <div className="flex justify-center my-12 gap-6">
        {/* Asssignment Section */}
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-6xl font-semibold ">Assignment</h2>
            <div className="flex justify-center p-4 my-10">
              <button
                className="btn btn-outline btn-warning"
                onClick={() => document.getElementById("modal").showModal()}
              >
                Create
              </button>
            </div>
          </div>
          {/* Start */}
          <dialog id="modal" className="modal">
            <div className="modal-box w-11/12 max-w-5xl ">
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex gap-6">
                    {/* Name */}
                    <div className="form-control w-full my-6">
                      <label className="label">
                        <span className="label-text">Title</span>
                      </label>
                      <input
                        {...register("title", { required: true })}
                        className="input input-bordered w-full"
                      />
                    </div>
                    {/* Image */}
                    <div className="form-control w-full my-6">
                      <label className="label">
                        <span className="label-text">Deadlines</span>
                      </label>
                      <input
                        type="date"
                        placeholder="Enter Deadlines"
                        {...register("deadline", { required: true })}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-6">
                    {/* Name */}
                    <div className="form-control w-full my-6">
                      <label className="label">
                        <span className="label-text">
                          Assignment Descriptions
                        </span>
                      </label>
                      <input
                        placeholder="Enter Description"
                        type="text"
                        {...register("description", { required: true })}
                        className="input input-bordered w-full"
                      />
                    </div>

                    {/* {Mail} */}
                    <div className="form-control w-full my-6">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        {...register("email", { required: true })}
                        className="input input-bordered w-full"
                      />
                    </div>
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
        </div>

        {/* Quiz Modal */}

        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-6xl font-semibold ">Quiz</h2>
            <div className="flex justify-center p-4 my-10">
              <button
                className="btn btn-outline btn-warning"
                onClick={() =>
                  document.getElementById("my_modal_5").showModal()
                }
              >
                Start
              </button>
            </div>
          </div>
        </div>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <form>
              <div className="flex justify-center">
                <label className="text-2xl text-center font-semibold">
                  Quiz Title
                </label>
              </div>
              <div>
                {/* <label>Questions</label> */}
                {[0, 1, 2].map((_, index) => (
                  <div key={index}>
                    <input
                      className="input input-info w-full my-10 text-center text-xl font-bold"
                      placeholder="Enter Your Question"
                    />
                    <input
                      className="input input-bordered w-full"
                      placeholder="Option 1"
                    />
                    <input
                      {...register(`questions[${index}].option3`)}
                      placeholder="Option 2"
                      className="input input-bordered w-full my-2"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <button className="btn btn-outline btn-accent" type="submit">
                  Create Quiz
                </button>
              </div>
            </form>

            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
      <hr className="border-dotted" />
      <div className="m-6">
        {/* Class Progress Section */}
        <div className=" flex justify-center card  bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-center text-4xl font-semibold min-h-96">
              <h2 className="card-title text-6xl font-semibold ">
                Total Enrollment Card-{" "}
                <span className="font-bold">{enroll.length}</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl p-6 my-6">
          <div className="card-body">
            <div className="flex justify-center text-4xl font-semibold">
              <h1>Total Assignment</h1>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {teachersAssignment.map((i) => (
                <TotoalAssignmentCard
                  key={i._id}
                  totalCard={i}
                ></TotoalAssignmentCard>
              ))}
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-6 my-6">
          <div className="flex justify-center text-4xl font-semibold">
            <h1>Per Day Submission</h1>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-3 gap-6">
              {don.map((i) => (
                <PerdaySubmission key={i._id} submission={i}></PerdaySubmission>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassDetails;

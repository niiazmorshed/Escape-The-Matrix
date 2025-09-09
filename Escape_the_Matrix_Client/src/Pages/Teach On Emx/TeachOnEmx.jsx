import { useForm } from "react-hook-form";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import { Helmet } from "react-helmet";
import Navbar from "../Navbar/Navbar";

const TeachOnEmx = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  //   const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const onSubmit = async (data) => {
    console.log(data);

    const requestInfo = {
      name: data.name,
      title: data.title,
      image: data.image,
      email: data.email,
      category: data.category,
      experience: data.experience,
      approved: false,
    };
    const requestRes = await axiosSecure.post("/request", requestInfo);
    console.log(requestRes.data);
    reset();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `${data.name} Applied Successfully`,
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{"Teach On EMX"}|EMX</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Navbar></Navbar>
      <div className="text-center  mb-12 sm :p-4 ">
        <h1 className="text-4xl font-semibold">Become a Teacher Today</h1>
      </div>
      <div className="m-12  "> 
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-6">
            {/* Name */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter Your Name"
                {...register("name", { required: true })}
                className="input input-bordered w-full"
              />
            </div>

            {/* Image */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Image</span>
              </label>
              <input
                placeholder="Enter Photo URL"
                {...register("image", { required: true })}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="flex gap-6">
            {/* Name */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter Title"
                {...register("title", { required: true })}
                className="input input-bordered w-full"
              />
            </div>

            {/* Image */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                readOnly
                defaultValue={user?.email}
                {...register("email", { required: true })}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="flex gap-6">
            {/* category */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                defaultValue="default"
                {...register("category", { required: true })}
                className="select select-bordered w-full"
              >
                <option disabled value="default">
                  Select a category
                </option>
                <option value="Web Development">Web Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Machine Learning">
                  Machine Learning Basics
                </option>
                <option value="advanced_javaScript">Advanced JavaScript</option>
                <option value="artificial_intelligence">
                  Artificial Intelligence
                </option>
              </select>
            </div>

            {/* {Experience} */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Experience</span>
              </label>
              <select
                defaultValue="default"
                {...register("experience", { required: true })}
                className="select select-bordered w-full"
              >
                <option disabled value="default">
                  Select Experience
                </option>
                <option value="beginner">Beginner</option>
                <option value="experienced">Experienced</option>
                <option value="mid-level">Mid-Level</option>
              </select>
            </div>
          </div>
          <button className="my-6 text-xl btn btn-block bg-yellow-700">
            Submit For Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeachOnEmx;

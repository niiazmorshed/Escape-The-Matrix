import { useForm } from "react-hook-form";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddClass = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const nevigate = useNavigate();
  const onSubmit = async (data) => {
    console.log(data);
    const classInfo = {
      name: data.name,
      title: data.title,
      image: data.image,
      email: data.email,
      price: parseInt(data.price),
      shortDescription: data.descriptions,
      approved: false,
    };
    const addClassRes = await axiosSecure.post("/addclass", classInfo);
    console.log(addClassRes.data);
    reset();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `${data.title} Added to the class Successfully`,
      showConfirmButton: false,
      timer: 1500,
    });
    nevigate("/dashboard/myclass");
  };
  return (
    <div className="m-12 p-12">
      <h2 className=" mb-12 text-4xl font-bold text-center">Add a Class</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              <span className="label-text">Name</span>
            </label>
            <input
              readOnly
              defaultValue={user?.displayName}
              type="text"
              {...register("name", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          {/* {Mail} */}
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
          {/* Price */}
          <div className="form-control w-full my-6">
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input
              type="number"
              placeholder="Enter price"
              {...register("price", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          {/* {Mail} */}
          <div className="form-control w-full my-6">
            <label className="label">
              <span className="label-text">Descriptions</span>
            </label>
            <input
              type="text"
              placeholder="Enter Descriptions"
              {...register("descriptions", { required: true })}
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <button className="my-6 text-xl btn btn-block bg-green-700">
          Add Class
        </button>
      </form>
    </div>
  );
};

export default AddClass;

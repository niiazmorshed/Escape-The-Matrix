import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

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
    <div className="px-4 py-10 md:py-12">
      <h2 className="mb-10 text-4xl font-bold text-center text-gray-900 dark:text-white">Add a Class</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" placeholder="Enter Title" {...register("title", { required: true })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          {/* Image */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
            <input placeholder="Enter Photo URL" {...register("image", { required: true })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input readOnly defaultValue={user?.displayName} type="text" {...register("name", { required: true })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed" />
          </div>

          {/* {Mail} */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input readOnly defaultValue={user?.email} {...register("email", { required: true })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Price */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
            <input type="number" placeholder="Enter price" {...register("price", { required: true })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          {/* {Mail} */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descriptions</label>
            <input type="text" placeholder="Enter Descriptions" {...register("descriptions", { required: true })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
        </div>
        <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
          Add Class
        </button>
      </form>
    </div>
  );
};

export default AddClass;

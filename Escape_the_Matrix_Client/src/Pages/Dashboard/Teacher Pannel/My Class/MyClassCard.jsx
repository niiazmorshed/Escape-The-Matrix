import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const MyClassCard = ({ card, refetch }) => {
  const { name, title, image, price, description, email, _id } = card;
  const { register, handleSubmit, reset } = useForm();
  const axiosSecuer = useAxiosSecure();

  const onSubmit = async (data) => {
    const classInfo = {
      name: data.name,
      title: data.title,
      image: data.image,
      email: data.email,
      price: parseInt(data.price),
      description: data.description,
    };

    axiosSecuer.patch(`/updateteacherclass/${_id}`, classInfo).then((res) => {
      if (res.data.modifiedCount) {
        reset();
        refetch();
        Swal.fire({
          title: "Data Update Successfully",
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

  const handleDeleted = (id) => {
    axiosSecuer.delete(`/delete-cls/${id}`)
    .then(res=>{
      if(res.data.deletedCount){
        refetch();
        Swal.fire({
          title: `${title} Deleted Successfully`,
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
    })
  };
  return (
    <div data-aos="fade-up" data-aos-duration="800" className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-200 dark:border-gray-700 w-full max-w-xs">
      <figure className="max-h-44">
        <img src={image} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105" />
      </figure>
      <div>
        <div className="px-3 my-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
          <div className="text-gray-600 dark:text-gray-300">Added By {name}</div>
          <div className="flex items-center gap-2 mt-1 text-gray-700 dark:text-gray-200">
            <p className="font-semibold">Price: ${price}</p>
          </div>
        </div>
        <div className="px-3 pb-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
        </div>
        <hr className="border-dashed border-gray-200 dark:border-gray-700" />
      </div>
      <div className="flex items-center justify-between p-2">
        <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700 border-none" onClick={() => document.getElementById("modal").showModal()}>
          Update
        </button>
        <button onClick={() => handleDeleted(_id)} className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-none">
          Delete
        </button>
        {card.approved && (
          <NavLink to={`/dashboard/teacherclassdeetails/${_id}`}>
            <button className="btn btn-sm bg-amber-500 text-white hover:bg-amber-600 border-none">View Details</button>
          </NavLink>
        )}
      </div>
      {/* Sstart */}
      <dialog id="modal" className="modal">
        <div className="modal-box max-w-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  defaultValue={title}
                  {...register("title", { required: true })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                <input
                  defaultValue={image}
                  {...register("image", { required: true })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  readOnly
                  defaultValue={name}
                  type="text"
                  {...register("name", { required: true })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  readOnly
                  defaultValue={email}
                  {...register("email", { required: true })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                <input
                  defaultValue={price}
                  type="number"
                  {...register("price", { required: true })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  defaultValue={description}
                  {...register("description", { required: true })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">Update</button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyClassCard;

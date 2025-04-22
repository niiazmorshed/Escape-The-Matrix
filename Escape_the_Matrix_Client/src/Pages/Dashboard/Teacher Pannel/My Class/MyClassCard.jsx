import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

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
    <div
      data-aos="fade-up"
      data-aos-duration="2000"
      className="sm: p-4 sm: m-4 card bg-base-100 shadow-lg shadow-green-700/50"
    >
      <figure className=" max-h-72  min-w-72">
        <img src={image} />
      </figure>
      <div>
        <div className="pl-4 my-4  max-h-30 ">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <div>
            <h2>Added By {name}</h2>
          </div>
          <div className="flex items-center gap-2 align-middle">
            <p className="font-bold">Price- {price}</p>
          </div>
        </div>
        <div className="flex p-4 justify-between ">
          <div className="text-xl font-normal">
            <p> {description}</p>
          </div>

        </div>
        <hr className="border-dashed" />
      </div>
      <div className="flex items-center justify-between p-4">
        <button
          className="btn btn-outline btn-accent"
          onClick={() => document.getElementById("modal").showModal()}
        >
          Update
        </button>
        <button
          onClick={() => handleDeleted(_id)}
          className="btn btn-outline btn-error"
        >
          Delete
        </button>
        {card.approved && (
          <NavLink to={`/dashboard/teacherclassdeetails/${_id}`}>
            <button className="btn btn-outline btn-warning">
              View Details
            </button>
          </NavLink>
        )}
      </div>
      {/* Sstart */}
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
                    defaultValue={title}
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
                    defaultValue={image}
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
                    defaultValue={name}
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
                    defaultValue={email}
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
                    defaultValue={price}
                    {...register("price", { required: true })}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* {Mail} */}
                <div className="form-control w-full my-6">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    defaultValue={description}
                    {...register("description", { required: true })}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <button className="my-6 text-xl btn btn-block bg-green-700">
                Update
              </button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyClassCard;

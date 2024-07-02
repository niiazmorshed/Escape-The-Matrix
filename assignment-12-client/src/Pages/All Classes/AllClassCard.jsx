
import { NavLink } from "react-router-dom";

const AllClassCard = ({ cla }) => {
  const { _id, title, name, price, shortDescription, image } =
    cla;
  return (
    <div
      data-aos="fade-up"
      data-aos-duration="2000"
      className="sm:  sm: md: p-20 card bg-base-100 shadow-lg shadow-green-700/50 mt-32"
    >
      <figure className=" max-h-72  min-w-72">
        <img src={image} />
      </figure>
      <div>
        <div className="pl-4 my-4  max-h-30 ">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <div className="flex justify-between mt-4">
            <p className="text-green-600 font-medium ">{name}</p>
          </div>
        </div>
        <p className="font-bold my-4">{shortDescription}</p>
        <hr className="border-dashed" />
      </div>
      <div className="flex items-center justify-between p-4">
        <p>
          <span className="text-yellow-700 font-extrabold text-xl">
            {price}
          </span>
          /$
        </p>
        <NavLink to={`/classdetails/${_id}`}>
          <button className="btn   bg-yellow-700">Enroll</button>
        </NavLink>
      </div>
    </div>
  );
};

export default AllClassCard;

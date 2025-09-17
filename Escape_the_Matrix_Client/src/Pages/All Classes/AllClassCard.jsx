
import { NavLink } from "react-router-dom";

const AllClassCard = ({ cla }) => {
  const { _id, title, name, price, shortDescription, image } =
    cla;
  return (
    <div
      data-aos="fade-up"
      data-aos-duration="1000"
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 text-center ring-1 ring-transparent hover:ring-blue-400 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Circle Image */}
      <div className="mx-auto w-36 h-36 rounded-full overflow-hidden ring-4 ring-transparent group-hover:ring-blue-500 transition-all duration-300">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Title & Meta */}
      <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-sm text-blue-600 dark:text-blue-300">By {name}</p>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{shortDescription}</p>

      {/* Price & CTA */}
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
          ${price}
        </span>
        <NavLink to={`/classdetails/${_id}`}>
          <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0">Enroll</button>
        </NavLink>
      </div>
    </div>
  );
};

export default AllClassCard;

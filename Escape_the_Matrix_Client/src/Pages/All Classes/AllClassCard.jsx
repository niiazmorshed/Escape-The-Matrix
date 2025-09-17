
import { NavLink } from "react-router-dom";

const AllClassCard = ({ cla }) => {
  const { _id, title, name, price, shortDescription, image } =
    cla;
  return (
    <div
      data-aos="fade-up"
      data-aos-duration="1200"
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
          ${price}
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
            By {name}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {shortDescription}
        </p>
      </div>

      <div className="px-5 pb-5">
        <hr className="border-gray-200 dark:border-gray-700 mb-4" />
        <NavLink to={`/classdetails/${_id}`} className="block">
          <button className="btn w-full bg-blue-600 hover:bg-blue-700 text-white border-0">Enroll</button>
        </NavLink>
      </div>
    </div>
  );
};

export default AllClassCard;

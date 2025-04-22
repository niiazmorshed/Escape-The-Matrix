
import { NavLink } from 'react-router-dom';

const MyEnrollCard = ({enrollCard}) => {
    const {classname, image, name,_id,courseTeacher  } = enrollCard;
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
            <h2 className="text-3xl font-semibold">{classname}</h2>
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-2">
              </div>
            </div>
          </div>
          <div className="flex p-4 justify-between ">
            <div className="text-xl font-normal">
              <p> {name}</p>
              <p>Instructor- {courseTeacher}</p>
            </div>
          </div>
          <hr className="border-dashed" />
        </div>
        <div className="flex items-center justify-between p-4">
  
          <NavLink to={`/dashboard/enrollclassdetails/${_id}`} >
            <button className="btn btn-outline btn-accent">Continue</button>
          </NavLink>
        </div>
      </div>
    );
};

export default MyEnrollCard;
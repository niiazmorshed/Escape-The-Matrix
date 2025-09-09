
import { FaArrowRight, FaBookOpen, FaPlay, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const MyEnrollCard = ({enrollCard}) => {
    const {classname, image, name,_id,courseTeacher  } = enrollCard;
    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={classname}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <FaPlay className="text-primary text-sm" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300">
              {classname}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <FaUser className="mr-2" />
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <FaBookOpen className="mr-2" />
              <span>Instructor: {courseTeacher}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
            </div>
          </div>

          {/* Action Button */}
          <NavLink to={`/dashboard/enrollclassdetails/${_id}`}>
            <button className="w-full bg-primary text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-secondary hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
              <span>Continue Learning</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </NavLink>
        </div>
      </div>
    );
};

export default MyEnrollCard;
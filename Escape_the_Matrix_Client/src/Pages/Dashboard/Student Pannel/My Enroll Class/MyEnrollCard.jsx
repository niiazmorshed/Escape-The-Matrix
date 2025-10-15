
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCalendar, FaClock, FaPlay, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import useAxiosPublic from '../../../../Hooks/useAxiosPublic';

const MyEnrollCard = ({enrollCard}) => {
    const axiosPublic = useAxiosPublic();
    const [classDetails, setClassDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const { 
      _id, 
      courseId, 
      enrolledDate, 
      lastAccessedAt,
      classDetails: initialClassDetails 
    } = enrollCard;

    // Fetch class details if not provided
    useEffect(() => {
      const fetchClassDetails = async () => {
        if (initialClassDetails) {
          setClassDetails(initialClassDetails);
          setLoading(false);
          return;
        }

        if (courseId) {
          try {
            console.log("Fetching class details for courseId:", courseId);
            const res = await axiosPublic.get(`/cla/${courseId}`);
            console.log("Class details fetched:", res.data);
            setClassDetails(res.data);
          } catch (error) {
            console.error("Error fetching class details:", error);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchClassDetails();
    }, [courseId, initialClassDetails, axiosPublic]);

    // Handle both old and new data structure
    const courseName = classDetails?.title || enrollCard.classname || 'Course Name';
    const courseImage = classDetails?.image || enrollCard.image || 'https://via.placeholder.com/400x300?text=Course+Image';
    const instructorName = classDetails?.name || enrollCard.courseTeacher || 'Instructor';
    const coursePrice = classDetails?.price || enrollCard.price || 0;

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    if (loading) {
      return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 h-96 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      );
    }

    return (
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img 
            src={courseImage} 
            alt={courseName}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Enrolled Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Enrolled
            </span>
          </div>
          
          {/* Price Badge */}
          {coursePrice > 0 && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                ${coursePrice}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {courseName}
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
              <FaUser className="mr-2" />
              <span>Instructor: {instructorName}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
              <FaCalendar className="mr-2" />
              <span>Enrolled: {formatDate(enrolledDate)}</span>
            </div>
            {lastAccessedAt && (
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                <FaClock className="mr-2" />
                <span>Last accessed: {formatDate(lastAccessedAt)}</span>
              </div>
            )}
          </div>

          {/* Progress Badge */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Course Progress</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
          </div>

          {/* Action Button */}
          <NavLink to={`/dashboard/course/${courseId}/assessments`}>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
              <FaPlay className="text-sm" />
              <span>Continue Course</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </NavLink>
        </div>
      </div>
    );
};

export default MyEnrollCard;
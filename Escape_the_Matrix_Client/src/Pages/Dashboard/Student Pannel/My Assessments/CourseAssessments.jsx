import { useEffect, useState } from 'react';
import { FaArrowLeft, FaBook } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPublic from '../../../../Hooks/useAxiosPublic';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import AssessmentCard from './AssessmentCard';

const CourseAssessments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  
  const [assessments, setAssessments] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAssessments();
  }, [courseId]);

  const fetchCourseAssessments = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching assessments for course:', courseId);

      // Fetch course details
      const courseRes = await axiosPublic.get(`/cla/${courseId}`);
      setCourseDetails(courseRes.data);
      console.log('✅ Course details:', courseRes.data);

      // Fetch assessments for this specific course
      const assessmentsRes = await axiosSecure.get(`/api/student/course/${courseId}/assessments`);
      
      if (assessmentsRes.data?.success) {
        setAssessments(assessmentsRes.data.data || []);
        console.log('✅ Course assessments loaded:', assessmentsRes.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching course assessments:', error);
      // If specific endpoint doesn't exist, try the general dashboard endpoint and filter
      try {
        const allAssessmentsRes = await axiosSecure.get('/api/student/dashboard/assessments');
        if (allAssessmentsRes.data?.success) {
          const filteredAssessments = allAssessmentsRes.data.data.filter(
            assessment => assessment.classId === courseId
          );
          setAssessments(filteredAssessments);
          console.log('✅ Filtered assessments for course:', filteredAssessments);
        }
      } catch (fallbackError) {
        console.error('❌ Fallback error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/myenrollclasses')}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
      >
        <FaArrowLeft />
        <span>Back to My Enrolled Classes</span>
      </button>

      {/* Course Header */}
      {courseDetails && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FaBook className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {courseDetails.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Instructor: {courseDetails.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assessments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Assessments
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {assessments.length} {assessments.length === 1 ? 'Assessment' : 'Assessments'}
          </span>
        </div>

        {assessments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No Assessments Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Your instructor hasn't created any assessments for this course yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <AssessmentCard key={assessment._id} assessment={assessment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseAssessments;


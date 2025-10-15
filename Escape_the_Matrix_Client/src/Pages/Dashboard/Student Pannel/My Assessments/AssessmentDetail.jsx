import { useEffect, useState } from 'react';
import { BsChatDots } from 'react-icons/bs';
import { FaArrowLeft, FaCalendar, FaCheckCircle, FaClock, FaStar } from 'react-icons/fa';
import { MdAssignment, MdQuiz } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import SubmitAssignment from './SubmitAssignment';
import SubmitDiscussion from './SubmitDiscussion';
import TakeQuiz from './TakeQuiz';

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  const [assessment, setAssessment] = useState(null);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssessmentDetails();
    fetchMySubmissions();
  }, [assessmentId]);

  const fetchAssessmentDetails = async () => {
    try {
      console.log(`🔍 Fetching assessment details for: ${assessmentId}`);
      const res = await axiosSecure.get(`/api/student/assessment/${assessmentId}`);
      
      if (res.data?.success) {
        console.log('✅ Assessment details:', res.data.data);
        setAssessment(res.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Error fetching assessment:', err);
      setError(err.response?.data?.message || 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubmissions = async () => {
    try {
      const res = await axiosSecure.get(`/api/student/assessment/${assessmentId}/my-submissions`);
      if (res.data?.success) {
        console.log('✅ My submissions:', res.data.data);
        setMySubmissions(res.data.data);
      }
    } catch (err) {
      console.error('❌ Error fetching submissions:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <MdAssignment className="text-3xl" />;
      case 'quiz':
        return <MdQuiz className="text-3xl" />;
      case 'discussion':
        return <BsChatDots className="text-3xl" />;
      default:
        return <MdAssignment className="text-3xl" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-600';
      case 'quiz':
        return 'bg-green-600';
      case 'discussion':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Failed to Load Assessment
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(assessment.dueDate) < new Date();
  const hasSubmitted = mySubmissions.length > 0;
  const latestSubmission = mySubmissions[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Assessments
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 ${getTypeBadgeColor(assessment.type)} rounded-xl flex items-center justify-center text-white`}>
                {getTypeIcon(assessment.type)}
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeBadgeColor(assessment.type)} mb-2`}>
                  {assessment.type.toUpperCase()}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {assessment.title}
                </h1>
              </div>
            </div>
            
            {hasSubmitted && (
              <div className="text-right">
                <FaCheckCircle className="text-green-500 text-3xl mb-2 ml-auto" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Submitted
                </span>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                <FaCalendar className="mr-2" />
                <span className="text-sm font-medium">Due Date</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatDate(assessment.dueDate)}
              </p>
              {isOverdue && !hasSubmitted && (
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  Overdue
                </span>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                <FaStar className="mr-2" />
                <span className="text-sm font-medium">Total Points</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {assessment.totalPoints}
              </p>
            </div>

            {assessment.attempts && assessment.type === 'quiz' && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                  <FaClock className="mr-2" />
                  <span className="text-sm font-medium">Attempts</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {mySubmissions.length} / {assessment.attempts}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {assessment.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {assessment.description}
              </p>
            </div>
          )}

          {/* Instructions */}
          {assessment.instructions && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Instructions
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {assessment.instructions}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Show submission or submission form */}
      {hasSubmitted ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your Submission
          </h2>
          
          <div className="space-y-4">
            {mySubmissions.map((submission, index) => (
              <div key={submission._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Submitted: {formatDate(submission.submittedAt)}
                  </span>
                  {submission.attemptNumber && (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Attempt {submission.attemptNumber}
                    </span>
                  )}
                </div>

                {submission.grade !== undefined && submission.grade !== null && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Grade:
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {submission.grade} / {assessment.totalPoints}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(submission.grade / assessment.totalPoints) * 100}%`,
                        }}
                      ></div>
                    </div>
                    
                    {submission.feedback && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Teacher Feedback:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {submission.submissionText && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Text Submission:
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {submission.submissionText}
                    </p>
                  </div>
                )}

                {submission.fileUrl && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      File:
                    </p>
                    <a
                      href={`http://escape-the-matrix-sigma.vercel.app${submission.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      📄 {submission.fileName}
                    </a>
                  </div>
                )}

                {submission.quizScore !== undefined && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Quiz Score:
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {submission.quizScore} / {assessment.totalPoints}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          {assessment.type === 'assignment' && (
            <SubmitAssignment
              assessmentId={assessmentId}
              assessment={assessment}
              onSubmitted={fetchMySubmissions}
            />
          )}
          {assessment.type === 'quiz' && (
            <TakeQuiz
              assessmentId={assessmentId}
              assessment={assessment}
              onSubmitted={fetchMySubmissions}
            />
          )}
          {assessment.type === 'discussion' && (
            <SubmitDiscussion
              assessmentId={assessmentId}
              assessment={assessment}
              onSubmitted={fetchMySubmissions}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentDetail;


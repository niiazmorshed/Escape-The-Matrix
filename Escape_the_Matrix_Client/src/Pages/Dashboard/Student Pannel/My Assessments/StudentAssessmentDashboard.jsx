import { BsChatDots } from 'react-icons/bs';
import { FaBookOpen, FaCheckCircle, FaClipboardList, FaClock } from 'react-icons/fa';
import { MdAssignment, MdOutlineRefresh, MdQuiz } from 'react-icons/md';
import useStudentAssessments from "../../../../Hooks/useStudentAssessments";
import AssessmentCard from './AssessmentCard';

const StudentAssessmentDashboard = () => {
  const [assessments, isLoading, refetch] = useStudentAssessments();

  console.log("📊 Student assessments:", assessments);

  // Calculate statistics
  const totalAssessments = assessments.length;
  const completedAssessments = assessments.filter(
    (a) => a.submissionCount > 0
  ).length;
  const pendingAssessments = totalAssessments - completedAssessments;
  
  // Get upcoming (not submitted and not past due)
  const upcomingAssessments = assessments.filter(
    (a) => a.submissionCount === 0 && new Date(a.dueDate) > new Date()
  ).length;

  // Group by type
  const assignments = assessments.filter((a) => a.type === 'assignment');
  const quizzes = assessments.filter((a) => a.type === 'quiz');
  const discussions = assessments.filter((a) => a.type === 'discussion');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaClipboardList className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                My Assessments
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Track your assignments, quizzes, and discussions
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="btn btn-outline btn-sm"
            title="Refresh assessments"
          >
            <MdOutlineRefresh className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Total Assessments
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalAssessments}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FaBookOpen className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {completedAssessments}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Pending
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {pendingAssessments}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <FaClock className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Upcoming
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {upcomingAssessments}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FaClipboardList className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Type Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Assignments</p>
              <p className="text-2xl font-bold">{assignments.length}</p>
            </div>
            <MdAssignment className="text-4xl opacity-50" />
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Quizzes</p>
              <p className="text-2xl font-bold">{quizzes.length}</p>
            </div>
            <MdQuiz className="text-4xl opacity-50" />
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Discussions</p>
              <p className="text-2xl font-bold">{discussions.length}</p>
            </div>
            <BsChatDots className="text-4xl opacity-50" />
          </div>
        </div>
      </div>

      {/* Assessments List */}
      {totalAssessments === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaClipboardList className="text-gray-400 dark:text-gray-500 text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No Assessments Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your teachers haven't created any assessments yet. Check back later!
          </p>
          <button
            onClick={() => refetch()}
            className="btn btn-outline px-8 py-3 rounded-xl font-semibold"
          >
            Refresh Data
          </button>
        </div>
      ) : (
        <>
          {/* Pending Assessments */}
          {pendingAssessments > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaClock className="mr-3 text-orange-500" />
                Pending Assessments ({pendingAssessments})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments
                  .filter((a) => a.submissionCount === 0)
                  .map((assessment, index) => (
                    <div
                      key={assessment._id}
                      className="transform transition-all duration-300 hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <AssessmentCard assessment={assessment} />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Completed Assessments */}
          {completedAssessments > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaCheckCircle className="mr-3 text-green-500" />
                Completed Assessments ({completedAssessments})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments
                  .filter((a) => a.submissionCount > 0)
                  .map((assessment, index) => (
                    <div
                      key={assessment._id}
                      className="transform transition-all duration-300 hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <AssessmentCard assessment={assessment} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentAssessmentDashboard;


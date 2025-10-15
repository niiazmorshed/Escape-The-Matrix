import { BsChatDots } from 'react-icons/bs';
import { FaBook, FaCalendar, FaCheckCircle, FaClock, FaStar } from 'react-icons/fa';
import { MdAssignment, MdQuiz } from 'react-icons/md';
import { Link } from 'react-router-dom';

const AssessmentCard = ({ assessment }) => {
  const {
    _id,
    title,
    type,
    dueDate,
    totalPoints,
    classTitle,
    classImage,
    mySubmissions = [],
    submissionCount,
  } = assessment;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if overdue
  const isOverdue = new Date(dueDate) < new Date() && submissionCount === 0;
  const isCompleted = submissionCount > 0;
  
  // Get submission details
  const latestSubmission = mySubmissions[0];
  const grade = latestSubmission?.grade;
  const hasGrade = grade !== undefined && grade !== null;

  // Get type-specific styles and icons
  const getTypeConfig = () => {
    switch (type) {
      case 'assignment':
        return {
          icon: MdAssignment,
          bgColor: 'from-blue-500 to-blue-600',
          badgeColor: 'bg-blue-600',
          textColor: 'text-blue-600 dark:text-blue-400',
        };
      case 'quiz':
        return {
          icon: MdQuiz,
          bgColor: 'from-green-500 to-green-600',
          badgeColor: 'bg-green-600',
          textColor: 'text-green-600 dark:text-green-400',
        };
      case 'discussion':
        return {
          icon: BsChatDots,
          bgColor: 'from-purple-500 to-purple-600',
          badgeColor: 'bg-purple-600',
          textColor: 'text-purple-600 dark:text-purple-400',
        };
      default:
        return {
          icon: FaBook,
          bgColor: 'from-gray-500 to-gray-600',
          badgeColor: 'bg-gray-600',
          textColor: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  const typeConfig = getTypeConfig();
  const TypeIcon = typeConfig.icon;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${typeConfig.bgColor} p-4 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <TypeIcon className="text-white text-xl" />
            </div>
            <div>
              <span className="text-xs text-white/80 uppercase tracking-wider font-semibold">
                {type}
              </span>
              <h3 className="text-lg font-bold text-white line-clamp-2">
                {title}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Class Info */}
        {classTitle && (
          <div className="mb-4 flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              {classImage ? (
                <img
                  src={classImage}
                  alt={classTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <FaBook className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {classTitle}
              </p>
            </div>
          </div>
        )}

        {/* Due Date */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm">
            <FaCalendar className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              Due: {formatDate(dueDate)}
            </span>
          </div>
          
          {/* Overdue warning */}
          {isOverdue && (
            <div className="flex items-center text-sm text-red-600 dark:text-red-400 font-semibold">
              <FaClock className="mr-2" />
              <span>Overdue!</span>
            </div>
          )}
        </div>

        {/* Points */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaStar className="mr-2 text-yellow-500" />
            <span>Total Points: <strong>{totalPoints}</strong></span>
          </div>
        </div>

        {/* Status & Grade */}
        <div className="mb-4">
          {isCompleted ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Submitted
                </span>
              </div>
              {hasGrade && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Your Grade:
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {grade}/{totalPoints}
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(grade / totalPoints) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              {!hasGrade && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  Pending grading...
                </p>
              )}
            </div>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center">
                <FaClock className="mr-2 text-orange-500" />
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  {isOverdue ? 'Overdue - Not Submitted' : 'Not Submitted'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link to={`/dashboard/assessment/${_id}`}>
          <button
            className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 ${
              isCompleted
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                : isOverdue
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gradient-to-r ' + typeConfig.bgColor + ' text-white hover:shadow-lg'
            }`}
          >
            <span>
              {isCompleted ? 'View Submission' : isOverdue ? 'Submit Now' : 'Start Assessment'}
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AssessmentCard;


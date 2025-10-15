import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import CreateAssignmentModal from "./CreateAssignmentModal";
import CreateDiscussionModal from "./CreateDiscussionModal";
import CreateQuizModal from "./CreateQuizModal";

const TeacherClassDetails = () => {
  const { id: classId } = useParams();
  const navigate = useNavigate();
  const [enroll, setEnroll] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);

  const { user } = useAuth();

  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  // Fetch enrollment count
  useEffect(() => {
    axiosPublic.get(`/totalenroll/${user.email}`).then((res) => {
      setEnroll(res.data);
    });
  }, [axiosPublic, user]);

  // Fetch new assessments from backend
  useEffect(() => {
    fetchAssessments();
  }, [classId]);

  const fetchAssessments = async () => {
    if (!classId) return;
    
    setLoadingAssessments(true);
    try {
      console.log("🔍 Fetching assessments for class:", classId);
      const res = await axiosSecure.get(`/api/teacher/class/${classId}/assessments`);
      
      if (res.data?.success) {
        console.log("✅ Assessments loaded:", res.data.data);
        setAssessments(res.data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching assessments:", error);
      toast.error("Failed to load assessments");
    } finally {
      setLoadingAssessments(false);
    }
  };

  const publishAssessment = async (assessmentId) => {
    try {
      const res = await axiosSecure.put(`/api/teacher/assessment/${assessmentId}/publish`);
      if (res.data?.success) {
        toast.success('Assessment published successfully!');
        fetchAssessments();
      }
    } catch (error) {
      toast.error('Failed to publish assessment');
    }
  };

  const deleteAssessment = async (assessmentId) => {
    try {
      const res = await axiosSecure.delete(`/api/teacher/assessment/${assessmentId}`);
      if (res.data?.success) {
        toast.success('Assessment deleted successfully!');
        fetchAssessments();
      }
    } catch (error) {
      toast.error('Failed to delete assessment');
    }
  };

  return (
    <div className="m-6">
      {/* New Assessment System */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assignment Card */}
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-4xl font-bold mb-4">📄 Assignment</h2>
              <p className="mb-6">Create assignment with file upload support</p>
              <button
                className="btn btn-warning btn-lg"
                onClick={() => document.getElementById('create_assignment_modal').showModal()}
              >
                Create
              </button>
            </div>
          </div>

          {/* Quiz Card */}
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-4xl font-bold mb-4">🧠 Quiz</h2>
              <p className="mb-6">Create quiz with auto-grading</p>
              <button
                className="btn btn-warning btn-lg"
                onClick={() => document.getElementById('create_quiz_modal').showModal()}
              >
                Start
              </button>
            </div>
          </div>

          {/* Discussion Card */}
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-4xl font-bold mb-4">💬 Discussion</h2>
              <p className="mb-6">Create discussion topic for students</p>
              <button
                className="btn btn-warning btn-lg"
                onClick={() => document.getElementById('create_discussion_modal').showModal()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Created Assessments List */}
      {loadingAssessments ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : assessments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className={`p-4 ${
                  assessment.type === 'assignment'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : assessment.type === 'quiz'
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-semibold uppercase tracking-wide">
                      {assessment.type === 'assignment' ? '📄 Assignment' : 
                       assessment.type === 'quiz' ? '🧠 Quiz' : '💬 Discussion'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        assessment.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : assessment.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {assessment.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white truncate">{assessment.title}</h3>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Due: {new Date(assessment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {assessment.totalPoints} pts
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {assessment.status === 'published' && (
                      <button
                        onClick={() => navigate(`/dashboard/assessment-submissions/${assessment._id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        View Submissions
                      </button>
                    )}
                    {assessment.status === 'draft' && (
                      <button
                        onClick={() => publishAssessment(assessment._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => deleteAssessment(assessment._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateAssignmentModal classId={classId} onSuccess={fetchAssessments} />
      <CreateQuizModal classId={classId} onSuccess={fetchAssessments} />
      <CreateDiscussionModal classId={classId} onSuccess={fetchAssessments} />

      {/* Class Overview Stats */}
      <div className="mt-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Class Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Enrollments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Enrollments</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">{enroll.length}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Assessments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Assessments</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">{assessments.length}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Published Assessments */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Published</p>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {assessments.filter(a => a.status === 'published').length}
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TeacherClassDetails;

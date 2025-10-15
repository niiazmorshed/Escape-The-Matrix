import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import GradeSubmissionModal from './GradeSubmissionModal';

const AssessmentSubmissions = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  const [assessment, setAssessment] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [gradingData, setGradingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, submitted, not-submitted, graded

  useEffect(() => {
    fetchGradingData();
  }, [assessmentId]);

  const fetchGradingData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching grading data for assessment:', assessmentId);

      // 1. Get assessment details
      const assessmentRes = await axiosSecure.get(`/api/teacher/assessment/${assessmentId}`);
      if (!assessmentRes.data?.success) {
        throw new Error('Failed to fetch assessment');
      }
      
      const assessmentData = assessmentRes.data.data;
      setAssessment(assessmentData);
      console.log('✅ Assessment loaded:', assessmentData);

      const classId = assessmentData.classId;

      // 2. Get all enrolled students
      const enrolledRes = await axiosSecure.get(`/class-enrollments/${classId}`);
      console.log('📥 Raw enrolled response:', enrolledRes.data);
      
      // Handle different response structures
      let enrolledData = [];
      if (Array.isArray(enrolledRes.data)) {
        enrolledData = enrolledRes.data;
      } else if (enrolledRes.data?.data && Array.isArray(enrolledRes.data.data)) {
        enrolledData = enrolledRes.data.data;
      } else if (enrolledRes.data?.success && Array.isArray(enrolledRes.data.enrollments)) {
        enrolledData = enrolledRes.data.enrollments;
      }
      
      setEnrolledStudents(enrolledData);
      console.log('✅ Enrolled students count:', enrolledData.length);
      console.log('✅ Enrolled students:', enrolledData);

      // 3. Get all submissions
      const submissionsRes = await axiosSecure.get(`/api/teacher/assessment/${assessmentId}/submissions`);
      const submissionsData = submissionsRes.data?.data || [];
      setSubmissions(submissionsData);
      console.log('✅ Submissions count:', submissionsData.length);
      console.log('✅ Submissions:', submissionsData);

      // 4. Merge data: Match students with submissions
      let merged = [];
      
      if (enrolledData.length > 0) {
        // If we have enrolled students, match them with submissions
        merged = enrolledData.map((student) => {
          const submission = submissionsData.find(
            (sub) => sub.studentEmail === student.studentEmail
          );

          return {
            studentId: student.studentId || student._id,
            studentEmail: student.studentEmail,
            studentName: submission?.studentName || student.studentEmail.split('@')[0],
            enrolledDate: student.enrolledDate,
            hasSubmitted: !!submission,
            submission: submission || null,
            status: submission?.status || 'not-submitted',
            submittedAt: submission?.submittedAt || null,
            isLate: submission?.isLate || false,
            grade: submission?.grade ?? null,
            feedback: submission?.feedback || null,
          };
        });
      } else if (submissionsData.length > 0) {
        // Fallback: If no enrolled students but have submissions, display submissions directly
        console.log('⚠️ No enrolled students found, displaying submissions directly');
        merged = submissionsData.map((submission) => ({
          studentId: submission.studentId,
          studentEmail: submission.studentEmail,
          studentName: submission.studentName || submission.studentEmail.split('@')[0],
          enrolledDate: null,
          hasSubmitted: true,
          submission: submission,
          status: submission.status || 'submitted',
          submittedAt: submission.submittedAt,
          isLate: submission.isLate || false,
          grade: submission.grade ?? null,
          feedback: submission.feedback || null,
        }));
      }

      setGradingData(merged);
      console.log('✅ Merged grading data count:', merged.length);
      console.log('✅ Merged grading data:', merged);
    } catch (error) {
      console.error('❌ Error fetching grading data:', error);
      toast.error('Failed to load grading data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = gradingData.filter((student) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'submitted') return student.hasSubmitted && student.status !== 'graded';
    if (filterStatus === 'not-submitted') return !student.hasSubmitted;
    if (filterStatus === 'graded') return student.status === 'graded';
    return true;
  });

  const stats = {
    total: gradingData.length,
    submitted: gradingData.filter((s) => s.hasSubmitted).length,
    notSubmitted: gradingData.filter((s) => !s.hasSubmitted).length,
    graded: gradingData.filter((s) => s.status === 'graded').length,
    pending: gradingData.filter((s) => s.hasSubmitted && s.status !== 'graded').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Assessment Not Found
        </h2>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          <FaArrowLeft className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Class
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {assessment.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Grade submissions and track student progress
              </p>
            </div>
            <span className={`badge ${
              assessment.type === 'assignment' ? 'badge-primary' :
              assessment.type === 'quiz' ? 'badge-success' : 'badge-secondary'
            } badge-lg`}>
              {assessment.type}
            </span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.submitted}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Not Submitted</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.notSubmitted}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Graded</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.graded}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('submitted')}
            className={`btn btn-sm ${filterStatus === 'submitted' ? 'btn-info' : 'btn-outline'}`}
          >
            Pending Grading ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('not-submitted')}
            className={`btn btn-sm ${filterStatus === 'not-submitted' ? 'btn-error' : 'btn-outline'}`}
          >
            Not Submitted ({stats.notSubmitted})
          </button>
          <button
            onClick={() => setFilterStatus('graded')}
            className={`btn btn-sm ${filterStatus === 'graded' ? 'btn-success' : 'btn-outline'}`}
          >
            Graded ({stats.graded})
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left">Student Name</th>
                <th className="text-left">Email</th>
                <th className="text-center">Status</th>
                <th className="text-center">Submitted At</th>
                <th className="text-center">Late?</th>
                <th className="text-center">Grade</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No students found for this filter
                  </td>
                </tr>
              ) : (
                filteredData.map((student, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      !student.hasSubmitted ? 'bg-red-50 dark:bg-red-900/10' :
                      student.status === 'graded' ? 'bg-green-50 dark:bg-green-900/10' : ''
                    }`}
                  >
                    <td className="font-medium text-gray-900 dark:text-white">
                      {student.studentName}
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      {student.studentEmail}
                    </td>
                    <td className="text-center">
                      {student.hasSubmitted ? (
                        student.status === 'graded' ? (
                          <span className="badge badge-success gap-2">
                            <FaCheckCircle /> Graded
                          </span>
                        ) : (
                          <span className="badge badge-info gap-2">
                            <FaClock /> Submitted
                          </span>
                        )
                      ) : (
                        <span className="badge badge-error gap-2">
                          <FaTimes /> Not Submitted
                        </span>
                      )}
                    </td>
                    <td className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {student.submittedAt
                        ? new Date(student.submittedAt).toLocaleString()
                        : '-'}
                    </td>
                    <td className="text-center">
                      {student.isLate ? (
                        <span className="badge badge-warning badge-sm">⚠️ Late</span>
                      ) : student.hasSubmitted ? (
                        <span className="text-green-600 dark:text-green-400">✓ On Time</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="text-center">
                      {student.grade !== null ? (
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {student.grade}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="text-center">
                      {student.hasSubmitted ? (
                        <button
                          onClick={() => setSelectedSubmission(student.submission)}
                          className={`btn btn-sm ${
                            student.status === 'graded' ? 'btn-outline' : 'btn-primary'
                          }`}
                        >
                          {student.status === 'graded' ? 'View' : 'Grade'}
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal */}
      {selectedSubmission && (
        <GradeSubmissionModal
          submission={selectedSubmission}
          assessment={assessment}
          onClose={() => setSelectedSubmission(null)}
          onGraded={fetchGradingData}
        />
      )}
    </div>
  );
};

export default AssessmentSubmissions;


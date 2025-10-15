import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaDownload, FaTimes } from 'react-icons/fa';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const GradeSubmissionModal = ({ submission, assessment, onClose, onGraded }) => {
  const axiosSecure = useAxiosSecure();
  const [gradeForm, setGradeForm] = useState({
    grade: submission.grade || '',
    feedback: submission.feedback || '',
  });
  const [grading, setGrading] = useState(false);

  const handleGrade = async () => {
    if (!gradeForm.grade || gradeForm.grade < 0 || gradeForm.grade > assessment.totalPoints) {
      toast.error(`Grade must be between 0 and ${assessment.totalPoints}`);
      return;
    }

    setGrading(true);

    try {
      console.log('📤 Grading submission:', submission._id);
      const res = await axiosSecure.put('/api/teacher/grade-submission', {
        submissionId: submission._id,
        grade: parseFloat(gradeForm.grade),
        feedback: gradeForm.feedback,
      });

      if (res.data?.success) {
        toast.success('Submission graded successfully!');
        onGraded && onGraded();
        onClose();
      }
    } catch (error) {
      console.error('❌ Error grading submission:', error);
      toast.error(error.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const isGraded = submission.status === 'graded';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isGraded ? 'View Submission' : 'Grade Submission'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {assessment.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Student</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {submission.studentName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {submission.studentEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
                {submission.isLate && (
                  <span className="badge badge-warning badge-sm mt-1">⚠️ Late Submission</span>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <span className={`badge ${
                  assessment.type === 'assignment' ? 'badge-primary' :
                  assessment.type === 'quiz' ? 'badge-success' : 'badge-secondary'
                }`}>
                  {assessment.type}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Content */}
          {submission.submissionText && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Text Submission
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {submission.submissionText}
                </p>
              </div>
            </div>
          )}

          {/* File Download */}
          {submission.fileUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Attached File
              </h3>
              <a
                href={`http://localhost:5000${submission.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl p-4 transition-colors"
              >
                <FaDownload className="text-2xl" />
                <div>
                  <p className="font-semibold">{submission.fileName}</p>
                  <p className="text-sm opacity-75">Click to download</p>
                </div>
              </a>
            </div>
          )}

          {/* Quiz Score (if quiz) */}
          {submission.quizScore !== undefined && submission.quizScore !== null && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Quiz Score (Auto-Graded)
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {submission.quizScore} / {assessment.totalPoints}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(submission.quizScore / assessment.totalPoints) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Discussion Post */}
          {submission.discussionPost && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Discussion Post
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {submission.discussionPost}
                </p>
              </div>
            </div>
          )}

          {/* Grading Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            {isGraded ? (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Graded
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Grade</p>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                      {submission.grade} / {assessment.totalPoints}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(submission.grade / assessment.totalPoints) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {submission.feedback && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Feedback</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Enter Grade & Feedback
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Grade (0 - {assessment.totalPoints})</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter grade"
                      value={gradeForm.grade}
                      onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })}
                      min="0"
                      max={assessment.totalPoints}
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Feedback (Optional)</span>
                    </label>
                    <textarea
                      placeholder="Provide feedback to the student..."
                      value={gradeForm.feedback}
                      onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                      rows="4"
                      className="textarea textarea-bordered w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn btn-ghost"
          >
            Close
          </button>
          {!isGraded && (
            <button
              onClick={handleGrade}
              disabled={!gradeForm.grade || grading}
              className="btn btn-success"
            >
              {grading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Grading...
                </>
              ) : (
                'Submit Grade'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeSubmissionModal;


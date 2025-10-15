import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const TakeQuiz = ({ assessmentId, assessment, onSubmitted }) => {
  const axiosSecure = useAxiosSecure();
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const questions = assessment.content?.questions || [];

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all questions answered
    const unansweredQuestions = questions.filter((q) => !answers[q._id]);
    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions (${unansweredQuestions.length} remaining)`);
      return;
    }

    setSubmitting(true);

    try {
      // Format answers for API
      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        answer: answers[q._id],
      }));

      console.log('📤 Submitting quiz...');

      const response = await axiosSecure.post('/api/student/submit-quiz', {
        assessmentId,
        answers: formattedAnswers,
      });

      if (response.data?.success) {
        console.log('✅ Quiz submitted:', response.data);
        setResult(response.data);
        toast.success(`Quiz submitted! Score: ${response.data.score}/${response.data.totalPoints}`);
        
        // Notify parent
        setTimeout(() => {
          onSubmitted && onSubmitted();
        }, 2000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('❌ Quiz submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit quiz. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // If quiz is already submitted and we have results
  if (result) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quiz Results
        </h2>

        {/* Score Card */}
        <div className={`rounded-2xl p-6 mb-6 ${
          result.passed
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
            : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {result.score} / {result.totalPoints}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {((result.score / result.totalPoints) * 100).toFixed(1)}%
              </p>
            </div>
            <div className={`text-5xl ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
              {result.passed ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                result.passed ? 'bg-green-600' : 'bg-red-600'
              }`}
              style={{ width: `${(result.score / result.totalPoints) * 100}%` }}
            ></div>
          </div>
          <p className={`mt-4 text-lg font-semibold ${
            result.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {result.passed ? '✅ Passed!' : '❌ Failed'}
          </p>
        </div>

        {/* Answer Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Answer Review
          </h3>
          
          {result.data?.answers?.map((answer, index) => {
            const question = questions.find((q) => q._id === answer.questionId);
            if (!question) return null;

            return (
              <div
                key={answer.questionId}
                className={`rounded-lg p-4 border-2 ${
                  answer.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    {answer.isCorrect ? (
                      <FaCheckCircle className="text-green-500 mr-2" />
                    ) : (
                      <FaTimesCircle className="text-red-500 mr-2" />
                    )}
                    Question {index + 1}
                  </h4>
                  <span className={`font-bold ${
                    answer.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {answer.pointsEarned} / {question.points} pts
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {question.question}
                </p>
                <div className="bg-white dark:bg-gray-800 rounded p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your answer: <strong>{answer.answer?.toString()}</strong>
                  </p>
                </div>
                {question.explanation && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                    💡 {question.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Take Quiz
      </h2>

      {/* Quiz Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Questions</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {questions.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {assessment.totalPoints}
            </p>
          </div>
          {assessment.timeLimit && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time Limit</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FaClock className="mr-2" />
                {assessment.timeLimit} min
              </p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={question._id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question {index + 1}
              </h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                {question.points} pts
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {question.question}
            </p>

            {/* MCQ */}
            {question.type === 'mcq' && (
              <div className="space-y-2">
                {question.options?.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[question._id] === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option}
                      checked={answers[question._id] === option}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      className="radio radio-primary mr-3"
                    />
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* True/False */}
            {question.type === 'true-false' && (
              <div className="space-y-2">
                {['true', 'false'].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[question._id] === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option}
                      checked={answers[question._id] === option}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      className="radio radio-primary mr-3"
                    />
                    <span className="text-gray-900 dark:text-white capitalize">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Short Answer */}
            {question.type === 'short-answer' && (
              <input
                type="text"
                placeholder="Your answer"
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}

        {/* Progress */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {Object.keys(answers).length} / {questions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(Object.keys(answers).length / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || Object.keys(answers).length !== questions.length}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
            submitting || Object.keys(answers).length !== questions.length
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Submitting Quiz...
            </span>
          ) : (
            'Submit Quiz'
          )}
        </button>
      </form>
    </div>
  );
};

export default TakeQuiz;


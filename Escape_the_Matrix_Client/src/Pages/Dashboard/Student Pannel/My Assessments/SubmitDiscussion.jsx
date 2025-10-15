import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaComments } from 'react-icons/fa';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const SubmitDiscussion = ({ assessmentId, assessment, onSubmitted }) => {
  const axiosSecure = useAxiosSecure();
  const [discussionPost, setDiscussionPost] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!discussionPost.trim()) {
      toast.error('Please write your discussion post');
      return;
    }

    setSubmitting(true);

    try {
      console.log('📤 Submitting discussion post...');

      const response = await axiosSecure.post('/api/student/submit-discussion', {
        assessmentId,
        discussionPost: discussionPost.trim(),
      });

      if (response.data?.success) {
        console.log('✅ Discussion submitted:', response.data);
        toast.success('Discussion post submitted successfully!');
        
        // Reset form
        setDiscussionPost('');
        
        // Notify parent
        onSubmitted && onSubmitted();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('❌ Discussion submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit discussion. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const discussionPrompt = assessment.content?.discussionPrompt;
  const minResponses = assessment.content?.minResponses;
  const requirePeerResponse = assessment.content?.requirePeerResponse;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <FaComments className="mr-3 text-purple-600" />
        Discussion Post
      </h2>

      {/* Discussion Prompt */}
      {discussionPrompt && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Discussion Prompt
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {discussionPrompt}
          </p>
          
          {requirePeerResponse && minResponses && (
            <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-800 dark:text-purple-300">
                <strong>Note:</strong> You are required to respond to at least {minResponses} peer{minResponses > 1 ? 's' : ''} after posting.
              </p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Discussion Post */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Discussion Post
          </label>
          <textarea
            value={discussionPost}
            onChange={(e) => setDiscussionPost(e.target.value)}
            placeholder="Share your thoughts, ideas, and opinions..."
            rows="12"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Be thoughtful and respectful in your response
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {discussionPost.length} characters
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Discussion Guidelines
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <li>Support your opinions with evidence or examples</li>
            <li>Be respectful of diverse viewpoints</li>
            <li>Engage critically with the topic</li>
            <li>Use proper grammar and formatting</li>
            {requirePeerResponse && (
              <li>Remember to respond to at least {minResponses} peer post{minResponses > 1 ? 's' : ''}</li>
            )}
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !discussionPost.trim()}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
            submitting || !discussionPost.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Submitting...
            </span>
          ) : (
            'Submit Discussion Post'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmitDiscussion;


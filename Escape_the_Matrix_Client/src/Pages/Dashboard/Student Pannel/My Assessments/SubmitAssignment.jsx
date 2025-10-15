import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaFileAlt, FaTimes, FaUpload } from 'react-icons/fa';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const SubmitAssignment = ({ assessmentId, assessment, onSubmitted }) => {
  const axiosSecure = useAxiosSecure();
  const [submissionText, setSubmissionText] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();

      if (!allowedTypes.includes(fileExt)) {
        toast.error('Only PDF, DOC, and DOCX files are allowed');
        return;
      }

      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      toast.success(`File selected: ${selectedFile.name}`);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one submission type is provided
    if (!submissionText && !file) {
      toast.error('Please provide either text submission or upload a file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('assessmentId', assessmentId);
      
      if (submissionText) {
        formData.append('submissionText', submissionText);
      }
      
      if (file) {
        formData.append('file', file);
      }

      console.log('📤 Submitting assignment...');
      
      const response = await axiosSecure.post(
        '/api/student/submit-assignment',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data?.success) {
        console.log('✅ Assignment submitted:', response.data);
        toast.success('Assignment submitted successfully!');
        
        // Reset form
        setSubmissionText('');
        setFile(null);
        
        // Notify parent
        onSubmitted && onSubmitted();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit assignment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const isOverdue = new Date(assessment.dueDate) < new Date();
  const allowLateSubmission = assessment.allowLateSubmission;

  if (isOverdue && !allowLateSubmission) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimes className="text-red-600 dark:text-red-400 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Submission Closed
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The due date has passed and late submissions are not allowed for this assessment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Submit Assignment
      </h2>

      {isOverdue && allowLateSubmission && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
          <p className="text-orange-800 dark:text-orange-300 font-semibold">
            ⚠️ This assignment is overdue, but late submissions are allowed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Submission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Submission
          </label>
          <textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            placeholder="Enter your submission text here..."
            rows="8"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            You can include explanations, links, or any text information about your submission.
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload File (PDF, DOC, DOCX - Max 10MB)
          </label>
          
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FaUpload className="text-4xl text-gray-400 mb-3" />
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, or DOCX (max. 10MB)
                </p>
              </label>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaFileAlt className="text-blue-600 dark:text-blue-400 text-2xl" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* Submission Type Info */}
        {assessment.content?.submissionType && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Submission Type:</strong> {assessment.content.submissionType === 'both' ? 'Text and/or File' : assessment.content.submissionType === 'file' ? 'File Only' : 'Text Only'}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || (!submissionText && !file)}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
            uploading || (!submissionText && !file)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Submitting...
            </span>
          ) : (
            'Submit Assignment'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmitAssignment;


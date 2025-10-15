import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const CreateAssignmentModal = ({ classId, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const [creating, setCreating] = useState(false);

  const onSubmit = async (data) => {
    setCreating(true);

    const assignmentData = {
      type: 'assignment',
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      dueDate: new Date(data.dueDate).toISOString(),
      totalPoints: parseInt(data.totalPoints) || 100,
      passingScore: parseInt(data.passingScore) || 60,
      allowLateSubmission: data.allowLateSubmission || false,
      content: {
        submissionType: data.submissionType || 'both',
        allowedFileTypes: ['.pdf', '.doc', '.docx'],
      },
      status: 'draft',
    };

    try {
      console.log('📤 Creating assignment:', assignmentData);
      const res = await axiosSecure.post(
        `/api/teacher/class/${classId}/assessment`,
        assignmentData
      );

      if (res.data?.success) {
        toast.success('Assignment created successfully!');
        reset();
        document.getElementById('create_assignment_modal').close();
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('❌ Error creating assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  return (
    <dialog id="create_assignment_modal" className="modal">
      <div className="modal-box w-11/12 max-w-4xl">
        <h3 className="font-bold text-2xl mb-4">Create New Assignment</h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                {...register('title', { required: true })}
                type="text"
                placeholder="e.g., Week 1 Assignment - React Components"
                className="input input-bordered w-full"
              />
            </div>

            {/* Description */}
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                placeholder="Brief description of the assignment"
                className="textarea textarea-bordered h-20"
              />
            </div>

            {/* Instructions */}
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Instructions</span>
              </label>
              <textarea
                {...register('instructions')}
                placeholder="Detailed instructions for students"
                className="textarea textarea-bordered h-24"
              />
            </div>

            {/* Due Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Due Date *</span>
              </label>
              <input
                {...register('dueDate', { required: true })}
                type="datetime-local"
                className="input input-bordered w-full"
              />
            </div>

            {/* Total Points */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Total Points</span>
              </label>
              <input
                {...register('totalPoints')}
                type="number"
                defaultValue={100}
                className="input input-bordered w-full"
              />
            </div>

            {/* Passing Score */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Passing Score</span>
              </label>
              <input
                {...register('passingScore')}
                type="number"
                defaultValue={60}
                className="input input-bordered w-full"
              />
            </div>

            {/* Submission Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Submission Type</span>
              </label>
              <select
                {...register('submissionType')}
                className="select select-bordered w-full"
              >
                <option value="both">Text & File</option>
                <option value="text">Text Only</option>
                <option value="file">File Only</option>
              </select>
            </div>

            {/* Allow Late Submission */}
            <div className="form-control col-span-2">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  {...register('allowLateSubmission')}
                  type="checkbox"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Allow late submissions</span>
              </label>
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset();
                document.getElementById('create_assignment_modal').close();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
            >
              {creating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                'Create Assignment'
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default CreateAssignmentModal;


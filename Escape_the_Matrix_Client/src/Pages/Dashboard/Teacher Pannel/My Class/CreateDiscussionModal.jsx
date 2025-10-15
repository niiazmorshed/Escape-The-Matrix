import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const CreateDiscussionModal = ({ classId, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const [creating, setCreating] = useState(false);

  const onSubmit = async (data) => {
    setCreating(true);

    const discussionData = {
      type: 'discussion',
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate).toISOString(),
      totalPoints: parseInt(data.totalPoints) || 20,
      content: {
        discussionPrompt: data.discussionPrompt,
        requirePeerResponse: data.requirePeerResponse || false,
        minResponses: parseInt(data.minResponses) || 0,
        allowAnonymous: data.allowAnonymous || false,
      },
      status: 'draft',
    };

    try {
      console.log('📤 Creating discussion:', discussionData);
      const res = await axiosSecure.post(
        `/api/teacher/class/${classId}/assessment`,
        discussionData
      );

      if (res.data?.success) {
        toast.success('Discussion created successfully!');
        reset();
        document.getElementById('create_discussion_modal').close();
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('❌ Error creating discussion:', error);
      toast.error(error.response?.data?.message || 'Failed to create discussion');
    } finally {
      setCreating(false);
    }
  };

  return (
    <dialog id="create_discussion_modal" className="modal">
      <div className="modal-box w-11/12 max-w-4xl">
        <h3 className="font-bold text-2xl mb-4">Create New Discussion</h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Discussion Title *</span>
              </label>
              <input
                {...register('title', { required: true })}
                type="text"
                placeholder="e.g., React vs Vue Discussion"
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
                placeholder="Brief description of the discussion topic"
                className="textarea textarea-bordered h-20"
              />
            </div>

            {/* Discussion Prompt */}
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Discussion Prompt *</span>
              </label>
              <textarea
                {...register('discussionPrompt', { required: true })}
                placeholder="What question or topic should students discuss?"
                className="textarea textarea-bordered h-32"
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
                defaultValue={20}
                className="input input-bordered w-full"
              />
            </div>

            {/* Require Peer Response */}
            <div className="form-control col-span-2">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  {...register('requirePeerResponse')}
                  type="checkbox"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Require peer responses</span>
              </label>
            </div>

            {/* Min Responses */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Minimum Peer Responses</span>
              </label>
              <input
                {...register('minResponses')}
                type="number"
                defaultValue={2}
                min={0}
                className="input input-bordered w-full"
              />
            </div>

            {/* Allow Anonymous */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  {...register('allowAnonymous')}
                  type="checkbox"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Allow anonymous responses</span>
              </label>
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset();
                document.getElementById('create_discussion_modal').close();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={creating}
            >
              {creating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                'Create Discussion'
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

export default CreateDiscussionModal;


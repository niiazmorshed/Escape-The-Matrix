import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash } from 'react-icons/fa';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const CreateQuizModal = ({ classId, onSuccess }) => {
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      questions: [{ question: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', points: 10 }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const axiosSecure = useAxiosSecure();
  const [creating, setCreating] = useState(false);

  const onSubmit = async (data) => {
    setCreating(true);

    // Format questions
    const formattedQuestions = data.questions.map((q, index) => ({
      _id: `q${index + 1}`,
      question: q.question,
      type: q.type,
      options: q.type === 'mcq' ? q.options.filter(opt => opt.trim()) : (q.type === 'true-false' ? ['true', 'false'] : []),
      correctAnswer: q.correctAnswer,
      points: parseInt(q.points) || 10,
      explanation: q.explanation || '',
    }));

    const totalPoints = formattedQuestions.reduce((sum, q) => sum + q.points, 0);

    const quizData = {
      type: 'quiz',
      title: data.title,
      description: data.description,
      instructions: data.instructions || 'Answer all questions to the best of your ability.',
      dueDate: new Date(data.dueDate).toISOString(),
      totalPoints: totalPoints,
      passingScore: parseInt(data.passingScore) || Math.ceil(totalPoints * 0.6),
      attempts: parseInt(data.attempts) || 1,
      timeLimit: parseInt(data.timeLimit) || 0,
      content: {
        questions: formattedQuestions,
      },
      status: 'draft',
    };

    try {
      console.log('📤 Creating quiz:', quizData);
      const res = await axiosSecure.post(
        `/api/teacher/class/${classId}/assessment`,
        quizData
      );

      if (res.data?.success) {
        toast.success('Quiz created successfully!');
        reset();
        document.getElementById('create_quiz_modal').close();
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('❌ Error creating quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setCreating(false);
    }
  };

  return (
    <dialog id="create_quiz_modal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-2xl mb-4">Create New Quiz</h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Quiz Title *</span>
              </label>
              <input
                {...register('title', { required: true })}
                type="text"
                placeholder="e.g., React Fundamentals Quiz"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                placeholder="Brief description of the quiz"
                className="textarea textarea-bordered h-16"
              />
            </div>

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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Passing Score (%)</span>
              </label>
              <input
                {...register('passingScore')}
                type="number"
                defaultValue={60}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Attempts Allowed</span>
              </label>
              <input
                {...register('attempts')}
                type="number"
                defaultValue={1}
                min={1}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Time Limit (minutes, 0 = unlimited)</span>
              </label>
              <input
                {...register('timeLimit')}
                type="number"
                defaultValue={0}
                min={0}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="divider">Questions</div>

          {fields.map((field, index) => (
            <div key={field.id} className="bg-base-200 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Question {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="btn btn-sm btn-error btn-outline"
                  >
                    <FaTrash /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="form-control">
                  <input
                    {...register(`questions.${index}.question`, { required: true })}
                    type="text"
                    placeholder="Enter your question"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="form-control">
                    <select
                      {...register(`questions.${index}.type`)}
                      className="select select-bordered w-full"
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="short-answer">Short Answer</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <input
                      {...register(`questions.${index}.points`)}
                      type="number"
                      placeholder="Points"
                      defaultValue={10}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                {/* MCQ Options */}
                {register(`questions.${index}.type`) && (
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((optIndex) => (
                      <input
                        key={optIndex}
                        {...register(`questions.${index}.options.${optIndex}`)}
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        className="input input-bordered input-sm"
                      />
                    ))}
                  </div>
                )}

                <div className="form-control">
                  <input
                    {...register(`questions.${index}.correctAnswer`, { required: true })}
                    type="text"
                    placeholder="Correct Answer"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <input
                    {...register(`questions.${index}.explanation`)}
                    type="text"
                    placeholder="Explanation (optional)"
                    className="input input-bordered w-full input-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ question: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', points: 10 })}
            className="btn btn-outline btn-sm mb-4"
          >
            <FaPlus /> Add Question
          </button>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset();
                document.getElementById('create_quiz_modal').close();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={creating}
            >
              {creating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                'Create Quiz'
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

export default CreateQuizModal;


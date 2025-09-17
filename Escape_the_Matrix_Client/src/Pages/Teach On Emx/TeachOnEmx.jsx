import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaChalkboardTeacher } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Navbar from "../Navbar/Navbar";

const TeachOnEmx = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();
  
  const onSubmit = async (data) => {
    console.log(data);

    const requestInfo = {
      name: data.name,
      email: data.email,
      category: data.category,
      experience: data.experience,
      approved: false,
    };
    
    try {
      const requestRes = await axiosSecure.post("/request", requestInfo);
      console.log(requestRes.data);
      reset();
      toast.success(`${data.name} Applied Successfully!`, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{"Teach On EMX"}|EMX</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Navbar />

      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Teach on EMX</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                readOnly
                defaultValue={user?.email}
                {...register("email", { required: true })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
              <select
                {...register("experience", { required: "Experience level is required" })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="mid-level">Mid-Level (2-5 years)</option>
                <option value="experienced">Experienced (5+ years)</option>
              </select>
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teaching Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a teaching category</option>
                <option value="Web Development">Web Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Machine Learning">Machine Learning Basics</option>
                <option value="advanced_javaScript">Advanced JavaScript</option>
                <option value="artificial_intelligence">Artificial Intelligence</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaChalkboardTeacher className="mr-2" />
              Submit for Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeachOnEmx;

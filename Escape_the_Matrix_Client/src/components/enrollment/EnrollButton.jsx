import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const EnrollButton = ({ courseId, onEnrolled }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [checking, setChecking] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkEnrollmentStatus = async () => {
      if (!user?.email || !courseId) {
        setChecking(false);
        return;
      }

      try {
        // Check if user is already enrolled by fetching their enrollments
        const { data } = await axiosSecure.get(`/enrollments/${user.email}`);
        if (mounted) {
          const isEnrolled = data?.some(
            (enrollment) => enrollment.courseId === courseId
          );
          setEnrolled(isEnrolled);
        }
      } catch (error) {
        // If error, assume not enrolled
        console.error("Error checking enrollment:", error);
      } finally {
        if (mounted) setChecking(false);
      }
    };

    checkEnrollmentStatus();
    return () => {
      mounted = false;
    };
  }, [axiosSecure, courseId, user?.email]);

  const handleEnroll = async () => {
    if (!user?.email) {
      toast.error("Please login to enroll in courses");
      return;
    }

    setPosting(true);

    try {
      // Backend expects { courseId } in request body
      const { data } = await axiosSecure.post("/enroll", { courseId });

      if (data?.success) {
        toast.success("Enrolled successfully!");
        setEnrolled(true);
        onEnrolled?.(data);
      } else {
        toast.error("Could not enroll in course");
      }
    } catch (error) {
      console.error("Enrollment error:", error);

      if (error?.response?.status === 400) {
        // Already enrolled
        toast("You are already enrolled in this course", { icon: "ℹ️" });
        setEnrolled(true);
      } else if (error?.response?.status === 404) {
        toast.error("Course not found or not approved");
      } else if (error?.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else {
        toast.error(
          error?.response?.data?.message || "Enrollment failed. Please try again."
        );
      }
    } finally {
      setPosting(false);
    }
  };

  if (checking) {
    return (
      <button className="btn btn-disabled" disabled>
        <span className="loading loading-spinner loading-sm"></span>
        Checking...
      </button>
    );
  }

  return (
    <button
      className={`btn ${
        enrolled
          ? "btn-success"
          : "bg-blue-600 hover:bg-blue-700 text-white border-none"
      }`}
      disabled={enrolled || posting}
      onClick={handleEnroll}
    >
      {enrolled ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Already Enrolled
        </>
      ) : posting ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Enrolling...
        </>
      ) : (
        "Enroll Now"
      )}
    </button>
  );
};

export default EnrollButton;


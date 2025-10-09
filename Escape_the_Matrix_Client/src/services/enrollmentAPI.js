import useAxiosPublic from "../Hooks/useAxiosPublic";

// Hook-style service to share configured axios
export const useEnrollmentAPI = () => {
  const axiosPublic = useAxiosPublic();

  const getApprovedClasses = () => axiosPublic.get("/classes");
  const getAllClassesAdmin = () => axiosPublic.get("/classes/admin");

  const getTeacherClasses = (email) => axiosPublic.get(`/teacherclass/${email}`);
  const getClassById = (id) => axiosPublic.get(`/class/${id}`);

  // Enrollment
  const checkEnrollment = (classId, email) =>
    axiosPublic.get(`/enrollment/status?classId=${classId}&email=${email}`);
  const enrollClass = (payload) => axiosPublic.post("/enrollment", payload);
  const getStudentEnrollments = (email) => axiosPublic.get(`/enrollment/${email}`);

  // Content
  const getEnrollmentContent = (enrollmentId) =>
    axiosPublic.get(`/enrollment/${enrollmentId}/content`);
  const addModule = (classId, payload) =>
    axiosPublic.post(`/classes/${classId}/modules`, payload);
  const updateModule = (classId, moduleId, payload) =>
    axiosPublic.patch(`/classes/${classId}/modules/${moduleId}`, payload);
  const deleteModule = (classId, moduleId) =>
    axiosPublic.delete(`/classes/${classId}/modules/${moduleId}`);

  // Assignments
  const addAssignment = (classId, payload) =>
    axiosPublic.post(`/classes/${classId}/assignments`, payload);
  const updateAssignment = (classId, assignmentId, payload) =>
    axiosPublic.patch(`/classes/${classId}/assignments/${assignmentId}`, payload);
  const deleteAssignment = (classId, assignmentId) =>
    axiosPublic.delete(`/classes/${classId}/assignments/${assignmentId}`);
  const getAssignment = (assignmentId) => axiosPublic.get(`/assignments/${assignmentId}`);

  // Submissions
  const getSubmissions = (assignmentId) => axiosPublic.get(`/assignments/${assignmentId}/submissions`);
  const submitAssignment = (assignmentId, payload) =>
    axiosPublic.post(`/assignments/${assignmentId}/submit`, payload);
  const gradeSubmission = (submissionId, payload) =>
    axiosPublic.post(`/submissions/${submissionId}/grade`, payload);

  return {
    getApprovedClasses,
    getAllClassesAdmin,
    getTeacherClasses,
    getClassById,
    checkEnrollment,
    enrollClass,
    getStudentEnrollments,
    getEnrollmentContent,
    addModule,
    updateModule,
    deleteModule,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignment,
    getSubmissions,
    submitAssignment,
    gradeSubmission,
  };
};



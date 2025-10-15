# Frontend Assessment System Integration Guide

## 🎯 Quick Start

Your backend now has a complete **Assessment System** with Assignments, Quizzes, and Discussions.

---

## 📋 What's Available

### Assessment Types

1. **Assignments** - File uploads + text submissions
2. **Quizzes** - Auto-graded with instant results
3. **Discussions** - Posts with peer responses

---

## 🔌 API Endpoints Summary

### Teacher Routes (require teacher role)

```javascript
// Create assessment
POST /api/teacher/class/:classId/assessment

// Get all assessments for a class
GET /api/teacher/class/:classId/assessments

// Get single assessment
GET /api/teacher/assessment/:assessmentId

// Update assessment
PUT /api/teacher/assessment/:assessmentId

// Delete assessment
DELETE /api/teacher/assessment/:assessmentId

// Publish assessment (make visible to students)
PUT /api/teacher/assessment/:assessmentId/publish

// Close assessment (stop accepting submissions)
PUT /api/teacher/assessment/:assessmentId/close

// Get all submissions
GET /api/teacher/assessment/:assessmentId/submissions

// Get single submission
GET /api/teacher/assessment/:assessmentId/submission/:submissionId

// Grade submission
PUT /api/teacher/grade-submission

// Get statistics
GET /api/teacher/class/:classId/assessment-statistics
```

### Student Routes (require enrollment)

```javascript
// Get all assessments for a class
GET /api/student/class/:classId/assessments

// Get assessment details
GET /api/student/assessment/:assessmentId

// Get my submissions
GET /api/student/assessment/:assessmentId/my-submissions

// Submit assignment (with file)
POST /api/student/submit-assignment

// Submit quiz (auto-graded)
POST /api/student/submit-quiz

// Submit discussion post
POST /api/student/submit-discussion

// Add peer response
POST /api/student/discussion/:submissionId/respond

// Get all my assessments (dashboard)
GET /api/student/dashboard/assessments
```

---

## 💻 Frontend Implementation Examples

### 1. Create Assessment (Teacher)

```javascript
// src/components/CreateAssessment.jsx
import React, { useState } from "react";
import axios from "axios";

const CreateAssessment = ({ classId }) => {
  const [formData, setFormData] = useState({
    type: "assignment", // 'assignment' | 'quiz' | 'discussion'
    title: "",
    description: "",
    instructions: "",
    dueDate: "",
    totalPoints: 100,
    passingScore: 60,
    allowLateSubmission: false,
    content: {
      submissionType: "both", // 'file' | 'text' | 'both'
      allowedFileTypes: [".pdf", ".doc", ".docx"],
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:5000/api/teacher/class/${classId}/assessment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Assessment created successfully!");
      console.log("Created:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert(error.response?.data?.message || "Failed to create assessment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-assessment-form">
      <h2>Create Assessment</h2>

      <div className="form-group">
        <label>Type:</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="assignment">Assignment</option>
          <option value="quiz">Quiz</option>
          <option value="discussion">Discussion</option>
        </select>
      </div>

      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Due Date:</label>
        <input
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Total Points:</label>
        <input
          type="number"
          value={formData.totalPoints}
          onChange={(e) =>
            setFormData({ ...formData, totalPoints: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.allowLateSubmission}
            onChange={(e) =>
              setFormData({
                ...formData,
                allowLateSubmission: e.target.checked,
              })
            }
          />
          Allow Late Submissions
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        Create Assessment
      </button>
    </form>
  );
};

export default CreateAssessment;
```

---

### 2. Submit Assignment with File Upload (Student)

```javascript
// src/components/SubmitAssignment.jsx
import React, { useState } from "react";
import axios from "axios";

const SubmitAssignment = ({ assessmentId }) => {
  const [submissionText, setSubmissionText] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file
    if (selectedFile) {
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const fileExt = "." + selectedFile.name.split(".").pop().toLowerCase();

      if (!allowedTypes.includes(fileExt)) {
        alert("Only PDF, DOC, and DOCX files are allowed");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("assessmentId", assessmentId);
      formData.append("submissionText", submissionText);
      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/student/submit-assignment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Assignment submitted successfully!");
      console.log("Submission:", response.data);

      // Reset form
      setSubmissionText("");
      setFile(null);
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert(error.response?.data?.message || "Failed to submit assignment");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="submit-assignment-form">
      <h3>Submit Assignment</h3>

      <div className="form-group">
        <label>Text Submission:</label>
        <textarea
          value={submissionText}
          onChange={(e) => setSubmissionText(e.target.value)}
          placeholder="Enter your submission text here..."
          rows="6"
        />
      </div>

      <div className="form-group">
        <label>Upload File (PDF, DOC, DOCX - Max 10MB):</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        {file && (
          <p className="file-info">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={uploading || (!submissionText && !file)}
      >
        {uploading ? "Submitting..." : "Submit Assignment"}
      </button>
    </form>
  );
};

export default SubmitAssignment;
```

---

### 3. Submit Quiz with Auto-Grading (Student)

```javascript
// src/components/TakeQuiz.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const TakeQuiz = ({ assessmentId }) => {
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:5000/api/student/assessment/${assessmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssessment(response.data.data);

      // Initialize answers array
      const initialAnswers = response.data.data.content.questions.map((q) => ({
        questionId: q._id,
        answer: "",
      }));
      setAnswers(initialAnswers);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((a) =>
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all questions answered
    if (answers.some((a) => !a.answer)) {
      alert("Please answer all questions");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/api/student/submit-quiz",
        {
          assessmentId,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResult(response.data);
      alert(
        `Quiz submitted! Score: ${response.data.score}/${response.data.totalPoints}`
      );
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert(error.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (!assessment) return <div>Loading quiz...</div>;

  if (result) {
    return (
      <div className="quiz-result">
        <h2>Quiz Results</h2>
        <div className={`score ${result.passed ? "passed" : "failed"}`}>
          <h3>
            Score: {result.score} / {result.totalPoints}
          </h3>
          <p>{result.passed ? "✅ Passed!" : "❌ Failed"}</p>
        </div>
        <div className="answers-review">
          {result.data.answers.map((answer, index) => (
            <div
              key={index}
              className={`answer ${answer.isCorrect ? "correct" : "incorrect"}`}
            >
              <p>
                Question {index + 1}: {answer.isCorrect ? "✓" : "✗"}
              </p>
              <p>Points: {answer.pointsEarned}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      <h2>{assessment.title}</h2>
      <p>{assessment.description}</p>
      <p>
        <strong>Total Points:</strong> {assessment.totalPoints}
      </p>
      <p>
        <strong>Passing Score:</strong> {assessment.passingScore}
      </p>

      {assessment.content.questions.map((question, index) => (
        <div key={question._id} className="question">
          <h4>
            Question {index + 1} ({question.points} points)
          </h4>
          <p>{question.question}</p>

          {question.type === "mcq" && (
            <div className="options">
              {question.options.map((option, optIndex) => (
                <label key={optIndex} className="option">
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={option}
                    onChange={(e) =>
                      handleAnswerChange(question._id, e.target.value)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {question.type === "true-false" && (
            <div className="options">
              <label>
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value="true"
                  onChange={(e) =>
                    handleAnswerChange(question._id, e.target.value)
                  }
                />
                True
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value="false"
                  onChange={(e) =>
                    handleAnswerChange(question._id, e.target.value)
                  }
                />
                False
              </label>
            </div>
          )}

          {question.type === "short-answer" && (
            <input
              type="text"
              placeholder="Your answer"
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </form>
  );
};

export default TakeQuiz;
```

---

### 4. View Assessments List (Student)

```javascript
// src/components/AssessmentsList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AssessmentsList = ({ classId }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:5000/api/student/class/${classId}/assessments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssessments(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading assessments...</div>;

  return (
    <div className="assessments-list">
      <h2>Assessments</h2>

      {assessments.length === 0 ? (
        <p>No assessments available yet.</p>
      ) : (
        <div className="assessment-cards">
          {assessments.map((assessment) => (
            <div
              key={assessment._id}
              className={`assessment-card ${assessment.type}`}
            >
              <div className="card-header">
                <span className={`badge ${assessment.type}`}>
                  {assessment.type.toUpperCase()}
                </span>
                <h3>{assessment.title}</h3>
              </div>

              <div className="card-body">
                <p>{assessment.description}</p>
                <p>
                  <strong>Due:</strong>{" "}
                  {new Date(assessment.dueDate).toLocaleString()}
                </p>
                <p>
                  <strong>Points:</strong> {assessment.totalPoints}
                </p>

                {assessment.submissionCount > 0 ? (
                  <div className="submission-status">
                    <span className="badge success">✓ Submitted</span>
                    {assessment.mySubmissions[0]?.grade && (
                      <p>
                        <strong>Grade:</strong>{" "}
                        {assessment.mySubmissions[0].grade}/
                        {assessment.totalPoints}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="badge warning">Not Submitted</span>
                )}
              </div>

              <div className="card-footer">
                <Link
                  to={`/assessment/${assessment._id}`}
                  className="btn btn-primary"
                >
                  {assessment.submissionCount > 0
                    ? "View Submission"
                    : "Start Assessment"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentsList;
```

---

### 5. Grade Submissions (Teacher)

```javascript
// src/components/GradeSubmission.jsx
import React, { useState } from "react";
import axios from "axios";

const GradeSubmission = ({ submission, onGraded }) => {
  const [grade, setGrade] = useState(submission.grade || "");
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [grading, setGrading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGrading(true);

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        "http://localhost:5000/api/teacher/grade-submission",
        {
          submissionId: submission._id,
          grade: parseFloat(grade),
          feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Submission graded successfully!");
      onGraded && onGraded();
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert("Failed to grade submission");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="grade-submission">
      <h3>Grade Submission</h3>

      <div className="submission-details">
        <p>
          <strong>Student:</strong> {submission.studentName}
        </p>
        <p>
          <strong>Submitted:</strong>{" "}
          {new Date(submission.submittedAt).toLocaleString()}
        </p>
        {submission.isLate && (
          <span className="badge danger">Late Submission</span>
        )}

        {submission.submissionText && (
          <div className="submission-text">
            <h4>Text Submission:</h4>
            <p>{submission.submissionText}</p>
          </div>
        )}

        {submission.fileUrl && (
          <div className="submission-file">
            <h4>File Submission:</h4>
            <a
              href={`http://localhost:5000${submission.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 {submission.fileName}
            </a>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grading-form">
        <div className="form-group">
          <label>Grade:</label>
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            placeholder="Provide feedback to the student..."
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={grading}>
          {grading ? "Grading..." : "Submit Grade"}
        </button>
      </form>
    </div>
  );
};

export default GradeSubmission;
```

---

## 🎨 Suggested UI Components

### Assessment Type Badges

```css
.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.badge.assignment {
  background: #3b82f6;
  color: white;
}

.badge.quiz {
  background: #10b981;
  color: white;
}

.badge.discussion {
  background: #8b5cf6;
  color: white;
}

.badge.success {
  background: #22c55e;
  color: white;
}

.badge.warning {
  background: #f59e0b;
  color: white;
}

.badge.danger {
  background: #ef4444;
  color: white;
}
```

---

## 📊 Dashboard Statistics (Teacher)

```javascript
// src/components/AssessmentStatistics.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AssessmentStatistics = ({ classId }) => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:5000/api/teacher/class/${classId}/assessment-statistics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="assessment-statistics">
      <h2>Assessment Statistics</h2>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.assessmentId} className="stat-card">
            <h3>{stat.assessmentTitle}</h3>
            <span className={`badge ${stat.assessmentType}`}>
              {stat.assessmentType}
            </span>

            <div className="stat-details">
              <div className="stat-item">
                <span className="label">Total Submissions:</span>
                <span className="value">{stat.totalSubmissions}</span>
              </div>
              <div className="stat-item">
                <span className="label">Graded:</span>
                <span className="value">{stat.gradedSubmissions}</span>
              </div>
              <div className="stat-item">
                <span className="label">Pending:</span>
                <span className="value">{stat.pendingGrading}</span>
              </div>
              <div className="stat-item">
                <span className="label">Average Grade:</span>
                <span className="value">{stat.averageGrade.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentStatistics;
```

---

## ✅ Implementation Checklist

### For Teachers:

- [ ] Create assessment form
- [ ] List all assessments
- [ ] Publish/close assessments
- [ ] View submissions
- [ ] Grade submissions
- [ ] View statistics dashboard

### For Students:

- [ ] View available assessments
- [ ] Submit assignments with file upload
- [ ] Take quizzes with instant results
- [ ] Post in discussions
- [ ] View grades and feedback
- [ ] Dashboard with all assessments

---

## 🚀 Quick Integration Steps

1. **Install Axios** (if not already):

   ```bash
   npm install axios
   ```

2. **Set up API base URL**:

   ```javascript
   // src/config/api.js
   export const API_BASE_URL = "http://localhost:5000";
   ```

3. **Create API helper**:

   ```javascript
   // src/utils/api.js
   import axios from "axios";

   const api = axios.create({
     baseURL: "http://localhost:5000",
   });

   api.interceptors.request.use((config) => {
     const token = localStorage.getItem("authToken");
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   export default api;
   ```

4. **Use in components**:

   ```javascript
   import api from "../utils/api";

   const response = await api.get("/api/student/dashboard/assessments");
   ```

---

## 📝 Notes

- All endpoints require JWT authentication
- Students must be enrolled to access assessments
- Teachers can only access their own class assessments
- Quizzes are auto-graded instantly
- File uploads limited to 10MB
- Supported file types: PDF, DOC, DOCX

---

**For detailed API documentation, see `ASSESSMENT_API_DOCUMENTATION.md`**

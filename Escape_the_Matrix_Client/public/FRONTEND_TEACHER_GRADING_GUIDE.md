# Frontend Teacher Grading Guide - Assessment System

## 🎯 Overview

This guide shows how to build a teacher interface to **view all students in a class**, **track who submitted assessments**, and **easily grade submissions**.

---

## 🗄️ Backend Collections

### SubmissionsCollection (NEW)

All student submissions are stored here:

```javascript
{
  _id: ObjectId,
  assessmentId: ObjectId,
  studentId: ObjectId,
  studentEmail: String,
  studentName: String,
  classId: ObjectId,
  submissionType: String,      // "assignment" | "quiz" | "discussion"
  submissionText: String,
  fileUrl: String,              // Path: /uploads/submissions/...
  fileName: String,
  grade: Number,
  feedback: String,
  status: String,               // "submitted" | "graded"
  submittedAt: Date,
  isLate: Boolean
}
```

### EnrollCollection

Students enrolled in classes:

```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  studentEmail: String,
  courseId: ObjectId,           // Class ID
  instructorId: ObjectId,
  enrolledDate: Date
}
```

---

## 📡 Key API Endpoints for Teachers

### 1. Get All Submissions for an Assessment

```
GET /api/teacher/assessment/:assessmentId/submissions
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "submission-id",
      "studentEmail": "student1@example.com",
      "studentName": "John Doe",
      "submittedAt": "2025-10-15T10:30:00Z",
      "status": "submitted",
      "isLate": false,
      "fileUrl": "/uploads/submissions/student1_assessment_123.pdf",
      "fileName": "assignment.pdf",
      "grade": null,
      "feedback": null
    }
  ]
}
```

### 2. Get All Students Enrolled in Class

```
GET /class-enrollments/:classId
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "enrollment-id",
      "studentEmail": "student1@example.com",
      "studentId": "student-id-1",
      "enrolledDate": "2025-10-01T00:00:00Z",
      "classDetails": {
        /* class info */
      }
    }
  ]
}
```

### 3. Grade a Submission

```
PUT /api/teacher/grade-submission
```

**Request:**

```json
{
  "submissionId": "submission-id",
  "grade": 85,
  "feedback": "Great work! Consider improving error handling."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Submission graded successfully"
}
```

---

## 🎨 Frontend Implementation

### Step 1: Fetch Enrolled Students and Submissions

```javascript
// src/pages/TeacherGradingPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TeacherGradingPage = () => {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [gradingData, setGradingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGradingData();
  }, [assessmentId]);

  const fetchGradingData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // 1. Get assessment details
      const assessmentRes = await axios.get(
        `http://localhost:5000/api/teacher/assessment/${assessmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssessment(assessmentRes.data.data);
      const classId = assessmentRes.data.data.classId;

      // 2. Get all enrolled students
      const enrolledRes = await axios.get(
        `http://localhost:5000/class-enrollments/${classId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolledStudents(enrolledRes.data);

      // 3. Get all submissions for this assessment
      const submissionsRes = await axios.get(
        `http://localhost:5000/api/teacher/assessment/${assessmentId}/submissions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissions(submissionsRes.data.data);

      // 4. Merge data: Match students with their submissions
      const merged = enrolledRes.data.map((student) => {
        const submission = submissionsRes.data.data.find(
          (sub) => sub.studentEmail === student.studentEmail
        );

        return {
          studentId: student.studentId,
          studentEmail: student.studentEmail,
          studentName: submission?.studentName || student.studentEmail,
          enrolledDate: student.enrolledDate,
          hasSubmitted: !!submission,
          submission: submission || null,
          status: submission?.status || "not-submitted",
          submittedAt: submission?.submittedAt || null,
          isLate: submission?.isLate || false,
          grade: submission?.grade || null,
          feedback: submission?.feedback || null,
        };
      });

      setGradingData(merged);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grading data:", error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading grading data...</div>;

  return (
    <div className="grading-page">
      <h1>Grade Assessment: {assessment?.title}</h1>

      <div className="grading-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{gradingData.length}</p>
        </div>
        <div className="stat-card">
          <h3>Submitted</h3>
          <p>{gradingData.filter((s) => s.hasSubmitted).length}</p>
        </div>
        <div className="stat-card">
          <h3>Not Submitted</h3>
          <p>{gradingData.filter((s) => !s.hasSubmitted).length}</p>
        </div>
        <div className="stat-card">
          <h3>Graded</h3>
          <p>{gradingData.filter((s) => s.status === "graded").length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Grading</h3>
          <p>{gradingData.filter((s) => s.status === "submitted").length}</p>
        </div>
      </div>

      <GradingTable data={gradingData} onGrade={fetchGradingData} />
    </div>
  );
};

export default TeacherGradingPage;
```

---

### Step 2: Grading Table Component

```javascript
// src/components/GradingTable.jsx
import React, { useState } from "react";
import axios from "axios";

const GradingTable = ({ data, onGrade }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "" });
  const [grading, setGrading] = useState(false);

  const handleGrade = async (submissionId) => {
    setGrading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        "http://localhost:5000/api/teacher/grade-submission",
        {
          submissionId: submissionId,
          grade: parseFloat(gradeForm.grade),
          feedback: gradeForm.feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Submission graded successfully!");
      setSelectedSubmission(null);
      setGradeForm({ grade: "", feedback: "" });
      onGrade(); // Refresh data
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Failed to grade submission");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="grading-table-container">
      <table className="grading-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Late?</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student, index) => (
            <tr
              key={index}
              className={student.hasSubmitted ? "submitted" : "not-submitted"}
            >
              <td>{student.studentName}</td>
              <td>{student.studentEmail}</td>
              <td>
                <span className={`status-badge ${student.status}`}>
                  {student.hasSubmitted
                    ? student.status === "graded"
                      ? "✅ Graded"
                      : "📝 Submitted"
                    : "❌ Not Submitted"}
                </span>
              </td>
              <td>
                {student.submittedAt
                  ? new Date(student.submittedAt).toLocaleString()
                  : "-"}
              </td>
              <td>
                {student.isLate ? (
                  <span className="late-badge">⚠️ Late</span>
                ) : student.hasSubmitted ? (
                  "✓ On Time"
                ) : (
                  "-"
                )}
              </td>
              <td>
                {student.grade !== null ? (
                  <strong>{student.grade}</strong>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {student.hasSubmitted ? (
                  <button
                    onClick={() => setSelectedSubmission(student.submission)}
                    className="btn-view"
                  >
                    {student.status === "graded" ? "View" : "Grade"}
                  </button>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="grading-modal">
          <div className="modal-content">
            <h2>Grade Submission</h2>
            <div className="submission-details">
              <p>
                <strong>Student:</strong> {selectedSubmission.studentName}
              </p>
              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(selectedSubmission.submittedAt).toLocaleString()}
              </p>
              {selectedSubmission.isLate && (
                <p className="late-warning">⚠️ This is a late submission</p>
              )}

              {selectedSubmission.submissionText && (
                <div className="submission-text">
                  <h4>Submission Text:</h4>
                  <p>{selectedSubmission.submissionText}</p>
                </div>
              )}

              {selectedSubmission.fileUrl && (
                <div className="submission-file">
                  <h4>Attached File:</h4>
                  <a
                    href={`http://localhost:5000${selectedSubmission.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    📄 {selectedSubmission.fileName}
                  </a>
                </div>
              )}

              {selectedSubmission.status === "graded" ? (
                <div className="graded-info">
                  <p>
                    <strong>Grade:</strong> {selectedSubmission.grade}
                  </p>
                  <p>
                    <strong>Feedback:</strong> {selectedSubmission.feedback}
                  </p>
                </div>
              ) : (
                <div className="grading-form">
                  <h4>Enter Grade & Feedback:</h4>
                  <input
                    type="number"
                    placeholder="Grade (0-100)"
                    value={gradeForm.grade}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, grade: e.target.value })
                    }
                    min="0"
                    max="100"
                  />
                  <textarea
                    placeholder="Feedback (optional)"
                    value={gradeForm.feedback}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, feedback: e.target.value })
                    }
                    rows="4"
                  />
                  <div className="modal-actions">
                    <button
                      onClick={() => handleGrade(selectedSubmission._id)}
                      disabled={!gradeForm.grade || grading}
                      className="btn-submit"
                    >
                      {grading ? "Grading..." : "Submit Grade"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSubmission(null);
                        setGradeForm({ grade: "", feedback: "" });
                      }}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradingTable;
```

---

### Step 3: CSS Styling

```css
/* src/styles/GradingPage.css */

.grading-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.grading-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #dee2e6;
}

.stat-card h3 {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 32px;
  font-weight: bold;
  color: #212529;
  margin: 0;
}

.grading-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.grading-table th {
  background: #343a40;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 600;
}

.grading-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

.grading-table tr.submitted {
  background: #f8f9fa;
}

.grading-table tr.not-submitted {
  background: #fff3cd;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.graded {
  background: #d4edda;
  color: #155724;
}

.status-badge.submitted {
  background: #cce5ff;
  color: #004085;
}

.status-badge.not-submitted {
  background: #f8d7da;
  color: #721c24;
}

.late-badge {
  background: #fff3cd;
  color: #856404;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.btn-view {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-view:hover {
  background: #0056b3;
}

/* Grading Modal */
.grading-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.submission-details h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #495057;
}

.submission-text {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
}

.file-link {
  display: inline-block;
  padding: 10px 20px;
  background: #e9ecef;
  color: #495057;
  text-decoration: none;
  border-radius: 4px;
  margin: 10px 0;
}

.file-link:hover {
  background: #dee2e6;
}

.grading-form input,
.grading-form textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-submit {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-submit:hover {
  background: #218838;
}

.btn-submit:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #5a6268;
}

.late-warning {
  background: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}
```

---

## 🔄 Complete Flow Diagram

```
1. Teacher navigates to assessment grading page
   ↓
2. Frontend fetches:
   - Assessment details
   - All enrolled students (EnrollCollection)
   - All submissions (SubmissionsCollection)
   ↓
3. Frontend merges data:
   - Match students with their submissions
   - Identify who submitted vs who didn't
   ↓
4. Display in table:
   ✅ Submitted & Graded (green)
   📝 Submitted & Pending (blue)
   ❌ Not Submitted (red)
   ↓
5. Teacher clicks "Grade" button
   ↓
6. Modal opens showing:
   - Submission text
   - Attached file (with download link)
   - Grading form (grade + feedback)
   ↓
7. Teacher submits grade
   ↓
8. Update SubmissionsCollection
   ↓
9. Refresh table to show updated status
```

---

## 📊 Example Data Flow

### API Call Sequence:

```javascript
// 1. Get assessment
GET /api/teacher/assessment/assessment-123
Response: { classId: "class-456", title: "Week 1 Assignment" }

// 2. Get enrolled students
GET /class-enrollments/class-456
Response: [
  { studentEmail: "student1@example.com", studentId: "id-1" },
  { studentEmail: "student2@example.com", studentId: "id-2" },
  { studentEmail: "student3@example.com", studentId: "id-3" }
]

// 3. Get submissions
GET /api/teacher/assessment/assessment-123/submissions
Response: [
  {
    studentEmail: "student1@example.com",
    studentName: "John Doe",
    status: "submitted",
    submittedAt: "2025-10-15T10:00:00Z",
    fileUrl: "/uploads/submissions/student1_assessment_123.pdf"
  },
  {
    studentEmail: "student3@example.com",
    studentName: "Jane Smith",
    status: "graded",
    submittedAt: "2025-10-15T09:00:00Z",
    grade: 95
  }
]

// 4. Merged result for table:
[
  {
    studentEmail: "student1@example.com",
    hasSubmitted: true,
    status: "submitted",     // ← Show "Grade" button
    submittedAt: "...",
    grade: null
  },
  {
    studentEmail: "student2@example.com",
    hasSubmitted: false,     // ← Show "Not Submitted"
    status: "not-submitted",
    submittedAt: null,
    grade: null
  },
  {
    studentEmail: "student3@example.com",
    hasSubmitted: true,
    status: "graded",        // ← Show "View" button
    submittedAt: "...",
    grade: 95
  }
]
```

---

## 🎯 Key Features

### ✅ What Teachers Can See:

1. **Total enrolled students** - From EnrollCollection
2. **Who submitted** - From SubmissionsCollection
3. **Who didn't submit** - Students in EnrollCollection but not in SubmissionsCollection
4. **Submission status:**
   - ✅ Graded (has grade)
   - 📝 Submitted (no grade yet)
   - ❌ Not Submitted
5. **Late submissions** - isLate flag
6. **Files attached** - Download link
7. **Grades and feedback** - After grading

### ✅ What Teachers Can Do:

1. **View all students at a glance**
2. **Filter by status** (submitted/not submitted/graded)
3. **Download submitted files**
4. **Grade submissions** with feedback
5. **Track grading progress** (X out of Y graded)

---

## 🚀 Quick Implementation Checklist

### Backend (Already Done ✅)

- [x] SubmissionsCollection created
- [x] API endpoint to get submissions
- [x] API endpoint to get enrolled students
- [x] API endpoint to grade submissions
- [x] Files stored in /uploads/submissions/

### Frontend (To Implement)

- [ ] Create TeacherGradingPage component
- [ ] Fetch enrolled students
- [ ] Fetch submissions
- [ ] Merge data (match students with submissions)
- [ ] Display table with submission status
- [ ] Create grading modal
- [ ] Implement grade submission
- [ ] Add file download functionality
- [ ] Style with CSS

---

## 📝 Summary for Frontend Developer

**Tell your frontend developer:**

> "We have a new **SubmissionsCollection** that stores all student submissions separately.
>
> **Your task:** Build a teacher grading interface that:
>
> 1. **Fetches all enrolled students** from `GET /class-enrollments/:classId`
> 2. **Fetches all submissions** from `GET /api/teacher/assessment/:assessmentId/submissions`
> 3. **Merges the data** to show:
>    - ✅ Students who submitted (with submission details)
>    - ❌ Students who didn't submit
> 4. **Displays a table** showing:
>    - Student name & email
>    - Submission status (Submitted/Not Submitted/Graded)
>    - Submitted date
>    - Late indicator
>    - Current grade (if graded)
>    - Grade/View button
> 5. **Opens a modal** when teacher clicks Grade button showing:
>    - Submission text
>    - Download link for attached file
>    - Grading form (grade + feedback)
> 6. **Submits grade** via `PUT /api/teacher/grade-submission`
> 7. **Refreshes the table** after grading
>
> **Files are stored at:** `/uploads/submissions/`  
> **All student submissions are in:** `SubmissionsCollection`  
> **Use the code examples above** to implement the interface."

---

**Status:** ✅ Complete Implementation Guide  
**Backend:** Ready  
**Frontend:** Use this guide to build the interface

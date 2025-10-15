# Assessment System API Documentation

## 📋 Overview

Complete backend API for an assessment system with **Assignment**, **Quiz**, and **Discussion** features.

---

## 🗄️ Database Collections

### 1. AssessmentCollection

```javascript
{
  _id: ObjectId,
  classId: ObjectId,                    // Reference to ClassesCollection
  teacherEmail: String,                 // Teacher who created it
  type: String,                         // "assignment" | "quiz" | "discussion"
  title: String,                        // Assessment title
  description: String,                  // Description
  instructions: String,                 // Instructions for students
  startDate: Date,                      // When it becomes available
  dueDate: Date,                        // Submission deadline
  availableUntil: Date,                 // When it closes (optional)
  totalPoints: Number,                  // Maximum points (default: 100)
  passingScore: Number,                 // Minimum to pass (default: 60)
  allowLateSubmission: Boolean,         // Allow late submissions (default: false)
  attempts: Number,                     // Number of attempts (default: 1, for quizzes)
  timeLimit: Number,                    // Time limit in minutes (optional)
  content: {
    questions: [{                       // For quizzes
      _id: ObjectId,
      question: String,
      type: String,                     // "mcq" | "true-false" | "short-answer"
      options: [String],                // For MCQ
      correctAnswer: Mixed,             // Correct answer
      points: Number,                   // Points for this question
      explanation: String               // Explanation (optional)
    }],
    attachments: [String],              // URLs to attachments
    submissionType: String,             // "file" | "text" | "both"
    allowedFileTypes: [String],         // [".pdf", ".doc", ".docx"]
    maxFileSize: Number,                // In bytes (default: 10MB)
    discussionPrompt: String,           // For discussions
    requirePeerResponse: Boolean,       // Require peer responses
    minResponses: Number,               // Minimum responses required
    allowAnonymous: Boolean             // Allow anonymous responses
  },
  status: String,                       // "draft" | "published" | "closed"
  createdAt: Date,
  updatedAt: Date
}
```

### 2. AssessmentSubmissionCollection

```javascript
{
  _id: ObjectId,
  assessmentId: ObjectId,               // Reference to AssessmentCollection
  studentId: ObjectId,                  // Reference to UserCollection
  studentEmail: String,
  studentName: String,
  classId: ObjectId,                    // Reference to ClassesCollection
  submissionType: String,               // "assignment" | "quiz" | "discussion"

  // For assignments
  submissionText: String,               // Text submission
  fileUrl: String,                      // File path
  fileName: String,                     // Original filename
  fileType: String,                     // MIME type
  fileSize: Number,                     // File size in bytes

  // For quizzes
  answers: [{
    questionId: ObjectId,
    answer: Mixed,                      // Student's answer
    isCorrect: Boolean,                 // Auto-graded
    pointsEarned: Number                // Points earned
  }],
  quizScore: Number,                    // Total quiz score

  // For discussions
  discussionPost: String,               // Discussion post text
  responses: [{                         // Peer responses
    _id: ObjectId,
    responseText: String,
    respondedBy: String,                // Email or "Anonymous"
    respondedAt: Date,
    isAnonymous: Boolean
  }],

  // Common fields
  submittedAt: Date,
  attemptNumber: Number,                // Attempt number (for quizzes)
  isLate: Boolean,                      // Submitted after due date
  grade: Number,                        // Final grade
  feedback: String,                     // Teacher feedback
  gradedBy: String,                     // Teacher email
  gradedAt: Date,                       // When graded
  status: String,                       // "submitted" | "graded" | "needs-revision"
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get JWT token:

```bash
POST /jwt
Body: { "email": "user@example.com" }
```

---

## 👨‍🏫 Teacher Endpoints

### 1. Create Assessment

**POST** `/api/teacher/class/:classId/assessment`

**Auth:** Required (Teacher)

**Request Body:**

```json
{
  "type": "assignment",
  "title": "Week 1 Assignment",
  "description": "Complete the React components",
  "instructions": "Follow the guidelines in the PDF",
  "dueDate": "2025-10-20T23:59:59Z",
  "totalPoints": 100,
  "passingScore": 70,
  "allowLateSubmission": false,
  "content": {
    "submissionType": "both",
    "allowedFileTypes": [".pdf", ".doc", ".docx"],
    "attachments": ["https://example.com/guidelines.pdf"]
  },
  "status": "draft"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Assessment created successfully",
  "assessmentId": "67abc123...",
  "data": {
    /* assessment object */
  }
}
```

---

### 2. Get All Assessments for a Class

**GET** `/api/teacher/class/:classId/assessments`

**Auth:** Required (Teacher)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67abc123...",
      "classId": "665b46d5...",
      "title": "Week 1 Assignment",
      "type": "assignment",
      "status": "published",
      "dueDate": "2025-10-20T23:59:59Z"
      /* ... */
    }
  ]
}
```

---

### 3. Get Single Assessment

**GET** `/api/teacher/assessment/:assessmentId`

**Auth:** Required (Teacher)

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* full assessment object */
  }
}
```

---

### 4. Update Assessment

**PUT** `/api/teacher/assessment/:assessmentId`

**Auth:** Required (Teacher)

**Request Body:** (same as create, partial updates allowed)

**Response (200):**

```json
{
  "success": true,
  "message": "Assessment updated successfully"
}
```

---

### 5. Delete Assessment

**DELETE** `/api/teacher/assessment/:assessmentId`

**Auth:** Required (Teacher)

**Response (200):**

```json
{
  "success": true,
  "message": "Assessment deleted successfully"
}
```

**Note:** This also deletes all submissions for the assessment.

---

### 6. Publish Assessment

**PUT** `/api/teacher/assessment/:assessmentId/publish`

**Auth:** Required (Teacher)

**Response (200):**

```json
{
  "success": true,
  "message": "Assessment published successfully"
}
```

---

### 7. Close Assessment

**PUT** `/api/teacher/assessment/:assessmentId/close`

**Auth:** Required (Teacher)

**Response (200):**

```json
{
  "success": true,
  "message": "Assessment closed successfully"
}
```

---

### 8. Get All Submissions for Assessment

**GET** `/api/teacher/assessment/:assessmentId/submissions`

**Auth:** Required (Teacher)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67sub123...",
      "studentEmail": "student@example.com",
      "studentName": "John Doe",
      "submittedAt": "2025-10-15T10:30:00Z",
      "status": "submitted",
      "isLate": false
      /* ... */
    }
  ]
}
```

---

### 9. Get Single Submission

**GET** `/api/teacher/assessment/:assessmentId/submission/:submissionId`

**Auth:** Required (Teacher)

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* full submission object */
  }
}
```

---

### 10. Grade Submission

**PUT** `/api/teacher/grade-submission`

**Auth:** Required (Teacher)

**Request Body:**

```json
{
  "submissionId": "67sub123...",
  "grade": 85,
  "feedback": "Great work! Consider improving the error handling."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Submission graded successfully"
}
```

---

### 11. Get Assessment Statistics

**GET** `/api/teacher/class/:classId/assessment-statistics`

**Auth:** Required (Teacher)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "assessmentId": "67abc123...",
      "assessmentTitle": "Week 1 Assignment",
      "assessmentType": "assignment",
      "totalSubmissions": 25,
      "gradedSubmissions": 20,
      "pendingGrading": 5,
      "averageGrade": 82.5
    }
  ]
}
```

---

## 🎓 Student Endpoints

### 1. Get All Assessments for Enrolled Class

**GET** `/api/student/class/:classId/assessments`

**Auth:** Required (Student, must be enrolled)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67abc123...",
      "title": "Week 1 Assignment",
      "type": "assignment",
      "dueDate": "2025-10-20T23:59:59Z",
      "totalPoints": 100,
      "mySubmissions": [
        /* student's submissions */
      ],
      "submissionCount": 1
    }
  ]
}
```

---

### 2. Get Assessment Details

**GET** `/api/student/assessment/:assessmentId`

**Auth:** Required (Student, must be enrolled)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "67abc123...",
    "title": "Week 1 Quiz",
    "type": "quiz",
    "content": {
      "questions": [
        {
          "_id": "q1",
          "question": "What is React?",
          "type": "mcq",
          "options": ["Library", "Framework", "Language"],
          "points": 10
          // Note: correctAnswer is NOT sent to students
        }
      ]
    }
  }
}
```

**Note:** For quizzes, correct answers are hidden from students.

---

### 3. Get My Submissions

**GET** `/api/student/assessment/:assessmentId/my-submissions`

**Auth:** Required (Student)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67sub123...",
      "submittedAt": "2025-10-15T10:30:00Z",
      "grade": 85,
      "feedback": "Great work!",
      "status": "graded"
    }
  ]
}
```

---

### 4. Submit Assignment (with File Upload)

**POST** `/api/student/submit-assignment`

**Auth:** Required (Student, must be enrolled)

**Content-Type:** `multipart/form-data`

**Form Data:**

- `assessmentId`: String (required)
- `submissionText`: String (optional)
- `file`: File (optional, max 10MB, .pdf/.doc/.docx)

**Response (201):**

```json
{
  "success": true,
  "message": "Assignment submitted successfully",
  "submissionId": "67sub123...",
  "data": {
    "fileUrl": "/uploads/assessments/student@example.com_67abc123_1728987654321.pdf",
    "fileName": "assignment.pdf",
    "submittedAt": "2025-10-15T10:30:00Z",
    "isLate": false,
    "status": "submitted"
  }
}
```

**Example with Axios:**

```javascript
const formData = new FormData();
formData.append("assessmentId", "67abc123...");
formData.append("submissionText", "Here is my submission");
formData.append("file", fileObject);

await axios.post("/api/student/submit-assignment", formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});
```

---

### 5. Submit Quiz (with Auto-Grading)

**POST** `/api/student/submit-quiz`

**Auth:** Required (Student, must be enrolled)

**Request Body:**

```json
{
  "assessmentId": "67abc123...",
  "answers": [
    {
      "questionId": "q1",
      "answer": "Library"
    },
    {
      "questionId": "q2",
      "answer": "true"
    }
  ]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "submissionId": "67sub123...",
  "score": 80,
  "totalPoints": 100,
  "passed": true,
  "data": {
    "answers": [
      {
        "questionId": "q1",
        "answer": "Library",
        "isCorrect": true,
        "pointsEarned": 10
      }
    ],
    "quizScore": 80,
    "attemptNumber": 1,
    "status": "graded"
  }
}
```

**Note:** Quizzes are auto-graded immediately!

---

### 6. Submit Discussion Post

**POST** `/api/student/submit-discussion`

**Auth:** Required (Student, must be enrolled)

**Request Body:**

```json
{
  "assessmentId": "67abc123...",
  "discussionPost": "I think the main concept here is..."
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Discussion post submitted successfully",
  "submissionId": "67sub123...",
  "data": {
    /* submission object */
  }
}
```

---

### 7. Add Peer Response to Discussion

**POST** `/api/student/discussion/:submissionId/respond`

**Auth:** Required (Student, must be enrolled)

**Request Body:**

```json
{
  "responseText": "I agree with your point about...",
  "isAnonymous": false
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Response added successfully",
  "data": {
    "_id": "resp123...",
    "responseText": "I agree with your point about...",
    "respondedBy": "student@example.com",
    "respondedAt": "2025-10-15T11:00:00Z",
    "isAnonymous": false
  }
}
```

---

### 8. Get Dashboard Assessments

**GET** `/api/student/dashboard/assessments`

**Auth:** Required (Student)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67abc123...",
      "title": "Week 1 Assignment",
      "type": "assignment",
      "dueDate": "2025-10-20T23:59:59Z",
      "classTitle": "React Course",
      "classImage": "https://...",
      "mySubmissions": [
        /* submissions */
      ],
      "submissionCount": 1,
      "isCompleted": true
    }
  ]
}
```

**Note:** Returns all assessments across all enrolled classes.

---

## 📁 File Upload

### Configuration

- **Allowed Types:** `.pdf`, `.doc`, `.docx`
- **Max Size:** 10MB
- **Storage:** `./uploads/assessments/`
- **Filename Format:** `{studentEmail}_{assessmentId}_{timestamp}.{ext}`

### Example

```javascript
// Frontend (React)
const handleFileUpload = async (file, assessmentId) => {
  const formData = new FormData();
  formData.append("assessmentId", assessmentId);
  formData.append("file", file);
  formData.append("submissionText", "Optional text submission");

  try {
    const response = await axios.post(
      "/api/student/submit-assignment",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Upload failed:", error.response?.data);
  }
};
```

---

## 🎯 Auto-Grading (Quizzes)

### How It Works

1. Student submits quiz answers
2. Backend compares answers with correct answers
3. Points are calculated automatically
4. Submission is marked as "graded" immediately
5. Student receives instant feedback

### Supported Question Types

1. **Multiple Choice (MCQ)**

   - Exact match comparison
   - Example: `answer === correctAnswer`

2. **True/False**

   - Exact match comparison
   - Example: `answer === "true"`

3. **Short Answer**
   - Case-insensitive comparison
   - Whitespace trimmed
   - Example: `answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()`

### Quiz Attempt Limits

- Configurable per quiz (default: 1 attempt)
- Backend checks attempt count before allowing submission
- Error returned if limit exceeded

---

## 🔒 Security Features

### 1. **Teacher Verification**

- Only teachers can create/modify assessments
- Teachers can only access their own class assessments

### 2. **Student Enrollment Verification**

- Students must be enrolled to access assessments
- Enrollment checked on every request

### 3. **File Upload Security**

- File type validation
- File size limits (10MB)
- Secure filename generation

### 4. **Quiz Security**

- Correct answers hidden from students
- Attempt limits enforced
- Auto-grading prevents tampering

### 5. **Late Submission Control**

- Configurable per assessment
- Automatically marked as late
- Can be disabled by teacher

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, late submission, etc.)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not enrolled, not owner, etc.)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing Examples

### Using cURL

```bash
# Get JWT token
TOKEN=$(curl -X POST http://localhost:5000/jwt \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com"}' | jq -r '.token')

# Create assessment
curl -X POST http://localhost:5000/api/teacher/class/665b46d5.../assessment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "assignment",
    "title": "Week 1 Assignment",
    "dueDate": "2025-10-20T23:59:59Z",
    "totalPoints": 100
  }'

# Get assessments
curl -X GET http://localhost:5000/api/teacher/class/665b46d5.../assessments \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. **Get Token:**

   - POST `/jwt`
   - Body: `{ "email": "teacher@example.com" }`
   - Save token from response

2. **Create Assessment:**

   - POST `/api/teacher/class/:classId/assessment`
   - Headers: `Authorization: Bearer TOKEN`
   - Body: (see request examples above)

3. **Submit Assignment with File:**
   - POST `/api/student/submit-assignment`
   - Headers: `Authorization: Bearer TOKEN`
   - Body: form-data
     - `assessmentId`: (text)
     - `file`: (file)

---

## 📝 Frontend Integration Guide

### React Example - Create Assessment

```javascript
import axios from "axios";

const CreateAssessment = () => {
  const [formData, setFormData] = useState({
    type: "assignment",
    title: "",
    dueDate: "",
    totalPoints: 100,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `/api/teacher/class/${classId}/assessment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Assessment created:", response.data);
      alert("Assessment created successfully!");
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert(error.response?.data?.message || "Failed to create assessment");
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
};
```

### React Example - Submit Quiz

```javascript
const SubmitQuiz = ({ assessmentId, questions }) => {
  const [answers, setAnswers] = useState([]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "/api/student/submit-quiz",
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

      const { score, totalPoints, passed } = response.data;
      alert(
        `Your score: ${score}/${totalPoints} - ${passed ? "Passed!" : "Failed"}`
      );
    } catch (error) {
      console.error("Error:", error.response?.data);
      alert(error.response?.data?.message || "Failed to submit quiz");
    }
  };

  return (
    <div>
      {/* Quiz questions */}
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};
```

---

## 🎨 UI/UX Recommendations

### Teacher Dashboard

- List all assessments with status badges (draft/published/closed)
- Show submission counts and grading progress
- Quick actions: Publish, Close, Delete
- Statistics cards: Average grade, submission rate

### Student Dashboard

- Show upcoming assessments with due dates
- Color-code by type (assignment/quiz/discussion)
- Display submission status (not started/submitted/graded)
- Show grades and feedback

### Assessment Details Page

- Clear instructions and requirements
- File upload with drag-and-drop
- Timer for timed quizzes
- Progress indicator

---

## 🚀 Deployment Notes

1. **Environment Variables:**

   ```
   DB_USER=your_mongodb_user
   DB_PASSWORD=your_mongodb_password
   ACCESS_TOKEN_SECRET=your_jwt_secret
   PORT=5000
   ```

2. **File Storage:**

   - Ensure `uploads/assessments/` directory exists
   - Set proper permissions
   - Consider cloud storage (S3, Cloudinary) for production

3. **Database Indexes:**
   ```javascript
   // Recommended indexes
   AssessmentCollection.createIndex({ classId: 1, status: 1 });
   AssessmentSubmissionCollection.createIndex({
     assessmentId: 1,
     studentEmail: 1,
   });
   ```

---

## 📞 Support

For issues or questions:

- Check error messages in response
- Verify JWT token is valid
- Ensure user has correct role (teacher/student)
- Check enrollment status for students
- Verify file upload requirements

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Backend Framework:** Express.js + MongoDB

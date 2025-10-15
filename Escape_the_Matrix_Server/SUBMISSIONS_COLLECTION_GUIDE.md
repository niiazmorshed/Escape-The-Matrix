# SubmissionsCollection System Guide

## 🎯 Overview

The assessment system now uses a **separate SubmissionsCollection** to store all student submissions. This provides better data organization and query performance.

---

## 🗄️ Database Collections

### SubmissionsCollection Schema

```javascript
{
  _id: ObjectId,
  assessmentId: ObjectId,              // Reference to AssessmentCollection
  studentId: ObjectId,                 // Reference to UserCollection
  studentEmail: String,
  studentName: String,
  classId: ObjectId,                   // Reference to ClassesCollection
  submissionType: String,              // "assignment" | "quiz" | "discussion"

  // For Assignment submissions
  submissionText: String,
  fileUrl: String,                     // Path: /uploads/submissions/...
  fileName: String,
  fileType: String,
  fileSize: Number,

  // For Quiz submissions
  answers: [{
    questionId: ObjectId,
    answer: Mixed,
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  quizScore: Number,

  // For Discussion submissions
  discussionPost: String,
  responses: [{
    _id: ObjectId,
    responseText: String,
    respondedBy: String,
    respondedAt: Date,
    isAnonymous: Boolean
  }],

  // Metadata
  submittedAt: Date,
  attemptNumber: Number,
  isLate: Boolean,

  // Grading
  grade: Number,
  feedback: String,
  gradedBy: String,
  gradedAt: Date,
  status: String,                      // "submitted" | "graded" | "needs-revision"

  createdAt: Date,
  updatedAt: Date
}
```

### Indexes Created

```javascript
SubmissionsCollection.createIndex({ assessmentId: 1, studentId: 1 });
SubmissionsCollection.createIndex({ studentEmail: 1 });
SubmissionsCollection.createIndex({ classId: 1 });
SubmissionsCollection.createIndex({ status: 1 });
```

---

## 📁 File Upload

### Storage Location

```
/uploads/submissions/
```

### File Naming Format

```
{studentEmail}_{assessmentId}_{timestamp}.{ext}
```

### Allowed File Types

- PDF (.pdf)
- DOC (.doc)
- DOCX (.docx)

### File Size Limit

- Maximum: 10MB

---

## 🔄 How It Works

### 1. Student Views Assessments

```
GET /api/student/class/:classId/assessments
```

**Flow:**

1. Verify student is enrolled in the class
2. Fetch published assessments for the class
3. Check SubmissionsCollection for student's submissions
4. Return assessments with submission status

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "assessment-id",
      "title": "Week 1 Assignment",
      "type": "assignment",
      "dueDate": "2025-10-25T23:59:59Z",
      "totalPoints": 100,
      "mySubmissions": [],
      "submissionCount": 0
    }
  ]
}
```

---

### 2. Student Submits Assignment

```
POST /api/student/submit-assignment
```

**Request:**

```javascript
// Form Data
{
  assessmentId: "assessment-id",
  submissionText: "My submission text",
  file: <File object>
}
```

**What Happens:**

1. Verify student is enrolled
2. Verify assessment exists and is published
3. Check if late submission
4. Upload file to `/uploads/submissions/`
5. **Create document in SubmissionsCollection:**

```javascript
{
  assessmentId: new ObjectId(assessmentId),
  studentId: student._id,
  studentEmail: student.email,
  studentName: student.fullName,
  classId: assessment.classId,
  submissionType: "assignment",
  submissionText: "My submission text",
  fileUrl: "/uploads/submissions/student@example.com_assessment-id_1234567890.pdf",
  fileName: "assignment.pdf",
  fileType: "application/pdf",
  fileSize: 245678,
  submittedAt: new Date(),
  isLate: false,
  status: "submitted",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**Response:**

```json
{
  "success": true,
  "message": "Assignment submitted successfully",
  "submissionId": "submission-id",
  "data": {
    /* submission object */
  }
}
```

---

### 3. Student Submits Quiz

```
POST /api/student/submit-quiz
```

**Request:**

```json
{
  "assessmentId": "quiz-id",
  "answers": [
    {
      "questionId": "q1",
      "answer": "A Library"
    },
    {
      "questionId": "q2",
      "answer": "true"
    }
  ]
}
```

**What Happens:**

1. Verify student is enrolled
2. Verify assessment exists and is published
3. Check attempt limit
4. **Auto-grade answers:**
   - Compare with correct answers
   - Calculate isCorrect and pointsEarned
   - Sum total score
5. **Create document in SubmissionsCollection:**

```javascript
{
  assessmentId: new ObjectId(assessmentId),
  studentId: student._id,
  studentEmail: student.email,
  studentName: student.fullName,
  classId: assessment.classId,
  submissionType: "quiz",
  answers: [
    {
      questionId: "q1",
      answer: "A Library",
      isCorrect: true,
      pointsEarned: 10
    },
    {
      questionId: "q2",
      answer: "true",
      isCorrect: true,
      pointsEarned: 10
    }
  ],
  quizScore: 20,
  attemptNumber: 1,
  submittedAt: new Date(),
  grade: 20,
  status: "graded",
  gradedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**Response:**

```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "submissionId": "submission-id",
  "score": 20,
  "totalPoints": 20,
  "passed": true,
  "data": {
    /* submission with graded answers */
  }
}
```

---

### 4. Student Submits Discussion

```
POST /api/student/submit-discussion
```

**Request:**

```json
{
  "assessmentId": "discussion-id",
  "discussionPost": "I think React is better because..."
}
```

**What Happens:**

1. Verify student is enrolled
2. Verify assessment exists and is published
3. Check if already submitted
4. **Create document in SubmissionsCollection:**

```javascript
{
  assessmentId: new ObjectId(assessmentId),
  studentId: student._id,
  studentEmail: student.email,
  studentName: student.fullName,
  classId: assessment.classId,
  submissionType: "discussion",
  discussionPost: "I think React is better because...",
  responses: [],
  submittedAt: new Date(),
  status: "submitted",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

---

### 5. Teacher Views Submissions

```
GET /api/teacher/assessment/:assessmentId/submissions
```

**What Happens:**

1. Verify teacher owns the class
2. **Query SubmissionsCollection:**

```javascript
const submissions = await SubmissionsCollection.find({
  assessmentId: new ObjectId(assessmentId),
}).toArray();
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "submission-id",
      "studentEmail": "student@example.com",
      "studentName": "John Doe",
      "submittedAt": "2025-10-15T10:30:00Z",
      "status": "submitted",
      "isLate": false,
      "fileUrl": "/uploads/submissions/...",
      "fileName": "assignment.pdf"
    }
  ]
}
```

---

### 6. Teacher Grades Submission

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

**What Happens:**

1. Verify teacher owns the class
2. **Update document in SubmissionsCollection:**

```javascript
await SubmissionsCollection.updateOne(
  { _id: new ObjectId(submissionId) },
  {
    $set: {
      grade: 85,
      feedback: "Great work!...",
      gradedBy: teacherEmail,
      gradedAt: new Date(),
      status: "graded",
      updatedAt: new Date(),
    },
  }
);
```

**Response:**

```json
{
  "success": true,
  "message": "Submission graded successfully"
}
```

---

## 📊 Query Examples

### Get All Submissions for a Student

```javascript
const submissions = await SubmissionsCollection.find({
  studentEmail: "student@example.com",
})
  .sort({ submittedAt: -1 })
  .toArray();
```

### Get Submissions for a Class

```javascript
const submissions = await SubmissionsCollection.find({
  classId: new ObjectId(classId),
}).toArray();
```

### Get Pending Grading

```javascript
const pending = await SubmissionsCollection.find({
  classId: new ObjectId(classId),
  status: "submitted",
}).toArray();
```

### Get Graded Submissions

```javascript
const graded = await SubmissionsCollection.find({
  studentEmail: "student@example.com",
  status: "graded",
}).toArray();
```

---

## 🔑 Key Benefits

### 1. Separation of Concerns

- **AssessmentCollection:** Stores assessment definitions (created by teachers)
- **SubmissionsCollection:** Stores student submissions (created by students)

### 2. Better Performance

- Indexed queries for fast lookups
- Separate collections reduce document size
- Efficient filtering by status, student, class

### 3. Scalability

- Easy to add new submission types
- Simple to query submission history
- Better for analytics and reporting

### 4. Clean Data Model

- Clear ownership (students own submissions)
- Easier to implement permissions
- Simpler backup and recovery

---

## 📁 File Storage Structure

```
uploads/
└── submissions/
    ├── student1@example.com_assessment1_1234567890.pdf
    ├── student1@example.com_assessment2_1234567891.docx
    ├── student2@example.com_assessment1_1234567892.pdf
    └── ...
```

---

## ✅ Verification Steps

### 1. Check Collection Exists

```javascript
// MongoDB Shell
use EscapeTheMatrix
db.SubmissionsCollection.find().pretty()
```

### 2. Verify Indexes

```javascript
db.SubmissionsCollection.getIndexes();
```

**Expected Output:**

```javascript
[
  { v: 2, key: { _id: 1 }, name: "_id_" },
  {
    v: 2,
    key: { assessmentId: 1, studentId: 1 },
    name: "assessmentId_1_studentId_1",
  },
  { v: 2, key: { studentEmail: 1 }, name: "studentEmail_1" },
  { v: 2, key: { classId: 1 }, name: "classId_1" },
  { v: 2, key: { status: 1 }, name: "status_1" },
];
```

### 3. Test Submission Flow

1. **Submit Assignment:**

   ```bash
   curl -X POST http://localhost:5000/api/student/submit-assignment \
     -H "Authorization: Bearer TOKEN" \
     -F "assessmentId=ASSESSMENT_ID" \
     -F "submissionText=My submission" \
     -F "file=@assignment.pdf"
   ```

2. **Check in Database:**

   ```javascript
   db.SubmissionsCollection.findOne({
     assessmentId: ObjectId("ASSESSMENT_ID"),
   });
   ```

3. **Verify File:**
   ```bash
   ls -lh uploads/submissions/
   ```

---

## 🚨 Important Notes

1. **All submissions** (assignments, quizzes, discussions) are stored in `SubmissionsCollection`

2. **File uploads** are saved to `/uploads/submissions/` directory

3. **Auto-grading** for quizzes happens immediately upon submission

4. **Enrollment verification** is required for all student submission endpoints

5. **Teacher authorization** is required for viewing/grading submissions

---

## 📝 Frontend Integration

### Fetch Student's Submissions

```javascript
const getMySubmissions = async (classId) => {
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("userEmail");

  const response = await axios.get(
    `http://localhost:5000/api/student/class/${classId}/assessments`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data.data; // Assessments with submission status
};
```

### Submit Assignment with File

```javascript
const submitAssignment = async (assessmentId, text, file) => {
  const token = localStorage.getItem("authToken");
  const formData = new FormData();
  formData.append("assessmentId", assessmentId);
  formData.append("submissionText", text);
  formData.append("file", file);

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

  return response.data;
};
```

### Display Submission

```javascript
const SubmissionDisplay = ({ submission }) => {
  return (
    <div className="submission">
      <p>Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
      <p>Status: {submission.status}</p>
      {submission.grade && (
        <p>
          Grade: {submission.grade}/{submission.totalPoints || 100}
        </p>
      )}
      {submission.feedback && <p>Feedback: {submission.feedback}</p>}
      {submission.fileUrl && (
        <a href={`http://localhost:5000${submission.fileUrl}`} download>
          Download: {submission.fileName}
        </a>
      )}
    </div>
  );
};
```

---

## ✨ Summary

**What Changed:**

- ✅ Created separate `SubmissionsCollection`
- ✅ All student submissions stored in new collection
- ✅ File uploads go to `/uploads/submissions/`
- ✅ Indexed for better query performance
- ✅ Clean separation of assessment definitions and submissions

**What Stayed the Same:**

- ✅ All API endpoints work the same
- ✅ Auto-grading for quizzes
- ✅ File upload functionality
- ✅ Teacher grading workflow
- ✅ Student submission workflow

**New Collection: SubmissionsCollection**  
**Old Collection: AssessmentSubmissionCollection (no longer used)**

---

**Status:** ✅ Implemented and Ready  
**Last Updated:** October 2025  
**Version:** 2.0

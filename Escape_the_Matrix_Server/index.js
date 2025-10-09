const express = require("express");
const cors = require("cors");
require("dotenv").config();
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// Default super admin email - immutable
const DEFAULT_ADMIN_EMAIL = "niazmorshedrafi@gmail.com";

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // "https://escape-the-matrix-9de78.web.app",
      // "https://escape-the-matrix-9de78.firebaseapp.com/",
    ],
  })
);
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pyoefad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const ClassesCollection = client
      .db("EscapeTheMatrix")
      .collection("ClassesCollection");
    const UserCollection = client
      .db("EscapeTheMatrix")
      .collection("UserCollection");

    const TeachRequestCollection = client
      .db("EscapeTheMatrix")
      .collection("TeachRequestCollection");

    // EnrollCollection - Tracks student enrollments in courses
    const EnrollCollection = client
      .db("EscapeTheMatrix")
      .collection("EnrollCollection");


    // Jwt Related API
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // Middlewares
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
    };
    
    // User verify Admin after verifyToken
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded?.email;
      const query = { email: email };
      const user = await UserCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (isAdmin) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      next();
    };

    // Verify Teacher middleware
    const verifyTeacher = async (req, res, next) => {
      const email = req.decoded?.email;
      const query = { email: email };
      const user = await UserCollection.findOne(query);
      const isTeacher = user?.role === "teacher";
      if (!isTeacher) {
        return res.status(403).send({ message: "Teacher access required" });
      }
      next();
    };

    // Verify Enrollment middleware
    const verifyEnrollment = async (req, res, next) => {
      const studentEmail = req.decoded?.email;
      const classId = req.params.classId || req.body.classId;
      
      if (!classId) {
        return res.status(400).send({ message: "Class ID is required" });
      }

      const enrollment = await EnrollCollection.findOne({
        studentEmail: studentEmail,
        classId: new ObjectId(classId),
        status: "active"
      });

      if (!enrollment) {
        return res.status(403).send({ message: "You are not enrolled in this class" });
      }

      req.enrollment = enrollment;
      next();
    };

    // User Related API
    app.get("/allusers", verifyToken, async (req, res) => {
      const users = await UserCollection.find().toArray();
      const normalized = users.map((u) => {
        const role = ["admin", "teacher", "student"].includes(u.role)
          ? u.role
          : "student";
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.email === DEFAULT_ADMIN_EMAIL ? "admin" : role,
          photoURL: u.photoURL || u.image || null,
        };
      });
      res.send(normalized);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await UserCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already Exist", insertedId: null });
      }
      const result = await UserCollection.insertOne(user);
      res.send(result);
    });

    // Finding admin
    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email != req.decoded.email) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      const query = { email: email };
      const user = await UserCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    // Get profile Info
    app.get("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await UserCollection.findOne(query);
      res.send(result);
    });

    // finding Teacher
    app.get("/users/teacher/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email != req.decoded.email) {
        return res.status(403).send({ message: "Forbidden Accesss" });
      }
      const query = { email: email };
      const user = await UserCollection.findOne(query);
      let teacher = false;
      if (user) {
        teacher = user?.role === "teacher";
      }
      res.send({ teacher });
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = await UserCollection.findOne({ _id: new ObjectId(id) });
      if (user?.email === DEFAULT_ADMIN_EMAIL) {
        return res.status(403).send({ message: "Cannot delete default admin" });
      }
      const query = { _id: new ObjectId(id) };
      const result = await UserCollection.deleteOne(query);
      res.send(result);
    });

    // Promote teacher to admin (only if current role is teacher)
    app.patch("/user/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id), role: "teacher" };
      const updatedDoc = { $set: { role: "admin" } };
      const result = await UserCollection.updateOne(filter, updatedDoc);
      res.send({ modifiedCount: result.modifiedCount });
    });

    // Remove admin role (downgrade to teacher). Protect default admin.
    app.patch("/user/remove-admin/:id", async (req, res) => {
      const id = req.params.id;
      const existing = await UserCollection.findOne({ _id: new ObjectId(id) });
      if (existing?.email === DEFAULT_ADMIN_EMAIL) {
        return res.status(403).send({ message: "Cannot change role of default admin" });
      }
      if (existing?.role !== "admin") {
        return res.status(400).send({ message: "User is not an admin" });
      }
      const filter = { _id: new ObjectId(id), role: "admin" };
      const updatedDoc = { $set: { role: "teacher" } };
      const result = await UserCollection.updateOne(filter, updatedDoc);
      res.send({ modifiedCount: result.modifiedCount });
    });

    // Making Teacher - Approve teacher request
    // ====================================>
    app.patch("/user/teacherrequest/:email", async (req, res) => {
      const email = req.params.email;
      if (email === DEFAULT_ADMIN_EMAIL) {
        return res.status(403).send({ message: "Cannot change default admin role" });
      }
      const query = { email: email };
      const updatedDoc = {
        $set: {
          role: "teacher",
          approved: true,
          status: "approved", // New status field
          approvedAt: new Date(), // Track approval date
        },
      };
      const result = await UserCollection.updateOne(query, updatedDoc);
      const result2 = await TeachRequestCollection.updateOne(query, updatedDoc);
      res.send({ result, result2 });
    });

    // Reject teacher request
    app.patch("/user/teacherrequest/reject/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "rejected",
          rejectedAt: new Date(), // Track rejection date
        },
      };
      const result = await TeachRequestCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    // ===========================================>

    // Getting teacher requests for admin
    app.get("/teacherreq", async (req, res) => {
      const result = await TeachRequestCollection.find().toArray();
      res.send(result);
    });

    // Get teacher requests by status (pending, approved, rejected)
    app.get("/teacherreq/status/:status", async (req, res) => {
      const status = req.params.status;
      const query = { status: status };
      const result = await TeachRequestCollection.find(query).toArray();
      res.send(result);
    });

    // Get teacher requests by experience level
    app.get("/teacherreq/experience/:level", async (req, res) => {
      const level = req.params.level;
      const query = { experience: level };
      const result = await TeachRequestCollection.find(query).toArray();
      res.send(result);
    });

    // Delete teacher request (legacy endpoint - consider using reject instead)
    app.delete("/user/teache-reject/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await TeachRequestCollection.deleteOne(query);
      res.send(result);
    });

    // Get teacher request by ID
    app.get("/teacherreq/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await TeachRequestCollection.findOne(query);
      res.send(result);
    });

    // Getting all the classes for admin (including pending and rejected)
    app.get("/classatadmin", async (req, res) => {
      const result = await ClassesCollection.find().toArray();
      res.send(result);
    });

    // Search Functionalities
    app.get("/search:email", async (req, res) => {
      const result = await UserCollection.find({
        email: req.params.email,
      }).toArray();
      res.send();
    });

    // Updating class after admin approve
    app.patch("/approve/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "approved",
        },
      };
      const result = await ClassesCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // Reject class by admin
    app.patch("/reject/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "rejected",
        },
      };
      const result = await ClassesCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // Teach on EMX API - Submit teacher application
    app.post("/request", async (req, res) => {
      const request = req.body;
      // Set default values for new teacher requests
      request.approved = false;
      request.role = "teacher";
      request.status = "pending"; // New status field
      request.appliedAt = new Date(); // Track when application was submitted
      
      const result = await TeachRequestCollection.insertOne(request);
      res.send(result);
    });


    // Get all classes (only approved ones for public)
    app.get("/classes", async (req, res) => {
      const query = { status: "approved" };
      const result = await ClassesCollection.find(query).toArray();
      res.send(result);
    });

    // Get total enrollment count (public endpoint)
    app.get('/enrollments/count', async (req, res) => {
      try {
        const count = await EnrollCollection.countDocuments();
        res.json({ count });
      } catch (error) {
        console.error("Get enrollment count error:", error);
        res.status(500).send({ message: "Failed to get enrollment count" });
      }
    });

    // Get all classes for admin (including pending and rejected)
    app.get("/classes/admin", async (req, res) => {
      const result = await ClassesCollection.find().toArray();
      res.send(result);
    });

    // Get classes by status (pending, approved, rejected)
    app.get("/classes/status/:status", async (req, res) => {
      const status = req.params.status;
      const query = { status: status };
      const result = await ClassesCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/cla/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ClassesCollection.findOne(query);
      res.send(result);
    });

    // Added Class Collections by teacher
    app.post("/addclass", async (req, res) => {
      const addClass = req.body;
      // Set initial status as pending when teacher adds a class
      addClass.status = "pending";
      addClass.approved = false; // Keep for backward compatibility
      const result = await ClassesCollection.insertOne(addClass);
      res.send(result);
    });

    // Get Class by Teacher
    app.get("/teacherclass/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await ClassesCollection.find(query).toArray();
      res.send(result);
    });

    // Update a Class
    app.patch("/updateteacherclass/:id", async (req, res) => {
      const value = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: value.name,
          title: value.title,
          price: value.price,
          image: value.image,
          email: value.email,
          description: value.description,
        },
      };
      const result = await ClassesCollection.updateOne(query, updateDoc);
    });

    // Delete a Class
    app.delete("/delete-cls/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ClassesCollection.deleteOne(query);
      res.send(result);
    });


    // get class info
    app.get("/get-class-info/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ClassesCollection.findOne(query);
      res.send(result);
    });

    // ===========================================>
    // ENROLLMENT SYSTEM APIs
    // ===========================================>

    // Enroll a student in a class
    app.post("/enroll", verifyToken, async (req, res) => {
      try {
        const { courseId } = req.body; // Using courseId (classId)
        const studentEmail = req.decoded.email;
        
        // Get student from UserCollection
        const student = await UserCollection.findOne({ email: studentEmail });
        if (!student) {
          return res.status(404).send({ message: "Student not found" });
        }

        // Check if course exists and is approved
        const course = await ClassesCollection.findOne({ 
          _id: new ObjectId(courseId),
          approved: true 
        });
        if (!course) {
          return res.status(404).send({ message: "Course not found or not approved" });
        }

        // Get instructor details
        const instructor = await UserCollection.findOne({ email: course.email });
        if (!instructor) {
          return res.status(404).send({ message: "Instructor not found" });
        }

        // Check if already enrolled
        const existingEnrollment = await EnrollCollection.findOne({
          studentId: student._id,
          courseId: new ObjectId(courseId)
        });
        
        if (existingEnrollment) {
          return res.status(400).send({ message: "You are already enrolled in this course" });
        }

        // Create enrollment with new schema
        const enrollment = {
          studentId: student._id,
          studentEmail: student.email, // Added email field
          courseId: new ObjectId(courseId),
          instructorId: instructor._id,
          instructorEmail: instructor.email, // Added instructor email
          enrolledDate: new Date(),
          lastAccessedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await EnrollCollection.insertOne(enrollment);
        res.status(201).send({ 
          success: true,
          message: "Enrolled successfully", 
          enrollmentId: result.insertedId,
          data: enrollment
        });
      } catch (error) {
        console.error("Enrollment error:", error);
        res.status(500).send({ 
          success: false,
          message: "Enrollment failed",
          error: error.message 
        });
      }
    });

    // Get all enrollments for a student
    app.get("/enrollments/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        
        // Verify the email matches the authenticated user
        if (email !== req.decoded.email) {
          return res.status(403).send({ message: "Access denied" });
        }

        const enrollments = await EnrollCollection.find({ 
          studentEmail: email 
        }).toArray();

        // Populate course details and instructor details for each enrollment
        const enrollmentsWithDetails = await Promise.all(
          enrollments.map(async (enrollment) => {
            // Get course/class details
            const classDetails = await ClassesCollection.findOne({
              _id: enrollment.courseId
            });

            // Get instructor details
            const instructor = await UserCollection.findOne({
              _id: enrollment.instructorId
            });

            return {
              _id: enrollment._id,
              courseId: enrollment.courseId,
              enrolledDate: enrollment.enrolledDate,
              lastAccessedAt: enrollment.lastAccessedAt,
              classDetails: classDetails ? {
                title: classDetails.title,
                image: classDetails.image,
                name: classDetails.name,
                email: classDetails.email,
                price: classDetails.price
              } : null,
              instructor: instructor ? {
                name: instructor.fullName || instructor.name,
                email: instructor.email
              } : null
            };
          })
        );

        res.send(enrollmentsWithDetails);
      } catch (error) {
        console.error("Get enrollments error:", error);
        res.status(500).send({ message: "Failed to get enrollments" });
      }
    });

    // Get specific enrollment details
    app.get("/enrollment/:id", verifyToken, async (req, res) => {
      try {
        const enrollmentId = req.params.id;
        const enrollment = await EnrollCollection.findOne({
          _id: new ObjectId(enrollmentId)
        });

        if (!enrollment) {
          return res.status(404).send({ message: "Enrollment not found" });
        }

        // Verify access (student can only see their own enrollment)
        if (enrollment.studentEmail !== req.decoded.email) {
          return res.status(403).send({ message: "Access denied" });
        }

        // Get class details
        const classDetails = await ClassesCollection.findOne({
          _id: enrollment.classId
        });

        res.send({
          ...enrollment,
          classDetails: classDetails
        });
      } catch (error) {
        console.error("Get enrollment error:", error);
        res.status(500).send({ message: "Failed to get enrollment" });
      }
    });

    // Unenroll from a class
    app.delete("/enrollment/:id", verifyToken, async (req, res) => {
      try {
        const enrollmentId = req.params.id;
        
        // Find enrollment
        const enrollment = await EnrollCollection.findOne({
          _id: new ObjectId(enrollmentId)
        });

        if (!enrollment) {
          return res.status(404).send({ message: "Enrollment not found" });
        }

        // Verify access
        if (enrollment.studentEmail !== req.decoded.email) {
          return res.status(403).send({ message: "Access denied" });
        }

        // Delete enrollment
        const result = await EnrollCollection.deleteOne({
          _id: new ObjectId(enrollmentId)
        });

        if (result.deletedCount === 1) {
          res.send({ message: "Successfully unenrolled" });
        } else {
          res.status(500).send({ message: "Failed to unenroll" });
        }
      } catch (error) {
        console.error("Unenroll error:", error);
        res.status(500).send({ message: "Unenrollment failed" });
      }
    });

    // Get all students enrolled in a class (for teacher)
    app.get("/class-enrollments/:classId", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const classId = req.params.classId;
        
        // Verify teacher owns this class
        const classDoc = await ClassesCollection.findOne({
          _id: new ObjectId(classId),
          email: req.decoded.email
        });

        if (!classDoc) {
          return res.status(403).send({ message: "Access denied. You don't own this class." });
        }

        const enrollments = await EnrollCollection.find({
          classId: new ObjectId(classId)
        }).toArray();

        res.send(enrollments);
      } catch (error) {
        console.error("Get class enrollments error:", error);
        res.status(500).send({ message: "Failed to get class enrollments" });
      }
    });

    // ===========================================>
    // COURSE CONTENT SYSTEM APIs
    // ===========================================>

    // Create course content (teacher only)
    app.post("/course-content", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const { classId } = req.body;
        
        // Verify teacher owns this class
        const classDoc = await ClassesCollection.findOne({
          _id: new ObjectId(classId),
          email: req.decoded.email
        });

        if (!classDoc) {
          return res.status(403).send({ message: "Access denied. You don't own this class." });
        }

        // Check if content already exists
        const existingContent = await CourseContentCollection.findOne({
          classId: new ObjectId(classId)
        });

        if (existingContent) {
          return res.status(400).send({ message: "Course content already exists for this class" });
        }

        // Create course content
        const courseContent = {
          classId: new ObjectId(classId),
          teacherEmail: req.decoded.email,
          modules: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await CourseContentCollection.insertOne(courseContent);
        res.status(201).send({ message: "Course content created successfully", contentId: result.insertedId });
      } catch (error) {
        console.error("Create course content error:", error);
        res.status(500).send({ message: "Failed to create course content" });
      }
    });

    // Get course content for a class
    app.get("/course-content/:classId", verifyToken, verifyEnrollment, async (req, res) => {
      try {
        const classId = req.params.classId;
        
        const courseContent = await CourseContentCollection.findOne({
          classId: new ObjectId(classId)
        });

        if (!courseContent) {
          return res.status(404).send({ message: "Course content not found" });
        }

        res.send(courseContent);
      } catch (error) {
        console.error("Get course content error:", error);
        res.status(500).send({ message: "Failed to get course content" });
      }
    });

    // Update course content (teacher only)
    app.patch("/course-content/:id", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const contentId = req.params.id;
        const updateData = req.body;
        
        // Find the course content
        const courseContent = await CourseContentCollection.findOne({
          _id: new ObjectId(contentId)
        });

        if (!courseContent) {
          return res.status(404).send({ message: "Course content not found" });
        }

        // Verify teacher owns this content
        if (courseContent.teacherEmail !== req.decoded.email) {
          return res.status(403).send({ message: "Access denied. You don't own this content." });
        }

        // Update content
        updateData.updatedAt = new Date();
        const result = await CourseContentCollection.updateOne(
          { _id: new ObjectId(contentId) },
          { $set: updateData }
        );

        if (result.modifiedCount === 1) {
          res.send({ message: "Course content updated successfully" });
        } else {
          res.status(500).send({ message: "Failed to update course content" });
        }
      } catch (error) {
        console.error("Update course content error:", error);
        res.status(500).send({ message: "Failed to update course content" });
      }
    });

    // Add new module
    app.post("/course-content/:id/module", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const contentId = req.params.id;
        const { title, description, resources } = req.body;
        
        // Find the course content
        const courseContent = await CourseContentCollection.findOne({
          _id: new ObjectId(contentId)
        });

        if (!courseContent) {
          return res.status(404).send({ message: "Course content not found" });
        }

        // Verify teacher owns this content
        if (courseContent.teacherEmail !== req.decoded.email) {
          return res.status(403).send({ message: "Access denied. You don't own this content." });
        }

        // Create new module
        const newModule = {
          moduleId: new ObjectId(),
          title: title,
          description: description,
          resources: resources || [],
          assignments: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Add module to course content
        const result = await CourseContentCollection.updateOne(
          { _id: new ObjectId(contentId) },
          { 
            $push: { modules: newModule },
            $set: { updatedAt: new Date() }
          }
        );

        if (result.modifiedCount === 1) {
          res.status(201).send({ message: "Module added successfully", moduleId: newModule.moduleId });
        } else {
          res.status(500).send({ message: "Failed to add module" });
        }
      } catch (error) {
        console.error("Add module error:", error);
        res.status(500).send({ message: "Failed to add module" });
      }
    });

    // Update specific module
    app.patch("/course-content/:classId/module/:moduleId", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const { classId, moduleId } = req.params;
        const updateData = req.body;
        
        // Find the course content
        const courseContent = await CourseContentCollection.findOne({
          classId: new ObjectId(classId),
          teacherEmail: req.decoded.email
        });

        if (!courseContent) {
          return res.status(404).send({ message: "Course content not found" });
        }

        // Find the module
        const moduleIndex = courseContent.modules.findIndex(
          module => module.moduleId.toString() === moduleId
        );

        if (moduleIndex === -1) {
          return res.status(404).send({ message: "Module not found" });
        }

        // Update module
        updateData.updatedAt = new Date();
        courseContent.modules[moduleIndex] = {
          ...courseContent.modules[moduleIndex],
          ...updateData
        };

        const result = await CourseContentCollection.updateOne(
          { _id: courseContent._id },
          { 
            $set: { 
              modules: courseContent.modules,
              updatedAt: new Date()
            }
          }
        );

        if (result.modifiedCount === 1) {
          res.send({ message: "Module updated successfully" });
        } else {
          res.status(500).send({ message: "Failed to update module" });
        }
      } catch (error) {
        console.error("Update module error:", error);
        res.status(500).send({ message: "Failed to update module" });
      }
    });

    // Delete module
    app.delete("/course-content/:classId/module/:moduleId", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const { classId, moduleId } = req.params;
        
        // Find the course content
        const courseContent = await CourseContentCollection.findOne({
          classId: new ObjectId(classId),
          teacherEmail: req.decoded.email
        });

        if (!courseContent) {
          return res.status(404).send({ message: "Course content not found" });
        }

        // Remove the module
        courseContent.modules = courseContent.modules.filter(
          module => module.moduleId.toString() !== moduleId
        );

        const result = await CourseContentCollection.updateOne(
          { _id: courseContent._id },
          { 
            $set: { 
              modules: courseContent.modules,
              updatedAt: new Date()
            }
          }
        );

        if (result.modifiedCount === 1) {
          res.send({ message: "Module deleted successfully" });
        } else {
          res.status(500).send({ message: "Failed to delete module" });
        }
      } catch (error) {
        console.error("Delete module error:", error);
        res.status(500).send({ message: "Failed to delete module" });
      }
    });

    // Add assignment to module
    app.post("/course-content/:classId/assignment", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const { classId } = req.params;
        const { moduleId, title, description, dueDate, maxScore } = req.body;
        
        // Find the course content
        const courseContent = await CourseContentCollection.findOne({
          classId: new ObjectId(classId),
          teacherEmail: req.decoded.email
        });

        if (!courseContent) {
          return res.status(404).send({ message: "Course content not found" });
        }

        // Find the module
        const moduleIndex = courseContent.modules.findIndex(
          module => module.moduleId.toString() === moduleId
        );

        if (moduleIndex === -1) {
          return res.status(404).send({ message: "Module not found" });
        }

        // Create new assignment
        const newAssignment = {
          assignmentId: new ObjectId(),
          title: title,
          description: description,
          dueDate: new Date(dueDate),
          maxScore: maxScore || 100,
          createdAt: new Date()
        };

        // Add assignment to module
        courseContent.modules[moduleIndex].assignments.push(newAssignment);
        courseContent.modules[moduleIndex].updatedAt = new Date();

        const result = await CourseContentCollection.updateOne(
          { _id: courseContent._id },
          { 
            $set: { 
              modules: courseContent.modules,
              updatedAt: new Date()
            }
          }
        );

        if (result.modifiedCount === 1) {
          res.status(201).send({ message: "Assignment added successfully", assignmentId: newAssignment.assignmentId });
        } else {
          res.status(500).send({ message: "Failed to add assignment" });
        }
      } catch (error) {
        console.error("Add assignment error:", error);
        res.status(500).send({ message: "Failed to add assignment" });
      }
    });

    // Update assignment
    app.patch("/course-content/:classId/assignment/:assignmentId", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const { classId, assignmentId } = req.params;
        const updateData = req.body;
        
        // Find the course content
        const courseContent = await CourseContentCollection.findOne({
          classId: new ObjectId(classId),
          teacherEmail: req.decoded.email
        });

        if (!courseContent) {
          return res.status(404).send({ message: "Course content not found" });
        }

        // Find the assignment in modules
        let assignmentFound = false;
        for (let i = 0; i < courseContent.modules.length; i++) {
          const assignmentIndex = courseContent.modules[i].assignments.findIndex(
            assignment => assignment.assignmentId.toString() === assignmentId
          );
          
          if (assignmentIndex !== -1) {
            // Update assignment
            courseContent.modules[i].assignments[assignmentIndex] = {
              ...courseContent.modules[i].assignments[assignmentIndex],
              ...updateData
            };
            courseContent.modules[i].updatedAt = new Date();
            assignmentFound = true;
            break;
          }
        }

        if (!assignmentFound) {
          return res.status(404).send({ message: "Assignment not found" });
        }

        const result = await CourseContentCollection.updateOne(
          { _id: courseContent._id },
          { 
            $set: { 
              modules: courseContent.modules,
              updatedAt: new Date()
            }
          }
        );

        if (result.modifiedCount === 1) {
          res.send({ message: "Assignment updated successfully" });
        } else {
          res.status(500).send({ message: "Failed to update assignment" });
        }
      } catch (error) {
        console.error("Update assignment error:", error);
        res.status(500).send({ message: "Failed to update assignment" });
      }
    });

    // ===========================================>
    // SUBMISSION SYSTEM APIs
    // ===========================================>

    // Submit assignment
    app.post("/submission", verifyToken, async (req, res) => {
      try {
        const { enrollmentId, assignmentId, submissionText, attachments } = req.body;
        const studentEmail = req.decoded.email;
        
        // Verify enrollment exists and belongs to the student
        const enrollment = await EnrollCollection.findOne({
          _id: new ObjectId(enrollmentId),
          studentEmail: studentEmail
        });

        if (!enrollment) {
          return res.status(404).send({ message: "Enrollment not found or access denied" });
        }

        // Check if already submitted
        const existingSubmission = await StudentSubmissionsCollection.findOne({
          enrollmentId: new ObjectId(enrollmentId),
          assignmentId: new ObjectId(assignmentId)
        });

        if (existingSubmission) {
          return res.status(400).send({ message: "Assignment already submitted" });
        }

        // Create submission
        const submission = {
          enrollmentId: new ObjectId(enrollmentId),
          assignmentId: new ObjectId(assignmentId),
          studentEmail: studentEmail,
          submissionText: submissionText,
          attachments: attachments || [],
          submittedAt: new Date(),
          grade: null,
          feedback: ""
        };

        const result = await StudentSubmissionsCollection.insertOne(submission);
        res.status(201).send({ message: "Assignment submitted successfully", submissionId: result.insertedId });
      } catch (error) {
        console.error("Submit assignment error:", error);
        res.status(500).send({ message: "Failed to submit assignment" });
      }
    });

    // Get all submissions for an enrollment
    app.get("/submissions/:enrollmentId", verifyToken, async (req, res) => {
      try {
        const enrollmentId = req.params.enrollmentId;
        
        // Verify enrollment belongs to the student
        const enrollment = await EnrollCollection.findOne({
          _id: new ObjectId(enrollmentId),
          studentEmail: req.decoded.email
        });

        if (!enrollment) {
          return res.status(404).send({ message: "Enrollment not found or access denied" });
        }

        const submissions = await StudentSubmissionsCollection.find({
          enrollmentId: new ObjectId(enrollmentId)
        }).toArray();

        res.send(submissions);
      } catch (error) {
        console.error("Get submissions error:", error);
        res.status(500).send({ message: "Failed to get submissions" });
      }
    });

    // Get all submissions for an assignment (teacher)
    app.get("/submissions/assignment/:assignmentId", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const assignmentId = req.params.assignmentId;
        
        // Verify teacher owns the assignment by checking course content
        const courseContent = await CourseContentCollection.findOne({
          "modules.assignments.assignmentId": new ObjectId(assignmentId),
          teacherEmail: req.decoded.email
        });

        if (!courseContent) {
          return res.status(403).send({ message: "Access denied. You don't own this assignment." });
        }

        const submissions = await StudentSubmissionsCollection.find({
          assignmentId: new ObjectId(assignmentId)
        }).toArray();

        // Populate student information
        const submissionsWithStudentInfo = await Promise.all(
          submissions.map(async (submission) => {
            const enrollment = await EnrollCollection.findOne({
              _id: submission.enrollmentId
            });
            return {
              ...submission,
              studentName: enrollment ? enrollment.studentName : "Unknown"
            };
          })
        );

        res.send(submissionsWithStudentInfo);
      } catch (error) {
        console.error("Get assignment submissions error:", error);
        res.status(500).send({ message: "Failed to get assignment submissions" });
      }
    });

    // Grade a submission (teacher only)
    app.patch("/submission/:id/grade", verifyToken, verifyTeacher, async (req, res) => {
      try {
        const submissionId = req.params.id;
        const { grade, feedback } = req.body;
        
        // Find the submission
        const submission = await StudentSubmissionsCollection.findOne({
          _id: new ObjectId(submissionId)
        });

        if (!submission) {
          return res.status(404).send({ message: "Submission not found" });
        }

        // Verify teacher owns the assignment
        const courseContent = await CourseContentCollection.findOne({
          "modules.assignments.assignmentId": submission.assignmentId,
          teacherEmail: req.decoded.email
        });

        if (!courseContent) {
          return res.status(403).send({ message: "Access denied. You don't own this assignment." });
        }

        // Update submission with grade and feedback
        const result = await StudentSubmissionsCollection.updateOne(
          { _id: new ObjectId(submissionId) },
          { 
            $set: { 
              grade: grade,
              feedback: feedback || "",
              gradedAt: new Date()
            }
          }
        );

        if (result.modifiedCount === 1) {
          // Update enrollment progress if needed
          const enrollment = await EnrollCollection.findOne({
            _id: submission.enrollmentId
          });

          if (enrollment) {
            // Simple progress calculation - can be enhanced
            const totalSubmissions = await StudentSubmissionsCollection.countDocuments({
              enrollmentId: submission.enrollmentId
            });
            const gradedSubmissions = await StudentSubmissionsCollection.countDocuments({
              enrollmentId: submission.enrollmentId,
              grade: { $ne: null }
            });

            const progress = totalSubmissions > 0 ? Math.round((gradedSubmissions / totalSubmissions) * 100) : 0;

            await EnrollCollection.updateOne(
              { _id: submission.enrollmentId },
              { $set: { progress: progress } }
            );
          }

          res.send({ message: "Submission graded successfully" });
        } else {
          res.status(500).send({ message: "Failed to grade submission" });
        }
      } catch (error) {
        console.error("Grade submission error:", error);
        res.status(500).send({ message: "Failed to grade submission" });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Bhaai Running");
});
app.listen(port, () => {
  console.log(`Port Is Running On bhaai ree ${port}`);
});

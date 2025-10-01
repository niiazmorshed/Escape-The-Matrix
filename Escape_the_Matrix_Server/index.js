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

    const ClassEnrollCollection = client
      .db("EscapeTheMatrix")
      .collection("ClassEnrollCollection");

    // const ClassAddCollection = client
    //   .db("EscapeTheMatrix")
    //   .collection("ClassAddCollection");

    const AssignmentCollection = client
      .db("EscapeTheMatrix")
      .collection("AssignmentCollection");

    const FeedbackCollection = client
      .db("EscapeTheMatrix")
      .collection("FeedbackCollection");

    const SubmittedAssignmentCollection = client
      .db("EscapeTheMatrix")
      .collection("SubmittedAssignmentCollection");

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

    // Class Enrollment API
    app.post("/enroll", async (req, res) => {
      const enroll = req.body;
      const result = await ClassEnrollCollection.insertOne(enroll);
      res.send(result);
    });

    app.get("/enroll", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await ClassEnrollCollection.find(query).toArray();
      res.send(result);
    });

    // get enroll at homepage
    app.get("/enrollall", async (req, res) => {
      const result = await ClassEnrollCollection.find().toArray();
      res.send(result);
    });

    // Get all classes (only approved ones for public)
    app.get("/classes", async (req, res) => {
      const query = { status: "approved" };
      const result = await ClassesCollection.find(query).toArray();
      res.send(result);
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

    // Assignment API
    app.post("/assignment", async (req, res) => {
      const assignment = req.body;
      const result = await AssignmentCollection.insertOne(assignment);
      res.send(result);
    });

    //Feedback API
    app.post("/feedback", async (req, res) => {
      const review = req.body;
      const result = await FeedbackCollection.insertOne(review);
      res.send(result);
    });
    // get all assignment
    app.get("/all-assignment", async (req, res) => {
      const result = await AssignmentCollection.find().toArray();
      res.send(result);
    });

    // get specific coursees submitted assignment
    app.get("/submittedass/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await SubmittedAssignmentCollection.find(query).toArray();
      res.send(result);
      // console.log(result)
    });

    // get teacher assignmetn
    app.get("/teacher-all-assignment/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await AssignmentCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/get-enrolled-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ClassEnrollCollection.find(query).toArray();
      res.send(result);
    });

    // Get Assignement in the student Pannel
    app.get("/getassignment/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await AssignmentCollection.find(query).toArray();
      res.send(result);
    });

    // Submitted Assignment API
    app.post("/submittedassignment", async (req, res) => {
      const submit = req.body;
      const result = await SubmittedAssignmentCollection.insertOne(submit);
      res.send(result);
    });

    // Get all the submitted assignment for tacher pannel
    app.get("/submitassignment", async (req, res) => {
      const result = await SubmittedAssignmentCollection.find().toArray();
      res.send(result);
    });

    // Get Feedback
    app.get("/feedback", async (req, res) => {
      const result = await FeedbackCollection.find().toArray();
      res.send(result);
    });

    // get total  enroll class
    app.get("/totalenroll/:email", async (req, res) => {
      const email = req.params.email;
      const query = { teachermail: email };
      const result = await ClassEnrollCollection.find(query).toArray();
      res.send(result);
    });

    // get class info
    app.get("/get-class-info/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ClassesCollection.findOne(query);
      res.send(result);
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

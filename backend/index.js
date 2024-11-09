const express = require("express");
const admin = require("firebase-admin");
let inspect = require("util").inspect;
let Busboy = require("busboy");
let path = require("path");
let os = require("os");
let fs = require("fs");
let UUID = require("uuid-v4");
let webpush = require("web-push");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//----------------------------------------------------------------
// Initialize Express app
const app = express(); // <-- Move this here to initialize app before using it

const User = require("./models/users/User");
const Transact = require("./models/transacts/Transacts");
// const Transaction = require("./models/transactions/Transaction");

/*
  config - cors
*/
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        // "https://guasar-jason.web.app",
        "https://guasar-jason2024.web.app",
        "http://localhost:8080",
      ];
      console.log("Request Origin:", origin); // Add this line for debugging
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

//------------------------MongoDB --------
// API endpoint examples ---------
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/mongo-users", async (req, res) => {
  try {
    // Exclude the 'avatar' field from the response
    const users = await User.find().select("-avatar -password -tokens");
    res.json(users);
  } catch (error) {
    console.error("Error fetching MongoDB users:", error);
    res.status(500).send("Error fetching users from MongoDB");
  }
});

app.get("/mongo-transacts", async (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  // Normalize and remove non-numeric characters for comparison
  const normalizedPhone = phone.replace(/\D/g, "");
  const phoneRegex = new RegExp(`.*${normalizedPhone.split("").join(".*")}.*`);

  console.log("Searching for phone number regex:", phoneRegex);

  try {
    const transacts = await Transact.find({ Phone_Number: phoneRegex }).sort({
      req_date: -1,
    });

    if (transacts.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for the phone number" });
    }
    res.json(transacts);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Error fetching transactions");
  }
});

// mongoose.connect(
// "mongodb+srv://jstaskapp:Axson2019@cluster0-aqvnx.mongodb.net/Axson-task-manager-api?",
// {
mongoose.connect(process.env.MONGODB_URL);

const dbMongo = mongoose.connection;
dbMongo.on("error", console.error.bind(console, "MongoDB connection error:"));
dbMongo.once("open", function () {
  console.log("Connected to MongoDB");
});

/*
  config - webpush
*/
webpush.setVapidDetails(
  "mailto:test@test.com",
  "BL7KqJ0PBikP5VBeXL9yP5_nktP_8WA2yUjBiXYaJVJd-vFeP2VWy-fntOc3Z3rAKDGjC0EYnY5bN1ipIZvdqvo", // public key
  "-T7LbUhzERsyUwYkeO7JiLIj8bCT32kBCde1g5dWrA0" // private key
);

/*
  config - firebase
*/
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // storageBucket: "guasar-jason.appspot.com",
  storageBucket: "guasar-jason2024.appspot.com",
});

/*
  endpoint - fetch Firestore posts
*/
const dbFirestore = admin.firestore();
let bucket = admin.storage().bucket();

app.get("/posts", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Unauthorized");
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const userId = decodedToken.uid;
    console.log(userId);

    let posts = [];
    const snapshot = await dbFirestore
      .collection("posts")
      .where("userId", "==", userId) // Filter posts by userId
      .orderBy("date", "desc")
      .get();

    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    res.send(posts);
  } catch (error) {
    console.error("Error fetching Firestore posts:", error);
    res.status(500).send("Error fetching posts");
  }
});
//----------------------------------------------------------
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore(); // Initialize Firestore instance
// const { getAuth } = require("firebase-admin/auth");

app.delete("/posts/:id", async (req, res) => {
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) {
    return res.status(401).send("Unauthorized: Missing Firebase token");
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    console.log(`Authenticated userId: ${userId}`);

    // Proceed to delete the post if userId matches post owner
    const postId = req.params.id;
    const postRef = dbFirestore.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists || postDoc.data().userId !== userId) {
      return res
        .status(403)
        .send("Unauthorized: You can only delete your own posts");
    }

    await postRef.delete();
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send("Unauthorized: Invalid Firebase token");
  }
});

//-----------------------------------------------------------

const { getAuth } = require("firebase-admin/auth");

app.post("/createPost", async (request, response) => {
  console.log("Received a request to /createPost"); // Add this to check if request hits the server
  response.set("Access-Control-Allow-Origin", "*");

  const idToken = request.headers.authorization?.split(" ")[1];
  console.log("Received ID Token:", idToken);

  if (!idToken) {
    console.error("No Firebase token found in request");
    return response.status(401).send("Unauthorized: Missing Firebase token");
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    userId = decodedToken.uid;
    console.log("Authenticated userId:", userId); // Log the userId to confirm it’s being extracted
  } catch (error) {
    console.error("Error verifying token:", error);
    return response.status(401).send("Unauthorized: Invalid Firebase token");
  }

  // Proceed with the rest of the document creation logic
  let uuid = UUID();
  var busboy = new Busboy({ headers: request.headers });
  let fields = {};
  let fileData = {};
  let imageUrl;

  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    console.log("Busboy received file:", filename);
    let filepath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filepath));
    fileData = { filepath, mimetype };
  });

  busboy.on("field", function (fieldname, val) {
    console.log("Busboy received field:", fieldname, "value:", val);
    fields[fieldname] = val;
  });

  busboy.on("finish", function () {
    console.log("Busboy finished processing.");
    // Rest of the code...

    bucket.upload(
      fileData.filepath,
      {
        uploadType: "media",
        metadata: {
          metadata: {
            contentType: fileData.mimetype,
            firebaseStorageDownloadTokens: uuid,
          },
        },
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile);
        }
      }
    );

    function createDocument(uploadedFile) {
      imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`;

      console.log("Document Data to be added:", {
        id: fields.id,
        caption: fields.caption,
        location: fields.location,
        date: parseInt(fields.date),
        imageUrl: imageUrl,
        userId: userId, // Confirm this is being passed to Firestore
      });

      dbFirestore
        .collection("posts")
        .doc(fields.id)
        .set({
          id: fields.id,
          caption: fields.caption,
          location: fields.location,
          date: parseInt(fields.date),
          imageUrl: imageUrl,
          userId: userId, // Make sure the userId is included here
        })
        .then(() => {
          response.send("Post added: " + fields.id);
        })
        .catch((error) => {
          console.error("Error creating document:", error);
          response.status(500).send("Error adding post");
        });
    }
  });

  request.pipe(busboy);
});

/*
  listen - start the server
*/
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port", process.env.PORT || 3000);
});

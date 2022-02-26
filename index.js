const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require('cors');

const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`successfully connected`);
  })
  .catch((e) => {
    console.log(`not connected`, e);
  });

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("common"));
app.use((req, res, next) => {
  res.header('Access-Controll-Allow-Origin', '*');
  res.header('Access-Controll-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Controll-Allow-Request-Method');
  res.header('Access-Controll-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.fileName);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

// Getting Request
app.get('/', (req, res) => {
 
  // Sending the response
  res.send('Hello World!')
  
  // Ending the response
  res.end()
})

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log("Backend server is running!");
});

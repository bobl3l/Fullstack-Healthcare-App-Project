import express from "express";
import connectDB from "./db.js";
import UserModel from "./models/user.js";
import PatientModel from "./models/patient.js";
import DoctorModel from "./models/doctor.js";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import authenticate from "./middleware/auth.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminapi.js";
import router from "./pwreset.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

dotenv.config();
const allergies = [
  "Antibiotics",
  "NSAIDs",
  "Sulfa drugs",
  "Antiseizure medications",
  "pain medications",
  "ACE inhibitors",
  "contrast dyes",
  "chemotherapy drugs",
  "HIV drugs",
  "Insulin",
  "Herval medicines",
  "Moluscs",
  "Eggs",
  "Fish",
  "Lupin",
  "Soya",
  "Milk",
  "Peanuts",
  "Gluten",
  "Crustaceans",
  "Mustard",
  "Nuts",
  "Sesame",
  "Celery",
  "Sulphintes",
];
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "pages")));
app.use(cookieParser());
app.use(cors());
app.set("views", "./pages");
app.set("view engine", "ejs");
app.use("/admin", adminRouter);
app.use("/pw", router);
app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

connectDB();

//page endpoints
// app.get("/", function (req, res) {
//   res.render("../pages/index");
// });

app.get("/index", function (req, res) {
  res.render("../pages/index");
});

app.get("/signup", (req, res) => {
  res.render("../pages/signup", { allergies: allergies });
});

app.get("/home", function (req, res) {
  res.render("../pages/home");
});

app.get("/passwordreset", function (req, res) {
  res.render("../pages/passwordreset");
});

app.get("/test", (req, res) => {
  res.json({ message: "Hello from the Express backend!" });
});

app.get("/admin", authenticate, async function (req, res) {
  const users = await UserModel.find();
  const approvedDoctors = await DoctorModel.find({ approval: "approved" });
  const applications = await DoctorModel.find({ approval: "pending" });
  const patients = await PatientModel.find();
  res.render("../pages/admin", {
    users: users,
    doctors: approvedDoctors,
    patients: patients,
    applications: applications,
  });
});

app.get("/get-users", async (req, res) => {
  const userData = await UserModel.find();
  res.json(userData);
});

//user-login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const user = await UserModel.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User could not be found. Try again." });
    }

    // Compare input pw with stored hash pw
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    console.log("User logged in successfully, token: " + token);
    //authenticate.isLogin = true;

    //fetch user data
    if (user.role == "admin") {
      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000, // 1 hour
        })
        .json({ message: "Successfully logged in with token: " + token });
    } else if (user.role == "doctor") {
      res.status(200).render("doctor");
    } else {
      res.status(200).render("home", { user: user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//user-registration endpoint
app.post("/register", async (req, res) => {
  const { username, email, name, role, password } = req.body;

  if (username && password && name && role && email) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username,
        name,
        email,
        role,
        password: hashedPassword,
      });
      //Add to patient collection
      if (role == "patient") {
        const { age, allergy } = req.body;
        const patient = new PatientModel({
          username,
          age,
          allergy,
          name,
          email,
        });
        await patient.save();
      }

      // Add to doctor collection
      if (role == "doctor") {
        const { specialization, experience } = req.body;
        const doctor = new DoctorModel({
          username,
          specialization,
          experience,
          name,
          email,
          approval: "pending",
        });
        await doctor.save();
      }

      await user.save();
      console.log("User registered successfully");
      res.status(200).redirect("/index");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});
app.post("/test", async function (req, res) {
  const { username, email, name, role, specialization, experience } = req.body;
  try {
    const doctor = new DoctorModel({
      username,
      specialization,
      experience,
      name,
      email,
      role,
      approval: "pending",
    });
    await doctor.save();
    res.status(200).json("big success");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//user-logout endpoint
app.post("/logout", (req, res) => {
  req.session = null;
  isLogin = false;
  res.status(200).clearCookie("token").redirect("/index");
  console.log("User logged out successfully");
});

app.listen(PORT, (error) => {
  if (!error) console.log(`Server is listening on port ${PORT}`);
  else console.log("Error occurred, server can't start", error);
});

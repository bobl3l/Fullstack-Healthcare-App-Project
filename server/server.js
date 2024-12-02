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
import session from "express-session";
dotenv.config();
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/admin", adminRouter);
app.use("/pw", router);
app.use(
  session({
    secret: "your_jwt_secret", // Replace with a secure key
    resave: false, // Avoid saving session if unmodified
    saveUninitialized: false, // Avoid creating session until something is stored
    cookie: { maxAge: 60000 }, // Optional: Set cookie expiration (in milliseconds)
  })
);

connectDB();

app.get("/passwordreset", function (req, res) {
  res.render("../pages/passwordreset");
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

app.get("/check-auth", authenticate, (req, res) => {
  try {
    res.status(200).json({ message: "Authenticated" });
  } catch (error) {
    console.error("Error in check-auth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/fetch-user", async (req, res) => {
  try {
    if (req.session.user) {
      res.send(`Session Data: ${JSON.stringify(req.session.user)}`);
    } else {
      res.send("No session data found");
    }
  } catch (e) {
    console.error(e);
  }
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

    req.session.user = {
      username: user.username,
      password: password,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    if (user.role == "patient") {
      const patient = await PatientModel.findOne({
        $or: [{ username: username }, { email: username }],
      });
      req.session.user = {
        age: patient.age,
        allergy: patient.allergy,
        appointments: patient.appointments,
        profile: patient.profile,
      };
    }
    if (user.role == "doctor") {
      const doctor = await DoctorModel.findOne({
        $or: [{ username: username }, { email: username }],
      });
      req.session.user = {
        approval: doctor.approval,
        details: doctor.details,
        appointments: doctor.appointments,
        profile: doctor.profile,
      };
    }
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
      })
      .json({ message: "Successfully logged in with token: " + token });
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

//user-logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).clearCookie("token").json("Logged out successfully");
  console.log("User logged out successfully");
});

app.listen(PORT, (error) => {
  if (!error) console.log(`Server is listening on port ${PORT}`);
  else console.log("Error occurred, server can't start", error);
});
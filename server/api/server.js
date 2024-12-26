import express from "express";
import connectDB from "./db.js";
import UserModel from "./models/user.js";
import PatientModel from "./models/patient.js";
import DoctorModel from "./models/doctor.js";
import AppointmentModel from "./models/appointment.js";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminapi.js";
import patientRouter from "./routes/patientapi.js";
import doctorRouter from "./routes/doctorapi.js";
import chatrouter from "./livechat.js";
import { Server } from "socket.io";
import router from "./pwreset.js";
import cors from "cors";
import session from "express-session";
import http from "http";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/admin", adminRouter);
app.use("/doctor", doctorRouter);
app.use("/patient", patientRouter);
app.use("/chat", chatrouter);
app.use("/pw", router);
app.use(
  session({
    secret: "your_jwt_secret", // Replace with a secure key
    resave: false, // Avoid saving session if unmodified
    saveUninitialized: false, // Avoid creating session until something is stored
    cookie: {
      secure: false, // Set to `true` if using HTTPS
      httpOnly: true,
      maxAge: 3600000,
    }, // Optional: Set cookie expiration (in milliseconds)
  })
);

connectDB();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.static("public")); // Serve static files for frontend

// Socket.IO events for video calls and messaging
io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    console.log(`User joined room: ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", { from: socket.id, offer });
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", { from: socket.id, answer });
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", { from: socket.id, candidate });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, emails, displayName, photos } = profile;
      try {
        let user = await UserModel.findOne({ email: emails });
        if (!user) {
          user = new UserModel({
            googleId: id,
            email: emails[0].value,
            name: displayName,
            avatar: photos[0].value,
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});
app.get("/passwordreset", function (req, res) {
  res.render("../pages/passwordreset");
});

app.get("/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("no token");
    return res.status(401).send("Not authenticated");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: verified.id });
  } catch (error) {
    console.log("wrong token");
    res.status(401).send("Invalid token");
  }
});

app.get("/fetch-user", async (req, res) => {
  try {
    if (req.session.user) {
      res.send(JSON.stringify(req.session.user));
    } else {
      res.status(400).send("No session data found");
    }
  } catch (e) {
    console.error(e);
  }
});

app.get("/fetch-doctors", async (req, res) => {
  try {
    const approvedDoctors = await DoctorModel.find({ approval: "approved" });
    res.json(approvedDoctors);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
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
        username: user.username,
        password: password,
        email: user.email,
        role: user.role,
        name: user.name,
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
        username: user.username,
        password: password,
        email: user.email,
        role: user.role,
        name: user.name,
        approval: doctor.approval,
        details: doctor.details,
        appointments: doctor.appointments,
        profile: doctor.profile,
      };
    }
    res

      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000, // 1 hour
      })
      .status(200)
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
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

//user-logout endpoint
app.post("/logout", async (req, res) => {
  req.session.destroy();
  res.status(200).clearCookie("token").json("Logged out successfully");
  console.log("User logged out successfully");
});

app.listen(PORT, (error) => {
  if (!error) console.log(`Server is listening on port ${PORT}`);
  else console.log("Error occurred, server can't start", error);
});

app.post("/test", async (req, res) => {
  const {
    username,
    email,
    name,
    specialization,
    experience,
    details,
    profile,
  } = req.body;
  const doctor = new DoctorModel({
    username,
    specialization,
    experience,
    name,
    email,
    details,
    profile,
    approval: "approved",
  });
  try {
    await doctor.save();
    res.status(200).json("registered");
  } catch (err) {
    res.status(500).send({ err });
  }
});

app.post("/update-user", async (req, res) => {
  const { id } = req.body;
  try {
    UserModel.findOne(id).then((doc) => {
      doc.save();
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
app.get("/fetch-appointments", async (req, res) => {
  try {
    if (req.session.user && req.session.user.name) {
      const appointment = await AppointmentModel.find({
        $or: [
          { doctor: req.session.user.name },
          { patient: req.session.user.name },
        ],
      });
      res.json(appointment);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});
app.post("/make-appointment", async (req, res) => {
  const { doctor, patient, date, remarks } = req.body;
  if (!doctor || !patient || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const socketId = uuidv4(); // Generate unique room ID
    const newappointment = new AppointmentModel({
      doctor,
      patient,
      date,
      remarks,
      socketId,
    });
    await newappointment.save();

    res.status(200).json({
      message: "Appointment created successfully",
      newappointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

app.post("/update-appointment", async (req, res) => {
  const { id, updateDate } = req.body;
  try {
    await AppointmentModel.findByIdAndUpupdateDate(
      { id },
      { date: updateDate },
      { new: true }
    );

    res.status(200).json("Appointment updated.");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.post("/delete-appointment", async (req, res) => {
  const { id } = req.body;
  try {
    await AppointmentModel.findByIdAndDelete(id);
    res.status(200).json("Appointment deleted.");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

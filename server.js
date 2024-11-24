import express from "express";
import connectDB from "./db.js";
import UserModel from "./models/user.js";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

//import html files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/pages")));
connectDB();

app.get("/", function (req, res) {
  res.render("../pages/index");
});

app.get("/signup", (req, res) => {
  res.type("html");
  res.sendFile(path.join(__dirname, "pages/signup.html"));
});

app.get("/get-users", async (req, res) => {
  const userData = await UserModel.find();
  res.json(userData);
});

//user-login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User could not be found. Try again." });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (
      //!isMatch
      !(password === user.password)
    ) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Authentication successful",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//user-registration endpoint
app.post("/signup", async (req, res) => {
  const { username, password, name, role } = req.body;

  if ((username && password, name, role)) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username,
        password: hashedPassword,
        name,
        role,
      });
      await user.save();
      res.json({ message: "Registration successful" });
    } catch (error) {
      next(error);
    }
  }
});

app.listen(PORT, (error) => {
  if (!error) console.log(`Server is listening on port ${PORT}`);
  else console.log("Error occurred, server can't start", error);
});

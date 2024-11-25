import express from "express";
import connectDB from "./db.js";
import UserModel from "./models/user.js";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import consolidate from "consolidate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "pages")));
// app.set("pages", __dirname + "/pages");
// app.engine("html", consolidate.mustache);
// app.set("view engine", "html");
app.set("views", "./pages");
app.set("view engine", "ejs");
connectDB();

//page endpoints
app.get("/", function (req, res) {
  res.render("../pages/index");
});

app.get("/index", function (req, res) {
  res.render("../pages/index");
});

app.get("/signup", (req, res) => {
  res.render("../pages/signup");
});

app.get("/home", function (req, res) {
  res.render("../pages/home");
});

app.get("/get-users", async (req, res) => {
  const userData = await UserModel.find();
  res.json(userData);
});

//user-login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });

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
    //res.type("html");
    res.status(200).render("home", { user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//user-registration endpoint
app.post("/register", async (req, res) => {
  const { username, name, role, password } = req.body;

  if (username && password && name && role) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username,

        name,
        role,
        password: hashedPassword,
      });
      await user.save();
      console.log("User registered successfully");
      res.status(200).redirect("/index");
    } catch (error) {
      next(error);
    }
  }
});

//user-logout endpoint
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  console.log("User logged out successfully");
  res.redirect("/index");
});

app.listen(PORT, (error) => {
  if (!error) console.log(`Server is listening on port ${PORT}`);
  else console.log("Error occurred, server can't start", error);
});

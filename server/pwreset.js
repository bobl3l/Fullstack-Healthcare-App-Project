import nodemailer from "nodemailer";
import express from "express";
import UserModel from "./models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
let resetuser = {};
// Route to initiate password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  resetuser = await UserModel.findOne({ email });
  // Check if the email exists in your user database
  if (resetuser) {
    const token = jwt.sign(
      { userId: resetuser._id, username: resetuser.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 300000, //5min
    });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "ballbebee@gmail.com",
        pass: "ddde snxd gkua zagr",
      },
    });
    const mailOptions = {
      from: "ballbebee@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: http://localhost:5000/pw/reset-password/${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email");
      } else {
        console.log(`Email sent: ${info.response}`);
        res
          .status(200)
          .send("Check your email for instructions on resetting your password");
      }
    });
  } else {
    res.status(404).send("Email not found");
  }
});
// Route to handle the reset token
router.get("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  // Check if the token exists and is still valid
  if (req.cookies.token === token) {
    // Render a form for the user to enter a new password
    res.send(
      '<form method="post" action="/pw/reset-password"><input type="password" name="password" required><input type="hidden" name="token" value="' +
        token +
        '"><input type="submit" value="Reset Password"></form>'
    );
  } else {
    res.status(404).send("Invalid or expired token");
  }
});
// Route to update the password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  if (token === req.cookies.token) {
    resetuser.password = hashedPassword;
    await resetuser.save();
    res.status(200).clearCookie("token").send("Password updated successfully");
  } else {
    res.status(404).send("Invalid or expired token");
  }
});

export default router;

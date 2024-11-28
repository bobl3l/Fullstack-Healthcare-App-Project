import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect("/index"); // Redirect to login page if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token").redirect("/index"); // Clear the invalid token
  }
};

export default authenticate;

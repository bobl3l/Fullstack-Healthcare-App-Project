import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).clearCookie("token").json(err); // Clear the invalid token
  }
};

export default authenticate;

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  lastLogin: { type: Date, default: null },
});

// Export model
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;

import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  approval: { type: String, required: true },
  details: { type: String },
  profile: { type: String },
});

// Export model
const DoctorModel = mongoose.model("Doctor", DoctorSchema);
export default DoctorModel;

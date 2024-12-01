import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  applications: { type: String },
  approval: { type: String, required: true },
  appointments: { type: Array },
});

// Export model
const DoctorModel = mongoose.model("Doctor", DoctorSchema);
export default DoctorModel;

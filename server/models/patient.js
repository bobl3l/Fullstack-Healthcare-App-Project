import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: String, required: true },
  allergy: { type: Array },
  appointments: { type: Array },
  profile: { type: String },
});

// Export model
const PatientModel = mongoose.model("Patient", PatientSchema);
export default PatientModel;

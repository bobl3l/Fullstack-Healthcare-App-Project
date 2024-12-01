import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  patient: { type: String, required: true },
  doctor: { type: String, required: true },
  date: { type: Date, required: true },
  remarks: { type: String, required: true },
});

// Export model
const DoctorModel = mongoose.model("user", DoctorSchema);
export default DoctorModel;

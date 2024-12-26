import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: String, required: true },
  patient: { type: String, required: true },
  date: { type: Date, required: true },
  remarks: { type: String, required: true },
  socketId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now() },
});

// Export model
const AppointmentModel = mongoose.model("appointment", AppointmentSchema);
export default AppointmentModel;

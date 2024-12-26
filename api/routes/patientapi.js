import express from "express";
import UserModel from "../models/user.js";
import DoctorModel from "../models/doctor.js";
import PatientModel from "../models/patient.js";

const patientRouter = express.Router();

patientRouter.delete("/remove-user:id", async function (req, res) {
  const { id } = req.params;
  try {
    const user = await UserModel.findOne(id);
    user.role == "doctor"
      ? await DoctorModel.findOne(id).then((doc) => {
          doc.remove();
        })
      : user.role == "patient"
      ? await PatientModel.findOne(id).then((doc) => {
          doc.remove();
        })
      : (id = id);
    UserModel.findOne(id).then((doc) => {
      doc.remove();
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

export default patientRouter;

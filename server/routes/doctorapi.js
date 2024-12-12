import express from "express";
import UserModel from "../models/user.js";
import DoctorModel from "../models/doctor.js";
import PatientModel from "../models/patient.js";

const doctorRouter = express.Router();
let application = {};
doctorRouter.delete("/fetch-appointments", async function (req, res) {
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

doctorRouter.get("/fetch-user", async (req, res) => {
  try {
    if (req.session.user) {
      res.send(JSON.stringify(req.session.user));
    } else {
      res.status(400).send("No session data found");
    }
  } catch (e) {
    console.error(e);
  }
});

export default doctorRouter;

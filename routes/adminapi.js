import express from "express";
import UserModel from "../models/user.js";
import DoctorModel from "../models/doctor.js";
import PatientModel from "../models/patient.js";

const adminRouter = express.Router();
let application = {};
adminRouter.delete("/remove-user:id", async function (req, res) {
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

adminRouter.post("/edit-user", function (req, res) {
  const { id } = req.body;
  try {
    UserModel.findOne(id).then((doc) => {
      doc.remove();
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

adminRouter.get("/user-info:id", async function (req, res) {
  const { id } = req.params;
  let output;
  try {
    const user = await UserModel.findOne(id);
    user.role == "patient"
      ? (output = await PatientModel.findOne(id))
      : (output = await DoctorModel.findOne(id));
    res.status(200).send(`/user-info/id?=${user.id}`, { user: output });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

adminRouter.post("/approve?id=:id", async function (req, res) {
  const { id } = req.params;

  try {
    application = await DoctorModel.findOne(id);
    application.approved = "approved";
    await application.save();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

adminRouter.post("/reject?id=:id", async function (req, res) {
  const { id } = req.params;
  try {
    DoctorModel.findOne(id).then((doc) => {
      doc.remove();
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

export default adminRouter;

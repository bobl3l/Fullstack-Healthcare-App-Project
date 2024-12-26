import express from "express";
import UserModel from "../models/user.js";
import DoctorModel from "../models/doctor.js";
import PatientModel from "../models/patient.js";

const adminRouter = express.Router();
let application = {};

adminRouter.get("/get-users", async function (req, res) {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

adminRouter.get("/get-applications", async function (req, res) {
  try {
    const applications = await DoctorModel.find({ approval: "pending" });
    res.json(applications);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

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
      doc.save();
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

const ATLAS_API_URL = "https://cloud.mongodb.com/api/atlas/v1.0";
const PROJECT_ID = "673f4e7ed5bce7473b3c341c";
const CLUSTER_HOST = "healthcareproject.dujgm";
const API_KEY = "aqbvgmdp"; // Store securely in environment variables

adminRouter.get("/metrics", async (req, res) => {
  try {
    const response = await axios.get(
      `${ATLAS_API_URL}/groups/${PROJECT_ID}/processes/${CLUSTER_HOST}:27017/measurements`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(API_KEY).toString("base64")}`,
        },
        params: {
          granularity: "PT1M",
          period: "PT1H",
          m: "CONNECTIONS",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching metrics");
  }
});
export default adminRouter;

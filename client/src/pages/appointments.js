import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoggedIn] = useContext(AuthContext);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/fetch-appointments",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setAppointments(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) => {
          const appointmentTime = new Date(appointment.date).getTime();
          const currentTime = new Date().getTime();
          const timeRemaining = appointmentTime - currentTime;

          return {
            ...appointment,
            isActive: timeRemaining <= 0,
            remainingTime: Math.max(timeRemaining, 0),
          };
        })
      );
    }, 1000);
  }, []);
  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  // Handle edit submission
  async function handleEditSubmit(id, updatedDate) {
    await axios
      .post("http://localhost:5000/update-appointment", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(function (response) {
        if (response.status === 200) {
          setAppointments((prev) =>
            prev.map((appointment) =>
              appointment.id === id
                ? { ...appointment, date: updatedDate }
                : appointment
            )
          );
          setEditingAppointment(null);
        } else {
          console.log("delete failed.");
        }
      })
      .catch((err) => console.log(err));
  }

  // Handle cancel appointment
  async function handleCancel(id) {
    await axios
      .post("http://localhost:5000/delete-appointment", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(function (response) {
        if (response.status === 200) {
          setAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== id)
          );
        } else {
          console.log("delete failed.");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="appointment-list">
      <h1>Your Appointments</h1>

      {!isLoggedIn ? (
        <p className="text-center">
          You need to sign in to view your appointments.
        </p>
      ) : appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} className="appointment-item">
              <div>
                <strong>Doctor:</strong> {appointment.doctor} <br />
                <strong>Date:</strong>{" "}
                {appointment.date.replace("T", " ").replace(".000Z", " ")}{" "}
                <br />
                <p>
                  {appointment.isActive
                    ? "Call is active"
                    : `Time remaining: ${formatTime(
                        appointment.remainingTime
                      )}`}
                </p>
                <button
                  className={classNames(
                    appointment.isActive ? "bg-green-200" : "bg-gray-300",
                    "p-2 rounded-md"
                  )}
                  disabled={!appointment.isActive}
                  onClick={() => navigate(`/videocall/${appointment.socketId}`)}
                >
                  Join Call
                </button>
              </div>

              <div className="appointment-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => setEditingAppointment(appointment)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-cancel"
                  onClick={() => handleCancel(appointment.id)}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <center>No appointments scheduled.</center>
      )}
      {/* Edit Modal */}
      {editingAppointment && (
        <div className="modal">
          <div className="modal-content-small ">
            <h3>Edit Appointment</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedDate = e.target.date.value;
                handleEditSubmit(editingAppointment.id, updatedDate);
              }}
            >
              <div>
                <label>Date:</label>
                <input
                  type="datetime-local"
                  name="date"
                  defaultValue={editingAppointment.date}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setEditingAppointment(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;

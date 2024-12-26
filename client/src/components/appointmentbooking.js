import React, { useState, useEffect } from "react";
import "./appointment.css"; // Include CSS for styling
import Notification from "./notification";
import axios from "axios";

const AppointmentModal = ({ isOpen, onClose, doctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [userID, setuserID] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetch-user", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }); // Replace with your API endpoint

        setuserID(response.data?.name);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    console.log(userID);

    if (userID) {
      axios
        .post("http://localhost:5000/make-appointment", {
          doctor: selectedDoctor,
          patient: userID,
          date,
          remarks,
        })
        .then(function (response) {
          if (response.status === 200) {
            console.log(response.data);
            onClose();
          } else {
            console.log("Signup failed.");
          }
        })
        .catch((err) => console.log(err));
    } else {
      setNotification({
        message: "You must be logged in to book an appointment.",
        type: "warning",
      });
      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000); // Adjust the delay as needed
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>Book an Appointment</h2>
          <form>
            <label htmlFor="doctor">Select Doctor:</label>
            <select
              id="doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose a doctor
              </option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor.name}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
            <input type="hidden" id="patient" value={userID} />
            <label htmlFor="date">Select Date:</label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <label htmlFor="remark">Remark:</label>
            <textarea
              id="remark"
              rows="4"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add a remark"
            ></textarea>
          </form>

          <div className="modal-buttons">
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button onClick={handleSubmit} className="submit-button">
              Submit
            </button>
          </div>
        </div>
      </div>
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </>
  );
};

export default AppointmentModal;

import React, { useState } from "react";
import "./appointment.css"; // Include CSS for styling

const AppointmentModal = ({ isOpen, onClose, onSubmit, doctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [remark, setRemark] = useState("");

  const handleSubmit = () => {
    onSubmit({ selectedDoctor, date, time, remark });
    onClose();
  };

  if (!isOpen) return null;

  return (
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
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
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
  );
};

export default AppointmentModal;

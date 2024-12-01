import React, { useState } from "react";
import "./style.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. John Doe", date: "2024-12-01", time: "10:00 AM" },
    { id: 2, doctor: "Dr. Jane Smith", date: "2024-12-02", time: "2:00 PM" },
    { id: 3, doctor: "Dr. Emily White", date: "2024-12-03", time: "11:30 AM" },
  ]);

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Handle edit submission
  const handleEditSubmit = (id, updatedDate, updatedTime) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? { ...appointment, date: updatedDate, time: updatedTime }
          : appointment
      )
    );
    setEditingAppointment(null);
  };

  // Handle cancel appointment
  const handleCancel = (id) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );
  };

  return (
    <div className="appointment-list">
      <h1>Your Appointments</h1>

      {!currentUser ? (
        <p className="text-center">
          You need to sign in to view your appointments.
        </p>
      ) : appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} className="appointment-item">
              <div>
                <strong>Doctor:</strong> {appointment.doctor} <br />
                <strong>Date:</strong> {appointment.date} <br />
                <strong>Time:</strong> {appointment.time}
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
        <p>No appointments scheduled.</p>
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
                const updatedTime = e.target.time.value;
                handleEditSubmit(
                  editingAppointment.id,
                  updatedDate,
                  updatedTime
                );
              }}
            >
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={editingAppointment.date}
                  required
                />
              </div>
              <div>
                <label>Time:</label>
                <input
                  type="time"
                  step="1800"
                  name="time"
                  defaultValue={editingAppointment.time}
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

import React, { useState } from "react";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([
    // Sample data for appointments
    { id: 1, patientName: "John Doe", time: "2024 Dec 15 10:00 AM" },
    { id: 2, patientName: "Jane Smith", time: "2024 Dec 17 11:00 AM" },
  ]);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [newTime, setNewTime] = useState("");

  const handleEditClick = (appointmentId, currentTime) => {
    setEditingAppointmentId(appointmentId);
    setNewTime(currentTime);
  };

  const handleSaveClick = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, time: newTime }
          : appointment
      )
    );
    setEditingAppointmentId(null);
  };

  const handleDeleteClick = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto my-12 rounded-2xl shadow bg-slate-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Doctor Dashboard</h1>
      <table className="min-w-full bg-white rounded">
        <thead>
          <tr>
            <th className="py-2">Patient Name</th>
            <th className="py-2">Appointment Date & Time</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="py-2">{appointment.patientName}</td>
              <td className="py-2">
                {editingAppointmentId === appointment.id ? (
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border rounded px-2"
                  />
                ) : (
                  appointment.time
                )}
              </td>
              <td className="py-2">
                {editingAppointmentId === appointment.id ? (
                  <button
                    onClick={() => handleSaveClick(appointment.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleEditClick(appointment.id, appointment.time)
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClick(appointment.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorDashboard;

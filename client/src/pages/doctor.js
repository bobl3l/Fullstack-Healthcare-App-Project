import React, { useState, useEffect } from "react";
import axios from "axios";
const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [newTime, setNewTime] = useState("");

  const handleEditClick = (appointmentId, currentTime) => {
    setEditingAppointmentId(appointmentId);
    setNewTime(currentTime);
  };
  useEffect(() => {
    const fetch = async () => {
      try {
        await axios
          .get("http://localhost:5000/fetch-user", {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
          .then((res) => {
            setAppointments(res.data.appointments);
            console.log(res.data);
          });
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);
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
      {appointments.length < 1 ? (
        <center>No appointments</center>
      ) : (
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
                <td className="py-2">{appointment.patient}</td>
                <td className="py-2">
                  {editingAppointmentId === appointment.id ? (
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="border rounded px-2"
                    />
                  ) : (
                    appointment.date
                  )}
                </td>
                <td className="py-2">
                  {editingAppointmentId === appointment.id ? (
                    <>
                      <button
                        onClick={() => handleSaveClick(appointment.id)}
                        className="px-4 py-2 mx-2 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveClick(appointment.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                    </>
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
      )}
    </div>
  );
};

export default DoctorDashboard;

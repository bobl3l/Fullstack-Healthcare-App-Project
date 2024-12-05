import React, { useState, useEffect } from "react";
import axios from "axios";
const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchapp = async () => {
      try {
        await axios
          .get("http://localhost:5000/admin/get-applications")
          .then((res) => {
            setApplications(res.data);
            console.log(res.data);
          });
      } catch (e) {
        console.error(e);
      }
    };
    fetchapp();
  }, []);

  const handleAction = async (id, action) => {
    //-
    setApplications(
      //-
      applications.map(
        (
          app //-
        ) => (app.id === id ? { ...app, approval: action } : app) //-
      ) //-
    ); //-
  }; //-
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Application Management</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Experience</th>
            <th className="py-2">Specialization</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {applications.map((app) => (
            <tr key={app.id}>
              <td className="py-2">{app.name}</td>
              <td className="py-2">{app.experience}</td>
              <td className="py-2">{app.specialization}</td>
              <td className="py-2">{app.approval}</td>
              <td className="py-2">
                {app.approval === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(app.id, "accepted")}
                      className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(app.id, "rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationManagement;

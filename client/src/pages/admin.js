import React, { useState, useEffect } from "react";
import UserManagement from "../components/database";
import ApplicationManagement from "../components/applications";
const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("users"); // Toggle between 'users' and 'applications'

  return (
    <div className="p-6 max-w-7xl mx-auto  my-12 rounded-2xl bg-white flex-row flex">
      <div className="p-6 max-w-auto mx-4 my-10 bg-slate-50 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        <button
          onClick={() => setCurrentView("users")}
          className={`px-4 py-2 my-4 w-full rounded ${
            currentView === "users" ? "bg-slate-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setCurrentView("applications")}
          className={`px-4 py-2 w-full my-4 rounded ${
            currentView === "applications"
              ? "bg-slate-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Manage Applications
        </button>
      </div>
      <div className="bg-slate-50 my-10 mx-4 p-4 w-full  rounded shadow">
        {currentView === "users" && <UserManagement />}
        {currentView === "applications" && <ApplicationManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;

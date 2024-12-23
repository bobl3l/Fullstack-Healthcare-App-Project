import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  // Static data for user activity
  const userActivityData = {
    labels: [
      "12-12",
      "12-13",
      "12-14",
      "12-15",
      "12-16",
      "12-17",
      "12-18",
      "12-19",
      "12-20",
      "12-21",
      "12-22",
      "12-23",
    ],
    datasets: [
      {
        label: "User Activities",
        data: [30, 50, 45, 60, 70, 90, 100, 85, 75, 65, 55, 40],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Static data for online users
  const onlineUsersData = {
    labels: [
      "12-12",
      "12-13",
      "12-14",
      "12-15",
      "12-16",
      "12-17",
      "12-18",
      "12-19",
      "12-20",
      "12-21",
      "12-22",
      "12-23",
    ],
    datasets: [
      {
        label: "Users Online",
        data: [20, 35, 30, 50, 60, 80, 95, 85, 70, 60, 50, 40],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>
        <strong>Analytics Dashboard</strong>
      </h1>
      <br />

      {/* Line Chart for User Activities */}
      <div style={{ marginBottom: "40px" }}>
        <h2>User Activities Over Time</h2>
        <Line
          data={userActivityData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
          }}
        />
      </div>

      {/* Bar Chart for Online Users */}
      <div>
        <h2>Number of Users Online</h2>
        <Bar
          data={onlineUsersData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Analytics;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function Analytics() {
//   const [connections, setConnections] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/admin/metrics");
//         // Parse the data to extract the number of connections
//         const connectionsData = response.data.measurements.find(
//           (metric) => metric.name === "CONNECTIONS"
//         );
//         setConnections(connectionsData?.value);
//       } catch (error) {
//         console.error("Error fetching metrics:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>MongoDB Atlas Metrics</h1>
//       <p>
//         Current Connections: {connections !== null ? connections : "Loading..."}
//       </p>
//     </div>
//   );
// }

// export default Analytics;

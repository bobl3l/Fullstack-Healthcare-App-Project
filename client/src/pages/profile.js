import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});

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
        setUserData(response.data);
        setEditableData(response.data); // Initialize editable data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({ ...editableData, [name]: value });
  };

  const saveChanges = async () => {
    try {
      await axios.put("http://localhost:5000/api/user", editableData); // Replace with your API endpoint
      setUserData(editableData); // Update displayed data
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  if (!userData) return <p>Loading user data...</p>;

  return (
    <div style={styles.container}>
      <h1 className="font-black text-3xl py-5">User Profile</h1>
      {Object.keys(userData).map((key) => (
        <div style={styles.field} key={key}>
          <strong style={styles.title}>{key}:</strong>
          {isEditing ? (
            <input
              type="text"
              name={key}
              value={editableData[key]}
              onChange={handleInputChange}
              style={styles.input}
            />
          ) : (
            <span style={styles.value}>
              {key === "password" ? "********" : userData[key]}
            </span>
          )}
        </div>
      ))}
      <div style={styles.buttons}>
        {isEditing ? (
          <>
            <button onClick={saveChanges} style={styles.saveButton}>
              Save
            </button>
            <button
              onClick={() => {
                setEditableData(userData);
                setIsEditing(false);
              }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} style={styles.editButton}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "5vh auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  field: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  title: {
    fontWeight: "bold",
  },
  value: {
    marginLeft: "10px",
  },
  input: {
    padding: "5px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  buttons: {
    marginTop: "20px",
    textAlign: "right",
  },
  editButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Profile;

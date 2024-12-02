import React, { useState, useEffect } from "react";
import axios from "axios";
const Profile = () => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    // Fetch user data on component mount
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetch-user"); // Replace with your API endpoint
        setProfile(response.data); // Store the response data
      } catch (err) {
        console.log(err.message); // Store error message
      }
    };

    fetchData();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Here you can add logic to send updated profile data to the backend
    console.log("Updated Profile:", profile);
    setIsEditing(false);
  };

  return (
    <div style={styles.container}>
      <h1>Your Profile</h1>
      <div style={styles.profileCard}>
        {/* Profile Picture */}
        {/* <div style={styles.pictureContainer}>
          <img
            src={profile.profilePicture}
            alt="Profile"
            style={styles.profilePicture}
          />
          {isEditing && (
            <input
              type="url"
              name="profilePicture"
              value={profile.profilePicture}
              onChange={handleInputChange}
              placeholder="Profile Picture URL"
              style={styles.input}
            />
          )}
        </div> */}
        {Object.keys(profile).map((key) => (
          <div style={styles.field}>
            <label>
              <strong>{key}:</strong>
            </label>
            {isEditing ? (
              <input
                type="text"
                name={key}
                value={profile[key]}
                onChange={handleInputChange}
                style={styles.input}
              />
            ) : (
              <span>{profile[key]}</span>
            )}
          </div>
        ))}
        {/* Username */}
        <div style={styles.field}>
          <label>Username:</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              style={styles.input}
            />
          ) : (
            <span>{profile.username}</span>
          )}
        </div>

        {/* Password
        <div style={styles.field}>
          <label>Password:</label>
          {isEditing ? (
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleInputChange}
              style={styles.input}
            />
          ) : (
            <span>{"*".repeat(profile.password.length)}</span>
          )}
        </div>

        {/* Email 
        <div style={styles.field}>
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              style={styles.input}
            />
          ) : (
            <span>{profile.email}</span>
          )}
        </div>

        {/* Details *
        <div style={styles.field}>
          <label>Details:</label>
          {isEditing ? (
            <textarea
              name="details"
              value={profile.details}
              onChange={handleInputChange}
              style={styles.textarea}
            />
          ) : (
            <p>{profile.details}</p>
          )}
        </div> */}

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <button onClick={handleSave} style={styles.button}>
                Save
              </button>
              <button onClick={toggleEditing} style={styles.buttonCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={toggleEditing} style={styles.button}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  profileCard: {
    width: "400px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  pictureContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  profilePicture: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  field: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    height: "60px",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonCancel: {
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Profile;

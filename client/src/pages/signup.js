import React, { useState, useEffect } from "react";
import "./style.css"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    role: "patient",
    age: "",
    allergies: [],
    specialization: "",
    experience: "",
    password: "",
    reenterPassword: "",
  });

  const [allergies, setAllergies] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState("");
  const [passwordError, setPasswordError] = useState([]);
  const [passwordValid, setPasswordValid] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAllergyChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, allergies: [...formData.allergies, value] });
    } else {
      setFormData({
        ...formData,
        allergies: formData.allergies.filter((allergy) => allergy !== value),
      });
    }
  };

  const roleSelect = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const showCheckboxes = () => {
    setExpanded(!expanded);
  };

  const emailCheck = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Invalid email address.");
      setEmailValid("");
    } else {
      setEmailError("");
      setEmailValid("Valid email");
    }
  };

  const passwordCheck = () => {
    const errors = [];
    if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(formData.password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/\d/.test(formData.password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[@$!%*?&]/.test(formData.password)) {
      errors.push(
        "Password must contain at least one special character (e.g., @$!%*?&)."
      );
    }

    setPasswordError(errors);

    if (errors.length === 0) {
      setPasswordValid("Strong password");
    } else {
      setPasswordValid("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="login">
      <form className="login-form" id="signupForm" onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <label>
          Username:
          <br />
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Email:
          <br />
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleInputChange}
            onBlur={emailCheck}
          />
          {emailError && <span className="error">{emailError}</span>}
          {emailValid && <span className="success">{emailValid}</span>}
        </label>
        <br />
        <br />
        <label>
          Name:
          <br />
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Role:
          <br />
          <div className="custom-select">
            <select
              name="role"
              id="roles"
              value={formData.role}
              onChange={roleSelect}
            >
              <option value="patient">patient</option>
              <option value="doctor">doctor</option>
            </select>
          </div>
        </label>
        <br />
        {formData.role === "patient" && (
          <div id="patient">
            <label>
              Age:
              <br />
              <input
                type="text"
                name="age"
                placeholder="Your age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <br />
            <label>
              Allergies:
              <br />
              <div className="multiselect">
                <div className="selectBox" onClick={showCheckboxes}>
                  <select>
                    <option id="multiSelectDropdown">
                      {formData.allergies.length > 0
                        ? formData.allergies.join(", ")
                        : "Select your allergies"}
                    </option>
                  </select>
                  <div className="overSelect"></div>
                </div>
                {expanded && (
                  <div id="checkboxes">
                    {allergies.map((allergy, index) => (
                      <label key={index} htmlFor={`allergy${index}`}>
                        <input
                          type="checkbox"
                          id={`allergy${index}`}
                          value={allergy}
                          checked={formData.allergies.includes(allergy)}
                          onChange={handleAllergyChange}
                        />
                        {allergy}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </label>
            <br />
          </div>
        )}
        {formData.role === "doctor" && (
          <div id="doctor">
            <label>
              Specialization:
              <br />
              <input
                type="text"
                name="specialization"
                placeholder="Your area of specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <br />
            <label>
              Experience:
              <br />
              <input
                type="text"
                name="experience"
                placeholder="Years of experience you have"
                value={formData.experience}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <br />
          </div>
        )}
        <label>
          Password:
          <br />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleInputChange}
            onBlur={passwordCheck}
          />
          {passwordError.length > 0 && (
            <ul className="error">
              {passwordError.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          {passwordValid && <span className="success">{passwordValid}</span>}
        </label>
        <br />
        <br />
        <label>
          Re-enter Password:
          <br />
          <input
            type="password"
            name="reenterPassword"
            placeholder="Re enter Password"
            required
            value={formData.reenterPassword}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <input type="submit" value="Sign up" />
      </form>
    </div>
  );
};

export default Signup;

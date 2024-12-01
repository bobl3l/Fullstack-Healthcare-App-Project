import React, { useState, useEffect } from "react";
import "./style.css";
import Logo from "../components/logo";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    username: "",
    password: "",
  });
  const handleInput = (event) => {
    const { name, value } = event.target;
    setPost({ ...post, [name]: value });
  };

  function handleSubmit(event) {
    event.preventDefault();
    console.log(post);
    axios
      .post("http://localhost:5000/login", post)
      .then(function (response) {
        if (response.status === 200) {
          // Navigate to success page
          navigate("/");
        } else {
          console.log("Login failed.");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="login">
      <Logo />

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        Username/Email:
        <br />
        <input
          type="text"
          name="username"
          placeholder="Username/Email"
          required
          onChange={handleInput}
        />
        <br />
        <br />
        Password:
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleInput}
        />
        <br />
        <br />
        <input type="submit" value="login" />
        <a
          className="link justify-center"
          href="/signup"
          onClick={() => navigate("/signup")}
        >
          Don't have an account?&nbsp;<span>Sign up here.</span>
        </a>
        <br />
        <a className="link justify-center" href="/passwordreset">
          <span>Forgot your password?</span>
        </a>
      </form>
    </div>
  );
};

export default Login;

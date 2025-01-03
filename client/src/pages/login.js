import React, { useState, useContext, useEffect } from "react";
import "./style.css";
import Logo from "../components/logo";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [post, setPost] = useState({
    username: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext);
  const handleInput = (event) => {
    const { name, value } = event.target;
    setPost({ ...post, [name]: value });
  };
  async function handleSubmit(event) {
    event.preventDefault();
    console.log(post);
    await axios
      .post("http://localhost:5000/login", post, { withCredentials: true })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response);
          setIsLoggedIn(true);
        } else {
          console.log("Login failed.");
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/google/callback",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      setUser(res.data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };
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
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.error("Login Failed")}
        />
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

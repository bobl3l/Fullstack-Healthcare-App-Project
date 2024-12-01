import React from "react";
import "./style.css";

export default function Pwreset() {
  return (
    <div class="login">
      <h1></h1>

      <form class="login-form" action="/pw/forgot-password" method="post">
        <h2>Reset your password</h2>
        Provide your email:
        <br />
        <input type="text" name="email" placeholder="Email" required />
        <br />
        <br />
        <input type="submit" value="Send verification email" />
      </form>
    </div>
  );
}

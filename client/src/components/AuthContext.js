import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
// Create AuthContext
export const AuthContext = createContext();

// Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login status
  useEffect(() => {
    const load = async () => {
      try {
        await axios
          .get("http://localhost:5000/check-auth", {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            if (response.status === 200) {
              console.log("User is currently logged in");
              setIsLoggedIn(true);
            }
          });
      } catch (error) {
        console.log("no user");
        setIsLoggedIn(false);
      }
    };
    load();
  }, []);

  return (
    <AuthContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
      {children}
    </AuthContext.Provider>
  );
};

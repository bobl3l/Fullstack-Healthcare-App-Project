import React from "react";
import DoctorCard from "../components/doctorcard";
import axios from "axios";
import { useState, useEffect } from "react";
const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        await axios.get("http://localhost:5000/fetch-doctors").then((res) => {
          setDoctors(res.data);
          console.log(res.data);
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);
  return (
    <>
      <div className="grid-container">
        {doctors.map((item, index) => (
          <DoctorCard
            name={item.name}
            image={item.profile}
            details={item.details}
            specialization={item.specialization}
            experience={item.experience}
          />
        ))}
      </div>
    </>
  );
};

export default Doctor;

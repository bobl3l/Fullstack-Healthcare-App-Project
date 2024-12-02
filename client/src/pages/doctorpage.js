import React from "react";
import DoctorCard from "../components/doctorcard";

const Doctor = () => {
  return (
    <>
      <DoctorCard
        name="Dr. John Doe"
        image="https://via.placeholder.com/100"
        details="Dr. John Doe is a board-certified physician with 10 years of experience in internal medicine."
      />
    </>
  );
};

export default Doctor;

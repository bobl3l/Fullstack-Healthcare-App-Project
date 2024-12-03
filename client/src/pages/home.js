import React, { useState, useEffect } from "react";
import Gallery from "../components/gallery";
import Cardiology from "../assets/Cardiology.png";
import Dentistry from "../assets/Dentistry.png";
import Dermatology from "../assets/Dermatology.png";
import Gastroenterology from "../assets/Gastroenterology.png";
import Gynecology from "../assets/Gynecology.png";
import Hepatology from "../assets/Hepatology.png";
import Neurology from "../assets/Neurology.png";
import Neurosurgery from "../assets/Neurosurgery.png";
import Ophthalmology from "../assets/Ophthalmology.png";
import Orthopaediology from "../assets/Orthopaediology.png";
import Orthopedics from "../assets/Orthopedics.png";
import Otology from "../assets/Otology.png";
import Plasticsurgery from "../assets/Plasticsurgery.png";
import Pulmonology from "../assets/Pulmonology.png";
import Rhinology from "../assets/Rhinology.png";
import Urology from "../assets/Urology.png";
import Footer from "../components/footer";

const Home = () => {
  const items = [
    { id: 1, img: Cardiology, text: "Cardiology" },
    { id: 2, img: Dentistry, text: "Dentistry" },
    { id: 3, img: Dermatology, text: "Dermatology" },
    { id: 4, img: Gastroenterology, text: "Gastroenterology" },
    { id: 5, img: Gynecology, text: "Gynecology" },
    { id: 6, img: Hepatology, text: "Hepatology" },
    { id: 7, img: Neurology, text: "Neurology" },
    { id: 8, img: Neurosurgery, text: "Neurosurgery" },
    { id: 9, img: Ophthalmology, text: "Ophthalmology" },
    { id: 10, img: Orthopaediology, text: "Orthopaediology" },
    { id: 11, img: Orthopedics, text: "Orthopedics" },
    { id: 12, img: Otology, text: "Otology" },
    { id: 13, img: Plasticsurgery, text: "Plastic surgery" },
    { id: 14, img: Pulmonology, text: "Pulmonology" },
    { id: 15, img: Rhinology, text: "Rhinology" },
    { id: 16, img: Urology, text: "Urology" },
  ];

  const doctors = [
    {
      id: 1,
      img: "https://www.shutterstock.com/image-photo/head-shot-woman-wearing-white-600nw-1529466836.jpg",
      name: "Dr. Leslie Winston",
      title: "Dental Sergeant",
    },
    {
      id: 2,
      img: "https://img.freepik.com/free-photo/front-view-doctor-working-clinic_23-2150165481.jpg",
      name: "Dr. Narender Kumar",
      title: "Orthopedist",
    },
    {
      id: 3,
      img: "https://www.shutterstock.com/image-photo/profile-picture-smiling-young-caucasian-600nw-1954278664.jpg",
      name: "Dr. Simon McCoy",
      title: "Plastic Sergeant",
    },
    {
      id: 4,
      img: "https://st.depositphotos.com/2389277/5131/i/950/depositphotos_51317421-stock-photo-portrait-of-young-male-doctor.jpg",
      name: "Dr. Albert Florence",
      title: "Cardiologist",
    },
  ];

  return (
    <>
      <div>
        <Gallery />
      </div>
      <div className="panel">
        <div className="flex ">
          <img
            src="https://img.freepik.com/premium-photo/clear-svg-vector-flat-icon-logo-doctor_787705-15499.jpg"
            alt="doctor-image"
          />
          <div className="items-center align-middle justify-center m-10">
            <h1>Why choose us?</h1>
            <br></br>
            <p className="inline-block">
              Your health deserves the best care, and we're here to deliver it.
              We combine compassionate care with cutting-edge technology to
              ensure you receive personalized, high-quality treatment every step
              of the way. Our team of experienced professionals is dedicated to
              putting your well-being first, providing expert support in a
              welcoming and trustworthy environment. Discover the difference
              with a healthcare provider who truly listens, understands, and
              puts you at the center of everything we do.
            </p>
          </div>
        </div>
      </div>
      <div className="panel bg-slate-200">
        <h1>Our Services</h1>
        <h4>
          We offer a comprehensive range of medical services, from preventative
          care and routine check-ups to specialized treatments and advanced
          diagnostics, all tailored to meet your unique healthcare needs.
        </h4>
        <div className="grid-container">
          {items.map((item) => (
            <div key={item.id} className="grid-item">
              <img src={item.img} alt={`Image ${item.id}`} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <center>
          <h1>Meet our specialists</h1>
          <h2>We make sure we always provide you the best of the best.</h2>
          <div className="doctor-grid">
            {doctors.map((item) => (
              <div key={item.id} className="doctor-container">
                <img src={item.img} alt={`Image ${item.id}`} />
                <h3>{item.name}</h3>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </center>
      </div>
      <center>
        <Footer />
      </center>
    </>
  );
};

export default Home;

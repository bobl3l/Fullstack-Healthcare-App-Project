import React, { useState, useEffect } from "react";
import "../index.css";
import {
  MdOutlineKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

const Gallery = () => {
  const images = [
    "https://st4.depositphotos.com/1907633/19684/i/450/depositphotos_196846686-stock-photo-general-medical-services-gms-general.jpg",
    "https://thumbs.dreamstime.com/b/smiling-hospital-colleagues-standing-together-20478173.jpg",
    "https://media.istockphoto.com/id/513439349/photo/nurse-and-patient-talking-in-hospital.jpg?s=612x612&w=0&k=20&c=Y0v_ZngEl_G5bKcjimeyXk8zYaESawTrlmukdBCsifU=",
    "https://image.shutterstock.com/image-photo/health-insurance-concept-healthcare-finance-260nw-2383504729.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

  const nextImage = () => {
    setFade(true); // Trigger fade-out animation
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFade(false); // Trigger fade-in animation
    }, 500); // Match CSS transition duration
  };

  const prevImage = () => {
    setFade(true); // Trigger fade-out animation
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setFade(false); // Trigger fade-in animation
    }, 500); // Match CSS transition duration
  };

  return (
    <div className="gallery">
      <div className={`gallery-container ${fade ? "fade-out" : "fade-in"}`}>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="gallery-image"
        />
      </div>

      <button onClick={prevImage} className="left-0.5 ">
        <MdOutlineKeyboardArrowLeft />
      </button>
      <button onClick={nextImage} className="right-0.5 ">
        <MdKeyboardArrowRight />
      </button>
    </div>
  );
};

export default Gallery;

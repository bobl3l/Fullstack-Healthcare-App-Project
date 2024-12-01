import React, { useState } from "react";
import "./DoctorCard.css";

const DoctorCard = ({ name, image, details }) => {
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <div className="info-card">
      <img src={image} alt={`${name}`} className="info-card-image" />
      <h2 className="info-card-name">{name}</h2>
      <p>specialization</p>
      <div className="info-card-buttons">
        <button
          onClick={() => setDetailsModalOpen(true)}
          className="btn btn-info"
        >
          View Details
        </button>
        <button
          onClick={() => setBookingModalOpen(true)}
          className="btn btn-primary"
        >
          Book Appointment
        </button>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="flex-row flex">
              <img src={image} alt={`${name}`} />
              <div className="mx-6">
                <h1>{name}</h1>
                <p>{details}</p>
              </div>
            </div>
            <button
              onClick={() => setDetailsModalOpen(false)}
              className="btn btn-close"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h1>Book an Appointment with {name}</h1>
            <form>
              <div>
                <label>Date:</label>
                <input type="date" required />
              </div>
              <div>
                <label>Time:</label>
                <input type="time" required />
              </div>
              <div>
                <label>Remarks:</label>
                <textarea placeholder="Optional message"></textarea>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                type="button"
                className="btn btn-close"
              >
                Close
              </button>{" "}
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;

import React, { useState } from "react";
import "./DoctorCard.css";

const DoctorCard = ({ name, image, details, specialization, experience }) => {
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <div className="info-card">
      <img src={image} alt={`${name}`} className="info-card-image" />
      <h2 className="info-card-name">{name}</h2>
      <p>{specialization}</p>
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
                <h2>
                  <strong>Years of Experience: </strong>
                  {experience}
                </h2>
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
          <div className="modal-content-small">
            <h1 style={{ fontWeight: "bold" }}>
              Book an Appointment with {name}
            </h1>
            <form className="">
              <div className="text-left m-8 space-y-5">
                <div className="flex flex-row space-x-4">
                  <div className="text-left my-8 space-y-7 flex flex-col">
                    <label style={{ fontWeight: "bold", alignSelf: "center" }}>
                      Date:
                    </label>
                    <label style={{ fontWeight: "bold", alignSelf: "center" }}>
                      Time:
                    </label>
                    <label style={{ fontWeight: "bold", alignSelf: "center" }}>
                      Remarks:
                    </label>
                  </div>
                  <div className="text-left m-8 space-y-5">
                    <input
                      type="date"
                      required
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "rgba(128,128,128,0.1",
                        borderRadius: "5px",
                        padding: "2px",
                      }}
                    />{" "}
                    <input
                      type="time"
                      required
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "rgba(128,128,128,0.1",
                        borderRadius: "5px",
                        padding: "2px",
                      }}
                    />
                    <textarea
                      placeholder="Optional message"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "rgba(128,128,128,0.1",
                        borderRadius: "5px",
                        padding: "4px",
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="flex-row justify-end">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;

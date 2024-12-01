import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ScrollAnimation = () => {
  const ref = useRef(null); // Reference for the div
  const isInView = useInView(ref, { once: true }); // Trigger animation only once

  return (
    <div style={{ height: "200vh", padding: "50px" }}>
      {" "}
      {/* For scroll testing */}
      <h1>Scroll down to see the animation</h1>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }} // Start hidden and slightly below
        animate={isInView ? { opacity: 1, y: 0 } : {}} // Animate when in view
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          backgroundColor: "#007bff",
          height: "200px",
          width: "200px",
          margin: "50px auto",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default ScrollAnimation;

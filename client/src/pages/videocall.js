import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const VideoCall = () => {
  const socketRef = useRef();

  useEffect(() => {
    // Connect to the server
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true,
    });

    // Listen for connection
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Rest of your component logic...

  return (
    // Your component JSX
  );
};

export default VideoCall;
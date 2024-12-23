import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with backend URL

const VideoCall = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [isCallStarted, setIsCallStarted] = useState(false);

  useEffect(() => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionRef.current = peerConnection;

    // Handle ICE Candidate
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    // Handle Remote Stream
    peerConnection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Join Room
    socket.emit("join-room", roomId);

    socket.on("user-joined", () => {
      setIsCallStarted(true);
    });

    socket.on("offer", async ({ from, offer }) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ answer }) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate) {
        await peerConnection.addIceCandidate(candidate);
      }
    });

    // Cleanup on Component Unmount
    return () => {
      peerConnection.close();
      socket.disconnect();
    };
  }, [roomId]);

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    });

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("offer", { roomId, offer });
  };
  return (
    <div>
      <center>
        <div className="flex flex-row">
          <video
            className="m-10 rounded-2xl border-gray-400 border-4"
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          ></video>
          <video
            className="m-10 rounded-2xl border-gray-400 border-4"
            ref={remoteVideoRef}
            autoPlay
            playsInline
          ></video>
        </div>
        <button
          className="bg-sky-700 text-white rounded-md p-5"
          onClick={startCall}
        >
          <strong>Start Call</strong>
        </button>
      </center>
    </div>
  );
};

export default VideoCall;

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams, useNavigate } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash, FaTimes } from "react-icons/fa";

const VideoCall = () => {
  const socket = io("http://localhost:5000"); // Replace with your server URL
  const [peers, setPeers] = useState([]);
  const localVideoRef = useRef();
  const remoteVideoRefs = useRef({});
  const userId = useRef(socket.id); // Use ref to persist userId between renders
  const { roomId } = useParams(); // Fetch the roomId from URL parameters
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Set local video stream
      localVideoRef.current.srcObject = stream;

      // Join the room
      socket.emit("join-room", { roomId, userId: userId.current });

      // Listen for new user connections
      socket.on("user-connected", (newUserId) => {
        const peer = createPeer(newUserId, stream);
        peer.userId = newUserId;
        setPeers((prev) => [...prev, peer]);
      });

      // Listen for incoming signals
      socket.on("signal", ({ signal, userId: remoteUserId }) => {
        const peer = peers.find((p) => p.userId === remoteUserId);
        if (peer) {
          peer.signal(signal);
        } else {
          const newPeer = addPeer(signal, stream, remoteUserId);
          newPeer.userId = remoteUserId;
          setPeers((prev) => [...prev, newPeer]);
        }
      });

      // Handle user disconnections
      socket.on("user-disconnected", (disconnectedUserId) => {
        setPeers((prev) =>
          prev.filter((peer) => peer.userId !== disconnectedUserId)
        );
      });

      return () => {
        socket.disconnect();
        stream.getTracks().forEach((track) => track.stop());
        setPeers([]);
      };
    };

    init();
  }, [roomId]);

  // Create a new peer for the current user to send the offer
  const createPeer = (newUserId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { roomId, signal, targetId: newUserId });
    });

    peer.on("stream", (remoteStream) => {
      console.log(
        `Remote stream received from user: ${newUserId}`,
        remoteStream
      );

      if (remoteVideoRefs.current[newUserId]) {
        remoteVideoRefs.current[newUserId].srcObject = remoteStream;
      }
    });

    return peer;
  };

  // Add a peer when receiving an offer
  const addPeer = (incomingSignal, stream, remoteUserId) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { roomId, signal, targetId: remoteUserId });
    });

    peer.on("stream", (remoteStream) => {
      console.log(
        `Remote stream received from user: ${remoteUserId}`,
        remoteStream
      );

      if (remoteVideoRefs.current[remoteUserId]) {
        remoteVideoRefs.current[remoteUserId].srcObject = remoteStream;
      }
    });

    peer.signal(incomingSignal);
    return peer;
  };

  // Toggle mute functionality
  const toggleMute = () => {
    const enabled = localVideoRef.current.srcObject.getAudioTracks()[0].enabled;
    localVideoRef.current.srcObject.getAudioTracks()[0].enabled = !enabled;
    setIsMuted(!enabled);
  };

  // Leave the room
  const handleLeave = () => {
    socket.disconnect();
    setPeers([]);
    navigate("/");
  };

  return (
    <div>
      <center>
        <div className="w-3/4 justify-center pt-40 flex flex-row">
          <div>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-2/3 rounded-xl border-gray-300 border-8"
            />
          </div>
          <div>
            {peers.map((peer) => (
              <video
                key={peer.userId}
                ref={localVideoRef}
                autoPlay
                playsInline
                className="w-2/3 rounded-xl border-gray-300 border-8"
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex space-x-4 mt-4 justify-center">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Mute"
            >
              {isMuted ? (
                <FaMicrophoneSlash className="text-black w-6 h-6" />
              ) : (
                <FaMicrophone className="text-black w-6 h-6" />
              )}
            </button>

            {/* Leave Button */}
            <button
              onClick={handleLeave}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Leave"
            >
              <FaTimes className="text-black w-6 h-6" />
            </button>
          </div>
        </div>
      </center>
    </div>
  );
};

export default VideoCall;

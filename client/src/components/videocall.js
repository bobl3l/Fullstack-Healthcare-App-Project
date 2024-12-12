import React, { useRef, useEffect } from "react";
import { io } from "socket.io-client";
import "../index.css";

const socket = io("http://localhost:3000");

const VideoCall = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
  );

  useEffect(() => {
    const startLocalStream = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream;

      localStream
        .getTracks()
        .forEach((track) =>
          peerConnectionRef.current.addTrack(track, localStream)
        );

      peerConnectionRef.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { roomId, candidate: event.candidate });
        }
      };
    };

    startLocalStream();

    socket.emit("join-room", { roomId });

    socket.on("offer", async (sdp) => {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, sdp: answer });
    });

    socket.on("answer", async (sdp) => {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
    });

    socket.on("ice-candidate", async (candidate) => {
      if (candidate) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });
  }, [roomId]);

  const startCall = async () => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socket.emit("offer", { roomId, sdp: offer });
  };

  return (
    <div>
      <center>
        <div className="flex flex-row">
          <video
            className="m-10 rounded-2xl border-gray-400 border-4"
            ref={localVideoRef}
            autoPlay
            muted
          ></video>

          <video ref={remoteVideoRef} autoPlay></video>
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

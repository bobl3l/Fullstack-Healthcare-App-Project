import { useRef, useEffect, useState } from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function App() {
  const userInfo = 123456; // Assume userId is defined elsewhere

  const pc = useRef(null);
  const localStream = useRef(null);
  const startButton = useRef(null);
  const hangupButton = useRef(null);
  const muteAudButton = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const muteVideoButton = useRef(null);
  const muteVideo = useRef(null);

  socket.on("calling", (e) => {
    if (!localStream.current) {
      console.log("not ready yet");
      return;
    }
    switch (e.type) {
      case "offer":
        handleOffer(e);
        break;
      case "answer":
        handleAnswer(e);
        break;
      case "candidate":
        handleCandidate(e);
        break;
      case "ready":
        if (pc.current) {
          alert("already in call ignoring");
          return;
        }
        makeCall();
        break;
      case "bye":
        if (pc.current) {
          hangup();
        }
        break;
      default:
        console.log("unhandled", e);
        break;
    }
  });

  async function makeCall() {
    try {
      pc.current = new RTCPeerConnection(configuration);
      pc.current.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          candidate: e.candidate ? e.candidate.candidate : null,
          sdpMid: e.candidate ? e.candidate.sdpMid : undefined,
          sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : undefined,
          id: userInfo,
        };
        socket.emit("calling", message);
      };
      pc.current.ontrack = (e) =>
        (remoteVideo.current.srcObject = e.streams[0]);
      localStream.current
        .getTracks()
        .forEach((track) => pc.current.addTrack(track, localStream.current));
      const offer = await pc.current.createOffer();
      socket.emit("calling", { id: userInfo, type: "offer", sdp: offer.sdp });
      await pc.current.setLocalDescription(offer);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleOffer(offer) {
    if (pc.current) {
      console.error("existing peerconnection");
      return;
    }
    try {
      pc.current = new RTCPeerConnection(configuration);
      pc.current.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          id: userInfo,
          candidate: e.candidate ? e.candidate.candidate : null,
          sdpMid: e.candidate ? e.candidate.sdpMid : undefined,
          sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : undefined,
        };
        socket.emit("calling", message);
      };
      pc.current.ontrack = (e) =>
        (remoteVideo.current.srcObject = e.streams[0]);
      localStream.current
        .getTracks()
        .forEach((track) => pc.current.addTrack(track, localStream.current));
      await pc.current.setRemoteDescription(offer);
      const answer = await pc.current.createAnswer();
      socket.emit("calling", { id: userInfo, type: "answer", sdp: answer.sdp });
      await pc.current.setLocalDescription(answer);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleAnswer(answer) {
    if (!pc.current) {
      console.error("no peerconnection");
      return;
    }
    try {
      await pc.current.setRemoteDescription(answer);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCandidate(candidate) {
    try {
      if (!pc.current) {
        console.error("no peerconnection");
        return;
      }
      await pc.current.addIceCandidate(candidate ? candidate : null);
    } catch (e) {
      console.log(e);
    }
  }

  async function hangup() {
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    localStream.current.getTracks().forEach((track) => track.stop());
    localStream.current = null;
    startButton.current.disabled = false;
    hangupButton.current.disabled = true;
    muteAudButton.current.disabled = true;
    muteVideo.current.disabled = true;

    closeVideoCall();
  }

  useEffect(() => {
    hangupButton.current.disabled = true;
    muteAudButton.current.disabled = true;
    muteVideo.current.disabled = true;
  }, []);

  const [audioState, setAudio] = useState(true);
  const [videoState, setVideoState] = useState(true);

  const startB = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true },
      });
      localVideo.current.srcObject = localStream.current;
    } catch (err) {
      console.log(err);
    }

    startButton.current.disabled = true;
    hangupButton.current.disabled = false;
    muteAudButton.current.disabled = false;
    muteVideo.current.disabled = false;

    socket.emit("calling", { id: userInfo, type: "ready" });
  };

  const hangB = async () => {
    Swal.fire({
      title: "Are you sure to cut the call?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (res.isConfirmed) {
        hangup();
        socket.emit("calling", { id: userInfo, type: "bye" });
      }
    });
  };

  function muteAudio() {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle mute/unmute
      });
      setAudio(!audioState); // Update state for UI toggle
    }
  }

  function pauseVideo() {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle video track
      });
      setVideoState(!videoState); // Update state for UI toggle
    }
  }

  return (
    <div className="bg-white w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 p-4">
          <div className="bg-gray-200 h-96 w-full md:w-96 rounded-lg shadow-md">
            <video
              ref={localVideo}
              className="w-full h-full rounded-lg object-cover"
              autoPlay
              playsInline
            ></video>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="bg-gray-200 h-96 w-full md:w-96 rounded-lg shadow-md">
            <video
              ref={remoteVideo}
              className="w-full h-full rounded-lg object-cover"
              autoPlay
              playsInline
            ></video>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 flex justify-center space-x-4">
        <button
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400"
          ref={muteAudButton}
          onClick={muteAudio}
        >
          {audioState ? <FiMic /> : <FiMicOff />}
        </button>
        <button
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400"
          ref={startButton}
          onClick={startB}
        >
          <FaPhone className="text-gray-600" />
        </button>
        <button
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400"
          ref={muteVideo}
          onClick={pauseVideo}
        >
          {videoState ? (
            <FaVideo className="text-gray-600" />
          ) : (
            <FaVideoSlash className="text-gray-600" />
          )}
        </button>
        <button
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400"
          ref={hangupButton}
          onClick={hangB}
        >
          <FaTimes className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users } from 'lucide-react';

const socket = io("http://localhost:5001"); // Ensure backend is running

export default function VideoCall() {
    const [roomId, setRoomId] = useState("");
    const [inCall, setInCall] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [participantCount, setParticipantCount] = useState(1);

    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const { user } = useSelector(state => state.user) || {};

    // Handle WebSocket Events
    useEffect(() => {
        socket.on("connect", () => console.log("Socket connected:", socket.id));
        socket.on("disconnect", () => console.log("Socket disconnected"));
        socket.on("connect_error", (err) => console.error("Socket connection error:", err));

        socket.on("ready", () => {
            console.log("Both users in room, creating offer...");
            createOffer();
        });

        socket.on("offer", async (offer) => {
            console.log("Received offer, setting remote description...");
            if (!peerConnectionRef.current) setupPeerConnection();
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
        });

        socket.on("answer", (answer) => {
            console.log("Received answer, setting remote description...");
            peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice-candidate", (candidate) => {
            console.log("Received ICE candidate, adding...");
            peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("room-full", () => {
            alert("Room is full. Try another room.");
            setInCall(false);
        });

        return () => {
            console.log("Cleaning up socket listeners...");
            socket.off("ready");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.off("room-full");
        };
    }, [roomId]);

    // Join Room and Setup Stream
    const joinRoom = async () => {
        if (!roomId) return alert("Enter a Room ID!");
        console.log(`Joining room: ${roomId}`);
        setInCall(true);
        socket.emit("join-room", roomId);
        await setupLocalStream();
    };

    // Request Camera & Microphone Permissions
    const setupLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log("Local stream obtained:", stream);
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            if (!peerConnectionRef.current) setupPeerConnection();
            stream.getTracks().forEach(track => {
                console.log("Adding track to peer connection:", track);
                peerConnectionRef.current?.addTrack(track, stream);
            });

            setLocalStream(stream);
            setRemoteStream(null);
            setIsConnected(true);
            setParticipantCount(1);
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Permission denied! Please allow camera and microphone access.");
        }
    };

    // Setup Peer Connection
    const setupPeerConnection = () => {
        console.log("Setting up Peer Connection...");
        peerConnectionRef.current = new RTCPeerConnection(servers);

        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Sending ICE candidate:", event.candidate);
                socket.emit("ice-candidate", { roomId, candidate: event.candidate });
            } else {
                console.log("No more ICE candidates.");
            }
        };

        peerConnectionRef.current.ontrack = (event) => {
            console.log("Remote stream received:", event.streams[0]);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setRemoteStream(event.streams[0]);
                setParticipantCount(event.streams.length);
            }
        };
    };

    // Create Offer for Peer Connection
    const createOffer = async () => {
        console.log("Creating offer...");
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
    };

    const toggleAudio = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !isAudioEnabled;
            });
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoEnabled;
            });
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const endCall = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        setIsConnected(false);
        setLocalStream(null);
        setRemoteStream(null);
        setInCall(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Telemedicine Video Call</h1>
                    <p className="text-gray-400">Connect with healthcare professionals securely</p>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Local Video */}
                    <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full">
                            <p className="text-white text-sm">You</p>
                        </div>
                    </div>

                    {/* Remote Video */}
                    <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full">
                            <p className="text-white text-sm">Remote User</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center space-y-6">
                    {/* Room ID Input */}
                    <div className="w-full max-w-md">
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter Room ID"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Join/Create Room Button */}
                    <button
                        onClick={joinRoom}
                        disabled={!roomId || isConnected}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                        {isConnected ? 'Connected' : 'Join Room'}
                    </button>

                    {/* Control Buttons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleAudio}
                            className={`p-4 rounded-full ${
                                isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                            } transition-colors duration-200`}
                        >
                            {isAudioEnabled ? (
                                <Mic className="w-6 h-6 text-white" />
                            ) : (
                                <MicOff className="w-6 h-6 text-white" />
                            )}
                        </button>

                        <button
                            onClick={toggleVideo}
                            className={`p-4 rounded-full ${
                                isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                            } transition-colors duration-200`}
                        >
                            {isVideoEnabled ? (
                                <Video className="w-6 h-6 text-white" />
                            ) : (
                                <VideoOff className="w-6 h-6 text-white" />
                            )}
                        </button>

                        <button
                            onClick={endCall}
                            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200"
                        >
                            <PhoneOff className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Participants Counter */}
                    <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="w-5 h-5" />
                        <span>{participantCount} participant(s)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
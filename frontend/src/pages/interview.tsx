import React, { useState, useEffect, useRef, useCallback} from 'react';
import Link from 'next/link';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor, 
  MessageSquare, 
  Send, 
  Users, 
  Clock, 
  Settings, 
  Copy, 
  Code, 
  FileText 
} from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import { useRouter } from 'next/router';
// Types and Interfaces
interface User {
  id: string;
  name: string;
  role: 'interviewer' | 'candidate';
  isVideoOn: boolean;
  isAudioOn: boolean;
  socketId?: string;
}


interface Message {
  id: string;
  sender: string;
  senderRole: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
}


interface InterviewSession {
  id: string;
  passkey: string;
  scheduledTime: Date;
  duration: number;
  participants: User[];
  status: 'waiting' | 'active' | 'ended';
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
type ActiveTab = 'video' | 'chat' | 'code' | 'notes';
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // In real app: clear localStorage and redirect
    console.log('Logged out');
  };

  
};

// JoinModal Component - Fixed and Completeimport { useRouter } from 'next/router';

const JoinModal = ({ 
  joinForm, 
  setJoinForm, 
  error, 
  connectionStatus, 
  joinRoom, 
  createRoom,
  onClose
}: {
  joinForm: {
    name: string;
    role: 'interviewer' | 'candidate';
    roomId: string;
    passkey: string;
  };
  setJoinForm: React.Dispatch<React.SetStateAction<{
    name: string;
    role: 'interviewer' | 'candidate';
    roomId: string;
    passkey: string;
  }>>;
  error: string;
  connectionStatus: string;
  joinRoom: () => void;
  createRoom: () => void;
  onClose?: () => void;
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (

    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition-all duration-200 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Main Modal */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Join Interview</h2>
              <p className="text-blue-100 text-sm">Connect to your interview room</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-red-800 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Connecting Status */}
            {connectionStatus === 'connecting' && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent mr-3"></div>
                  <span className="text-blue-800 text-sm font-medium">Connecting to room...</span>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Input */}
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={joinForm.name}
                    onChange={(e) => setJoinForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-800 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your full name"
                    disabled={connectionStatus === 'connecting'}
                    maxLength={50}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                  Your Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={joinForm.role}
                    onChange={(e) => setJoinForm(prev => ({ ...prev, role: e.target.value as 'interviewer' | 'candidate' }))}
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-800 transition-all duration-200 bg-white appearance-none cursor-pointer"
                    disabled={connectionStatus === 'connecting'}
                  >
                    <option value="candidate">Candidate (Interviewee)</option>
                    <option value="interviewer">Interviewer</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Room ID Input */}
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                  Room ID <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={joinForm.roomId}
                      onChange={(e) => setJoinForm(prev => ({ ...prev, roomId: e.target.value.toUpperCase() }))}
                      className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-800 font-mono font-semibold tracking-wider transition-all duration-200 placeholder-gray-400"
                      placeholder="ABC123"
                      disabled={connectionStatus === 'connecting'}
                      maxLength={6}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={createRoom}
                    className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                    disabled={connectionStatus === 'connecting'}
                    title="Generate a new room ID"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 ml-1">6-character alphanumeric code</p>
              </div>

              {/* Passkey Input */}
              <div className="group">
                <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
                  Passkey <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={joinForm.passkey}
                    onChange={(e) => setJoinForm(prev => ({ ...prev, passkey: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-800 font-mono font-semibold tracking-widest transition-all duration-200 placeholder-gray-400"
                    placeholder="A1B2"
                    disabled={connectionStatus === 'connecting'}
                    maxLength={4}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 ml-1">4-character security code</p>
              </div>
            </div>

            {/* Join Button */}
            <button
              onClick={joinRoom}
              disabled={
                !joinForm.name?.trim() || 
                !joinForm.roomId?.trim() || 
                !joinForm.passkey?.trim() || 
                connectionStatus === 'connecting'
              }
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
            >
              {connectionStatus === 'connecting' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Joining Room...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Join Interview Room
                </div>
              )}
            </button>

            {/* Help Text */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Need help? Contact your interviewer for room details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Main Interview Room Component is on
const InterviewRoom: React.FC = () => {
  // Session Management
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    name: '',
    role: 'candidate',
    isVideoOn: true,
    isAudioOn: true
  });
  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // UI State
  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'code' | 'notes'>('video');
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [joinForm, setJoinForm] = useState({ 
    roomId: '', 
    passkey: '', 
    name: '', 
    role: 'candidate' as 'interviewer' | 'candidate' 
  });
  const [error, setError] = useState<string>('');

  // Chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Code Editor
  const [code, setCode] = useState('// Welcome to the coding interview!\n// Feel free to write your code here\n\nfunction solution() {\n  // Your code here\n}');
  const [language, setLanguage] = useState('javascript');

  // Notes
  const [notes, setNotes] = useState('# Interview Notes\n\n## Candidate Information\n- Name: \n- Position: \n\n## Technical Questions\n1. \n\n## Notes\n');

  // WebSocket and WebRTC
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);

  // Add cleanup flag to prevent state updates after unmount
  const isUnmountingRef = useRef(false);

  // WebRTC Configuration
 const rtcConfig = {
  iceServers: [
    // Google STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    
    // Xirsys free STUN (backup)
    { urls: 'stun:global.stun.twilio.com:3478' }
  ],
  iceCandidatePoolSize: 10
};

  // Initialize WebSocket connection - FIXED VERSION
  const initializeSocket = useCallback(() => {
    console.log('Initializing socket connection...');
    
    // Clean up existing connection
    if (socketRef.current) {
      console.log('Cleaning up existing socket connection');
      socketRef.current.off(); // Remove all listeners
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Replace with your backend URL
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 100000
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      if (!isUnmountingRef.current) {
        setConnectionStatus('connected');
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server. Reason:', reason);
      if (!isUnmountingRef.current) {
        setConnectionStatus('disconnected');
        if (reason === 'io server disconnect') {
          // Server disconnected us, try to reconnect
          socket.connect();
        }
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      if (!isUnmountingRef.current) {
        setConnectionStatus('disconnected');
        setError('Failed to connect to server. Please try again.');
      }
    });

    // Room events
    socket.on('room-joined', (data: { room: InterviewSession, user: User }) => {
      console.log('Room joined successfully:', data);
      if (!isUnmountingRef.current) {
        setSession(data.room);
        setCurrentUser(prev => ({ ...prev, ...data.user }));
        setIsConnected(true);
        setTimeRemaining(data.room.duration * 60);
        setError(''); // Clear any previous errors
      }
    });
socket.on('user-joined', (user: User) => {
  console.log('New user joined:', user);
  if (!isUnmountingRef.current) {
    setRemoteUser(user);
    
    // Use joinForm.role instead of currentUser.role since currentUser might not be updated yet
    if (joinForm.role === 'interviewer' && localStreamRef.current) {
      console.log('Initiating call as interviewer');
      setTimeout(() => {
        if (localStreamRef.current && !peerConnectionRef.current) {
          initiateCall();
        }
      }, 1000); // Reduced timeout
    }
  }
});
    socket.on('user-left', () => {
      console.log('User left the room');
      if (!isUnmountingRef.current) {
        setRemoteUser(null);
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
           resetPeerConnection();
        }
      }
    });

    socket.on('room-error', (error: string) => {
      console.error('Room error:', error);
      if (!isUnmountingRef.current) {
        setError(error);
        setConnectionStatus('disconnected');
      }
    });

    // Chat events
socket.on('new-message', (message: Message) => {
  console.log('New message received:', message);
  if (!isUnmountingRef.current) {
    // Convert timestamp string back to Date object
    const messageWithDate = {
      ...message,
      timestamp: new Date(message.timestamp)
    };
    setMessages(prev => [...prev, messageWithDate]);
    if (activeTab !== 'chat') {
      setUnreadCount(prev => prev + 1);
    }
  }
});
    // Code editor events
    socket.on('code-updated', (newCode: string) => {
      if (!isUnmountingRef.current) {
        setCode(newCode);
      }
    });

    // Notes events
    socket.on('notes-updated', (newNotes: string) => {
      if (!isUnmountingRef.current) {
        setNotes(newNotes);
      }
    });
// Media toggle events
socket.on('media-toggle', (data: { type: 'video' | 'audio', enabled: boolean, userId: string }) => {
  console.log('Media toggle received:', data);
  if (!isUnmountingRef.current && remoteUser) {
    setRemoteUser(prev => prev ? {
      ...prev,
      isVideoOn: data.type === 'video' ? data.enabled : prev.isVideoOn,
      isAudioOn: data.type === 'audio' ? data.enabled : prev.isAudioOn
    } : null);
  }
});
    // WebRTC signaling
    socket.on('webrtc-offer', handleWebRTCOffer);
    socket.on('webrtc-answer', handleWebRTCAnswer);
    socket.on('webrtc-ice-candidate', handleWebRTCIceCandidate);

    return socket;
  }, []); // Remove dependencies that cause re-creation
const checkVideoPermissions = async () => {
  try {
    const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
    console.log('Camera permission:', permissions.state);
    
    if (permissions.state === 'denied') {
      setError('Camera access denied. Please enable camera permissions in your browser settings.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('Permission check not supported, proceeding with media request');
    return true;
  }
};
useEffect(() => {
  // Ensure video is displayed after joining room
  if (!showJoinModal && localStreamRef.current && localVideoRef.current && !localVideoRef.current.srcObject) {
    localVideoRef.current.srcObject = localStreamRef.current;
    localVideoRef.current.play().catch(console.error);
  }
}, [showJoinModal, isConnected]);
  // Initialize media stream
const initializeMedia = useCallback(async () => {
  console.log('Initializing media stream...');
  try {
    const constraints = {
      video: {
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
        frameRate: { ideal: 30, min: 15 },
        facingMode: 'user'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamRef.current = stream;
    
    // REMOVE THIS COMPLEX PROMISE WRAPPER
    // Simply set the video source
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    
    console.log('Media stream initialized successfully');
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    if (!isUnmountingRef.current) {
      setError('Failed to access camera/microphone. Please check permissions.');
    }
    return null;
  }
}, []);

 const createPeerConnection = useCallback(() => {
  console.log('Creating peer connection with config:', rtcConfig);
  const peerConnection = new RTCPeerConnection(rtcConfig);

  peerConnection.onicecandidate = (event) => {
    console.log('ICE candidate event:', event.candidate);
    console.log("Event",event);
    console.log("SOcket",socketRef.current);
    if (event.candidate && socketRef.current) {
      console.log(' ICE Candidate Generated:', {
        type: event.candidate.type,
        protocol: event.candidate.protocol,
        address: event.candidate.address,
        port: event.candidate.port,
        candidate: event.candidate.candidate
      });
      
      socketRef.current.emit('webrtc-ice-candidate', {
        candidate: event.candidate,
        to: remoteUser?.socketId
      });
    } else if (!event.candidate) {
      console.log('ICE gathering complete');
    }
  };
peerConnection.ontrack = (event) => {
  console.log('Received remote track:', event.track.kind, event.streams.length);
  
  // Get the stream from the event
  const [remoteStream] = event.streams;
  
  if (remoteStream && remoteVideoRef.current) {
    console.log('Setting remote stream to video element, tracks:', remoteStream.getTracks().length);
    
    // Clear any existing srcObject first
    if (remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject = null;
    }
    
    // Set the new stream
    remoteVideoRef.current.srcObject = remoteStream;
    remoteStreamRef.current = remoteStream;
    
    // Handle play with better error handling
    const playVideo = async () => {
      try {
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
          await remoteVideoRef.current.play();
          console.log('Remote video playing successfully');
        }
      } catch (error) {
        console.error('Error playing remote video:', error);
        
        // Retry with user interaction requirement
        if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'NotAllowedError') {
          console.log('Autoplay blocked, waiting for user interaction');
          // Add click handler to enable play
          const enablePlay = () => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.play().catch(console.error);
              document.removeEventListener('click', enablePlay);
            }
          };
          document.addEventListener('click', enablePlay);
        } else {
          // Retry after a delay for other errors
          setTimeout(() => {
            if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
              remoteVideoRef.current.play().catch(console.error);
            }
          }, 1000);
        }
      }
    };
    
    // Wait for metadata to load before playing
    remoteVideoRef.current.onloadedmetadata = () => {
      console.log('Remote video metadata loaded');
      playVideo();
    };
    
    // If metadata is already loaded, play immediately
    if (remoteVideoRef.current.readyState >= 1) {
      playVideo();
    }
  }
};

  peerConnection.onconnectionstatechange = () => {
    console.log('Peer connection state changed:', peerConnection.connectionState);
    console.log('ICE connection state:', peerConnection.iceConnectionState);
    console.log('ICE gathering state:', peerConnection.iceGatheringState);
  };

  peerConnection.oniceconnectionstatechange = () => {
    console.log('ICE connection state changed:', peerConnection.iceConnectionState);
    if (peerConnection.iceConnectionState === 'failed') {
      console.log('ICE connection failed, restarting...');
      peerConnection.restartIce();
    }
  };

  return peerConnection;
}, [remoteUser?.socketId]);

const initiateCall = useCallback(async () => {
  console.log('Initiating call...');
  if (!localStreamRef.current || !socketRef.current || !remoteUser) {
    console.log('Cannot initiate call - missing requirements');
    return;
  }

  try {
    peerConnectionRef.current = createPeerConnection();
    
    // Add local stream tracks to peer connection
    localStreamRef.current.getTracks().forEach(track => {
      console.log('Adding local track to peer connection:', track.kind);
      if (peerConnectionRef.current && localStreamRef.current) {
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      }
    });

    const offer = await peerConnectionRef.current.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
      iceRestart: false
    });
    
    await peerConnectionRef.current.setLocalDescription(offer);
    
    console.log('Sending WebRTC offer to:', remoteUser.socketId);
    console.log('Offer SDP:', offer.sdp); // Add this for debugging
    
    socketRef.current.emit('webrtc-offer', {
      offer,
      to: remoteUser.socketId
    });
  } catch (error) {
    console.error('Error creating offer:', error);
  }
}, [createPeerConnection, remoteUser]);

useEffect(() => {
  // Initiate call when remote user joins and we're the interviewer
  if (remoteUser && currentUser.role === 'interviewer' && localStreamRef.current && !peerConnectionRef.current) {
    console.log('Initiating call from useEffect as interviewer');
    setTimeout(() => {
      if (localStreamRef.current && !peerConnectionRef.current) {
        initiateCall();
      }
    }, 1000);
  }
}, [remoteUser, currentUser.role, localStreamRef.current, peerConnectionRef.current, initiateCall]);

 const handleWebRTCOffer = useCallback(async (data: { offer: RTCSessionDescriptionInit, from: string }) => {
  console.log('Handling WebRTC offer from:', data.from);
  if (!localStreamRef.current || !socketRef.current) {
    console.log('Cannot handle offer - missing requirements');
    return;
  }

  try {
    peerConnectionRef.current = createPeerConnection();
    
    // Add local stream tracks to peer connection
    localStreamRef.current.getTracks().forEach(track => {
      console.log('Adding local track to peer connection:', track.kind);
      if (peerConnectionRef.current && localStreamRef.current) {
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      }
    });

    await peerConnectionRef.current.setRemoteDescription(data.offer);
    
    if (iceCandidateQueue.current.length > 0) {
      console.log(`Processing ${iceCandidateQueue.current.length} queued ICE candidates.`);
      for (const candidate of iceCandidateQueue.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding queued ICE candidate:', error);
        }
      }
      iceCandidateQueue.current = []; 
    }

    const answer = await peerConnectionRef.current.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    
    await peerConnectionRef.current.setLocalDescription(answer);
    
    console.log('Sending WebRTC answer to:', data.from);
    socketRef.current.emit('webrtc-answer', {
      answer,
      to: data.from
    });
  } catch (error) {
    console.error('Error handling offer:', error);
  }
}, [createPeerConnection]);

  // This useEffect is for debugging the remote video stream.
  // It was previously misplaced inside a useCallback, which is invalid.
  useEffect(() => {
    if (remoteVideoRef.current) {
      const video = remoteVideoRef.current;
      
      const handleLoadedMetadata = () => {
        console.log('Remote video metadata loaded:', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          duration: video.duration
        });
      };
      
      const handleCanPlay = () => {
        console.log('Remote video can play');
        video.play().catch(console.error);
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [remoteUser]);

  const resetPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
    }
  }, []);

  const handleWebRTCAnswer = useCallback(async (data: { answer: RTCSessionDescriptionInit }) => {
    console.log('Handling WebRTC answer');
    if (peerConnectionRef.current) {
      try {
        await peerConnectionRef.current.setRemoteDescription(data.answer);
        console.log('WebRTC answer handled successfully');

        
        if (iceCandidateQueue.current.length > 0) {
          console.log(`Processing ${iceCandidateQueue.current.length} queued ICE candidates.`);
          for (const candidate of iceCandidateQueue.current) {
            try {
              await peerConnectionRef.current.addIceCandidate(candidate);
            } catch (error) {
              console.error('Error adding queued ICE candidate:', error);
            }
          }
          iceCandidateQueue.current = []; 
        }
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }, []);

  const handleWebRTCIceCandidate = useCallback(async (data: { candidate: RTCIceCandidateInit }) => {
    console.log('Received ICE candidate.');
    if (peerConnectionRef.current?.remoteDescription) {
      try {
        await peerConnectionRef.current.addIceCandidate(data.candidate);
        console.log('ICE candidate added successfully.');
      } catch (error) {
        console.error('Error adding received ICE candidate:', error);
      }
    } else {
      console.log('Peer connection not ready, queueing ICE candidate.');
      iceCandidateQueue.current.push(data.candidate);
    }
  }, []);

  // Toggle media controls
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const newVideoState = videoTrack.enabled;
        setCurrentUser(prev => ({ ...prev, isVideoOn: newVideoState }));
        
        // Emit to other participants
        socketRef.current?.emit('media-toggle', {
          type: 'video',
          enabled: newVideoState,
          roomId: session?.id
        });
      }
    }
  }, [session?.id]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const newAudioState = audioTrack.enabled;
        setCurrentUser(prev => ({ ...prev, isAudioOn: newAudioState }));
        
        // Emit to other participants
        socketRef.current?.emit('media-toggle', {
          type: 'audio',
          enabled: newAudioState,
          roomId: session?.id
        });
      }
    }
  }, [session?.id]);
const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setJoinForm(prev => ({ ...prev, name: e.target.value }));
}, []);

const handleRoomIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setJoinForm(prev => ({ ...prev, roomId: e.target.value.toUpperCase() }));
}, []);
  // Chat functions
  const sendMessage = useCallback(() => {
    if (newMessage.trim() && socketRef.current && session) {
      const message: Message = {
        id: Date.now().toString(),
        sender: currentUser.name,
        senderRole: currentUser.role,
        content: newMessage.trim(),
        timestamp: new Date()
      };
      
      socketRef.current.emit('send-message', {
        message,
        roomId: session.id
      });
      
      setNewMessage('');
    }
  }, [newMessage, currentUser, session]);

  // Code editor sync
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (socketRef.current && session) {
      socketRef.current.emit('code-update', {
        code: newCode,
        roomId: session.id
      });
    }
  }, [session]);

  // Notes sync
  const handleNotesChange = useCallback((newNotes: string) => {
    setNotes(newNotes);
    if (socketRef.current && session) {
      socketRef.current.emit('notes-update', {
        notes: newNotes,
        roomId: session.id
      });
    }
  }, [session]);

  // Generate room credentials
  const generateRoomCredentials = () => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const passkey = Math.random().toString(36).substring(2, 6).toUpperCase();
    return { roomId, passkey };
  };

  // FIXED: Join room function
  const joinRoom = async () => {
    console.log('Join room clicked with form:', joinForm);
    const hasPermission = await checkVideoPermissions();
if (!hasPermission) {
  setConnectionStatus('disconnected');
  return;
}
    
    if (!joinForm.roomId || !joinForm.passkey || !joinForm.name) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setConnectionStatus('connecting');

    try {
      // Initialize media first
      console.log('Initializing media...');
      const stream = await initializeMedia();
      if (!stream) {
        setConnectionStatus('disconnected');
        return;
      }

      // Initialize socket connection
      console.log('Initializing socket...');
      const socket = initializeSocket();

      // Wait for socket to connect before joining room
      const waitForConnection = () => {
        return new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, 100000);

          if (socket.connected) {
            clearTimeout(timeout);
            resolve();
          } else {
            const onConnect = () => {
              clearTimeout(timeout);
              socket.off('connect', onConnect);
              socket.off('connect_error', onError);
              resolve();
            };

            const onError = (error: any) => {
              clearTimeout(timeout);
              socket.off('connect', onConnect);
              socket.off('connect_error', onError);
              reject(error);
            };

            socket.on('connect', onConnect);
            socket.on('connect_error', onError);
          }
        });
      };

      await waitForConnection();
      console.log('Socket connected, joining room...');

      // Join room via socket
      socket.emit('join-room', {
        roomId: joinForm.roomId,
        passkey: joinForm.passkey,
        user: {
          name: joinForm.name,
          role: joinForm.role,
          isVideoOn: true,
          isAudioOn: true
        }
      });

      // Wait for room-joined confirmation
      const waitForRoomJoin = () => {
        return new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Room join timeout'));
          }, 5000);

          const onRoomJoined = () => {
            clearTimeout(timeout);
            socket.off('room-joined', onRoomJoined);
            socket.off('room-error', onRoomError);
            resolve();
          };

          const onRoomError = (error: string) => {
            clearTimeout(timeout);
            socket.off('room-joined', onRoomJoined);
            socket.off('room-error', onRoomError);
            reject(new Error(error));
          };

          socket.on('room-joined', onRoomJoined);
          socket.on('room-error', onRoomError);
        });
      };

      await waitForRoomJoin();
      console.log('Successfully joined room');
      setShowJoinModal(false);

    } catch (error) {
      console.error('Error joining room:', error);
      setError(`Failed to join room: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setConnectionStatus('disconnected');
    }
  };

  // Create new room
  const createRoom = () => {
    const { roomId, passkey } = generateRoomCredentials();
    setJoinForm(prev => ({ ...prev, roomId, passkey, role: 'interviewer' }));
  };

  // FIXED: End call function
  const endCall = useCallback(() => {
    console.log('Ending call...');
    isUnmountingRef.current = true;

    // Clean up WebRTC
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      localStreamRef.current = null;
    }

    // Leave room and disconnect socket
    if (socketRef.current && session) {
      socketRef.current.emit('leave-room', { roomId: session.id });
      socketRef.current.off(); // Remove all listeners
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    

    // Reset state
    setSession(null);
    setRemoteUser(null);
    setIsConnected(false);
    setShowJoinModal(true);
    setConnectionStatus('disconnected');
    setMessages([]);
    setUnreadCount(0);
    
    // Reset unmounting flag after a delay
    setTimeout(() => {
      isUnmountingRef.current = false;
    }, 1000);
  }, [session?.id]);

  // Timer effect - FIXED to prevent infinite re-renders
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected && timeRemaining > 0 && session?.status !== 'ended') {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // End call when time reaches 0
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, endCall]); // Remove timeRemaining from dependencies

  // Clear unread count when switching to chat
  useEffect(() => {
    if (activeTab === 'chat') {
      setUnreadCount(0);
    }
  }, [activeTab]);

  // FIXED: Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting...');
      isUnmountingRef.current = true;
      
      // Clean up WebRTC
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Clean up socket
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copy to clipboard
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Join Modal Component

if (showJoinModal || !session || !isConnected) {
  return (
    <JoinModal
      joinForm={joinForm}
      setJoinForm={setJoinForm}
      error={error}
      connectionStatus={connectionStatus}
      joinRoom={joinRoom}
      createRoom={createRoom}
    />
  );
}

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Interview Room</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="w-4 h-4" />
            <span>{remoteUser ? '2' : '1'} participants</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
            <span>{connectionStatus}</span>
          </div>
        </div>

       <div className="flex items-center gap-2">
          <button
            onClick={() => {
              copyToClipboard(`Room: ${session?.id}, Passkey: ${session?.passkey}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            {copied && (
              <div className="ml-3 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-md shadow-lg animate-fade-in">
                copied
              </div>
            )}
            Share Room
          </button>
          <button className="p-2 hover:bg-gray-700 rounded">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-gray-800 px-4 py-2 flex gap-1 border-b border-gray-700">
            {[
              { id: 'video', label: 'Video', icon: Camera },
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'code', label: 'Code Editor', icon: Code },
              { id: 'notes', label: 'Notes', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id === 'chat' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Video Tab */}
            {activeTab === 'video' && (
              <div className="h-full bg-gray-900 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full">
                {/* Local Video */}
<div className="relative bg-gray-800 rounded-lg overflow-hidden min-h-[300px]">
  <video
    ref={localVideoRef}
    autoPlay
    muted
    playsInline
    className="w-full h-full object-cover bg-gray-800"
    style={{ transform: 'scaleX(-1)', minHeight: '300px' }}
    onLoadedMetadata={() => {
      console.log('Local video metadata loaded');
      if (localVideoRef.current) {
        localVideoRef.current.play().catch(console.error);
      }
    }}
  />
  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded">
    <span className="text-sm">{currentUser.name} (You)</span>
  </div>
  {!currentUser.isVideoOn && (
    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
      <CameraOff className="w-12 h-12 text-gray-400" />
    </div>
  )}
</div>

{/* Remote Video */}
<div className="relative bg-gray-800 rounded-lg overflow-hidden min-h-[300px]">
  {remoteUser ? (
    <>
     <video
  ref={remoteVideoRef}
  autoPlay
  playsInline
  controls={false}
  muted={false}
  className="w-full h-full object-cover bg-gray-800"
  style={{ minHeight: '300px' }}
  onLoadedMetadata={() => {
    console.log('Remote video metadata loaded');
    if (remoteVideoRef.current) {
      remoteVideoRef.current.play().catch(console.error);
    }
  }}
  onError={(e) => {
    console.error('Remote video error:', e);
  }}
  onLoadStart={() => {
    console.log('Remote video load start');
  }}
/>
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded">
        <span className="text-sm">{remoteUser.name}</span>
      </div>
      {!remoteUser.isVideoOn && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <CameraOff className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </>
  ) : (
    <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
      <div className="text-center">
        <Users className="w-12 h-12 mx-auto mb-2" />
        <p>Waiting for participant to join...</p>
      </div>
    </div>
  )}
</div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-50 px-6 py-3 rounded-full">
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-full transition-colors ${
                      currentUser.isAudioOn 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {currentUser.isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full transition-colors ${
                      currentUser.isVideoOn 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {currentUser.isVideoOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                  </button>

                  <button 
                    onClick={endCall}
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>

                  <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                    <Monitor className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col bg-gray-900">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderRole === currentUser.role ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderRole === currentUser.role
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p className="text-xs opacity-70 mb-1">{message.sender}</p>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Code Editor Tab */}
            {activeTab === 'code' && (
              <div className="h-full flex flex-col bg-gray-900">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">Code Editor</h3>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="typescript">TypeScript</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                      Run
                    </button>
                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                      Save
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-4">
                  <textarea
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className="w-full h-full bg-gray-800 text-white font-mono text-sm p-4 border border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your code here..."
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="h-full flex flex-col bg-gray-900">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Interview Notes</h3>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                      Export
                    </button>
                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                      Save
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-4">
                  <textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    className="w-full h-full bg-gray-800 text-white p-4 border border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Take your interview notes here..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;

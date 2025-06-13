import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
         <div className="flex items-center">
              <div
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md m-3 cursor-pointer"
                onClick={() => window.location.href = '/'}
              >
    <img
      src="/logo.svg"
      alt="Campus Konnect Logo"
      className="w-16 h-16 object-contain"
    />
  </div>

  {/* Title styling */}
  <span className="text-2xl font-semibold text-gray-800 tracking-wide">
    <span className="font-bold bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">Campus</span>{' '}
    <span className="font-bold text-gray-900">Konnect</span>
  </span>
            </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/company">
              <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition-colors">
                Home
              </div>
            </Link>
            <Link href="/company/test">
              <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition-colors">
                Dashboard
              </div>
            </Link>
          
            
            {/* Conditional Login/Logout */}
            {!isLoggedIn ? (
              <Link href="/login">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition-colors">
                  Login
                </div>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition-colors bg-transparent border-none"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// JoinModal Component - Fixed and Complete
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
  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="min-h-screen w-full">
        <Navbar />
        <div className="bg-white rounded-lg max-w-md w-full mx-auto mt-8 relative shadow-2xl overflow-hidden">

        {/* Modal Content */}
        <div className="p-8 relative">
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Interview Room</h2>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Connecting Status */}
        {connectionStatus === 'connecting' && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-2"></div>
              Connecting to room...
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={joinForm.name}
              onChange={(e) => setJoinForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition-all"
              placeholder="Enter your full name"
              disabled={connectionStatus === 'connecting'}
              maxLength={50}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Your Role <span className="text-red-500">*</span>
            </label>
            <select
              value={joinForm.role}
              onChange={(e) => setJoinForm(prev => ({ ...prev, role: e.target.value as 'interviewer' | 'candidate' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition-all"
              disabled={connectionStatus === 'connecting'}
            >
              <option value="candidate">Candidate (Interviewee)</option>
              <option value="interviewer">Interviewer</option>
            </select>
          </div>

          {/* Room ID Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Room ID <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinForm.roomId}
                onChange={(e) => setJoinForm(prev => ({ ...prev, roomId: e.target.value.toUpperCase() }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-mono transition-all"
                placeholder="Enter room ID"
                disabled={connectionStatus === 'connecting'}
                maxLength={6}
              />
              <button
                onClick={createRoom}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                disabled={connectionStatus === 'connecting'}
                title="Generate a new room ID"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">6-character alphanumeric code</p>
          </div>

          {/* Passkey Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Passkey <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={joinForm.passkey}
              onChange={(e) => setJoinForm(prev => ({ ...prev, passkey: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-mono transition-all"
              placeholder="Enter passkey"
              disabled={connectionStatus === 'connecting'}
              maxLength={4}
            />
            <p className="text-xs text-gray-500 mt-1">4-character security code</p>
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
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {connectionStatus === 'connecting' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Joining Room...
              </div>
            ) : (
              'Join Interview Room'
            )}
          </button>
        </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
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


// Main Interview Room Component
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
    
    // Additional reliable STUN servers
    { urls: 'stun:stun.nextcloud.com:443' },
    { urls: 'stun:stun.sipgate.net:3478' },
    { urls: 'stun:stun.ekiga.net' },
    
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
    
    const [remoteStream] = event.streams;
    
    if (remoteStream && remoteVideoRef.current) {
      console.log('Setting remote stream to video element, tracks:', remoteStream.getTracks().length);
      remoteVideoRef.current.srcObject = remoteStream;
      remoteStreamRef.current = remoteStream;
      
      // Force play with better error handling
      remoteVideoRef.current.play()
        .then(() => console.log('Remote video playing successfully'))
        .catch(error => {
          console.error('Error playing remote video:', error);
          // Try again after a short delay
          setTimeout(() => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.play().catch(console.error);
            }
          }, 1000);
        });
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
      offerToReceiveVideo: true
    });
    
    await peerConnectionRef.current.setLocalDescription(offer);
    
    console.log('Sending WebRTC offer to:', remoteUser.socketId);
    socketRef.current.emit('webrtc-offer', {
      offer,
      to: remoteUser.socketId
    });
  } catch (error) {
    console.error('Error creating offer:', error);
  }
}, [createPeerConnection, remoteUser]);
// Add this useEffect after your existing useEffects
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
}, [remoteUser, currentUser.role, initiateCall]);
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
 // Add createPeerConnection to dependencies
  const resetPeerConnection = useCallback(() => {
  if (peerConnectionRef.current) {
    peerConnectionRef.current.close();
    peerConnectionRef.current = null;
  }
  if (remoteStreamRef.current) {
    remoteStreamRef.current.getTracks().forEach(track => track.stop());
    remoteStreamRef.current = null;
  }
  // Debug remote video
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
}, []);

  const handleWebRTCAnswer = useCallback(async (data: { answer: RTCSessionDescriptionInit }) => {
    console.log('Handling WebRTC answer');
    if (peerConnectionRef.current) {
      try {
        await peerConnectionRef.current.setRemoteDescription(data.answer);
        console.log('WebRTC answer handled successfully');
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }, []);

  const handleWebRTCIceCandidate = useCallback(async (data: { candidate: RTCIceCandidateInit }) => {
    console.log('Handling ICE candidate');
    if (peerConnectionRef.current) {
      try {
        await peerConnectionRef.current.addIceCandidate(data.candidate);
        console.log('ICE candidate added successfully');
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
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

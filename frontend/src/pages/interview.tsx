'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  Mic, 
  MicOff, 
  CameraOff, 
  Phone, 
  MessageSquare, 
  Code, 
  FileText, 
  Send, 
  Clock, 
  Users,
  Settings,
  Monitor,
  Copy,
  PhoneOff
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

// Types
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

interface User {
  id: string;
  name: string;
  role: 'interviewer' | 'candidate';
  isVideoOn: boolean;
  isAudioOn: boolean;
  socketId?: string;
}

interface RTCMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  from: string;
  to: string;
}

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
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
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
    // Initiate call if we have local stream and no existing peer connection
    // The first person to join after someone else should initiate
    if (localStreamRef.current && !peerConnectionRef.current && user.socketId) {
      console.log('Initiating call to new user');
      setTimeout(() => initiateCall(), 1000);
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
  // WebRTC functions
  const createPeerConnection = useCallback(() => {
    console.log('Creating peer connection...');
    const peerConnection = new RTCPeerConnection(rtcConfig);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        console.log('Sending ICE candidate');
        socketRef.current.emit('webrtc-ice-candidate', {
          candidate: event.candidate,
          to: remoteUser?.socketId
        });
      }
    };
peerConnection.ontrack = (event) => {
  console.log('Received remote track', event.track.kind);
  
  if (!remoteStreamRef.current) {
    remoteStreamRef.current = new MediaStream();
  }
  
  // Add the track to our remote stream
  remoteStreamRef.current.addTrack(event.track);
  
  if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
    remoteVideoRef.current.srcObject = remoteStreamRef.current;
    remoteVideoRef.current.play().catch(error => {
      console.error('Error playing remote video:', error);
    });
  }
};

    peerConnection.onconnectionstatechange = () => {
      console.log('Peer connection state:', peerConnection.connectionState);
    };

    return peerConnection;
  }, [remoteUser?.socketId]);

  const initiateCall = useCallback(async () => {
    console.log('Initiating call...');
    if (!localStreamRef.current || !socketRef.current) {
      console.log('Cannot initiate call - missing stream or socket');
      return;
    }

    peerConnectionRef.current = createPeerConnection();
    
    // Add local stream to peer connection
    localStreamRef.current.getTracks().forEach(track => {
      console.log('Adding track to peer connection:', track.kind);
      peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
    });

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      console.log('Sending WebRTC offer');
      socketRef.current.emit('webrtc-offer', {
        offer,
        to: remoteUser?.socketId
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [createPeerConnection, remoteUser?.socketId]);

  const handleWebRTCOffer = useCallback(async (data: { offer: RTCSessionDescriptionInit, from: string }) => {
    console.log('Handling WebRTC offer');
    if (!localStreamRef.current || !socketRef.current) return;

    peerConnectionRef.current = createPeerConnection();
    
    // Add local stream to peer connection
    localStreamRef.current.getTracks().forEach(track => {
      peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
    });

    try {
      await peerConnectionRef.current.setRemoteDescription(data.offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      console.log('Sending WebRTC answer');
      socketRef.current.emit('webrtc-answer', {
        answer,
        to: data.from
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [createPeerConnection]);
  
  const resetPeerConnection = useCallback(() => {
  if (peerConnectionRef.current) {
    peerConnectionRef.current.close();
    peerConnectionRef.current = null;
  }
  if (remoteStreamRef.current) {
    remoteStreamRef.current.getTracks().forEach(track => track.stop());
    remoteStreamRef.current = null;
  }
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
  }
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
    const roomId = Math.random().toString(36).substring(2, 12).toUpperCase();
    const passkey = Math.random().toString(36).substring(2, 8).toUpperCase();
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
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Join Modal Component
  const JoinModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Interview Room</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {connectionStatus === 'connecting' && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            Connecting to room...
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Your Name</label>
            <input
              type="text"
              value={joinForm.name}
              onChange={(e) => setJoinForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Enter your name"
              disabled={connectionStatus === 'connecting'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Role</label>
            <select
              value={joinForm.role}
              onChange={(e) => setJoinForm(prev => ({ ...prev, role: e.target.value as 'interviewer' | 'candidate' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              disabled={connectionStatus === 'connecting'}
            >
              <option value="candidate">Candidate</option>
              <option value="interviewer">Interviewer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Room ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinForm.roomId}
                onChange={(e) => setJoinForm(prev => ({ ...prev, roomId: e.target.value.toUpperCase() }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Enter room ID"
                disabled={connectionStatus === 'connecting'}
              />
              <button
                onClick={createRoom}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                disabled={connectionStatus === 'connecting'}
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Passkey</label>
            <input
              type="text"
              value={joinForm.passkey}
              onChange={(e) => setJoinForm(prev => ({ ...prev, passkey: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Enter passkey"
              disabled={connectionStatus === 'connecting'}
            />
          </div>

          <button
            onClick={joinRoom}
            disabled={!joinForm.name || !joinForm.roomId || !joinForm.passkey || connectionStatus === 'connecting'}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {connectionStatus === 'connecting' ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </div>
    </div>
  );

  if (showJoinModal) {
    return <JoinModal />;
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
            onClick={() => copyToClipboard(`Room: ${session?.id}, Passkey: ${session?.passkey}`)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
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
        className="w-full h-full object-cover bg-gray-800"
        style={{ minHeight: '300px' }}
        onLoadedMetadata={() => {
          console.log('Remote video metadata loaded');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.play().catch(console.error);
          }
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

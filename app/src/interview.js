const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (use a database in production)
const rooms = new Map();
const users = new Map();

// Room management
class InterviewRoom {
  constructor(id, passkey, creator) {
    this.id = id;
    this.passkey = passkey;
    this.creator = creator;
    this.participants = new Map();
    this.messages = [];
    this.code = '// Welcome to the coding interview!\n// Feel free to write your code here\n\nfunction solution() {\n  // Your code here\n}';
    this.notes = '# Interview Notes\n\n## Candidate Information\n- Name: \n- Position: \n\n## Technical Questions\n1. \n\n## Notes\n';
    this.createdAt = new Date();
    this.status = 'waiting';
    this.duration = 60; // 60 minutes default
  }

  addParticipant(user) {
    this.participants.set(user.socketId, user);
    if (this.participants.size === 2) {
      this.status = 'active';
    }
  }

  removeParticipant(socketId) {
    this.participants.delete(socketId);
    if (this.participants.size === 0) {
      this.status = 'ended';
    }
  }

  getOtherParticipant(socketId) {
    for (const [id, participant] of this.participants) {
      if (id !== socketId) {
        return participant;
      }
    }
    return null;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  updateCode(code) {
    this.code = code;
  }

  updateNotes(notes) {
    this.notes = notes;
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room
  socket.on('join-room', (data) => {
    console.log('Join room request received:', data);
    
    // Add validation for required data
    if (!data || !data.roomId || !data.passkey || !data.user) {
      console.error('Invalid join-room data:', data);
      socket.emit('room-error', 'Missing required data');
      return;
    }

    const { roomId, passkey, user } = data;
    
    // Validate user object
    if (!user.name || !user.role) {
      console.error('Invalid user data:', user);
      socket.emit('room-error', 'Invalid user information');
      return;
    }
    
    try {
      let room = rooms.get(roomId);
      
      if (!room) {
        // Create new room if it doesn't exist
        console.log(`Creating new room: ${roomId}`);
        room = new InterviewRoom(roomId, passkey, user);
        rooms.set(roomId, room);
      } else if (room.passkey !== passkey) {
        console.error(`Invalid passkey for room ${roomId}`);
        socket.emit('room-error', 'Invalid passkey');
        return;
      }
      
      if (room.participants.size >= 2) {
        console.error(`Room ${roomId} is full`);
        socket.emit('room-error', 'Room is full');
        return;
      }

      // Add user to room
      const userWithSocket = { ...user, socketId: socket.id };
      room.addParticipant(userWithSocket);
      users.set(socket.id, { ...userWithSocket, roomId });
      
      // Join socket room
      socket.join(roomId);
      console.log(`User ${user.name} joined room ${roomId}`);
      
      // Send room data to user
      const roomData = {
        room: {
          id: room.id,
          passkey: room.passkey,
          scheduledTime: room.createdAt,
          duration: room.duration,
          participants: Array.from(room.participants.values()),
          status: room.status
        },
        user: userWithSocket
      };
      
      console.log('Sending room-joined event:', roomData);
      socket.emit('room-joined', roomData);

      // Notify other participants
      const otherParticipant = room.getOtherParticipant(socket.id);
if (otherParticipant) {
  console.log(`Notifying other participant: ${otherParticipant.name}`);
  socket.to(otherParticipant.socketId).emit('user-joined', userWithSocket);
}
socket.emit('user-joined', otherParticipant);
      // Send existing messages, code, and notes
      room.messages.forEach(message => {
        socket.emit('new-message', message);
      });
      
      socket.emit('code-updated', room.code);
      socket.emit('notes-updated', room.notes);
      
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('room-error', `Failed to join room: ${error.message}`);
    }
  });

  // Leave room
  socket.on('leave-room', (data) => {
    console.log('Leave room request:', socket.id);
    const user = users.get(socket.id);
    if (user && user.roomId) {
      const room = rooms.get(user.roomId);
      if (room) {
        room.removeParticipant(socket.id);
        socket.to(user.roomId).emit('user-left', user);
        socket.leave(user.roomId);
        console.log(`User ${user.name} left room ${user.roomId}`);
        
        // Clean up empty rooms
        if (room.participants.size === 0) {
          console.log(`Cleaning up empty room: ${user.roomId}`);
          rooms.delete(user.roomId);
        }
      }
    }
    users.delete(socket.id);
  });

  // Handle messages
  socket.on('send-message', (data) => {
    console.log('Message received:', data);
    if (!data || !data.message || !data.roomId) {
      console.error('Invalid message data:', data);
      return;
    }

    const { message, roomId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.addMessage(message);
      io.to(roomId).emit('new-message', message);
    } else {
      console.error(`Room not found: ${roomId}`);
    }
  });

  // Handle code updates
  socket.on('code-update', (data) => {
    console.log('Code update received:', data?.roomId);
    if (!data || !data.roomId || typeof data.code !== 'string') {
      console.error('Invalid code update data:', data);
      return;
    }

    const { code, roomId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.updateCode(code);
      socket.to(roomId).emit('code-updated', code);
    } else {
      console.error(`Room not found for code update: ${roomId}`);
    }
  });

  // Handle notes updates
  socket.on('notes-update', (data) => {
    console.log('Notes update received:', data?.roomId);
    if (!data || !data.roomId || typeof data.notes !== 'string') {
      console.error('Invalid notes update data:', data);
      return;
    }

    const { notes, roomId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.updateNotes(notes);
      socket.to(roomId).emit('notes-updated', notes);
    } else {
      console.error(`Room not found for notes update: ${roomId}`);
    }
  });

  // Handle media toggles
  socket.on('media-toggle', (data) => {
    console.log('Media toggle received:', data);
    if (!data || !data.roomId || !data.type) {
      console.error('Invalid media toggle data:', data);
      return;
    }

    const { type, enabled, roomId } = data;
    socket.to(roomId).emit('media-toggle', { type, enabled, from: socket.id });
  });

  // WebRTC signaling
  socket.on('webrtc-offer', (data) => {
    console.log('WebRTC offer received');
    if (!data || !data.offer || !data.to) {
      console.error('Invalid WebRTC offer data:', data);
      return;
    }

    const { offer, to } = data;
    socket.to(to).emit('webrtc-offer', { offer, from: socket.id });
  });

  socket.on('webrtc-answer', (data) => {
    console.log('WebRTC answer received');
    if (!data || !data.answer || !data.to) {
      console.error('Invalid WebRTC answer data:', data);
      return;
    }

    const { answer, to } = data;
    socket.to(to).emit('webrtc-answer', { answer, from: socket.id });
  });

  socket.on('webrtc-ice-candidate', (data) => {
    console.log('WebRTC ICE candidate received');
    if (!data || !data.candidate || !data.to) {
      console.error('Invalid WebRTC ICE candidate data:', data);
      return;
    }

    const { candidate, to } = data;
    socket.to(to).emit('webrtc-ice-candidate', { candidate, from: socket.id });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    
    const user = users.get(socket.id);
    if (user && user.roomId) {
      const room = rooms.get(user.roomId);
      if (room) {
        room.removeParticipant(socket.id);
        socket.to(user.roomId).emit('user-left', user);
        console.log(`User ${user.name} left room ${user.roomId} due to disconnect`);
        
        // Clean up empty rooms
        if (room.participants.size === 0) {
          console.log(`Cleaning up empty room after disconnect: ${user.roomId}`);
          rooms.delete(user.roomId);
        }
      }
    }
    users.delete(socket.id);
  });

  // Add error handling for socket errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Add connect_error handling
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
});

// API endpoints
app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (room) {
    res.json({
      id: room.id,
      status: room.status,
      participants: room.participants.size,
      createdAt: room.createdAt
    });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    rooms: rooms.size, 
    connectedUsers: users.size 
  });
});

// Add global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
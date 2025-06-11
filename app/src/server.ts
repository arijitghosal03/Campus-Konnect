import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import User from './models/userSchema';
import StudentProfile from './models/studentProfileSchema';
import Company from './models/companySchema';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.SECRET_KEY as string;
const MONGO_URI = process.env.MONGODB_URI as string;

// Configure CORS for both Express and Socket.IO
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

// Configure Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: corsOptions
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Successfully Connected");
  } catch (err: any) {
    console.log("MongoDB Connection Error: ", err);
    process.exit(1);
  }
}

// User Schema Interface
interface IUser extends Document {
  username: string;
  password: string;
  role: 'student' | 'college' | 'company';
  email: string;
  createdAt: Date;
}

// Interview Room Interfaces
interface IInterviewUser {
  name: string;
  role: 'interviewer' | 'candidate';
  socketId: string;
  email?: string;
}

interface IMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'system';
}

// Interview Room Class
class InterviewRoom {
  public id: string;
  public passkey: string;
  public creator: IInterviewUser;
  public participants: Map<string, IInterviewUser>;
  public messages: IMessage[];
  public code: string;
  public notes: string;
  public createdAt: Date;
  public status: 'waiting' | 'active' | 'ended';
  public duration: number;

  constructor(id: string, passkey: string, creator: IInterviewUser) {
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

  addParticipant(user: IInterviewUser): void {
    this.participants.set(user.socketId, user);
    if (this.participants.size === 2) {
      this.status = 'active';
    }
  }

  removeParticipant(socketId: string): void {
    this.participants.delete(socketId);
    if (this.participants.size === 0) {
      this.status = 'ended';
    }
  }

  getOtherParticipant(socketId: string): IInterviewUser | null {
    for (const [id, participant] of this.participants) {
      if (id !== socketId) {
        return participant;
      }
    }
    return null;
  }

  addMessage(message: IMessage): void {
    this.messages.push(message);
  }

  updateCode(code: string): void {
    this.code = code;
  }

  updateNotes(notes: string): void {
    this.notes = notes;
  }
}

// In-memory storage for interview rooms
const interviewRooms = new Map<string, InterviewRoom>();
const interviewUsers = new Map<string, IInterviewUser & { roomId: string }>();

// Custom Request interface
interface CustomRequest extends Request {
  user?: IUser & Document;
}

type CustomRequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => Promise<void> | void;

// Authentication middleware
const authenticate: CustomRequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).json({ message: 'No authorization token provided' });
    return;
  }

  jwt.verify(token, JWT_SECRET, async (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
    if (err) {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }
    
    try {
      const user = await User.findById((decoded as JwtPayload).userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      req.user = user;
      next();
    } catch (error: any) {
      res.status(500).json({ message: 'Server error during authentication' });
      return;
    }
  });
};

// Role authorization middleware
const authorize = (roles: string[]): CustomRequestHandler => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied for this role' });
      return;
    }
    next();
  };
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join interview room
  socket.on('join-room', (data: {
    roomId: string;
    passkey: string;
    user: IInterviewUser;
  }) => {
    console.log('Join room request received:', data);
    
    if (!data || !data.roomId || !data.passkey || !data.user) {
      console.error('Invalid join-room data:', data);
      socket.emit('room-error', 'Missing required data');
      return;
    }

    const { roomId, passkey, user } = data;
    
    if (!user.name || !user.role) {
      console.error('Invalid user data:', user);
      socket.emit('room-error', 'Invalid user information');
      return;
    }
    
    try {
      let room = interviewRooms.get(roomId);
      
      if (!room) {
        console.log(`Creating new room: ${roomId}`);
        room = new InterviewRoom(roomId, passkey, user);
        interviewRooms.set(roomId, room);
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

      const userWithSocket: IInterviewUser = { ...user, socketId: socket.id };
      room.addParticipant(userWithSocket);
      interviewUsers.set(socket.id, { ...userWithSocket, roomId });
      
      socket.join(roomId);
      console.log(`User ${user.name} joined room ${roomId}`);
      
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
      
      socket.emit('room-joined', roomData);

      const otherParticipant = room.getOtherParticipant(socket.id);
      if (otherParticipant) {
        console.log(`Notifying other participant: ${otherParticipant.name}`);
        socket.to(otherParticipant.socketId).emit('user-joined', userWithSocket);
      }
      socket.emit('user-joined', otherParticipant);
      
      room.messages.forEach(message => {
        socket.emit('new-message', message);
      });
      
      socket.emit('code-updated', room.code);
      socket.emit('notes-updated', room.notes);
      
    } catch (error: any) {
      console.error('Error joining room:', error);
      socket.emit('room-error', `Failed to join room: ${error.message}`);
    }
  });

  // Leave interview room
  socket.on('leave-room', () => {
    console.log('Leave room request:', socket.id);
    const user = interviewUsers.get(socket.id);
    if (user && user.roomId) {
      const room = interviewRooms.get(user.roomId);
      if (room) {
        room.removeParticipant(socket.id);
        socket.to(user.roomId).emit('user-left', user);
        socket.leave(user.roomId);
        console.log(`User ${user.name} left room ${user.roomId}`);
        
        if (room.participants.size === 0) {
          console.log(`Cleaning up empty room: ${user.roomId}`);
          interviewRooms.delete(user.roomId);
        }
      }
    }
    interviewUsers.delete(socket.id);
  });

  // Handle chat messages
  socket.on('send-message', (data: { message: IMessage; roomId: string }) => {
    console.log('Message received:', data);
    if (!data || !data.message || !data.roomId) {
      console.error('Invalid message data:', data);
      return;
    }

    const { message, roomId } = data;
    const room = interviewRooms.get(roomId);
    
    if (room) {
      room.addMessage(message);
      io.to(roomId).emit('new-message', message);
    } else {
      console.error(`Room not found: ${roomId}`);
    }
  });

  // Handle code editor updates
  socket.on('code-update', (data: { code: string; roomId: string }) => {
    console.log('Code update received:', data?.roomId);
    if (!data || !data.roomId || typeof data.code !== 'string') {
      console.error('Invalid code update data:', data);
      return;
    }

    const { code, roomId } = data;
    const room = interviewRooms.get(roomId);
    
    if (room) {
      room.updateCode(code);
      socket.to(roomId).emit('code-updated', code);
    } else {
      console.error(`Room not found for code update: ${roomId}`);
    }
  });

  // Handle notes updates
  socket.on('notes-update', (data: { notes: string; roomId: string }) => {
    console.log('Notes update received:', data?.roomId);
    if (!data || !data.roomId || typeof data.notes !== 'string') {
      console.error('Invalid notes update data:', data);
      return;
    }

    const { notes, roomId } = data;
    const room = interviewRooms.get(roomId);
    
    if (room) {
      room.updateNotes(notes);
      socket.to(roomId).emit('notes-updated', notes);
    } else {
      console.error(`Room not found for notes update: ${roomId}`);
    }
  });

  // Handle media toggles (audio/video)
  socket.on('media-toggle', (data: { type: string; enabled: boolean; roomId: string }) => {
    console.log('Media toggle received:', data);
    if (!data || !data.roomId || !data.type) {
      console.error('Invalid media toggle data:', data);
      return;
    }

    const { type, enabled, roomId } = data;
    socket.to(roomId).emit('media-toggle', { type, enabled, from: socket.id });
  });

  // WebRTC signaling for video/audio calls
  socket.on('webrtc-offer', (data: { offer: RTCSessionDescriptionInit; to: string }) => {
    console.log('WebRTC offer received');
    if (!data || !data.offer || !data.to) {
      console.error('Invalid WebRTC offer data:', data);
      return;
    }

    const { offer, to } = data;
    socket.to(to).emit('webrtc-offer', { offer, from: socket.id });
  });

  socket.on('webrtc-answer', (data: { answer: RTCSessionDescriptionInit; to: string }) => {
    console.log('WebRTC answer received');
    if (!data || !data.answer || !data.to) {
      console.error('Invalid WebRTC answer data:', data);
      return;
    }

    const { answer, to } = data;
    socket.to(to).emit('webrtc-answer', { answer, from: socket.id });
  });

  socket.on('webrtc-ice-candidate', (data: { candidate: RTCIceCandidate; to: string }) => {
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
    
    const user = interviewUsers.get(socket.id);
    if (user && user.roomId) {
      const room = interviewRooms.get(user.roomId);
      if (room) {
        room.removeParticipant(socket.id);
        socket.to(user.roomId).emit('user-left', user);
        console.log(`User ${user.name} left room ${user.roomId} due to disconnect`);
        
        if (room.participants.size === 0) {
          console.log(`Cleaning up empty room after disconnect: ${user.roomId}`);
          interviewRooms.delete(user.roomId);
        }
      }
    }
    interviewUsers.delete(socket.id);
  });

  // Socket error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Campus Konnect Backend is running',
    timestamp: new Date().toISOString(),
    interviewRooms: interviewRooms.size,
    connectedUsers: interviewUsers.size
  });
});

// Interview Room API endpoints
app.get('/api/interview/rooms/:roomId', (req: Request, res: Response) => {
  const room = interviewRooms.get(req.params.roomId);
  if (room) {
    res.json({
      id: room.id,
      status: room.status,
      participants: room.participants.size,
      createdAt: room.createdAt
    });
  } else {
    res.status(404).json({ error: 'Interview room not found' });
  }
});

app.post('/api/interview/rooms', authenticate, (req: CustomRequest, res: Response) => {
  try {
    const { roomId, passkey, duration = 60 } = req.body;
    
    if (!roomId || !passkey) {
      res.status(400).json({ error: 'Room ID and passkey are required' });
      return;
    }

    if (interviewRooms.has(roomId)) {
      res.status(409).json({ error: 'Room already exists' });
      return;
    }

    const creator: IInterviewUser = {
      name: req.user?.username || 'Unknown',
      role: req.user?.role === 'company' ? 'interviewer' : 'candidate',
      socketId: '', // Will be set when user joins
      email: req.user?.email
    };

    const room = new InterviewRoom(roomId, passkey, creator);
    room.duration = duration;
    interviewRooms.set(roomId, room);

    res.status(201).json({
      message: 'Interview room created successfully',
      room: {
        id: room.id,
        passkey: room.passkey,
        duration: room.duration,
        createdAt: room.createdAt,
        status: room.status
      }
    });
  } catch (error: any) {
    console.error('Error creating interview room:', error);
    res.status(500).json({ error: 'Failed to create interview room' });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Campus Konnect Backend is running',
    timestamp: new Date().toISOString()
  });
});

// AUTH ROUTES
app.post('/auth/login', (async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}));

app.post('/auth/register', (async (req: Request, res: Response) => {
  try {
    const { username, password, role, email, rollNo, staffCode, companyCode } = req.body;

    if (!username || !password || !role || !email) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if(role !== "student" && role !== "college" && role !== "company") {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(409).json({ message: 'Username or email already exists' });
      return;
    }

    if(role === "student") {
      if (!rollNo) {
        res.status(400).json({ message: 'Roll number is required' });
        return;
      }
    }
    if(role === "college") {
      if (!staffCode) {
        res.status(400).json({ message: 'Staff code is required' });
        return;
      }
      if (staffCode !== process.env.STAFF_CODE) {
        res.status(400).json({ message: 'Invalid Staff code' });
        return;
      }
    }
    if(role === "company") {
      if (!companyCode) {
        res.status(400).json({ message: 'Company code is required' });
        return;
      }
      if (companyCode !== process.env.COMPANY_CODE) {
        res.status(400).json({ message: 'Invalid Company code' });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserDetails: {
      username: string;
      password: string;
      role: string;
      email: string;
      rollNo?: string;
      staffCode?: string;
      companyCode?: string;
    } = {
      username,
      password: hashedPassword,
      role,
      email,
    };

    if (role === 'student') {
      newUserDetails.rollNo = rollNo;
    }
    if (role === 'college') {
      newUserDetails.staffCode = staffCode;
    }
    if (role === 'company') {
      newUserDetails.companyCode = companyCode;
    }
    
    const user = new User(newUserDetails);
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}));

// STUDENT ROUTES
app.get('/student/profile', authenticate, authorize(['student']), (async (req: CustomRequest, res: Response) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }
    res.json(profile);
  } catch (error: any) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}) as CustomRequestHandler);

app.put('/student/profile', authenticate, authorize(['student']), (async (req: CustomRequest, res: Response) => {
  try {
    const profileData = { ...req.body, userId: req.user?._id, updatedAt: new Date() };
    
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user?._id },
      profileData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error: any) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

app.get('/student/dashboard', authenticate, authorize(['student']), (async (req: CustomRequest, res: Response) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user?._id });
    if (!profile) {
      res.json({
        message: 'Profile not found',
        profileExists: false,
        user: {
          id: req.user?._id,
          username: req.user?.username,
          email: req.user?.email,
          role: req.user?.role
        }
      });
      return;
    }

    const dashboardData = {
      profileExists: true,
      student: profile,
      recentAchievements: profile.achievements.slice(-3),
      upcomingAssignments: [],
      notifications: []
    };

    res.json(dashboardData);
  } catch (error: any) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

// COLLEGE ADMIN ROUTES
app.get('/college/dashboard', authenticate, authorize(['college']), (async (req: CustomRequest, res: Response) => {
  try {
    const students = await StudentProfile.find({}).populate('userId', 'username email');
    const totalStudents = students.length;
    
    const departmentStats: Record<string, number> = {};
    const yearStats: Record<string, number> = {};
    
    students.forEach((student) => {
      if (student.department) {
        departmentStats[student.department] = (departmentStats[student.department] || 0) + 1;
      }
      
      if (student.year) {
        yearStats[student.year] = (yearStats[student.year] || 0) + 1;
      }
    });

    const studentInfo = students.map((student) => ({
      id: student._id,
      fullName: student.fullName,
      studentId: student.studentId,
      department: student.department,
      year: student.year,
      semester: student.semester,
      cgpa: student.cgpa,
      attendance: student.attendance,
      email: student.email
    }));

    res.json({
      totalStudents,
      departmentStats,
      yearStats,
      studentInfo,
      recentRegistrations: students.slice(-5)
    });
  } catch (error: any) {
    console.error('Error fetching college dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

app.post('/college/students', authenticate, authorize(['college']), (async (req: CustomRequest, res: Response) => {
  try {
    const studentData = req.body;
    
    const hashedPassword = await bcrypt.hash(studentData.password || 'student123', 10);
    const user = new User({
      username: studentData.username || studentData.studentId,
      password: hashedPassword,
      role: 'student',
      email: studentData.email
    });
    await user.save();

    const studentProfile = new StudentProfile({
      ...studentData,
      userId: user._id
    });
    await studentProfile.save();

    res.status(201).json({ 
      message: 'Student added successfully', 
      student: studentProfile 
    });
  } catch (error: any) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server error' });
  }
}) as CustomRequestHandler);

app.get('/college/students', authenticate, authorize(['college']), (async (req: CustomRequest, res: Response) => {
  try {
    const students = await StudentProfile.find({}).populate('userId', 'username email');
    res.json(students);
  } catch (error: any) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

// COMPANY ROUTES
app.get('/company', authenticate, authorize(['company']), (async (req: CustomRequest, res: Response) => {
  try {
    const company = await Company.findOne({ userId: req.user?._id });
    if (!company) {
      res.json({
        message: 'Company profile not found',
        profileExists: false,
        user: {
          id: req.user?._id,
          username: req.user?.username,
          email: req.user?.email,
          role: req.user?.role
        }
      });
      return;
    }

    const totalJobs = company.jobPostings.length;
    const activeJobs = company.jobPostings.filter(job => job.isActive).length;
    const totalApplications = company.appliedStudents.length;
    
    res.json({
      profileExists: true,
      company,
      stats: {
        totalJobs,
        activeJobs,
        totalApplications
      },
      recentJobs: company.jobPostings.slice(-5),
      recentApplications: company.appliedStudents.slice(-10)
    });
  } catch (error: any) {
    console.error('Error fetching company dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

app.put('/company/profile', authenticate, authorize(['company']), (async (req: CustomRequest, res: Response) => {
  try {
    const companyData = { ...req.body, userId: req.user?._id };
    
    const company = await Company.findOneAndUpdate(
      { userId: req.user?._id },
      companyData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Company profile updated successfully', company });
  } catch (error: any) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

app.post('/company/jobs', authenticate, authorize(['company']), (async (req: CustomRequest, res: Response) => {
  try {
    const company = await Company.findOne({ userId: req.user?._id });
    if (!company) {
      res.status(404).json({ message: 'Company profile not found' });
      return;
    }

    const jobData = {
      ...req.body,
      postedDate: new Date()
    };

    company.jobPostings.push(jobData);
    await company.save();

    res.status(201).json({ message: 'Job posted successfully', job: jobData });
  } catch (error: any) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

app.get('/company/students', authenticate, authorize(['company']), (async (req: CustomRequest, res: Response) => {
  try {
    const students = await StudentProfile.find({})
      .populate('userId', 'username email')
      .select('fullName studentId department year cgpa email achievements');
    
    res.json(students);
  } catch (error: any) {
    console.error('Error fetching students for company:', error);
    res.status(500).json({ message: 'Server error' });
  }
}));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('Default users created successfully');
    });
  } catch (error: any) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import User from './models/userSchema';
import workshop from './models/workshop';
import Company from './models/companySchema';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
// For file uploads
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Student } from './models/students';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import JobPosting from './models/jobPostings';
import {
  getAllJobPostings,
  getJobPostingById,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingsByCompany,
  getEligibleJobPostings,
  getJobPostingStats
} from './jobRoutes';


const uploadsDir = 'uploads/workshops/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/workshops/');
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

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

// In-memory OTP store
const otpStore = new Map<string, { otp: string; expires: number }>();

// Custom Request interface
interface CustomRequest extends Request {
  user?: IUser & Document;
}

type CustomRequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => Promise<void> | void;

// Authentication middleware
const authenticate: CustomRequestHandler = (req, res, next) => {
  console.log("Authenticating user");
  console.log(req.cookies);
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
      secure: true,
      sameSite: 'none',
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
      secure: true,
      sameSite: 'none',
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

app.post('/auth/send-otp', (async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store OTP with expiration (5 minutes)
    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`
    });

    res.status(200).json({ message: 'OTP sent successfully' });
    return;
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
    return;
  }
}));

app.post('/auth/verify-otp', (async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      res.status(400).json({ message: 'OTP not found or expired' });
      return;
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      res.status(400).json({ message: 'OTP expired' });
      return;
    }

    if (storedData.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    // OTP verified successfully
    otpStore.delete(email);
    res.status(200).json({ message: 'OTP verified successfully' });
    return;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
    return;
  }
}));

// STUDENT ROUTES
app.get('/student/profile', authenticate, authorize(['student']), (async (req: CustomRequest, res: Response) => {
  try {
    console.log(req.user);
    //@ts-ignore
    const profile = await Student.findOne({ roll_number: req.user?.rollNo as string });
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
    //@ts-ignore
    const profileData = { ...req.body, roll_number: req.user?.rollNo, updatedAt: new Date() };
    console.log(profileData);
    const profile = await Student.findOneAndUpdate(
      //@ts-ignore
      { roll_number: req.user?.rollNo },
      profileData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error: any) {
    console.error('Error updating student profile:', error);
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

    const studentProfile = new Student({
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

app.get('/college/students', authenticate, authorize(['college','company']), (async (req: CustomRequest, res: Response) => {
  try {
    const students = await Student.find({})
  .populate({
    path: 'userId',
    select: 'username email',
    options: { strictPopulate: false }
  });
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
    const students = await Student.find({})
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
app.post('/api/workshops', (async (req: CustomRequest, res: Response) => {
  try {
    const workshopData = req.body;

    // Validation
    if (!workshopData.title || 
        !workshopData.speaker?.name || 
        !workshopData.topic || 
        !workshopData.date || 
        !workshopData.time || 
        !workshopData.venue || 
        !workshopData.contact?.email || 
        !workshopData.contact?.phone || 
        !workshopData.description || 
        !workshopData.maxParticipants || 
        !workshopData.targetAudience) {
      res.status(400).json({ message: 'All required fields must be provided' });
      return;
    }

    // Set default image if not provided
    if (!workshopData.speaker.image) {
      workshopData.speaker.image = "/api/placeholder/80/80";
    }

    // Filter out empty requirements
    if (workshopData.requirements) {
      workshopData.requirements = workshopData.requirements.filter((req: string) => req.trim() !== '');
    }

    const workshopDoc = new workshop({
      ...workshopData,
      maxParticipants: parseInt(workshopData.maxParticipants),
      status: 'upcoming', // Default status
      createdBy: req.user?._id,
      submittedDate: new Date()
    });

    await workshopDoc.save();

    res.status(201).json({
      message: 'Workshop registered successfully',
      workshop: {
        id: workshopDoc._id,
        title: workshopDoc.title,
        speaker: workshopDoc.speaker.name,
        status: workshopDoc.status,
        submittedDate: workshopDoc.submittedDate
      }
    });
  } catch (error: any) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Get all workshops
app.get('/api/workshops', (async (req: Request, res: Response) => {
  try {
    const { status, topic, limit } = req.query;
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }

    let workshopsQuery = workshop.find(query).sort({ date: 1 });
    
    if (limit) {
      workshopsQuery = workshopsQuery.limit(parseInt(limit as string));
    }

    const workshops = await workshopsQuery.exec();
    
    res.json({
      success: true,
      count: workshops.length,
      workshops
    });
  } catch (error: any) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}));

// Get workshop by ID
app.get('/api/workshops/:id', (async (req: Request, res: Response) => {
  try {
    const workshopDoc = await workshop.findById(req.params.id);
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    res.json({
      success: true,
      workshop: workshopDoc
    });
  } catch (error: any) {
    console.error('Error fetching workshop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}));

// Update workshop
app.put('/api/workshops/:id', (async (req: CustomRequest, res: Response) => {
  try {
    const workshopDoc = await workshop.findById(req.params.id) as (typeof workshop) extends { prototype: infer T } ? T : any;
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    // Optional: Check if the user created this workshop
    

    const updatedWorkshop = await workshop.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Workshop updated successfully',
      workshop: updatedWorkshop
    });
  } catch (error: any) {
    console.error('Error updating workshop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Delete workshop
app.delete('/api/workshops/:id', (async (req: CustomRequest, res: Response) => {
  try {
    const workshopDoc = await workshop.findById(req.params.id);
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    // Optional: Check if the user created this workshop
   

    await workshop.findByIdAndDelete(req.params.id);

    res.json({ message: 'Workshop deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting workshop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Register for workshop (for students)
app.post('/api/workshops/:id/register',  (async (req: CustomRequest, res: Response) => {
  try {
    const workshopDoc = await workshop.findById(req.params.id);
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    // Check if workshop is full
    if (workshopDoc.registeredParticipants && workshopDoc.registeredParticipants.length >= workshopDoc.maxParticipants) {
      res.status(400).json({ message: 'Workshop is full' });
      return;
    }



    // Add user to registered participants
    const participantData = {
      userId: req.user?._id,
      username: req.user?.username,
      email: req.user?.email,
      registeredAt: new Date()
    };

    workshopDoc.registeredParticipants = workshopDoc.registeredParticipants || [];
    workshopDoc.registeredParticipants.push(participantData);

    await workshopDoc.save();

    res.json({
      message: 'Successfully registered for workshop',
      workshop: {
        id: workshopDoc._id,
        title: workshopDoc.title,
        registeredCount: workshopDoc.registeredParticipants.length
      }
    });
  } catch (error: any) {
    console.error('Error registering for workshop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Get workshops for a specific user (registered workshops)
app.get('/api/workshops/user/registered',  (async (req: CustomRequest, res: Response) => {
  try {
    const workshops = await workshop.find({
      'registeredParticipants.userId': req.user?._id
    }).sort({ date: 1 });

    res.json({
      success: true,
      count: workshops.length,
      workshops
    });
  } catch (error: any) {
    console.error('Error fetching user workshops:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Update workshop status (approve/decline)
app.put('/api/workshops/:id/status', (async (req: CustomRequest, res: Response) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !['approved', 'declined', 'pending', 'completed', 'upcoming'].includes(status)) {
      res.status(400).json({ message: 'Invalid status provided' });
      return;
    }

    const workshopDoc = await workshop.findById(req.params.id);
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    // Update workshop status
    const updatedWorkshop = await workshop.findByIdAndUpdate(
      req.params.id,
      { 
        status: status,
        updatedAt: new Date(),
        ...(status === 'approved' && { approvedAt: new Date() }),
        ...(status === 'declined' && { declinedAt: new Date() })
      },
      { new: true, runValidators: true }
    );

    // TODO: Send email notification to workshop organizer
    // You can implement email service here
    console.log(`Workshop ${status}: ${updatedWorkshop?.title} - Email should be sent to: ${updatedWorkshop?.contact.email}`);

    res.json({
      success: true,
      message: `Workshop ${status} successfully`,
      workshop: updatedWorkshop
    });
  } catch (error: any) {
    console.error('Error updating workshop status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Update workshop summary
app.put('/api/workshops/:id/summary',  (async (req: CustomRequest, res: Response) => {
  try {
    const { summary, hasSummary } = req.body;
    
    if (!summary) {
      res.status(400).json({ message: 'Summary data is required' });
      return;
    }

    // Validate summary structure
    if (typeof summary.students !== 'number' || 
        typeof summary.budget !== 'number' || 
        typeof summary.summary !== 'string') {
      res.status(400).json({ message: 'Invalid summary data structure' });
      return;
    }

    const workshopDoc = await workshop.findById(req.params.id);
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    // Update workshop with summary
    const updatedWorkshop = await workshop.findByIdAndUpdate(
      req.params.id,
      { 
        summary: summary,
        hasSummary: hasSummary || true,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Workshop summary updated successfully',
      workshop: updatedWorkshop
    });
  } catch (error: any) {
    console.error('Error updating workshop summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Get workshops by status (upcoming/completed)
app.get('/api/workshops/status/:status', (async (req: CustomRequest, res: Response) => {
  try {
    const { status } = req.params;
    const { limit, skip, sortBy = 'date', sortOrder = 'asc' } = req.query;
    
    // Validate status
    if (!['pending', 'approved', 'declined', 'completed', 'upcoming'].includes(status)) {
      res.status(400).json({ message: 'Invalid status parameter' });
      return;
    }

    let query: any = { status };
    
    // Build query
    let workshopsQuery = workshop.find(query);
    
    // Sorting
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    workshopsQuery = workshopsQuery.sort({ [sortBy as string]: sortDirection });
    
    // Pagination
    if (skip) {
      workshopsQuery = workshopsQuery.skip(parseInt(skip as string));
    }
    
    if (limit) {
      workshopsQuery = workshopsQuery.limit(parseInt(limit as string));
    }

    const workshops = await workshopsQuery.exec();
    const totalCount = await workshop.countDocuments(query);
    
    res.json({
      success: true,
      count: workshops.length,
      totalCount,
      workshops
    });
  } catch (error: any) {
    console.error('Error fetching workshops by status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Bulk update workshop status
app.put('/api/workshops/bulk/status',  (async (req: CustomRequest, res: Response) => {
  try {
    const { workshopIds, status } = req.body;
    
    if (!workshopIds || !Array.isArray(workshopIds) || workshopIds.length === 0) {
      res.status(400).json({ message: 'Workshop IDs array is required' });
      return;
    }
    
    if (!status || !['approved', 'declined', 'pending', 'completed', 'upcoming'].includes(status)) {
      res.status(400).json({ message: 'Invalid status provided' });
      return;
    }

    // Update multiple workshops
    const result = await workshop.updateMany(
      { _id: { $in: workshopIds } },
      { 
        status: status,
        updatedAt: new Date(),
        ...(status === 'approved' && { approvedAt: new Date() }),
        ...(status === 'declined' && { declinedAt: new Date() })
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} workshops updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error: any) {
    console.error('Error bulk updating workshop status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Get workshop statistics
app.get('/api/workshops/stats', (async (req: CustomRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // Get counts by status
    const statusStats = await workshop.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get total participants across all workshops
    const participantStats = await workshop.aggregate([
      { $match: { ...dateFilter, registeredParticipants: { $exists: true } } },
      { $project: { participantCount: { $size: { $ifNull: ['$registeredParticipants', []] } } } },
      { $group: { _id: null, totalParticipants: { $sum: '$participantCount' } } }
    ]);

    // Get workshops by topic
    const topicStats = await workshop.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get monthly workshop creation trend
    const monthlyStats = await workshop.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        byStatus: statusStats,
        totalParticipants: participantStats[0]?.totalParticipants || 0,
        byTopic: topicStats,
        monthly: monthlyStats
      }
    });
  } catch (error: any) {
    console.error('Error fetching workshop statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Upload workshop photos
app.post('/api/workshops/:id/photos',  upload.array('photos', 10), (async (req: CustomRequest, res: Response) => {
  try {
    const workshopDoc = await workshop.findById(req.params.id);
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    // Handle uploaded files
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No photos uploaded' });
      return;
    }

    // Process uploaded files (store file paths or URLs)
    const photoUrls = files.map(file => `/uploads/workshops/${file.filename}`);
    
    // Update workshop with photo URLs
    const existingPhotos = workshopDoc.summary?.photos || [];
    const updatedPhotos = Array.isArray(existingPhotos) 
      ? [...existingPhotos, ...photoUrls] 
      : photoUrls;

    const updatedWorkshop = await workshop.findByIdAndUpdate(
      req.params.id,
      { 
        'summary.photos': updatedPhotos,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      photoUrls,
      workshop: updatedWorkshop
    });
  } catch (error: any) {
    console.error('Error uploading workshop photos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Get workshops created by current user
app.get('/api/workshops/user/created', (async (req: CustomRequest, res: Response) => {
  try {
    const { status, limit, skip } = req.query;
    
    let query: any = { createdBy: req.user?._id };
    
    if (status) {
      query.status = status;
    }

    let workshopsQuery = workshop.find(query).sort({ createdAt: -1 });
    
    if (skip) {
      workshopsQuery = workshopsQuery.skip(parseInt(skip as string));
    }
    
    if (limit) {
      workshopsQuery = workshopsQuery.limit(parseInt(limit as string));
    }

    const workshops = await workshopsQuery.exec();
    const totalCount = await workshop.countDocuments(query);
    
    res.json({
      success: true,
      count: workshops.length,
      totalCount,
      workshops
    });
  } catch (error: any) {
    console.error('Error fetching user created workshops:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Unregister from workshop
app.delete('/api/workshops/:id/unregister',  (async (req: CustomRequest, res: Response) => {
  try {
    const workshopDoc = await workshop.findById(req.params.id);
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    // Check if user is registered
    const isRegistered = workshopDoc.registeredParticipants?.some(
      (p: any) => p.userId?.toString() === req.user?._id?.toString()
    );

    if (!isRegistered) {
      res.status(400).json({ message: 'You are not registered for this workshop' });
      return;
    }

    // Remove user from registered participants
    workshopDoc.registeredParticipants = workshopDoc.registeredParticipants?.filter(
      (p: any) => p.userId?.toString() !== req.user?._id?.toString()
    ) || [];

    await workshopDoc.save();

    res.json({
      success: true,
      message: 'Successfully unregistered from workshop',
      workshop: {
        id: workshopDoc._id,
        title: workshopDoc.title,
        registeredCount: workshopDoc.registeredParticipants.length
      }
    });
  } catch (error: any) {
    console.error('Error unregistering from workshop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

// Get workshop participants
app.get('/api/workshops/:id/participants', (async (req: CustomRequest, res: Response) => {
  try {
    const workshopDoc = await workshop.findById(req.params.id)
      .populate('registeredParticipants.userId', 'username email profile')
      .exec();
    
    if (!workshopDoc) {
      res.status(404).json({ message: 'Workshop not found' });
      return;
    }

    res.json({
      success: true,
      workshop: {
        id: workshopDoc._id,
        title: workshopDoc.title,
        maxParticipants: workshopDoc.maxParticipants,
        registeredCount: workshopDoc.registeredParticipants?.length || 0
      },
      participants: workshopDoc.registeredParticipants || []
    });
  } catch (error: any) {
    console.error('Error fetching workshop participants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}) as CustomRequestHandler);

//JOB ROUTES
// GET /api/job-postings - Get all job postings with filters
app.get('/api/job-postings', getAllJobPostings);

// GET /api/job-postings/stats - Get job posting statistics
app.get('/api/job-postings/stats', getJobPostingStats);

// GET /api/job-postings/companies/:companyName - Get job postings by company
app.get('/api/job-postings/companies/:companyName', getJobPostingsByCompany);

// GET /api/job-postings/eligible/:branch - Get eligible job postings for branch
app.get('/api/job-postings/eligible/:branch', getEligibleJobPostings);

// GET /api/job-postings/:id - Get single job posting by ID
app.get('/api/job-postings/:id', getJobPostingById);

// POST /api/job-postings - Create new job posting (College/Company only)
app.post('/api/job-postings', authenticate, authorize(['college', 'company']), createJobPosting);

// PUT /api/job-postings/:id - Update job posting (College/Company only)
app.put('/api/job-postings/:id', authenticate, authorize(['college', 'company']), updateJobPosting);

// DELETE /api/job-postings/:id - Delete job posting (College only)
app.delete('/api/job-postings/:id', authenticate, authorize(['college']), deleteJobPosting);
app.get('/api/job-postings/search', async (req: Request, res: Response) => {
  try {
    const { 
      q, 
      company, 
      role, 
      location, 
      min_package, 
      max_cgpa, 
      status = 'upcoming',
      page = 1,
      limit = 10
    } = req.query;

    // Build search query
    const searchQuery: any = {};

    // Text search across multiple fields
    if (q) {
      searchQuery.$or = [
        { role: { $regex: q, $options: 'i' } },
        { short_description: { $regex: q, $options: 'i' } },
        { company_name: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { 'requirements.skills': { $in: [new RegExp(q as string, 'i')] } }
      ];
    }

    // Filter by company
    if (company) {
      searchQuery.company_name = { $regex: company, $options: 'i' };
    }

    // Filter by role
    if (role) {
      searchQuery.role = { $regex: role, $options: 'i' };
    }

    // Filter by location
    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }

    // Filter by minimum package (basic string comparison for now)
    if (min_package) {
      searchQuery.package = { $regex: min_package, $options: 'i' };
    }

    // Filter by maximum CGPA requirement
    if (max_cgpa) {
      searchQuery['requirements.cgpa_cutoff'] = { $lte: Number(max_cgpa) };
    }

    // Filter by status
    if (status) {
      searchQuery.status = status;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute search
    const jobPostings = await JobPosting.find(searchQuery)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalCount = await JobPosting.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: jobPostings,
      metadata: {
        total_count: totalCount,
        current_page: Number(page),
        total_pages: Math.ceil(totalCount / Number(limit)),
        search_query: q,
        filters_applied: {
          company,
          role,
          location,
          min_package,
          max_cgpa,
          status
        }
      }
    });
  } catch (error: any) {
    console.error('Error searching job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching job postings',
      error: error.message
    });
  }
});
//CHATBOT backend

// Start server
async function startServer() {
  try {
    await connectDB();
    
    server.listen(PORT, () => {
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
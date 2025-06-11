import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './models/userSchema';
import StudentProfile from './models/studentProfileSchema';
import Company from './models/companySchema';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.SECRET_KEY as string;
const MONGO_URI = process.env.MONGODB_URI as string;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

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

// User Schema
interface IUser extends Document {
  username: string;
  password: string;
  role: 'student' | 'college' | 'company';
  email: string;
  createdAt: Date;
}

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
import React, { useEffect, useState,useRef, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Bell, BookOpen, GraduationCap, Trophy, ThumbsUp, Calendar, PenSquare, 
  User, LogOut, MessageCircle, Edit3, BarChart3, Briefcase, FileText,
  Upload, Save, X, Plus, Star, Award, MapPin, Phone, Mail, 
  School, Users, TrendingUp, Clock, CheckCircle, Eye, Search,
  ChevronRight, Home, Settings, 
  Loader2, 
  AlertTriangle,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  XCircle,
  Filter,
  ExternalLink,
  Building,
  DollarSign
} from 'lucide-react';

// Interfaces (keeping original)
interface IStudent {
  _id?: string;
  name: string;
  roll_number: string;
  college?: string;
  degree?: string;
  stream?: string;
  semester?: number;
  enrollment_year?: number;
  passout_year?: number;
  subjects?: string[];
  backlogs?: number;
  average_cgpa?: number;
  status?: 'Active' | 'Passout' | 'Dropout' | 'On Hold';
  total_marks?: number;
  pending_fees?: number;
  attendance?: number;
  dob?: string;
  mobile?: string;
  email?: string;
  city?: string;
  gender?: 'Male' | 'Female' | 'Other';
  profile_image?: string;
  resume?: string[];
  skills?: string[];
  projects?: string[];
  posts?: Array<{
    title: string;
    content: string;
    date: string;
    description: string;
  }>;
  certificates?: Array<{
    title: string;
    description: string;
    issue_date: string;
    credential_id: string;
  }>;
  internships?: Array<{
    title: string;
    description: string;
    date: string;
  }>;
}
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for the analysis results
interface ResumeInsight {
  title: string;
  description: string;
}
type JobPosting = {
  status: string;
  package?: string;
  requirements?: { 
    cgpa_cutoff?: number;
    skills?: string[];
    eligible_branches?: string[];
    [key: string]: any;
  };
  company_name?: string;
  [key: string]: any;
};

interface ResumeAnalysis {
  goodPoints: ResumeInsight[];
  badPoints: ResumeInsight[];
  overallScore?: number;
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const Student = () => {
  const [student, setStudent] = useState<IStudent | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<IStudent>>({});
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '', description: '' });
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [allJobPostings, setAllJobPostings] = useState<JobPosting[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to text
  const fileToText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string;
        resolve(text);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };
const [showPopup, setShowPopup] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });

  const handleSendEmail = () => {
    const mailtoLink = `mailto:admin@gcelt.gov.in?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
    window.location.href = mailtoLink;
    setShowPopup(false);
    setEmailData({ subject: '', message: '' });
  };
  // Analyze resume with Gemini API
  const analyzeResumeWithGemini = async (file: File): Promise<ResumeAnalysis> => {
    try {
      const fileText = await fileToText(file);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Analyze the following resume and provide exactly 10 insights: 5 good points and 5 areas for improvement.
        
        Please format your response as a JSON object with the following structure:
        {
          "goodPoints": [
            {"title": "Strength Title", "description": "Detailed explanation of what's good"},
            {"title": "Strength Title", "description": "Detailed explanation of what's good"},
            {"title": "Strength Title", "description": "Detailed explanation of what's good"},
            {"title": "Strength Title", "description": "Detailed explanation of what's good"},
            {"title": "Strength Title", "description": "Detailed explanation of what's good"}
          ],
          "badPoints": [
            {"title": "Area for Improvement", "description": "Detailed explanation and suggestion"},
            {"title": "Area for Improvement", "description": "Detailed explanation and suggestion"},
            {"title": "Area for Improvement", "description": "Detailed explanation and suggestion"},
            {"title": "Area for Improvement", "description": "Detailed explanation and suggestion"},
            {"title": "Area for Improvement", "description": "Detailed explanation and suggestion"}
          ],
          "overallScore": 75
        }

        Focus on: content quality, formatting, skills presentation, experience descriptions, education details, contact information, ATS optimization, achievements, professional summary, and readability.

        Resume content:
        ${fileText}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract and parse JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : text;
      const analysisResult: ResumeAnalysis = JSON.parse(jsonString);

      if (!analysisResult.goodPoints || !analysisResult.badPoints || 
          analysisResult.goodPoints.length !== 5 || analysisResult.badPoints.length !== 5) {
        throw new Error('Invalid response structure from Gemini API');
      }

      return analysisResult;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume. Please try again.');
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type - now including PDF
    const allowedTypes = [
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid document file (TXT, DOC, DOCX, or PDF)');
      return;
    }

    // Validate file size (10MB limit for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setError(null);
    
    // Create URL for file preview
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Only analyze non-PDF files automatically
    if (file.type !== 'application/pdf') {
      setLoading(true);
      try {
        const analysisResult = await analyzeResumeWithGemini(file);
        setAnalysis(analysisResult);
        setShowAnalysis(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      } finally {
        setLoading(false);
      }
    }
  };

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null);
    setAnalysis(null);
    setShowAnalysis(false);
    setShowPdfViewer(false);
    setError(null);
    setZoom(1);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle PDF analysis
  const handleAnalyzePdf = async () => {
    if (!uploadedFile || uploadedFile.type !== 'application/pdf') return;
    
    setLoading(true);
    setError('PDF analysis is not yet supported. Please upload a TXT, DOC, or DOCX file for AI analysis.');
    setLoading(false);
  };
  // Mock logged in user data
  const loggedInUser = {
    name: "SUBHAJIT MONDAL",
    roll_number: "11200120020"
  };

  

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true);
      // setTimeout(() => {
      //   setStudent(mockStudentData);
      //   setEditData(mockStudentData);
      //   setIsLoading(false);
      // }, 1500);
      await fetch(`/api/student/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then((res) => {
        return res.json();
      }).then((data) => {
        console.log("Student data", data);
        setStudent(data);
        setEditData(data);
        setIsLoading(false);
      }).catch((err) => {
        console.log(err);
      });
    };

    fetchStudentData();
  }, []);
useEffect(() => {
   const fetchAllJobPostings = async (filters: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const queryString = queryParams.toString();
   
      const url = `/api/api/job-postings${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log("All job postings data:", data);
        setAllJobPostings(data.jobPostings || data.data || []);
      } else {
        console.error('Error fetching job postings:', data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

    fetchAllJobPostings();
  }, []);
  const handleSave = () => {
    setStudent({ ...student, ...editData } as IStudent);
    fetch(`/api/student/profile`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(editData)
    }).then((res) => {
      return res.json();
    }).then((data) => {
      console.log("Student data", data);
    });
    setIsEditing(false);
  };

  const handleAddPost = () => {
    if (newPost.title && newPost.content) {
      const post = {
        ...newPost,
        date: new Date().toISOString().split('T')[0]
      };
      setStudent(prev => ({
        ...prev!,
        posts: [post, ...(prev?.posts || [])]
      }));
      setNewPost({ title: '', content: '', description: '' });
      setShowNewPostModal(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const Sidebar = () => (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 h-fit sticky top-8"
    >
      {/* Profile Section */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
          {student?.name?.charAt(0) || 'S'}
        </div>
        <h3 className="font-semibold text-gray-800 text-sm">{student?.name || 'Student Name'}</h3>
        <p className="text-gray-500 text-xs">{student?.stream || 'Stream'}</p>
      </motion.div>

      {/* Navigation */}
      <div className="space-y-2">
        {[
          { id: 'profile', icon: Home, label: 'Dashboard' },
          { id: 'edit', icon: User, label: 'Profile' },
          { id: 'statistics', icon: BarChart3, label: 'Analytics' },
          { id: 'posts', icon: PenSquare, label: 'Posts' },
          { id: 'achievements', icon: Trophy, label: 'Achievements' },
          { id: 'jobs', icon: Briefcase, label: 'Jobs' },
          { id: 'resume', icon: FileText, label: 'Resume' }
        ].map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm ${
              activeTab === id 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
     
       
      const ProfileSection = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Main Profile Card - Matching Reference */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white/20">
                {student?.name?.charAt(0) || 'S'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{student?.name || 'Student Name'}</h1>
              <p className="text-white/80 text-sm mb-2">{student?.stream || 'Computer Science Class'}</p>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white/20"></div>
                  ))}
                </div>
                <span>25 classmates</span>
              </div>
            </div>
          </div>

          {/* Stats Section - Matching Reference */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{student?.average_cgpa || '0.0'}</div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Average Score</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-8 bg-green-400 rounded-full"></div>
                <div className="w-2 h-6 bg-green-400/60 rounded-full"></div>
                <div className="w-2 h-4 bg-green-400/40 rounded-full"></div>
              </div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Attendance</div>
            </div>

            <div className="text-center relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${(student?.average_cgpa || 0) * 10}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/60 text-xs uppercase tracking-wider">Grades</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section - Matching Reference Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Need Help Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Need help?</h3>
          <p className="text-gray-600 text-sm mb-4">Get your contact to get feedback and support</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPopup(true)}
            className="w-full bg-blue-500 text-white py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-2"
          >
            Contact college admin
          </motion.button>
          <p className="text-xs text-gray-500 mt-2 text-center">Available from 11am till 5pm</p>
           {/* Email Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Email College Admin</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                  admin@gcelt.gov.in
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  placeholder="Enter email subject"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                Send Email
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              This will open your default email client
            </p>
          </div>
        </div>
      )}
        </motion.div>

        {/* Tests Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">TESTS</h3>
            <span className="text-xs text-gray-500">48 min</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Libraries</p>
                  <p className="text-xs text-gray-500">60 min Required</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Algorithms</p>
                  <p className="text-xs text-gray-500">120 min Required</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">2 more this week</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Next Classes */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">NEXT CLASSES</h3>
            <span className="text-xs text-gray-500">3 today</span>
          </div>

          <div className="space-y-3">
            {[
              { subject: 'Multiprocessors', time: 'Class', color: 'bg-red-100 text-red-600', icon: '📊' },
              { subject: 'Information security', time: '2 hour', color: 'bg-green-100 text-green-600', icon: '🔒' },
              { subject: 'Statistical learning', time: '1 hour', color: 'bg-yellow-100 text-yellow-600', icon: '📈' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.subject}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Timetable */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-6">TIMETABLE</h3>
        
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { date: 20, day: 'MON', label: 'MONDAY', isToday: false },
            { date: 21, day: 'TUE', label: 'TUESDAY', isToday: true },
            { date: 22, day: 'WED', label: 'WEDNESDAY', isToday: false },
            { date: 23, day: 'THU', label: 'THURSDAY', isToday: false },
            { date: 24, day: 'FRI', label: 'FRIDAY', isToday: false }
          ].map((day, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                day.isToday 
                  ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`text-2xl font-bold ${day.isToday ? 'text-white' : 'text-gray-800'}`}>
                {day.date}
              </div>
              <div className={`text-xs ${day.isToday ? 'text-white/80' : 'text-gray-500'}`}>
                {day.day}
              </div>
              <div className={`text-xs font-medium ${day.isToday ? 'text-white' : 'text-gray-600'}`}>
                {day.label.slice(0, 3)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const EditSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { label: 'College', key: 'college', type: 'text' },
            { label: 'Degree', key: 'degree', type: 'text' },
            { label: 'Stream', key: 'stream', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
              <input
                type={field.type}
                value={
                 typeof editData[field.key as keyof IStudent] === 'string' || 
                  typeof editData[field.key as keyof IStudent] === 'number'
                    ? String(editData[field.key as keyof IStudent])
                    : ''
                }
                onChange={(e) => setEditData({...editData, [field.key]: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[
            { label: 'Mobile', key: 'mobile', type: 'text' },
            { label: 'City', key: 'city', type: 'text' },
            { label: 'Semester', key: 'semester', type: 'number' },
            { label: 'CGPA', key: 'average_cgpa', type: 'number', step: '0.01' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
              <input
                type={field.type}
                step={field.step}
                value={
                  typeof editData[field.key as keyof IStudent] === 'string' || 
                  typeof editData[field.key as keyof IStudent] === 'number'
                    ? String(editData[field.key as keyof IStudent])
                    : ''
                }
                
                onChange={(e) => setEditData({
                  ...editData, 
                  [field.key]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value
                })}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const PostsSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewPostModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Post
          </motion.button>
        </div>

        <div className="space-y-4">
          {student?.posts?.map((post, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-3">{post.description}</p>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                    <ThumbsUp className="w-4 h-4" /> 0
                  </span>
                  <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                    <MessageCircle className="w-4 h-4" /> 0
                  </span>
                </div>
              </div>
            </motion.div>
          )) || <p className="text-gray-500 text-center py-8">No posts yet. Create your first post!</p>}
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-2xl"
            >
              <h3 className="text-2xl font-bold mb-4">Create New Post</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Post Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Write your post content..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 h-32"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 rounded-2xl"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
onClick={handleAddPost}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  Publish Post
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const StatisticsSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Subjects', value: student?.subjects?.length || 0, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
          { title: 'CGPA', value: student?.average_cgpa || 0, icon: Trophy, color: 'from-green-500 to-emerald-500' },
          { title: 'Attendance', value: `${student?.attendance || 0}%`, icon: Calendar, color: 'from-orange-500 to-red-500' },
          { title: 'Backlogs', value: student?.backlogs || 0, icon: Award, color: 'from-purple-500 to-pink-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Subject Progress</h3>
        <div className="space-y-4">
          {student?.subjects?.slice(0, 6).map((subject, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{subject}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12">{Math.floor(Math.random() * 40 + 60)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const AchievementsSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Certificates</h2>
        <div className="space-y-4">
          {student?.certificates?.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{cert.title}</h3>
                  <p className="text-gray-600 mb-3">{cert.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </span>
                    <span>ID: {cert.credential_id}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Internships</h2>
        <div className="space-y-4">
          {student?.internships?.map((internship, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{internship.title}</h3>
                  <p className="text-gray-600 mb-3">{internship.description}</p>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(internship.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const JobsSection = () => {
  const [allJobPostings, setAllJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('upcoming');
  const [showFilters, setShowFilters] = useState(false);

  const fetchAllJobPostings = async (filters: Record<string, any> = {}) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const queryString = queryParams.toString();
     
      const url = `/api/api/job-postings${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setAllJobPostings(data.jobPostings || data.data || []);
      } else {
        console.error('Error fetching job postings:', data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobPostings({ status: statusFilter });
  }, [statusFilter]);

  const handleApply = async (jobId: string) => {
    try {
      // Add your apply logic here - API call to apply for job
      setAppliedJobs(prev => new Set([...prev, jobId]));
      
      // Optional: Show success notification
      // You can add a toast notification here
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  const filteredJobs = allJobPostings.filter(job => 
    job.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Career Opportunities</h2>
              <p className="text-blue-100 mt-1">Discover your next career move</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">{filteredJobs.length} Jobs Available</span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="upcoming" className="text-gray-800">Upcoming</option>
              <option value="ongoing" className="text-gray-800">Ongoing</option>
              <option value="completed" className="text-gray-800">Completed</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-200"
                >
                  {/* Job Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {job.role || 'Software Developer'}
                          </h3>
                          <p className="text-lg text-gray-600 font-medium">
                            {job.company_name || 'Tech Company'}
                          </p>
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(job.status)}`}>
                            {job.status?.charAt(0).toUpperCase() + job.status?.slice(1) || 'Active'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Job Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">{job.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">{job.package || 'Competitive'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">
                            {job.application_deadline ? formatDate(job.application_deadline) : 'Open'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">
                            {job.requirements?.eligible_branches?.join(', ') || 'All Branches'}
                          </span>
                        </div>
                      </div>

                      {/* Job Description */}
                      {job.short_description && (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {job.short_description}
                        </p>
                      )}

                      {/* Requirements */}
                      {job.requirements && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Key Requirements
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.cgpa_cutoff && (
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                CGPA: {job.requirements.cgpa_cutoff}+
                              </span>
                            )}
                            {job.requirements.skills?.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                            {(job.requirements.skills && job.requirements.skills.length > 3) && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                +{(job.requirements.skills?.length ?? 0) - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleApply(job._id)}
                        disabled={appliedJobs.has(job._id)}
                        className={`
                          px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-lg
                          ${appliedJobs.has(job._id)
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl hover:from-blue-600 hover:to-purple-700'
                          }
                        `}
                      >
                        {appliedJobs.has(job._id) ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Applied
                          </span>
                        ) : (
                          'Apply Now'
                        )}
                      </motion.button>
                      
              
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Posted {job.created_at ? formatDate(job.created_at) : 'Recently'}
                      </span>
                      {job.applications_count && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {job.applications_count} applications
                        </span>
                      )}
                    </div>
                  
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};
const PdfViewer = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && setShowPdfViewer(false)}
    >
      <div className="bg-white rounded-2xl w-11/12 h-5/6 max-w-4xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {uploadedFile?.name}
          </h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </motion.button>
            <span className="text-sm text-gray-600 min-w-16 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPdfViewer(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {fileUrl && uploadedFile?.type === 'application/pdf' ? (
            <div className="h-full flex justify-center">
              <iframe
                src={fileUrl}
                className="w-full h-full border-0 rounded-lg"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                title="Resume PDF"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Preview not available for this file type</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
  const ResumeSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resume & Documents</h2>
      
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {uploadedFile ? uploadedFile.name : 'Upload Resume'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {uploadedFile 
                    ? `Uploaded: ${new Date().toLocaleDateString()}` 
                    : 'Upload your resume for AI-powered analysis'
                  }
                </p>
              </div>
            </div>
            
            
            <div className="flex gap-3">
              {uploadedFile && (
                <>
              
                  {uploadedFile.type === 'application/pdf' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAnalyzePdf}
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                      Analyze PDF
                    </motion.button>
                  ) : (
                    analysis && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAnalysis(!showAnalysis)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" /> {showAnalysis ? 'Hide' : 'Show'} Analysis
                      </motion.button>
                    )
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={removeFile}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </motion.button>
                </>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploadedFile ? 'Update' : 'Upload'}
              </motion.button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3"
            >
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <p className="text-blue-700 text-sm">Analyzing your resume with AI...</p>
            </motion.div>
          )}
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {showAnalysis && analysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              {analysis.overallScore && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Overall Score</h3>
                      <p className="text-gray-600">Based on comprehensive analysis</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">
                        {analysis.overallScore}/100
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(analysis.overallScore! / 20)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Good Points */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Strengths ({analysis.goodPoints.length})
                </h3>
                <div className="space-y-4">
                  {analysis.goodPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-4 border border-green-200"
                    >
                      <h4 className="font-semibold text-green-800 mb-2">{point.title}</h4>
                      <p className="text-green-700 text-sm">{point.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-orange-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Areas for Improvement ({analysis.badPoints.length})
                </h3>
                <div className="space-y-4">
                  {analysis.badPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-4 border border-orange-200"
                    >
                      <h4 className="font-semibold text-orange-800 mb-2">{point.title}</h4>
                      <p className="text-orange-700 text-sm">{point.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
  
  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSection />;
      case 'edit': return <EditSection />;
      case 'statistics': return <StatisticsSection />;
      case 'posts': return <PostsSection />;
      case 'achievements': return <AchievementsSection />;
      case 'jobs': return <JobsSection />;
      case 'resume': return <ResumeSection />;
   
      default: return <ProfileSection />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
      
                    <span className="text-2xl font-semibold text-gray-800 tracking-wide">
                      <span className="font-bold bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">Campus</span>{' '}
                      <span className="font-bold text-gray-900">Konnect</span>
                    </span>
                  </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
               Student Portal
              </Badge>
            </div>
              
            <div className="flex items-center space-x-3">
                <nav className="flex items-center space-x-4">
              <a 
                href="/posts"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 hover:text-blue-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-200 group"
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <span>Posts</span>
              </a>
              
              <button
                onClick={() => {
                  localStorage.removeItem('college');
                  localStorage.removeItem('student'); 
                  localStorage.removeItem('company');
                  window.location.href="/"
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 hover:text-red-700 font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-red-100 hover:border-red-200 group"
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
                <span>Logout</span>
              </button>
            </nav>
               <Link href="/interview">
              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Interview Room
              </Button>
              </Link>
              <Link href="/student/test">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Join Test
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;
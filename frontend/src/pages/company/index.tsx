'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Shield,
  Plus,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  Monitor,
  Settings,
  Mail,
  Download,
  MessageCircle,
  Send,
  Brain,
  Award,
  Target,
  Zap,
  Star,
  Search,
  Filter,
  Menu,
  X,
  Code,
  CheckCircle,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface Student {
  _id: string;
  name: string;
  roll_number: string;
  college: string;
  degree: string;
  stream: string;
  semester: number;
  enrollment_year: number;
  passout_year: number;
  subjects: string[];
  backlogs: number;
  average_cgpa: number;
  status: string;
  total_marks: number;
  pending_fees: number;
  attendance: number;
  dob: string;
  mobile: string;
  email: string;
  city: string;
  gender: string;
  profile_image: string;
  resume: string[];
  skills: string[];
  projects: string[];
  posts: Array<{
    title: string;
    content: string;
    date: string;
    description: string;
  }>;
  certificates: Array<{
    title: string;
    description: string;
    issue_date: string;
    credential_id: string;
  }>;
  internships: Array<{
    title: string;
    description: string;
    date: string;
  }>;
}


interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp?: Date;
}

interface SkillAnalysis {
  name: string;
  count: number;
  percentage: number;
}

interface BranchAnalysis {
  stream: string;
  avgCGPA: number;
  studentCount: number;
  topSkills: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "Hello! I'm your AI assistant. I can help you analyze student data, predict performance, and provide insights. Try asking me about student trends!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
   


  useEffect(() => {
    const value = localStorage.getItem('role');
    if (value !== "company") {
      router.push("/");
    }
  }, [router]);

  // Fetch students data
  const fetchStudentsData = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/college/students`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log("Students data", data);
          setStudents(data|| []);
        } else {
          console.error('Error fetching students:', data.message);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchStudentsData();
    }, []);
  
    // Get students by department
    const getStudentsByDepartment = (department: string) => {
      return students.filter(student => 
        student.stream.toLowerCase().includes(department.toLowerCase()) || 
        department.toLowerCase().includes(student.stream.toLowerCase())
      );
    };
  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AI-powered analytics functions
  const getSkillsAnalysis = (): SkillAnalysis[] => {
    const skillCount: { [key: string]: number } = {};
    students.forEach(student => {
      student.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });
    
    const total = students.length;
    return Object.entries(skillCount)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getBranchAnalysis = (): BranchAnalysis[] => {
    const streamData: { [key: string]: { average_cgpas: number[], skills: string[] } } = {};
    
    students.forEach(student => {
      if (!streamData[student.stream]) {
        streamData[student.stream] = { average_cgpas: [], skills: [] };
      }
      streamData[student.stream].average_cgpas.push(student.average_cgpa);
      streamData[student.stream].skills.push(...student.skills);
    });

    return Object.entries(streamData).map(([stream, data]) => {
      const avgCGPA = data.average_cgpas.reduce((sum, cgpa) => sum + cgpa, 0) / data.average_cgpas.length;
      const skillCount: { [key: string]: number } = {};
      data.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
      const topSkills = Object.entries(skillCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([skill]) => skill);

      return {
        stream,
        avgCGPA: Math.round(avgCGPA * 100) / 100,
        studentCount: data.average_cgpas.length,
        topSkills
      };
    });
  };

  const getCareerReadinessScore = (student: Student): number => {
    const cgpaScore = student.average_cgpa * 10;
    const skillsScore = student.skills.length * 5;
    const internshipScore = student.internships.length * 15;
   
    
    return Math.min(100, Math.round((cgpaScore + skillsScore + internshipScore) ));
  };

  const getTopPerformers = () => {
    return students
      .map(student => ({
        ...student,
        readinessScore: getCareerReadinessScore(student)
      }))
      .sort((a, b) => b.readinessScore - a.readinessScore)
      .slice(0, 5);
  };

  const getSkillRecommendations = (student: Student): string[] => {
    const streamSkillMap: { [key: string]: string[] } = {
      'Computer Science': ['React', 'Python', 'Machine Learning', 'Docker', 'AWS'],
      'Electronics and Communication': ['Python', 'MATLAB', 'PCB Design', 'Signal Processing', 'IoT'],
      'Mechanical': ['CAD', 'Python', 'MATLAB', 'Automation', 'Robotics']
    };
    
    const recommendedSkills = streamSkillMap[student.stream] || [];
    return recommendedSkills.filter(skill => !student.skills.includes(skill)).slice(0, 3);
  };

  // AI Chatbot Logic
  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('top skills') || lowerMessage.includes('popular skills')) {
      const skillsAnalysis = getSkillsAnalysis().slice(0, 5);
      return `Here are the top skills among students:\n${skillsAnalysis.map((skill, index) => 
        `${index + 1}. ${skill.name} - ${skill.count} students (${skill.percentage}%)`
      ).join('\n')}`;
    }
    
    if (lowerMessage.includes('stream performance') || lowerMessage.includes('stream analysis')) {
      const streamAnalysis = getBranchAnalysis();
      return `Branch Performance Analysis:\n${streamAnalysis.map(stream => 
        `${stream.stream}: Avg CGPA ${stream.avgCGPA} (${stream.studentCount} students)\nTop Skills: ${stream.topSkills.join(', ')}`
      ).join('\n\n')}`;
    }
    
    if (lowerMessage.includes('top performers') || lowerMessage.includes('best students')) {
      const topPerformers = getTopPerformers();
      return `Top 5 Performers by Career Readiness Score:\n${topPerformers.map((student, index) => 
        `${index + 1}. ${student.name} - Score: ${student.readinessScore}/100 (CGPA: ${student.average_cgpa})`
      ).join('\n')}`;
    }
    
    if (lowerMessage.includes('skill gap') || lowerMessage.includes('recommendations')) {
      const recommendations = students.map(student => ({
        name: student.name,
        recommendations: getSkillRecommendations(student)
      })).filter(r => r.recommendations.length > 0).slice(0, 3);
      
      return `Skill Gap Analysis - Top Recommendations:\n${recommendations.map(r => 
        `${r.name}: ${r.recommendations.join(', ')}`
      ).join('\n')}`;
    }
    
    if (lowerMessage.includes('predict') || lowerMessage.includes('forecast')) {
      const avgCGPA = students.reduce((sum, s) => sum + Number(s.average_cgpa), 0) / students.length;
      const highPerformers = students.filter(s => Number(s.average_cgpa) > 8.5).length;
      const percentage = Math.round((highPerformers / students.length) * 100);
      
      return `Predictive Analysis:\n• Average CGPA: ${avgCGPA.toFixed(2)}\n• ${percentage}% are high performers (CGPA > 8.5)\n• Based on current trends, we predict strong placement outcomes for ${highPerformers} students`;
    }
    
    return "I can help you with: skill analysis, stream performance, top performers, skill gap analysis, and predictive insights. What would you like to explore?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user' as const, content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, { type: 'bot', content: botResponse, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Filter students based on search and stream
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = selectedBranch === 'all' || student.stream === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const streames = [...new Set(students.map(s => s.stream))];
  const skillsAnalysis = getSkillsAnalysis();
  const streamAnalysis = getBranchAnalysis();
  const topPerformers = getTopPerformers();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
          {/* Navigation */}
       
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
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
               Company Portal
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
              <Link href="/company/createtest">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
           
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </h2>
                <p className="text-gray-600">AI-powered insights into your student data</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Students</p>
                      <p className="text-3xl font-bold">{students.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Avg CGPA</p>
                      <p className="text-3xl font-bold">
                        {(students.reduce((sum, s) => sum + Number(s.average_cgpa), 0) / students.length).toFixed(2)}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Skills</p>
                      <p className="text-3xl font-bold">{skillsAnalysis.length}</p>
                    </div>
                    <Brain className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white transform hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Branches</p>
                      <p className="text-3xl font-bold">{streames.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>Career readiness scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((student, index) => (
                      <div key={student._id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.stream}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{student.readinessScore}/100</p>
                          <p className="text-sm text-gray-600">CGPA: {student.average_cgpa}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                    Skills Distribution
                  </CardTitle>
                  <CardDescription>Most popular skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {skillsAnalysis.slice(0, 8).map((skill, index) => (
                      <div key={skill.name} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-xs text-gray-600">{skill.count} students</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${skill.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Student Management</h2>
                <p className="text-gray-600">Manage and analyze student profiles</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name, roll, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select 
                  value={selectedBranch} 
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  <option value="all">All Branches</option>
                  {streames.map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student._id} className="bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.roll_number}</p>
                        <p className="text-sm text-gray-600">{student.stream}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{student.average_cgpa}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {getCareerReadinessScore(student)}/100
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {student.internships.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Internships:</p>
                        <div className="space-y-1">
                          {student.internships.map((internship, index) => (
                            <p key={index} className="text-xs text-gray-600">
                              {internship.title} {internship.date && `(${internship.date})`} - {internship.description}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
  <div>
    <h2 className="text-2xl font-bold mb-2">Recruitment Analytics</h2>
    <p className="text-gray-600">Comprehensive insights for strategic hiring decisions</p>
  </div>

  {/* Key Metrics Overview */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Applicants</p>
            <p className="text-2xl font-bold">90</p>
          </div>
          <Users className="h-8 w-8 text-blue-200" />
        </div>
      </CardContent>
    </Card>
    
    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Aptitude Cleared</p>
            <p className="text-2xl font-bold">85</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-200" />
        </div>
      </CardContent>
    </Card>
    
    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Interviews Scheduled</p>
            <p className="text-2xl font-bold">67</p>
          </div>
          <Calendar className="h-8 w-8 text-purple-200" />
        </div>
      </CardContent>
    </Card>
    
    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Final Selection Rate</p>
            <p className="text-2xl font-bold">28.5%</p>
          </div>
          <TrendingUp className="h-8 w-8 text-orange-200" />
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Performance Analytics */}
  <div className="grid md:grid-cols-2 gap-6">
    <Card className="bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          Aptitude Test Performance by Stream
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { stream: "Computer Science", attempted: 50, cleared: 45, passRate: 90.0, avgScore: 78.5 },
            { stream: "Information Technology", attempted: 18, cleared: 15, passRate: 83.2, avgScore: 89.3 },
            { stream: "Leather Technology", attempted: 16, cleared: 12, passRate: 75.0, avgScore: 68.9 },
          ].map((stream, index) => (
            <div key={index} className="p-4 rounded-lg border bg-white/40">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{stream.stream}</h4>
                <Badge className={`${stream.passRate > 50 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {stream.passRate}% Pass Rate
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Attempted: <span className="font-semibold">{stream.attempted}</span></p>
                  <p className="text-gray-600">Cleared: <span className="font-semibold text-green-600">{stream.cleared}</span></p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Score: <span className="font-semibold">{stream.avgScore}%</span></p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${stream.avgScore}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-500" />
          Interview Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { position: "Software Engineer", scheduled: 45, completed: 38, selected: 10, successRate: 22.0 },
            { position: "Data Analyst", scheduled: 15, completed: 10, selected: 3, successRate: 20.0 },
            { position: "Frontend Developer", scheduled: 32, completed: 12, selected: 4, successRate: 12.5 },
          ].map((position, index) => (
            <div key={index} className="p-4 rounded-lg border bg-white/40">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{position.position}</h4>
                <Badge className="bg-blue-100 text-blue-800">
                  {position.successRate}% Success
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{position.scheduled}</p>
                  <p className="text-gray-600">Scheduled</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-600">{position.completed}</p>
                  <p className="text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">{position.selected}</p>
                  <p className="text-gray-600">Selected</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Skills and Trends Analysis */}
  <div className="grid md:grid-cols-3 gap-6">
    <Card className="bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-blue-500" />
          Most Sought Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { skill: "React.js", demand: 92, candidates: 38 },
            { skill: "Python", demand: 89, candidates: 24 },
            { skill: "Node.js", demand: 85, candidates: 56 },
            { skill: "AWS", demand: 78, candidates: 9 },
            { skill: "Docker", demand: 71, candidates: 18 },
            { skill: "MongoDB", demand: 68, candidates: 25 },
            { skill: "TypeScript", demand: 64, candidates: 67 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{item.skill}</span>
                  <span className="text-xs text-gray-600">{item.candidates} candidates</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: `${item.demand}%`}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          Top Performing Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            {student: "Arijit Ghosal", students: 89, selected: 94, rate: 98.2 },
            { student: "Sayantan Dam", students: 156, selected: 87, rate: 80.1 },
            { student: "Shehenaz Islam", students: 67, selected: 79, rate: 88.4 },
            { student: "Sayantan Dam", students: 234, selected: 92, rate: 76.5 },
            { student: "Sk Nasir Hosen", students: 198, selected: 89, rate: 84.7 },
            { student: "Hrittika Pramanick", students: 143, selected: 93, rate: 93.1 }
          ].map((student, index) => (
            <div key={index} className="p-3 rounded-lg border bg-white/40">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-sm">{student.student}</h4>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  {student.rate}%
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                {student.selected}/100 marks scored
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Skill Gap Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <h4 className="font-semibold text-sm text-red-800 mb-2">Critical Gaps</h4>
            <div className="space-y-1">
              {["System Design", "Microservices", "Kubernetes", "GraphQL"].map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs mr-1 border-red-300 text-red-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
            <h4 className="font-semibold text-sm text-orange-800 mb-2">Moderate Gaps</h4>
            <div className="space-y-1">
              {["CI/CD", "Redis", "Elasticsearch", "Testing"].map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs mr-1 border-orange-300 text-orange-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="font-semibold text-sm text-blue-800 mb-2">Recommendations</h4>
            <p className="text-xs text-blue-700">
              Focus recruitment on candidates with cloud-native experience. 
              Consider providing upskilling programs for system design concepts.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Hiring Timeline and Predictions */}
  <Card className="bg-white/60 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
        Recruitment Pipeline & Predictions
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Current Pipeline Status</h4>
          <div className="space-y-3">
            {[
              { stage: "Application Screening", count: 2847, color: "bg-gray-500" },
              { stage: "Aptitude Test", count: 1245, color: "bg-blue-500" },
              { stage: "Technical Interview", count: 687, color: "bg-purple-500" },
              { stage: "HR Interview", count: 234, color: "bg-green-500" },
              { stage: "Final Selection", count: 89, color: "bg-yellow-500" }
            ].map((stage, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${stage.color} mr-3`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm font-bold">{stage.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">AI-Powered Predictions</h4>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">High Probability Hires</span>
              </div>
              <p className="text-sm text-green-700">
                127 candidates show 85%+ selection probability based on assessment scores and profile analysis.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Completion Timeline</span>
              </div>
              <p className="text-sm text-blue-700">
                Predicted completion in 18-22 days with current interview velocity of 45 candidates/day.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center mb-2">
                <Users className="h-4 w-4 text-purple-600 mr-2" />
                <span className="font-semibold text-purple-800">Diversity Metrics</span>
              </div>
              <p className="text-sm text-purple-700">
                Current selection maintains 32% gender diversity and represents 15 different institutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


       
        </Tabs>
      </div>
    </div>
  );
}
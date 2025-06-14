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
  X
} from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: number;
  name: string;
  roll: string;
  branch: string;
  skills: string[];
  cgpa: string;
  year: string;
  image: string;
  internships: string[];
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
  branch: string;
  avgCGPA: number;
  studentCount: number;
  topSkills: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
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


  useEffect(() => {
    const value = localStorage.getItem('role');
    if (value !== "company") {
      router.push("/");
    }
  }, [router]);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/students.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

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
    const branchData: { [key: string]: { cgpas: number[], skills: string[] } } = {};
    
    students.forEach(student => {
      if (!branchData[student.branch]) {
        branchData[student.branch] = { cgpas: [], skills: [] };
      }
      branchData[student.branch].cgpas.push(parseFloat(student.cgpa));
      branchData[student.branch].skills.push(...student.skills);
    });

    return Object.entries(branchData).map(([branch, data]) => {
      const avgCGPA = data.cgpas.reduce((sum, cgpa) => sum + cgpa, 0) / data.cgpas.length;
      const skillCount: { [key: string]: number } = {};
      data.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
      const topSkills = Object.entries(skillCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([skill]) => skill);

      return {
        branch,
        avgCGPA: Math.round(avgCGPA * 100) / 100,
        studentCount: data.cgpas.length,
        topSkills
      };
    });
  };

  const getCareerReadinessScore = (student: Student): number => {
    const cgpaScore = parseFloat(student.cgpa) * 10;
    const skillsScore = student.skills.length * 5;
    const internshipScore = student.internships.length * 15;
    const yearMultiplier = student.year === 'Final' ? 1.2 : student.year === 'Third' ? 1.0 : 0.8;
    
    return Math.min(100, Math.round((cgpaScore + skillsScore + internshipScore) * yearMultiplier));
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
    const branchSkillMap: { [key: string]: string[] } = {
      'Computer Science': ['React', 'Python', 'Machine Learning', 'Docker', 'AWS'],
      'Electronics and Communication': ['Python', 'MATLAB', 'PCB Design', 'Signal Processing', 'IoT'],
      'Mechanical': ['CAD', 'Python', 'MATLAB', 'Automation', 'Robotics']
    };
    
    const recommendedSkills = branchSkillMap[student.branch] || [];
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
    
    if (lowerMessage.includes('branch performance') || lowerMessage.includes('branch analysis')) {
      const branchAnalysis = getBranchAnalysis();
      return `Branch Performance Analysis:\n${branchAnalysis.map(branch => 
        `${branch.branch}: Avg CGPA ${branch.avgCGPA} (${branch.studentCount} students)\nTop Skills: ${branch.topSkills.join(', ')}`
      ).join('\n\n')}`;
    }
    
    if (lowerMessage.includes('top performers') || lowerMessage.includes('best students')) {
      const topPerformers = getTopPerformers();
      return `Top 5 Performers by Career Readiness Score:\n${topPerformers.map((student, index) => 
        `${index + 1}. ${student.name} - Score: ${student.readinessScore}/100 (CGPA: ${student.cgpa})`
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
      const avgCGPA = students.reduce((sum, s) => sum + parseFloat(s.cgpa), 0) / students.length;
      const highPerformers = students.filter(s => parseFloat(s.cgpa) > 8.5).length;
      const percentage = Math.round((highPerformers / students.length) * 100);
      
      return `Predictive Analysis:\n• Average CGPA: ${avgCGPA.toFixed(2)}\n• ${percentage}% are high performers (CGPA > 8.5)\n• Based on current trends, we predict strong placement outcomes for ${highPerformers} students`;
    }
    
    return "I can help you with: skill analysis, branch performance, top performers, skill gap analysis, and predictive insights. What would you like to explore?";
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

  // Filter students based on search and branch
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = selectedBranch === 'all' || student.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const branches = [...new Set(students.map(s => s.branch))];
  const skillsAnalysis = getSkillsAnalysis();
  const branchAnalysis = getBranchAnalysis();
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
            <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
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
                        {(students.reduce((sum, s) => sum + parseFloat(s.cgpa), 0) / students.length).toFixed(2)}
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
                      <p className="text-3xl font-bold">{branches.length}</p>
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
                      <div key={student.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.branch}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{student.readinessScore}/100</p>
                          <p className="text-sm text-gray-600">CGPA: {student.cgpa}</p>
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
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.roll}</p>
                        <p className="text-sm text-gray-600">{student.branch}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{student.cgpa}</span>
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
                            <p key={index} className="text-xs text-gray-600">{internship}</p>
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
              <h2 className="text-2xl font-bold mb-2">AI-Powered Analytics</h2>
              <p className="text-gray-600">Deep insights and predictive analysis</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    Branch Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {branchAnalysis.map((branch, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-white/40">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{branch.branch}</h4>
                          <Badge className="bg-blue-100 text-blue-800">
                            {branch.studentCount} students
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Average CGPA: <span className="font-semibold">{branch.avgCGPA}</span></p>
                        <div className="flex flex-wrap gap-1">
                          {branch.topSkills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
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
                    Skill Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.slice(0, 5).map((student) => {
                      const recommendations = getSkillRecommendations(student);
                      return recommendations.length > 0 ? (
                        <div key={student.id} className="p-4 rounded-lg border bg-white/40">
                          <h4 className="font-semibold text-sm">{student.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{student.branch}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium">Recommended Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {recommendations.map((skill, skillIndex) => (
                                <Badge key={skillIndex} className="bg-orange-100 text-orange-800 text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Live Monitoring</h2>
              <p className="text-gray-600">Real-time surveillance and analytics</p>
            </div>

            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="h-5 w-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <Monitor className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Monitoring System Active</h3>
                  <p className="text-gray-600">All systems operational • {students.length} students tracked</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI Assistant</h2>
              <p className="text-gray-600">Get insights and answers about your student data</p>
            </div>

            <Card className="bg-white/60 backdrop-blur-sm h-96 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        } animate-fadeIn`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 p-3 rounded-lg animate-pulse">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about student analytics, trends, or performance..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('Show me top skills')}
                    className="text-xs"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Top Skills
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('Analyze branch performance')}
                    className="text-xs"
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Branch Analysis
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('Show top performers')}
                    className="text-xs"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Top Performers
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('Skill gap recommendations')}
                    className="text-xs"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    Skill Gaps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React, { useState, useEffect,useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Brain, Code, UserCheck, GraduationCap, TrendingUp, Search, Award, Target, Send, Bot } from 'lucide-react';
//import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Image from "next/image";
import Link from "next/link";
const CompanyDashboard = () => {

const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

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

  // ML Feature 1: Skills Analysis
  const getSkillsDistribution = () => {
    const skillsCount: { [key: string]: number } = {};
    students.forEach(student => {
      student.skills.forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });
    return Object.entries(skillsCount).map(([name, value]) => ({ name, value }));
  };

  // ML Feature 2: CGPA Analysis
  const getHighPerformers = () => {
    return students.filter(student => parseFloat(student.cgpa) > 8.5);
  };

  // ML Feature 3: Programming Language Expertise
  const getProgrammingExperts = () => {
    const programmingLanguages = ['Java', 'Python', 'C++'];
    return students.filter(student => 
      student.skills.some(skill => programmingLanguages.includes(skill))
    );
  };

const getBranchPerformance = () => {
    const branchData: { [key: string]: { branch: string; avgCGPA: number; count: number } } = {};
    
    students.forEach(student => {
      // Convert CGPA from string to number
      const cgpa = parseFloat(student.cgpa);
      
      if (!branchData[student.branch]) {
        branchData[student.branch] = {
          branch: student.branch,
          avgCGPA: cgpa,
          count: 1
        };
      } else {
        branchData[student.branch].avgCGPA += cgpa;
        branchData[student.branch].count += 1;
      }
    });

    // Calculate averages and format data for the chart
    return Object.values(branchData).map(data => ({
      branch: data.branch,
      avgCGPA: +(data.avgCGPA / data.count).toFixed(2)  // Round to 2 decimal places
    }));
};

 

  // ML Feature 5: Career Trajectory Prediction
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

interface SkillDistribution {
    name: string;
    value: number;
}

interface BranchPerformance {
    branch: string;
    avgCGPA: string;
}

interface CareerReadinessScoreFactors {
    cgpa: number;
    internships: number;
    skills: number;
}

const getCareerReadinessScore = (student: Student): string => {
    const factors: CareerReadinessScoreFactors = {
        cgpa: parseFloat(student.cgpa) * 0.4,
        internships: student.internships.length * 0.3,
        skills: student.skills.length * 0.3
    };
    return ((factors.cgpa + factors.internships + factors.skills) * 10).toFixed(1);
};

  const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884d8'];
const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm your AI assistant. I can help you analyze student skills and provide recommendations. Try asking me about top skills or student performance!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chatbot response logic
interface Message {
    type: 'user' | 'bot';
    content: string;
}

interface SkillCount {
    [key: string]: number;
}

const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Predefined responses based on keywords
    if (lowerMessage.includes('top skills') || lowerMessage.includes('best skills')) {
        const skillCount: SkillCount = {};
        students.forEach(student => {
            student.skills.forEach(skill => {
                skillCount[skill] = (skillCount[skill] || 0) + 1;
            });
        });
        
        const sortedSkills = Object.entries(skillCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([skill, count]) => `${skill} (${count} students)`);

        return `The top skills among our students are:\n1. ${sortedSkills.join('\n2. ')}`;
    }
    
    if (lowerMessage.includes('cgpa') || lowerMessage.includes('performance')) {
        const highPerformers = students.filter(s => parseFloat(s.cgpa) > 8.5);
        return `We have ${highPerformers.length} high-performing students with CGPA above 8.5. The highest CGPA is ${Math.max(...students.map(s => parseFloat(s.cgpa)))}.`;
    }
    
    if (lowerMessage.includes('branch') || lowerMessage.includes('department')) {
        const branches = [...new Set(students.map(s => s.branch))];
        return `Our students are from the following branches: ${branches.join(', ')}.`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! I can help you analyze student skills and performance. What would you like to know?";
    }

    return "I can help you with information about student skills, CGPA performance, and branch distribution. Please try asking about these topics!";
};

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);

    // Generate and add bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
    }, 500);

    setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4242] to-[#092635] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="bg-[#1B4242]/95 backdrop-blur-lg border-b border-teal-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/">
                <div className="relative w-32 h-8">
                  <Image
                    src="/sar.png"
                    alt="SARSS Logo"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/company/dashboard" className="text-teal-100 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/company" className="text-teal-100 hover:text-white transition-colors">
                  Students Data
                </Link>
                <Link href="/about" className="text-teal-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <div className="flex items-center gap-2">
            <Brain className="text-teal-300" size={24} />
            <span className="text-teal-100">AI-Powered Insights</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-[#1B4242]/20 border-teal-700/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <UserCheck className="text-teal-300" size={32} />
                <div>
                  <p className="text-sm text-teal-200/70">Total Students</p>
                  <p className="text-2xl font-bold text-white">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1B4242]/20 border-teal-700/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <GraduationCap className="text-teal-300" size={32} />
                <div>
                  <p className="text-sm text-teal-200/70">High Performers</p>
                  <p className="text-2xl font-bold text-white">{getHighPerformers().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1B4242]/20 border-teal-700/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Code className="text-teal-300" size={32} />
                <div>
                  <p className="text-sm text-teal-200/70">Programming Experts</p>
                  <p className="text-2xl font-bold text-white">{getProgrammingExperts().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1B4242]/20 border-teal-700/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="text-teal-300" size={32} />
                <div>
                  <p className="text-sm text-teal-200/70">Avg Career Readiness</p>
                  <p className="text-2xl font-bold text-white">
                    {(students.reduce((acc, student) => acc + parseFloat(getCareerReadinessScore(student)), 0) / students.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Distribution */}
          <Card className="bg-[#1B4242]/20 border-teal-700/30">
            <CardHeader>
              <CardTitle className="text-white">Skills Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart width={400} height={300}>
                <Pie
                  data={getSkillsDistribution()}
                  cx={200}
                  cy={150}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {getSkillsDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>

          {/* Branch Performance */}
          <Card className="bg-[#1B4242]/20 border-teal-700/30">
            <CardHeader>
              <CardTitle className="text-white">Branch-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart width={400} height={300} data={getBranchPerformance()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgCGPA" fill="#00C49F" />
              </BarChart>
            </CardContent>
          </Card>

          {/* Career Readiness Scores */}
          <Card className="bg-[#1B4242]/20 border-teal-700/30 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Student Career Readiness Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart width={800} height={300} data={students.map(student => ({
                name: student.name,
                score: parseFloat(getCareerReadinessScore(student))
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#00C49F" />
              </LineChart>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <Card className="bg-[#1B4242]/20 border-teal-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain size={24} className="text-teal-300" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-teal-500/10 rounded-lg">
              <h3 className="text-teal-300 font-semibold mb-2">High Performer Analysis</h3>
              <p className="text-teal-100">
                {getHighPerformers().length} students maintain a CGPA above 8.5, demonstrating exceptional academic performance.
                These students show strong correlation with multiple internships and diverse skill sets.
              </p>
            </div>
            <div className="p-4 bg-teal-500/10 rounded-lg">
              <h3 className="text-teal-300 font-semibold mb-2">Skill Gap Analysis</h3>
              <p className="text-teal-100">
                Current data shows a strong presence of {getSkillsDistribution().length} distinct skills.
                Recommended focus areas for improvement include emerging technologies and soft skills development.
              </p>
            </div>
            <div className="p-4 bg-teal-500/10 rounded-lg">
              <h3 className="text-teal-300 font-semibold mb-2">Career Trajectory Prediction</h3>
              <p className="text-teal-100">
                Based on current trends, {Math.round((getHighPerformers().length / students.length) * 100)}% of students
                show strong potential for immediate industry placement, with particularly strong prospects in software development
                and technology consulting roles.
              </p>
            </div>
          </CardContent>
        </Card> <Card className="bg-[#1B4242]/20 border-teal-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="text-teal-300" />
              Campus Konnect.AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-96">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-teal-500/20 text-white'
                          : 'bg-teal-700/20 text-teal-100'
                      }`}
                    >
                      {message.type === 'bot' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Bot size={16} className="text-teal-300" />
                          <span className="text-sm text-teal-300">AI Assistant</span>
                        </div>
                      )}
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about student skills..."
                  className="flex-1 bg-[#1B4242]/40 border border-teal-700/30 rounded-lg px-4 py-2 text-white placeholder-teal-300/60 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboard;


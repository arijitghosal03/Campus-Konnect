import React, { useState, useEffect } from 'react';
import { ChevronRight, Play, Users, BookOpen, Briefcase, Award, ArrowRight, Menu, X, Star, Check, Shield, Zap, Globe, Database, Bot, Brain, Target, Rocket } from 'lucide-react';
import Link from 'next/link';
const ProfessionalLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(false);
    };
    checkLoginStatus();
  }, []);

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('home');
  };

  const partnerLogos = [
    "Microsoft", "Google", "Amazon", "IBM", "Oracle", "Salesforce"
  ];
  const testimonials = [
  {
    id: 1,
    name: "Tushar Chowdhury",
    role: "Senior Designer",
    company: "Tata Consultancy Services",
    avatar: "HR1.jpg",
    text: "Experienced Seamless hiring process and excellent support from the team. The platform is user-friendly and has helped us find top talent quickly.",
    rating: 5
  },
  {
    id: 2,
    name: "Sneha Roy",
    role: "HR Manager",
    company: "Wipro Technologies",
    avatar: "HR2.png",
    text: "I really appreciate the efforts and effective communication from the team. The platform is intuitive and has streamlined our hiring process significantly.",
    rating: 5
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    role: "Creative Lead",
    company: "Infosys Ltd.",
    avatar: "HR3.jpg",
    text: "I was very impressed! The platform is easy to use and has a great selection of candidates. The support team was also very responsive and helpful.",
    rating: 5
  },
  {
    id: 4,
    name: "Debanjan Chatterjee",
    role: "Marketing Director",
    company: "Cognizant Technology Solutions",
    avatar: "HR4.jpeg",
    text: "working with GCELT has been a game-changer for our hiring process. Their platform is efficient and the team is always ready to assist with any queries.",
    rating: 5,
    featured: true
  },
  {
    id: 5,
    name: "Krishna Patel",
    role: "Product Manager",
    company: "Intel Corporation",
    avatar: "HR5.jpeg",
    text: "The team gave their best to ensure a smooth hiring experience. The platform is robust and has helped us connect with high-quality candidates.",
    rating: 5
  },
  {
    id: 6,
    name: "Sophie Clark",
    role: "Brand Strategist",
    company: "Creative Agency Pro",
    avatar: "/api/placeholder/50/50",
    text: "Sophie's collaborative approach and strategic thinking helped transform our brand identity. The results exceeded our expectations in every way.",
    rating: 5
  },
  {
    id: 7,
    name: "Michael Torres",
    role: "Co-Founder",
    company: "Startup Dynamics Corp",
    avatar: "/api/placeholder/50/50",
    text: "Working with Michael was an absolute pleasure. His expertise in AI integration and business strategy helped accelerate our growth significantly.",
    rating: 5
  }
];

  const workflowSteps = [
    {
      title: "Leading AI Models to work with",
      description: "Access and chat with leading AI models including OpenAI, Claude, Gemini, and more",
      icon: <Brain className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Securely Connect your knowledge base",
      description: "Upload documents, connect databases, and integrate with your existing knowledge systems",
      icon: <Shield className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Access prompt library & smart tasks",
      description: "Pre-built prompts and automated workflows for common academic and business tasks",
      icon: <Database className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500"
    }
  ];



  const features = [
    {
      title: "Process Automation",
      subtitle: "Automate administrative and academic processes for maximum efficiency",
      icon: <Zap className="w-6 h-6" />,
      items: ["Student enrollment", "Grade processing", "Report generation", "Communication workflows"]
    },
    {
      title: "Seamless Integration", 
      subtitle: "Connect with existing campus systems and third-party applications",
      icon: <Globe className="w-6 h-6" />,
      items: ["Learning Management Systems", "Student Information Systems", "HR Management", "Financial Systems"]
    },
    {
      title: "Efficient",
      subtitle: "Streamline operations and reduce manual work across your institution",
      icon: <Target className="w-6 h-6" />,
      items: ["Real-time analytics", "Automated reporting", "Smart notifications", "Performance tracking"]
    }
  ];
  const cardVariants = [
    "w-72 h-auto", // standard
    "w-80 h-auto", // slightly wider
    "w-64 h-auto", // narrower
    "w-76 h-auto", // medium-wide
  ];
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
type WorkshopModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const WorkshopModal = ({ isOpen, onClose }: WorkshopModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    speaker: {
      name: '',
      designation: '',
      company: '',
      bio: '',
      image: ''
    },
    topic: '',
    date: '',
    time: '',
    venue: '',
    requirements: [''],
    contact: {
      email: '',
      phone: ''
    },
    description: '',
    maxParticipants: '',
    targetAudience: ''
  });

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      requirements: newRequirements.length > 0 ? newRequirements : ['']
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        submittedDate: new Date().toISOString().split('T')[0]
      };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/workshops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (response.ok) {
        alert('Workshop registered successfully!');
        onClose();
        setFormData({
          title: '',
          speaker: {
            name: '',
            designation: '',
            company: '',
            bio: '',
            image: ''
          },
          topic: '',
          date: '',
          time: '',
          venue: '',
          requirements: [''],
          contact: {
            email: '',
            phone: ''
          },
          description: '',
          maxParticipants: '',
          targetAudience: ''
        });
      }
    } catch (error) {
      console.error('Error submitting workshop:', error);
      alert('Error submitting workshop. Please try again.');
    }
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
    {/* Animated background particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
      <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-30 animation-delay-3000"></div>
    </div>

    <div className="relative bg-white/95 backdrop-blur-2xl border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/10 animate-in slide-in-from-bottom-8 duration-500">
      {/* Gradient border animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-3xl opacity-20 animate-pulse"></div>
      <div className="absolute inset-[1px] bg-white/95 backdrop-blur-2xl rounded-3xl"></div>
      
      {/* Content */}
      <div className="relative overflow-y-auto max-h-[90vh]">
        <div className="p-8">
          {/* Header with AI brain icon */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Workshop Studio
                </h3>
                <p className="text-sm text-gray-500 mt-1">Want to organize a workshop at GCELT? <span className="text-sky-500">Contact Us</span> for more info</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="group relative w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 transition-all duration-200 flex items-center justify-center hover:scale-110"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
              <div className="absolute inset-0 rounded-full bg-red-500/20 scale-0 group-hover:scale-100 transition-transform duration-200"></div>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
          
            <div className="group relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Workshop Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 group-hover:bg-white/70"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Workshop Topic"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 group-hover:bg-white/70"
                required
              />
            </div>

            {/* Speaker Information with enhanced styling */}
            <div className="relative bg-gradient-to-br from-purple-50/80 to-blue-50/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-200/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              <h4 className="font-bold text-gray-800 mb-6 text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                Speaker Information
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Speaker Name"
                    value={formData.speaker.name}
                    onChange={(e) => setFormData({
                      ...formData, 
                      speaker: {...formData.speaker, name: e.target.value}
                    })}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-200 hover:bg-white/80"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Designation"
                    value={formData.speaker.designation}
                    onChange={(e) => setFormData({
                      ...formData, 
                      speaker: {...formData.speaker, designation: e.target.value}
                    })}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-200 hover:bg-white/80"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company"
                    value={formData.speaker.company}
                    onChange={(e) => setFormData({
                      ...formData, 
                      speaker: {...formData.speaker, company: e.target.value}
                    })}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-200 hover:bg-white/80"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Speaker Image URL"
                    value={formData.speaker.image}
                    onChange={(e) => setFormData({
                      ...formData, 
                      speaker: {...formData.speaker, image: e.target.value}
                    })}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-200 hover:bg-white/80"
                  />
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Speaker Bio"
                    value={formData.speaker.bio}
                    onChange={(e) => setFormData({
                      ...formData, 
                      speaker: {...formData.speaker, bio: e.target.value}
                    })}
                    rows={3}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-200 hover:bg-white/80 resize-none"
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="relative bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-6 rounded-3xl border border-blue-200/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
              </div>
              <h4 className="font-bold text-gray-800 mb-6 text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Contact Email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData, 
                    contact: {...formData.contact, email: e.target.value}
                  })}
                  className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 hover:bg-white/80"
                  required
                />
                <input
                  type="tel"
                  placeholder="Contact Phone"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData, 
                    contact: {...formData.contact, phone: e.target.value}
                  })}
                  className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 hover:bg-white/80"
                  required
                />
              </div>
            </div>

            {/* Workshop Details with modern grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-300 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Time (e.g., 9:00 AM - 5:00 PM)"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-300 transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Venue"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-300 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10"
                required
              />
              <input
                type="number"
                placeholder="Max Participants"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Target Audience"
              value={formData.targetAudience}
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-300 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10"
              required
            />

            <div className="relative">
              <textarea
                placeholder="Workshop Description • AI will optimize for engagement"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 resize-none"
                required
              />
              
            </div>

            {/* Requirements with enhanced UI */}
            <div className="relative bg-gradient-to-br from-gray-50/80 to-slate-50/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-200/30">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                  Requirements
                </h4>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Requirement
                </button>
              </div>
              <div className="space-y-3">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-3 group">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder={`Requirement ${index + 1}`}
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl focus:ring-2 focus:ring-gray-500/50 focus:border-gray-300 transition-all duration-200 hover:bg-white/80 group-hover:shadow-md"
                      />
                    </div>
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="w-12 h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all duration-200 flex items-center justify-center hover:scale-110 group-hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13H5v-2h14v2z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 bg-white/70 backdrop-blur-sm border border-gray-300/50 text-gray-700 rounded-2xl hover:bg-gray-50/80 hover:shadow-lg transition-all duration-200 font-medium hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Submit Workshop
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};
  const getRandomCardClass = (index: number) => {
    return cardVariants[index % cardVariants.length];
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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


            <div className="hidden md:flex items-center space-x-8">
               <Link href="/register">
                              <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Register</div>
                            </Link>
              <Link href="/about">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Team</div>
              </Link>
               <Link href="#features">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Features</div>
              </Link>
              
               <Link href="/posts">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Posts</div>
              </Link>
               <Link href="#testmonials">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Testamonials</div>
              </Link>
                 <Link href="#workshop">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Workshop</div>
              </Link>
              
              
              {!isLoggedIn && <Link href="/login">
          <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">
            Login
          </div>
        </Link>}
         {isLoggedIn && <button
          onClick={() => {
            localStorage.removeItem('college');
            localStorage.removeItem('student'); 
            localStorage.removeItem('company');  // Clear login info
            window.location.href="/"
          }}
           className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
        >
          Logout
        </button>}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

     
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-3xl font-bold mb-8 leading-tight">
                <span className="text-gray-900">Accelerate Smart Hirings At</span><br />
                <span className="text-blue-600">Your Campus</span>
                <span className="text-gray-900"> & </span>
                <span className="text-blue-600">Company</span>
              </h1>
              <p className="text-l text-gray-600 mb-10 max-w-2xl leading-relaxed">
                We offer integrated platform to colleges, companies and students to showcase their achievements. Our AI-powered tools streamline processes, enhance learning experiences, and drive success across the educational ecosystem.
              </p>
              <div className="flex gap-4 mb-16">
                
                <Link href="/register">
                  <div className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Get Started
                  </div>
                </Link>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                  Learn more
                </button>
              </div>

              {/* Partner Logos */}
         <div className="flex items-center gap-6 opacity-80">
  {['tcs.png', 'ibm.png', 'Wipro.png', 'cognizant.png'].map((logo, index) => (
    <div
      key={index}
      className="h-12 w-28 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200 hover:shadow-md transition-shadow"
    >
      <img
        src={`/${logo}`}
        alt={logo.split('.')[0]}
        className="h-10 object-contain"
      />
    </div>
  ))}
</div>

            </div>

            {/* Right Visual */}
            <div className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-3xl"></div>
              
              {/* Main Central Element */}
              <div className="relative z-10 flex justify-center items-center h-96">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center relative animate-pulse">
                  <div className="w-40 h-40 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Bot className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-bold text-gray-800">AI Powered</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Students</p>
                    <p className="text-xs text-gray-500">100+ Active</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Companies</p>
                    <p className="text-xs text-gray-500">120+ Hirings</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Faculty</p>
                    <p className="text-xs text-gray-500">50+ Educators</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Success Rate</p>
                    <p className="text-xs text-gray-500">95% Graduate</p>
                  </div>
                </div>
              </div>

              {/* Side Floating Icons */}
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-pulse">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '1s'}}>
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '2s'}}>
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
              </div>

              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '0.5s'}}>
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '1.5s'}}>
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '2.5s'}}>
                  <Rocket className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-100 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-indigo-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '3s'}}></div>
      </section>

     

      {/* Process Automation Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-blue-600">Automate</span>
              <span className="text-gray-900"> Complex Campus<br />Workflows </span>
              <span className="text-blue-600">Effortlessly</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your institution's operations with intelligent automation that handles everything from admissions to graduation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.subtitle}</p>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

    <div>

      
{/*Testamonials Section*/}
    <section id ="testmonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            What Companies Say<br />
            <span className="text-blue-600">About our platform</span>
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-xl border relative overflow-hidden min-h-[700px]">
          {/* Large decorative quote marks */}
          <div className="absolute top-8 left-12 text-8xl text-gray-300 font-serif leading-none">"</div>
          <div className="absolute bottom-8 right-12 text-8xl text-gray-300 font-serif leading-none rotate-180">"</div>
          
          {/* Scattered testimonial cards layout */}
          <div className="relative h-full">
            {/* Featured large testimonial - center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-100 w-80">
                <div className="flex flex-col items-center text-center mb-6">
                  <img 
                    src='HR4.jpeg' 
                    alt="Featured testimonial" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                  />
                  <h4 className="font-bold text-gray-900 text-lg">
                    {testimonials.find(t => t.featured)?.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {testimonials.find(t => t.featured)?.role}
                  </p>
                  <p className="text-xs text-gray-500">
                    {testimonials.find(t => t.featured)?.company}
                  </p>
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-center">
                  {testimonials.find(t => t.featured)?.text}
                </p>
              </div>
            </div>

            {/* Scattered testimonials around the featured one */}
            {testimonials.filter(t => !t.featured).map((testimonial, index) => {
              const positions = [
                "top-4 left-8",      // top-left
                "top-10 right-8",    // top-right  
                "top-72 left-4",     // mid-left
                "top-96 right-2",   // bottom-right
                "bottom-32 left-12", // bottom-left
                "bottom-28 right-4", // bottom-right
              ];
              
              return (
                <div 
                  key={testimonial.id} 
                  className={`absolute ${positions[index % positions.length]} ${getRandomCardClass(index)} transform hover:scale-105 transition-transform duration-200`}
            
                >
                  <div className="bg-white rounded-xl p-6 shadow-md border hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3 mb-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    
                    {/* Rating stars */}
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {testimonial.text.length > 120 ? 
                        testimonial.text.substring(0, 120) + "..." : 
                        testimonial.text
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

     
          
        </div>
      </div>
    </section>
<section id ="workshop" className="py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-5xl font-bold mb-6">
          Take a <br />
          <span className="text-purple-200 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            Workshop
          </span>
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
        Eager to share your expertise? Join our college to organize workshop and connect with us. Whether you're a student, faculty, or industry professional, there's a place for you to share your knowledge and grow.
        </p>
        
        {/* Speaker Instructions */}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 mb-12 max-w-4xl mx-auto border border-white/20">
          <h3 className="text-2xl font-semibold mb-6 text-purple-100">For Workshop Speakers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">1</span>
                </div>
                <h4 className="font-semibold">Prepare Your Content</h4>
              </div>
              <p className="text-purple-100 text-sm">Ensure your workshop materials are ready and tested before the session.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">2</span>
                </div>
                <h4 className="font-semibold">Interactive Engagement</h4>
              </div>
              <p className="text-purple-100 text-sm">Encourage questions and hands-on participation throughout the workshop.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <h4 className="font-semibold">Technical Setup</h4>
              </div>
              <p className="text-purple-100 text-sm">Test all equipment and have backup plans for technical difficulties.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">4</span>
                </div>
                <h4 className="font-semibold">Follow-up Resources</h4>
              </div>
              <p className="text-purple-100 text-sm">Provide additional materials and contact information for continued learning.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowWorkshopModal(true)}
          className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Register Your Workshop
        </button>
      </div>
    </div>
  </div>
</section>
<WorkshopModal 
        isOpen={showWorkshopModal} 
        onClose={() => setShowWorkshopModal(false)} 
      />
    </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CK</span>
                </div>
                <span className="ml-2 text-xl font-bold">Campus Konnect</span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering educational institutions with AI-driven solutions for the future of learning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2025 GCELT All Rights Reserved.</p>
            <p className="text-gray-400 text-sm">Developed & Maintained by Campus Konnect</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalLandingPage;
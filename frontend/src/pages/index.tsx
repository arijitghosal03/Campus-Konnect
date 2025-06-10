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
    name: "Sarah Brown",
    role: "Senior Designer",
    company: "Wonderland Design Co.",
    avatar: "/api/placeholder/50/50",
    text: "I've had the pleasure of working with teams that truly understand design. The AI agents helped us streamline our design process and deliver exceptional results for our clients.",
    rating: 5
  },
  {
    id: 2,
    name: "Sophia Earwhisper",
    role: "Art Director",
    company: "Creative Studios",
    avatar: "/api/placeholder/50/50",
    text: "I really appreciate!! Congue mauris rhoncus eleifend vel elit rhoncus ultrices vel lacus eros varius consequat",
    rating: 5
  },
  {
    id: 3,
    name: "Victoria Wilson",
    role: "Creative Lead",
    company: "Innovation Desk Co.",
    avatar: "/api/placeholder/50/50",
    text: "I was very impressed! Duis malesuada ultricies mi quis, in mollis placerat sollicitudin accumsan. Adipiscing eget dui volutpat quis venenatis quis. Viverra facilisis ante tellus lorem suspendisse augue aenean sit.",
    rating: 5
  },
  {
    id: 4,
    name: "Julie Chen",
    role: "Marketing Director",
    company: "Brand Solutions Inc.",
    avatar: "/api/placeholder/50/50",
    text: "Good Job! Lorem ipsum dolor sit amet lorem amet ipsum lorem dolor sit amet consectetur adipiscing elit sed do eiusmod",
    rating: 5,
    featured: true
  },
  {
    id: 5,
    name: "Dave Richardson",
    role: "Product Manager",
    company: "Tech Innovations Ltd.",
    avatar: "/api/placeholder/50/50",
    text: "Dave Richardson was a true professional when collaborating with our team. His attention to detail and creative approach resulted in outstanding deliverables.",
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

  const integrations = [
    { name: "Microsoft Teams", color: "bg-blue-500" },
    { name: "Google Workspace", color: "bg-red-500" },
    { name: "Slack", color: "bg-purple-500" },
    { name: "Zoom", color: "bg-blue-600" },
    { name: "Canvas LMS", color: "bg-orange-500" },
    { name: "Blackboard", color: "bg-green-600" }
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">SARSS</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Team</div>
              </Link>
               <Link href="#features">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Features</div>
              </Link>
               <Link href="#demo">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Demo</div>
              </Link>
               <Link href="/posts">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Posts</div>
              </Link>
               <Link href="#testmonials">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Testamonials</div>
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
                <span className="text-gray-900">Accelerate AI Adoption At</span><br />
                <span className="text-blue-600">Your Campus</span>
                <span className="text-gray-900"> & </span>
                <span className="text-blue-600">Business</span>
              </h1>
              <p className="text-l text-gray-600 mb-10 max-w-2xl leading-relaxed">
                Fast-track AI use across your institution with our comprehensive
                platform that connects students, faculty, and administration.
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
              <div>
                <p className="text-sm text-gray-500 mb-6">Trusted by leading institutions worldwide</p>
                <div className="flex items-center gap-6 opacity-60">
                  {partnerLogos.slice(0, 4).map((logo, index) => (
                    <div key={index} className="h-10 px-4 bg-white rounded-lg shadow-sm flex items-center border">
                      <span className="text-gray-600 font-medium text-sm">{logo}</span>
                    </div>
                  ))}
                </div>
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
                      <p className="text-sm font-bold text-gray-800">AI Workbench</p>
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
                    <p className="text-xs text-gray-500">50,000+ Active</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Courses</p>
                    <p className="text-xs text-gray-500">1,200+ Available</p>
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
                    <p className="text-xs text-gray-500">500+ Educators</p>
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

      {/* AI Workbench Section */}
      <section id ="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-blue-600">AI Workbench,</span>
              <span className="text-gray-900"> Infinite<br />Possibilities For Education</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {workflowSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Integration Preview */}
          <div className="mt-20 bg-white rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">
                  Customize AI To Scale And Optimize
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Teaching and Learning</h4>
                      <p className="text-gray-600 text-sm">Personalized learning paths and intelligent tutoring systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Students</h4>
                      <p className="text-gray-600 text-sm">AI-powered study assistance and career guidance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Admin & Operations</h4>
                      <p className="text-gray-600 text-sm">Streamlined administrative processes and resource management</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Marketing & Services</h4>
                      <p className="text-gray-600 text-sm">Enhanced outreach and student services</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Rocket className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive Demo Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                    src={testimonials.find(t => t.featured)?.avatar} 
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

      {/* Privacy & Security Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-5xl font-bold mb-6">
              Our Commitment To<br />
              <span className="text-blue-200">Privacy And Security</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Built with enterprise-grade security to protect your institution's sensitive data and ensure compliance with educational standards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Shield className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Data Encryption</h3>
                <p className="text-blue-100 text-sm">End-to-end encryption for all sensitive information</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Globe className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">FERPA Compliant</h3>
                <p className="text-blue-100 text-sm">Full compliance with educational privacy regulations</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Database className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure Infrastructure</h3>
                <p className="text-blue-100 text-sm">Enterprise-grade security with 99.9% uptime</p>
              </div>
            </div>

            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors mt-8">
              Learn About Security
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="ml-2 text-xl font-bold">SARSS</span>
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
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Github, Linkedin, Mail, ShoppingCart, Lock, Twitter, Menu, X } from 'lucide-react';

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine if user is logged in by checking localStorage (customize as needed)
  const isLoggedIn = Boolean(
    typeof window !== "undefined" &&
    (localStorage.getItem('college') ||
      localStorage.getItem('student') ||
      localStorage.getItem('company'))
  );
  
  const teamMembers = [
   {
      name: "Arijit Ghosal",
      role: "Full Stack AI Developer",
      description: "Passionate about creating innovative solutions and building scalable applications. Experienced in modern web technologies and AI applications.",
      image: "/Ag.png",
      social: {
        github: "https://github.com/arijitghosal03",
        linkedin: "https://www.linkedin.com/in/arijit-ghosal-b80257214/",
        email: "mailto:arijitghosal0309@email.com"
      }
    },
    {
      name: "Ramik Mukherjee",
      role: "Full Stack Web3 Developer",
      description: "Web3 developer with a keen eye for detail. Specializes in creating efficient product based solutions.",
      image: "/ramik.jpg",
      social: {
        github: "https://github.com",
        linkedin: "https://www.linkedin.com/in/ramik-mukherjee/",
        email: "mailto:example@email.com"
      }
    },
    {
      name: "Sayantan Dam",
      role: "Frontend Developer",
      description: "Expert in building creative frontend systems with enagaging UI. Passionate about leadership and manangement.",
      image: "/sayantan.jpg",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "mailto:example@email.com"
      }
    },
    {
      name: "Shehenaz Islam",
      role: "UI/UX Developer",
      description: "Experienced in creating responsive and accessible web applications. Passionate about modern JavaScript frameworks and web standards.",
      image: "/shehenaz.jpg",
      social: {
        github: "https://github.com",
        linkedin: "https://www.linkedin.com/in/shehenaz-islam-942184282",
        email: "mailto:example@email.com"
      }
    },
    {
      name: "SK Nasir Hosen",
      role: "AI/ML Developer",
      description: "Experienced in creating scalable AI solutions, with expertise in deep learning frameworks, NLP, and MLOps best practices",
      image: "/nasir.jpg",
      social: {
        github: "https://github.com",
        linkedin: "https://www.linkedin.com/in/sk-nasir-hosen-40796727a",
        email: "mailto:example@email.com"
      }
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(teamMembers.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentMembers = () => {
    const startIndex = currentIndex * itemsPerPage;
    return teamMembers.slice(startIndex, startIndex + itemsPerPage);
  };

  const getSocialIcon = (platform: string, url: string) => {
    switch (platform) {
      case 'github':
        return <Github size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'email':
        return <Mail size={20} />;
      default:
        return <ShoppingCart size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 -mt-16">
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

  {/* Title styling */}
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
      
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-700 mb-4">Our team</h1>
          <p className="text-gray-500 text-lg">We created the platform Campus Konnect</p>
        </div>

        {/* Team Members Grid */}
        <div className="flex justify-center items-center mb-8 px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 max-w-5xl">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                {/* Circular Image with Cut Corner and Shadow */}
                <div className="relative mb-6">
                  {/* Container with cut corner effect and shadow */}
                  <div className="relative w-40 h-40">
                    {/* Shadow element */}
                    <div 
                      className="absolute top-3 left-3 w-40 h-40 bg-gray-400 opacity-30"
                      style={{
                        clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%)',
                        borderRadius: '50%'
                      }}
                    />
                    
                    {/* Main circle with gradient border and cut corner */}
                    <div 
                      className="relative w-40 h-40 bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-300 p-4 "
                      style={{
                        clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%)',
                        borderRadius: '80%'
                      }}
                    >
                      {/* Image Container */}
                      <div 
                        className="w-full h-full overflow-hidden bg-white relative"
                        style={{
                          clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%)',
                          borderRadius: '80%'
                        }}
                      >
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Social Icons positioned at bottom center */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                          <div className="flex gap-4">
                            {Object.entries(member.social).map(([platform, url]) => (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-gray-100 transition-colors"
                              >
                                {getSocialIcon(platform, url)}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="max-w-xs">
                  <h3 className="text-2xl font-light text-gray-700 mb-2">{member.name}</h3>
                  <p className="text-cyan-500 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-light text-gray-700 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At Campus Konnect, we're committed to revolutionizing educational technology through innovative solutions. 
              Our goal is to create seamless, intuitive platforms that enhance the learning experience for students 
              and streamline administrative processes for institutions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2025 GCELT All Rights Reserved.</p>
            <p className="text-sm">Developed & Maintained by Campus Konnect</p>
          </div>
        </div>
      </div>
    
  );
};

export default About;
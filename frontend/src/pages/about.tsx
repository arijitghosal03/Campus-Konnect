import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const About = () => {
  const teamMembers: TeamMember[] = [
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

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-gray-900 to-[#1B4242]">
      <header className="bg-[#1B4242]/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="relative w-32 h-8 cursor-pointer">
                <Image
                  src="/sar.png"
                  alt="SARSS Logo"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
            </Link>
            <nav className="flex gap-8 items-center">
              <Link href="/">
                <div className="text-white hover:text-gray-200 transition-colors font-medium">
                  Home
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Meet Our Team</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We are a passionate team of developers dedicated to creating innovative solutions for the future of education technology.
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#1B4242]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-teal-300 text-sm mb-4">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-6">{member.description}</p>
                  <div className="flex gap-4">
                    {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                        <Github size={20} />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.social.email && (
                      <a href={member.social.email} className="text-gray-300 hover:text-white transition-colors">
                        <Mail size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#1B4242]/60 backdrop-blur-sm rounded-xl p-8 mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Mission</h2>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto text-center">
              At Campus Konnect, we're committed to revolutionizing educational technology through innovative solutions. 
              Our goal is to create seamless, intuitive platforms that enhance the learning experience for students 
              and streamline administrative processes for institutions.
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="bg-[#1B4242]/95 backdrop-blur-sm text-white py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2025 GCELT All Rights Reserved.</p>
            <p className="text-sm">Developed & Maintained by Campus Konnect</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
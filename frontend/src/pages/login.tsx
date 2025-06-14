import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
interface LoginFormProps {
  title: string;
  onCancel: () => void;
  onSubmit: (data: { username: string; password: string }) => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ title, onCancel, onSubmit, onForgotPassword }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white text-2xl"
            >
              🎓
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-500 text-sm">Welcome back! Please sign in to continue</p>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-4">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                required
              />
              <motion.div
                initial={{ width: 0 }}
                whileFocus={{ width: "100%" }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
              />
            </motion.div>

            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                required
              />
              <motion.div
                initial={{ width: 0 }}
                whileFocus={{ width: "100%" }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
              />
            </motion.div>
          </div>

          <motion.button
            type="button"
            onClick={onForgotPassword}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
          >
            Forgot Password?
          </motion.button>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <motion.span
                className="relative z-10"
                initial={{ opacity: 1 }}
                whileHover={{ opacity: 0.9 }}
              >
                Sign In
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                initial={false}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.form>

        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-600 rounded-full opacity-20"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${70 + Math.random() * 20}%`
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay }) => (
  <motion.div
    initial={{ y: 60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ 
      y: -8, 
      scale: 1.03,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
    }}
    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden group"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />
    
    <div className="relative z-10">
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl mb-6 inline-block"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

interface PanelBoxProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay: number;
}

const PanelBox: React.FC<PanelBoxProps> = ({ title, description, icon, onClick, delay }) => (
  <motion.div
    initial={{ y: 60, opacity: 0, scale: 0.9 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ 
      scale: 1.05, 
      y: -10,
      boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)"
    }}
    whileTap={{ scale: 0.95 }}
    className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl shadow-xl cursor-pointer w-full max-w-sm relative overflow-hidden group"
    onClick={onClick}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />
    
    <div className="relative z-10">
      <motion.div
        whileHover={{ 
          scale: 1.2, 
          rotate: [0, -5, 5, 0] 
        }}
        transition={{ duration: 0.5 }}
        className="text-white text-5xl mb-6 inline-block"
      >
        {icon}
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
      <p className="text-gray-200 text-sm leading-relaxed">{description}</p>
    </div>

    {/* Animated corner accent */}
    <motion.div
      initial={{ scale: 0, rotate: 45 }}
      animate={{ scale: 1, rotate: 45 }}
      transition={{ delay: delay + 0.3, duration: 0.4 }}
      className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-sm"
    />
  </motion.div>
);

const Home: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const username = {student:"sayantan", college:"gcelt", company:"tcs"}
  const password = {student:"sayan123", college:"gceltadmin", company:"tcs123"}

  const openModal = (title: string) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
  };

  const panels = [
    {
      title: "Student Portal",
      description: "Access your academic records, assignments, and course materials with seamless integration",
      icon: "👨‍🎓",
    },
    {
      title: "College Admin",
      description: "Manage institution resources, faculty, and student information efficiently",
      icon: "🏛️",
    },
    {
      title: "Company Access",
      description: "Connect with talented students and manage recruitment processes",
      icon: "🏢",
    },
  ];

  const features = [
    {
      title: "AI-Powered Learning",
      description: "Experience intelligent tutoring and personalized learning paths powered by advanced AI",
      icon: "🤖",
    },
    {
      title: "Real-time Analytics",
      description: "Get instant insights with comprehensive dashboards and performance tracking",
      icon: "📊",
    },
    {
      title: "Secure Infrastructure",
      description: "Enterprise-grade security with end-to-end encryption and data protection",
      icon: "🔐",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Enhanced Header */}
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
              <Link href="/posts">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Posts</div>
              </Link>
              <Link href="/">
                <div className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer">Home</div>
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

    
          </div>
        </div>
      </nav>

      <main className="flex-1">
       
        <div className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Choose Your Portal
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Access your dedicated workspace with personalized tools and features designed for your role
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {panels.map((panel, index) => (
              <PanelBox
                key={panel.title}
                {...panel}
                delay={0.2 + index * 0.1}
                onClick={() => openModal(`${panel.title} Login`)}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Infinite Possibilities For Education
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover cutting-edge features that transform how you learn, teach, and connect
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  delay={0.3 + index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                  G
                </div>
                About GCELT
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Government College of Engineering and Leather Technology, 
                a premier institution fostering excellence in education and innovation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-300 leading-relaxed">
                Block-LB, Sector III, Salt Lake City<br />
                Kolkata - 700098<br />
                West Bengal, India
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-gray-300">&copy; 2025 GCELT All Rights Reserved. Developed & Maintained by SARSS</p>
          </div>
        </div>
      </motion.footer>

      {/* Enhanced Login Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            {/* Enhanced Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            {/* Modal Container */}
            <div className="relative z-10">
              {/* Enhanced Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.2 }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 90,
                  backgroundColor: "#fee2e2"
                }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-red-500 z-50 border-2 border-gray-100 transition-all duration-300"
                onClick={closeModal}
              >
                ✕
              </motion.button>

                 <LoginForm
                title={modalTitle}
                onCancel={closeModal}
                onSubmit={async (data) => {
                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                    const response = await fetch(`${apiUrl}/auth/login`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data),
                      credentials: 'include'
                    });

                    const result = await response.json();

                    if (response.ok) {
                      const user = result.user;
                      localStorage.setItem('role',result.user.role);
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      switch (user.role) {
                        case 'student':
                          router.push('/student');
                          break;
                        case 'college':
                          router.push('/college');
                          break;
                        case 'company':
                          router.push('/company');
                          break;
                        default:
                          router.push('/');
                          break;
                      }
                      closeModal();
                    } else {
                      alert(result.message || 'Login failed');
                    }
                  } catch (error) {
                    alert('An error occurred during login.');
                  }
                }}
                onForgotPassword={() => alert("Forgot password clicked!")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
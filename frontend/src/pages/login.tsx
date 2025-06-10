import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation'

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="text-teal-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface PanelBoxProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const username = {student:"sayantan", college:"gcelt", company:"tcs"}
const password = {student:"sayan123", college:"gceltadmin", company:"tcs123"}

const PanelBox: React.FC<PanelBoxProps> = ({ title, description, icon, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-gradient-to-br from-[#1B4242] to-[#2d6363] p-8 rounded-xl shadow-lg cursor-pointer w-full max-w-xs"
    onClick={onClick}
  >
    <div className="text-white text-4xl mb-4">{icon}</div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-200 text-sm">{description}</p>
  </motion.div>
);

const Home: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const router = useRouter()


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
      description: "Access your academic records, assignments, and course materials",
      icon: "👨‍🎓",
    },
    {
      title: "College Admin",
      description: "Manage institution resources, faculty, and student information",
      icon: "🏛️",
    },
    {
      title: "Company Access",
      description: "Connect with talented students and manage recruitment",
      icon: "🏢",
    },
  ];

  const features = [
    {
      title: "Digital Campus",
      description: "Experience seamless digital learning and administrative processes",
      icon: "🌐",
    },
    {
      title: "Real-time Updates",
      description: "Stay informed with instant notifications and announcements",
      icon: "⚡",
    },
    {
      title: "Secure Access",
      description: "Enhanced security measures to protect your data",
      icon: "🔒",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-[#1B4242] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/sar.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold">Campus Konnect</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-gray-300 transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition">
              About
            </Link>
          
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#1B4242] to-[#2d6363] text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to Campus Konnect
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Your gateway to seamless academic management, career development, and institutional excellence
            </p>
          </div>
        </div>

        {/* Panels Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {panels.map((panel) => (
              <PanelBox
                key={panel.title}
                {...panel}
                onClick={() => openModal(`${panel.title} Login`)}
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why Choose Our Portal?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1B4242] text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About GCELT</h3>
              <p className="text-gray-300">
                Government College of Engineering and Leather Technology, 
                a premier institution fostering excellence in education and innovation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-300">
                Block-LB, Sector III, Salt Lake City<br />
                Kolkata - 700098<br />
                West Bengal, India
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2025 GCELT All Rights Reserved. Developed & Maintained by SARSS</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="relative z-10 bg-transparent"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 z-50 hover:bg-gray-100 transition-colors"
              onClick={closeModal}
            >
              ✕
            </motion.button>

            <div className="transform-gpu">
              <LoginForm
                title={modalTitle}
                onCancel={closeModal}
                onSubmit={(data) => {
                  console.log("Submitted data:", data);
                  switch (modalTitle){
                    case "Student Portal Login":{
                      console.log(data.username)
                      if (username.student===data.username && password.student===data.password){
                        localStorage.setItem("student","1")
                        router.push("/student")
                      } else{
                        alert("wrong credentials given")
                      }
                      break;
                    }
                    case "College Admin Login":{
                      if (username.college===data.username && password.college===data.password){
                        localStorage.setItem("college","1")
                        router.push("/college")
                      } else{
                        alert("wrong credentials given")
                      }
                      break;
                    }
                    case "Company Access Login":{
                      if (username.company===data.username && password.company===data.password){
                        localStorage.setItem("company","1")
                        router.push("/company/dashboard")
                      } else{
                        alert("wrong credentials given")
                      }
                      break;
                    }
                    default:
                      console.log("No such case exists!");
                      break;
                  }
                  closeModal();
                }}
                onForgotPassword={() => alert("Forgot password clicked!")}
              />
            </div>
          </motion.div>
        </motion.div>
      
      )}
    </div>
  );
};

export default Home;
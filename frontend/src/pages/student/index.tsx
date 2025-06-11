import React, { useEffect, useState } from 'react';
import { Bell, BookOpen, GraduationCap, Trophy, ThumbsUp, Calendar, PenSquare, User, LogOut, MessageCircle } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock student data - In production, this would come from an API/database
const studentData = {
  id: "IT2503",
  name: "Arijit Ghosal",
  roll: "11200221003",
  semester: "7th",
  department: "Information Technology",
  cgpa: "8.7",
  email: "arijitghosal0303@gmail.com",
  attendance: "85%",
  currentSubjects: [
    { name: "Data Structures", grade: "A", progress: 85 },
    { name: "Web Development", grade: "A+", progress: 92 },
    { name: "Database Systems", grade: "A", progress: 78 },
    { name: "Object Oriented Programming", grade: "A", progress: 58 },
    { name: "Computer Networks", grade: "A", progress: 23 },
    { name: "Computer Architecture", grade: "A", progress: 98 },

  ],
  achievements: [
    { title: "First Prize - Hackathon 2024", date: "2024-01-15" },
    { title: "Best Project Award", date: "2023-12-10" },
    { title: "Academic Excellence Award", date: "2023-11-20" }
  ],
  blogPosts: [
    { id: 1, title: "My Experience with React", content: "React has transformed how I think about web development...", date: "2024-01-01", likes: 24, comments: 8 },
    { id: 2, title: "Learning NextJS", content: "Next.js brings amazing features to React...", date: "2024-01-15", likes: 15, comments: 5 }
  ]
};

const Navbar = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(3);

  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/login");
  };

  return (
    <nav className="flex items-center gap-6">
      <div className="relative">
        <Bell className="w-6 h-6 text-gray-100 cursor-pointer hover:text-gray-300 transition" />
        {notifications > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications}
          </span>
        )}
      </div>
      <Link href="/student/profile" className="flex items-center gap-2 hover:text-gray-300 transition">
        <User className="w-5 h-5" />
        Profile
      </Link>
      <button onClick={handleLogout} className="flex items-center gap-2 hover:text-gray-300 transition">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </nav>
  );
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-green-500 rounded-full h-2 transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>
);

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: { title: string; content: string }) => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Create New Blog Post</h3>
        <input
          type="text"
          placeholder="Post Title"
          className="w-full p-2 border rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your post content..."
          className="w-full p-2 border rounded mb-4 h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit({ title, content });
              setTitle('');
              setContent('');
            }}
            className="bg-[#1B4242] text-white px-4 py-2 rounded hover:bg-[#143333] transition"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

const Student = () => {
  const router = useRouter();
  const [student, setStudent] = useState(studentData);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem("student");
    if (value !== "1") {
      router.push("/");
    }
  }, [router]);

  interface BlogPost {
    id: number;
    title: string;
    content: string;
    date: string;
    likes: number;
    comments: number;
  }

  const handleNewPost = (post: { title: string; content: string }) => {
    const newPost: BlogPost = {
      id: student.blogPosts.length + 1,
      ...post,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0
    };
    setStudent(prev => ({
      ...prev,
      blogPosts: [newPost, ...prev.blogPosts]
    }));
    setIsNewPostModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#1B4242] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/sar.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-semibold">Student Portal</span>
          </div>
          <Navbar />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src="/sar.png"
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                <p className="text-gray-600 mb-2">{student.roll}</p>
                <p className="text-gray-500 text-sm">{student.email}</p>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Department: </span>
                  <span>{student.department}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Semester</span>
                  <span>{student.semester}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">CGPA</span>
                  <span className="text-green-600 font-semibold">{student.cgpa}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Attendance</span>
                  <span className="text-blue-600 font-semibold">{student.attendance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <PenSquare className="w-8 h-8 text-[#1B4242]" />
                  <span className="text-3xl font-bold text-[#1B4242]">{student.blogPosts.length}</span>
                </div>
                <p className="text-gray-600 mt-2">Total Posts</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <ThumbsUp className="w-8 h-8 text-[#1B4242]" />
                  <span className="text-3xl font-bold text-[#1B4242]">
                    {student.blogPosts.reduce((acc, post) => acc + post.likes, 0)}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">Total Likes</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <Trophy className="w-8 h-8 text-[#1B4242]" />
                  <span className="text-3xl font-bold text-[#1B4242]">{student.achievements.length}</span>
                </div>
                <p className="text-gray-600 mt-2">Achievements</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <BookOpen className="w-8 h-8 text-[#1B4242]" />
                  <span className="text-3xl font-bold text-[#1B4242]">{student.currentSubjects.length}</span>
                </div>
                <p className="text-gray-600 mt-2">Current Subjects</p>
              </div>
            </div>

            {/* Current Subjects */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Current Subjects</h3>
              <div className="space-y-4">
                {student.currentSubjects.map((subject, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">{subject.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        subject.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Grade: {subject.grade}
                      </span>
                    </div>
                    <ProgressBar progress={subject.progress} />
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {student.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Posts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Blog Posts</h3>
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="bg-[#1B4242] text-white px-4 py-2 rounded-lg hover:bg-[#143333] transition flex items-center gap-2"
                >
                  <PenSquare className="w-4 h-4" />
                  New Post
                </button>
              </div>
              <div className="space-y-4">
                {student.blogPosts.map((post) => (
                  <div key={post.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                    <h4 className="text-lg font-semibold text-gray-800">{post.title}</h4>
                    <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#1B4242] text-white py-4 text-center mt-8">
        <p>&copy; 2025 GCELT All Rights Reserved. Developed & Maintained by Campus Konnect</p>
      </footer>

      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleNewPost}
      />
    </div>
  );
};

export default Student;
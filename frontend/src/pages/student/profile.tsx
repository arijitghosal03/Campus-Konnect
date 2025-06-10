import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StudentData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  studentId: string;
  program: string;
  semester: string;
  contactInformation: string;
}

interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  proficiency: number;
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  file?: File;
}

const StudentProfile = () => {
  const router = useRouter();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 50 });
  const [isEditing, setIsEditing] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // New Achievement & Certificate Data
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    issuer: '',
    date: '',
  });


  useEffect(() => {
    const fetchStudentData = () => {
        try {
          const studentKeys = Object.keys(localStorage);
          let studentFound = false;
    
          for (const key of studentKeys) {
            const storedData = localStorage.getItem(key);
            console.log(storedData);
            if (!storedData) continue;
    
            const parsedData = JSON.parse(storedData);
            if (parsedData?.fullName && parsedData?.studentId) {
              setStudentData(parsedData);
              studentFound = true;
              break;
            }
          }
    
          if (!studentFound) {
            console.warn("No valid student data found.");
          }
    
          setProfileImage(localStorage.getItem("profileImage") || null);
          setSkills(JSON.parse(localStorage.getItem("skills") || "[]"));
          setAchievements(JSON.parse(localStorage.getItem("achievements") || "[]"));
          setCertificates(JSON.parse(localStorage.getItem("certificates") || "[]"));
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };
   

    // Load saved profile data
    const loadProfileData = () => {
      const savedProfileImage = localStorage.getItem('profileImage');
      if (savedProfileImage) setProfileImage(savedProfileImage);

      const savedSkills = localStorage.getItem('skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));

      const savedAchievements = localStorage.getItem('achievements');
      if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

      const savedCertificates = localStorage.getItem('certificates');
      if (savedCertificates) setCertificates(JSON.parse(savedCertificates));
    };

    fetchStudentData();
    loadProfileData();
  }, []);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
      // Store resume name in localStorage
      localStorage.setItem('resumeName', file.name);
    }
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const updatedSkills = [...skills, { ...newSkill, id: Date.now().toString() }];
      setSkills(updatedSkills);
      localStorage.setItem('skills', JSON.stringify(updatedSkills));
      setNewSkill({ name: '', proficiency: 50 });
    }
  };
  const addAchievement = () => {
    const updatedAchievements = [
      ...achievements,
      { ...newAchievement, id: Date.now().toString() },
    ];
    setAchievements(updatedAchievements);
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    setNewAchievement({ title: '', description: '', date: '' });
    setIsAchievementModalOpen(false);
  };

  const addCertificate = () => {
    const updatedCertificates = [
      ...certificates,
      { ...newCertificate, id: Date.now().toString() },
    ];
    setCertificates(updatedCertificates);
    localStorage.setItem('certificates', JSON.stringify(updatedCertificates));
    setNewCertificate({ name: '', issuer: '', date: '' });
    setIsCertificateModalOpen(false);
  };
  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No student data found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     <header className="bg-[#1B4242] w-full h-[54px] text-white flex justify-between items-center px-10 md:px-16">
        <div className="flex items-center gap-2">
          <Image
            src="/sar.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-semibold">Student Registration</span>
        </div>
        <nav className="flex gap-6">
          <Link href="/">
            <div className="text-white text-xl cursor-pointer hover:text-gray-300">
              Home
            </div>
          </Link>
          <Link href="/student">
            <div className="text-white text-xl cursor-pointer hover:text-gray-300">
              Dashboard
            </div>
          </Link>
        </nav>
      </header>
     
      <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      layout="fill"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl text-gray-400">👤</span>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-[#1B4242] text-white p-2 rounded-full cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageUpload}
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold">{studentData.fullName}</h2>
                <p className="text-gray-600">{studentData.studentId}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Department</h3>
                  <p>{studentData.program}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Semester</h3>
                  <p>{studentData.semester}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Email</h3>
                  <p>{studentData.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Contact</h3>
                  <p>{studentData.contactInformation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Skills & Resume */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span>{skill.name}</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#1B4242] rounded-full h-2"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <input
                    type="text"
                    placeholder="Add new skill"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                    className="w-full mb-2"
                  />
                  <button
                    onClick={addSkill}
                    className="w-full bg-[#1B4242] text-white py-2 rounded hover:bg-[#2C5454]"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Resume</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-4h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-[#1B4242] hover:text-[#2C5454]">
                          Upload a file
                        </span>
                        {' or drag and drop'}
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </label>
                </div>
                {resume && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <span className="truncate">{resume.name}</span>
                    <button
                      onClick={() => setResume(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
  {/* Achievements Section */}
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-xl font-bold mb-6 text-gray-800">Achievements</h2>
    <div className="space-y-6">
      {achievements.map((achievement) => (
        <div 
          key={achievement.id} 
          className="border-l-4 border-[#1B4242] pl-4 py-2 hover:bg-gray-50 transition-colors duration-200"
        >
          <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{achievement.date}</p>
          <p className="text-gray-700 mt-2 text-sm leading-relaxed">{achievement.description}</p>
        </div>
      ))}
      <button
        onClick={() => setIsAchievementModalOpen(true)}
        className="w-full bg-[#1B4242] text-white py-3 rounded-lg hover:bg-[#2C5454] transition-colors duration-200 font-medium mt-4"
      >
        Add Achievement
      </button>
    </div>
  </div>

  {/* Certificates Section */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-6 text-gray-800">Certificates</h2>
    <div className="space-y-4">
      {certificates.map((certificate) => (
        <div 
          key={certificate.id} 
          className="border border-gray-200 p-4 rounded-lg hover:border-[#1B4242] hover:bg-gray-50 transition-all duration-200"
        >
          <h3 className="font-semibold text-gray-800">{certificate.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{certificate.issuer}</p>
          <p className="text-xs text-gray-500 mt-2">{certificate.date}</p>
        </div>
      ))}
      <button
        onClick={() => setIsCertificateModalOpen(true)}
        className="w-full bg-[#1B4242] text-white py-3 rounded-lg hover:bg-[#2C5454] transition-colors duration-200 font-medium mt-4"
      >
        Add Certificate
      </button>
    </div>
  </div>
</div>

{isCertificateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-xl font-bold mb-4">Add Certificate</h2>
            <input
              type="text"
              placeholder="Name"
              value={newCertificate.name}
              onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              placeholder="Issuer"
              value={newCertificate.issuer}
              onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="date"
              value={newCertificate.date}
              onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addCertificate}
                className="px-4 py-2 bg-[#1B4242] text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
{/* Achievement Modal */}
{isAchievementModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Add Achievement</h2>
        <input
          type="text"
          placeholder="Achievement Title"
          value={newAchievement.title}
          onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#1B4242] focus:border-transparent"
        />
        <textarea
          placeholder="Achievement Description"
          value={newAchievement.description}
          onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#1B4242] focus:border-transparent min-h-[100px]"
        />
        <input
          type="date"
          value={newAchievement.date}
          onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#1B4242] focus:border-transparent"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsAchievementModalOpen(false)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={addAchievement}
            className="px-6 py-2.5 bg-[#1B4242] text-white rounded-lg hover:bg-[#2C5454] transition-colors duration-200 font-medium"
          >
            Add Achievement
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</div>
</main>
</div>
  );
};
export default StudentProfile;
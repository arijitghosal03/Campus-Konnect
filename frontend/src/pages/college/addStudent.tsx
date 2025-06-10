import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  contactInformation: string;
  schoolName: string;
  graduationDate: string;
  cgpa: string;
  email: string;
  studentId: string;
  program: string;
  semester: string;
  profileImage?: string;
}

const Home = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    contactInformation: '',
    schoolName: '',
    graduationDate: '',
    cgpa: '',
    email: '',
    studentId: '',
    program: '',
    semester: '',
  });
  
  useEffect(() => {
    const value = localStorage.getItem("college");
    if (value !== "1") {
      router.push("/");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const clearForm = () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      contactInformation: '',
      schoolName: '',
      graduationDate: '',
      cgpa: '',
      email: '',
      studentId: '',
      program: '',
      semester: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.studentId) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Form submitted:', formData);
    localStorage.setItem(formData.studentId, JSON.stringify(formData));
    setShowPopup(true);
    clearForm();
    
    setTimeout(() => {
      setShowPopup(false);
    }, 6000);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {/* Header remains the same */}
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
          <Link href="/college">
            <div className="text-white text-xl cursor-pointer hover:text-gray-300">
              Dashboard
            </div>
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Success Popup remains the same */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <div className="bg-[#1B4242] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 text-center mb-4">Your student registration has been submitted successfully.</p>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-[#1B4242] text-white py-2 px-4 rounded-md hover:bg-[#2C5454] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#1B4242] px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1B4242]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Add New Student</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8 text-center">
              <p className="text-gray-600">Please fill in the form below to register as a new student.</p>
              <p className="text-gray-600">All fields marked with * are required.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1B4242] border-b pb-2">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4242] focus:ring-[#1B4242]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4242] focus:ring-[#1B4242]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4242] focus:ring-[#1B4242]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender *</label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4242] focus:ring-[#1B4242]"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1B4242] border-b pb-2">Academic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID *</label>
                    <input
                      type="text"
                      name="studentId"
                      required
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4242] focus:ring-[#1B4242]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department *</label>
                    <select
                      name="program"
                      required
                      value={formData.program}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4242] focus:ring-[#1B4242]"
                    >
                      <option value="">Select department</option>
                      <option value="cse">Computer Science & Engineering</option>
                      <option value="it">Information Technology</option>
                      <option value="ece">Electronics & Communication</option>
                      <option value="ee">Electrical Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester *</label>
                    <select
                      name="semester"
                      required
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4242] focus:ring-[#1B4242]"
                    >
                      <option value="">Select semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
                    <input
                      type="tel"
                      name="contactInformation"
                      required
                      value={formData.contactInformation}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4242] focus:ring-[#1B4242]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1B4242] text-white rounded-md hover:bg-[#2C5454] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4242] transition-colors"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-[#1B4242] w-full h-[54px] text-white flex items-center justify-center mt-8">
        <p>&copy; 2025 GCELT All Rights Reserved. Developed & Maintained by Campus Konnect</p>
      </footer>
    </div>
  );
};

export default Home;
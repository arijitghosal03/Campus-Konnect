import React from "react";
import Image from "next/image";
import { Building2, GraduationCap, Users, Briefcase } from "lucide-react";
import Link from "next/link";

const CollegeHomepage = () => {
  // Sample data - replace with your actual data
  const collegeInfo = {
    name: "Government College of Engineering and Leather Technology",
    established: 1919,
    location: " Block-LB, Sector III, Salt Lake City Kolkata - 700098, \n West Bengal, India",
    accreditation: "NAAC A++ Grade",
    departments: ["Computer Science","Information Technology","Leather Technology"]
  };

  const students = [
    { id: 1, name: "Arijit Ghosal", department: "Information Technology", year: "4th", gpa: 8.7 },
    { id: 2, name: "Ramik Mukherjee", department: "Information Technology", year: "4th", gpa: 8.9 },
    { id: 3, name: "Sayantan Dam", department: "Information Technology", year: "4th", gpa: 9.4 },
    { id: 4, name: "Shehenaz Islam", department: "Information Technology", year: "4th", gpa: 8.5 },
    { id: 5, name: "SK Nasir Hosen", department: "Information Technology", year: "4th", gpa: 8.5 },

  ];

  const companies = [
    { name: "TATA Consultancy Service", date: "2025-02-15", positions: ["Software Engineer", "Data Analyst"] },
    { name: "Innovation Labs", date: "2025-02-20", positions: ["System Architect", "DevOps Engineer"] },
    { name: "Wipro", date: "2025-02-25", positions: ["Full Stack Developer", "ML Engineer"] },
  ];

  return (
    
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1B4242] to-[#092635]">
      {/* Header */}
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
          <Link href="/college/addStudent" className="text-teal-100 hover:text-white transition-colors">
              Add Student
            </Link>
            <Link href="/" className="text-teal-100 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-teal-100 hover:text-white transition-colors">
              About Us
            </Link>
          </nav>
        </div>
      </div>
    </div>
  </header>

    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* College Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100 mb-2">{collegeInfo.name}</h1>
        <p className="text-lg text-gray-400">Excellence in Education Since {collegeInfo.established}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card: Registered Students */}
        <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
          <Users className="h-10 w-10 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-gray-600">Registered Students</p>
          </div>
        </div>

        {/* Card: Departments */}
        <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
          <Building2 className="h-10 w-10 text-green-500" />
          <div>
            <p className="text-2xl font-bold">{collegeInfo.departments.length}</p>
            <p className="text-gray-600">Departments</p>
          </div>
        </div>

        {/* Card: Companies Visiting */}
        <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
          <Briefcase className="h-10 w-10 text-purple-500" />
          <div>
            <p className="text-2xl font-bold">{companies.length}</p>
            <p className="text-gray-600">Companies Visiting</p>
          </div>
        </div>
      </div>

      {/* College Info */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">About Our College</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p>{collegeInfo.location}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Accreditation</h3>
            <p>{collegeInfo.accreditation}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-2">Departments</h3>
            <div className="flex flex-wrap gap-2">
              {collegeInfo.departments.map((dept) => (
                <span
                  key={dept}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registered Students */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Registered Students</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border border-gray-300">Name</th>
              <th className="p-3 text-left border border-gray-300">Department</th>
              <th className="p-3 text-left border border-gray-300">Year</th>
              <th className="p-3 text-left border border-gray-300">GPA</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{student.name}</td>
                <td className="p-3 border border-gray-300">{student.department}</td>
                <td className="p-3 border border-gray-300">{student.year}</td>
                <td className="p-3 border border-gray-300">{student.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Company Visits */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Upcoming Company Visits</h2>
        <div className="space-y-4">
          {companies.map((company) => (
            <div key={company.name} className="p-4 bg-gray-100 rounded-lg flex items-start space-x-4">
              <Briefcase className="h-6 w-6 text-gray-700" />
              <div>
                <h3 className="font-bold">{company.name}</h3>
                <p className="text-sm text-gray-600">
                  Interview Date: {new Date(company.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Positions: {company.positions.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default CollegeHomepage;

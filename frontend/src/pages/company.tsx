import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, GraduationCap, Briefcase, ChevronRight, X } from "lucide-react";

interface Student {
  id: number;
  name: string;
  branch: string;
  roll: string;
  skills: string[];
  cgpa: number;
  year: string;
  internships: string[];
  image: string; // Added image property
}

const Company = () => {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  // Redirect if the user is not authorized
  useEffect(() => {
    const value = localStorage.getItem("company");
    if (value !== "1") {
      router.push("/");
    }
  }, [router]);

  // Fetch students data from JSON
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/students.json"); // Adjust the path if necessary
        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.statusText}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    [student.name, student.branch, student.roll]
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                <Link href="/company/dashboard" className="text-teal-100 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/company" className="text-teal-100 hover:text-white transition-colors">
                  Students Data
                </Link>
                <Link href="/about" className="text-teal-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300/60" size={20} />
              <input
                type="text"
                placeholder="Search by name, branch, or roll number..."
                className="w-full pl-10 pr-4 py-2 bg-[#1B4242]/20 border border-teal-700/30 rounded-lg text-white placeholder-teal-300/60 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-[#1B4242]/20 rounded-xl border border-teal-700/30 backdrop-blur-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-teal-700/30">
                  <th className="text-left p-4 text-teal-100">Student</th>
                  <th className="text-left p-4 text-teal-100">Branch</th>
                  <th className="text-left p-4 text-teal-100">Skills</th>
                  <th className="text-left p-4 text-teal-100">CGPA</th>
                  <th className="text-left p-4 text-teal-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-teal-700/30 hover:bg-teal-700/10 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={student.image}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="text-white">{student.name}</div>
                          <div className="text-sm text-teal-200/70">{student.roll}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-teal-100">{student.branch}</td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {student.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full bg-teal-500/10 text-teal-300 text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {student.skills.length > 3 && (
                          <span className="px-2 py-1 rounded-full bg-teal-700/20 text-teal-200 text-sm">
                            +{student.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-teal-100">{student.cgpa}</td>
                    <td className="p-4">
                      <button className="flex items-center text-teal-300 hover:text-teal-200">
                        View Profile <ChevronRight size={16} className="ml-2" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Student Detail Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-[#092635]/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-[#1B4242] to-[#092635] rounded-xl border border-teal-700/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-teal-300 hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={selectedStudent.image}
                    alt={selectedStudent.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedStudent.name}</h2>
                    <p className="text-teal-200/70">{selectedStudent.roll}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <GraduationCap className="text-teal-300" size={20} />
                      Academic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-teal-100">
                      <div>
                        <p className="text-sm text-teal-200/70">Branch</p>
                        <p>{selectedStudent.branch}</p>
                      </div>
                      <div>
                        <p className="text-sm text-teal-200/70">Year of Study</p>
                        <p>{selectedStudent.year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-teal-200/70">CGPA</p>
                        <p>{selectedStudent.cgpa}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Briefcase className="text-teal-300" size={20} />
                      Skills & Experience
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-teal-200/70 mb-2">Skills</p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedStudent.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded-full bg-teal-500/10 text-teal-300 text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-teal-200/70 mb-2">Internships</p>
                        <ul className="list-disc pl-5 text-teal-100">
                          {selectedStudent.internships.map((internship, index) => (
                            <li key={index}>{internship}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;

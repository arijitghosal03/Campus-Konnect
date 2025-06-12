import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  Briefcase, 
  Home,
  BookOpen,
  Calendar,
  Trophy,
  BarChart3,
  Settings,
  User,
  LogOut,
  Search,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  Bell,
  MapPin,
  Phone,
  Mail,
  Edit,
  Check,
  X,
  FileText,
  Camera,
  DollarSign,
  UserCheck,
  Eye
} from 'lucide-react';

type WorkshopSummary = {
  students: number | string;
  budget: number | string;
  summary: string;
  photos: number[] | number | string[] | string;
};

type Workshop = {
  id: number;
  title: string;
  speaker: {
    name: string;
    designation: string;
    company: string;
    bio?: string;
    image?: string;
  };
  topic?: string;
  date: string;
  time?: string;
  venue: string;
  requirements?: string[];
  contact: {
    email: string;
    phone: string;
  };
  status: string;
  description?: string;
  maxParticipants?: number;
  targetAudience?: string;
  submittedDate?: string;
  hasSummary?: boolean;
  summary?: WorkshopSummary;
};

const CollegeDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showWorkshopDetails, setShowWorkshopDetails] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [workshopSummary, setWorkshopSummary] = useState<WorkshopSummary>({
    students: '',
    budget: '',
    summary: '',
    photos: []
  });

  // College data
  const collegeInfo = {
    name: "Government College of Engineering and Leather Technology",
    established: 1919,
    location: "Block-LB, Sector III, Salt Lake City Kolkata - 700098, West Bengal, India",
    accreditation: "NAAC A++ Grade",
    departments: ["Computer Science", "Information Technology", "Leather Technology"]
  };

  const students = [
    { id: 1, name: "Arijit Ghosal", department: "Information Technology", year: "4th", gpa: 8.7, status: "Active" },
    { id: 2, name: "Ramik Mukherjee", department: "Information Technology", year: "4th", gpa: 8.9, status: "Active" },
    { id: 3, name: "Sayantan Dam", department: "Information Technology", year: "4th", gpa: 9.4, status: "Active" },
    { id: 4, name: "Shehenaz Islam", department: "Information Technology", year: "4th", gpa: 8.5, status: "Active" },
    { id: 5, name: "SK Nasir Hosen", department: "Information Technology", year: "4th", gpa: 8.5, status: "Active" },
  ];

  const companies = [
    { 
      name: "TATA Consultancy Service", 
      date: "2025-02-15", 
      positions: ["Software Engineer", "Data Analyst"],
      students: 200,
      topics: 12,
      completion: 72
    },
    { 
      name: "Innovation Labs", 
      date: "2025-02-20", 
      positions: ["System Architect", "DevOps Engineer"],
      students: 150,
      topics: 10,
      completion: 68
    },
    { 
      name: "Wipro", 
      date: "2025-02-25", 
      positions: ["Full Stack Developer", "ML Engineer"],
      students: 180,
      topics: 8,
      completion: 85
    },
  ];

  // Workshop data (mock data - would be fetched from MongoDB)
  const upcomingWorkshops = [
    {
      id: 1,
      title: "Machine Learning in Healthcare",
      speaker: {
        name: "Dr. Rajesh Kumar",
        designation: "Senior Data Scientist",
        company: "Google Health",
        bio: "10+ years of experience in ML applications in healthcare",
        image: "/api/placeholder/80/80"
      },
      topic: "Applications of Machine Learning in Medical Diagnosis and Treatment",
      date: "2025-07-15",
      time: "10:00 AM - 4:00 PM",
      venue: "Main Auditorium, GCELT",
      requirements: [
        "Basic knowledge of Python",
        "Laptop with Python environment",
        "Interest in healthcare technology"
      ],
      contact: {
        email: "rajesh.kumar@googlehealth.com",
        phone: "+91-9876543210"
      },
      status: "pending",
      description: "This workshop will cover the latest trends in machine learning applications for healthcare, including diagnostic tools and treatment recommendations.",
      maxParticipants: 100,
      targetAudience: "Final year students and faculty",
      submittedDate: "2025-06-10"
    },
    {
      id: 2,
      title: "Blockchain Technology Workshop",
      speaker: {
        name: "Priya Sharma",
        designation: "Blockchain Architect",
        company: "IBM",
        bio: "Leading blockchain implementations across various industries",
        image: "/api/placeholder/80/80"
      },
      topic: "Decentralized Applications and Smart Contracts",
      date: "2025-07-20",
      time: "9:00 AM - 5:00 PM",
      venue: "Computer Lab 1, GCELT",
      requirements: [
        "Basic programming knowledge",
        "Understanding of cryptography basics",
        "Laptop with latest browser"
      ],
      contact: {
        email: "priya.sharma@ibm.com",
        phone: "+91-8765432109"
      },
      status: "approved",
      description: "Hands-on workshop on building decentralized applications using Ethereum and smart contract development.",
      maxParticipants: 50,
      targetAudience: "Computer Science and IT students",
      submittedDate: "2025-06-05"
    },
    {
      id: 3,
      title: "Advanced Leather Processing Techniques",
      speaker: {
        name: "Prof. Amit Banerjee",
        designation: "Senior Researcher",
        company: "Central Leather Research Institute",
        bio: "30+ years in leather technology research and development",
        image: "/api/placeholder/80/80"
      },
      topic: "Sustainable Leather Manufacturing Processes",
      date: "2025-07-25",
      time: "11:00 AM - 3:00 PM",
      venue: "Leather Technology Lab, GCELT",
      requirements: [
        "Safety equipment will be provided",
        "Basic knowledge of chemistry",
        "Lab coat recommended"
      ],
      contact: {
        email: "amit.banerjee@clri.org",
        phone: "+91-7654321098"
      },
      status: "pending",
      description: "Workshop focusing on eco-friendly leather processing methods and quality control techniques.",
      maxParticipants: 30,
      targetAudience: "Leather Technology students and researchers",
      submittedDate: "2025-06-12"
    }
  ];

  const completedWorkshops = [
    {
      id: 4,
      title: "AI in Industry 4.0",
      speaker: {
        name: "Dr. Suresh Patel",
        designation: "CTO",
        company: "TechCorp Solutions"
      },
      contact: {
        email: "amit.banerjee@clri.org",
        phone: "+91-7654321098"
      },
      date: "2025-05-15",
      venue: "Main Auditorium, GCELT",
      status: "completed",
      hasSummary: false
    },
    {
      id: 5,
      title: "Cloud Computing Fundamentals",
      speaker: {
        name: "Ms. Anita Roy",
        designation: "Cloud Architect",
        company: "AWS"
      },
      date: "2025-04-20",
      venue: "Computer Lab 2, GCELT",
      status: "completed",
      hasSummary: true,
      contact: {
        email: "amit.banerjee@clri.org",
        phone: "+91-7654321098"
      },
      summary: {
        students: 85,
        budget: 15000,
        photos: 12,
        summary: "Highly successful workshop with great student engagement. Covered AWS basics, EC2, S3, and Lambda functions."
      }
    }
  ];

  const statistics = {
    graphics: 85,
    theme: 65,
    template: 50
  };
const [workshops, setWorkshops] = useState<{
  upcoming: Workshop[];
  completed: Workshop[];
}>({
  upcoming: [...upcomingWorkshops],
  completed: [...completedWorkshops]
});

  const menuItems = [
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'workshops', label: 'Workshops', icon: Calendar },
    { id: 'ranking', label: 'My Ranking', icon: Trophy },
    { id: 'statistics', label: 'Statistics', icon: TrendingUp },
  ];

  const settingsItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  // Workshop functions
const handleApproveWorkshop = async (workshopId: number) => {
  const workshop = workshops.upcoming.find(w => w.id === workshopId);
  if (workshop) {
    // Update the workshop status
    const updatedUpcoming = workshops.upcoming.map(w => 
      w.id === workshopId ? { ...w, status: 'approved' } : w
    );
    
    setWorkshops(prev => ({
      ...prev,
      upcoming: updatedUpcoming
    }));

    // Simulate sending email
    try {
      console.log(`Sending approval email to ${workshop.contact.email}`);
      // In real implementation, make API call to send email
      // await sendApprovalEmail(workshop);
      
      alert(`Workshop "${workshop.title}" approved successfully! 
Approval email sent to: ${workshop.speaker.name} (${workshop.contact.email})`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Workshop approved but failed to send email notification.');
    }
  }
};

const handleDeclineWorkshop = async (workshopId: number) => {
  const workshop = workshops.upcoming.find(w => w.id === workshopId);
  if (workshop) {
    const updatedUpcoming = workshops.upcoming.map(w => 
      w.id === workshopId ? { ...w, status: 'declined' } : w
    );
    
    setWorkshops(prev => ({
      ...prev,
      upcoming: updatedUpcoming
    }));

    // Simulate sending decline email
    try {
      console.log(`Sending decline notification to ${workshop.contact.email}`);
      alert(`Workshop "${workshop.title}" declined. 
Notification sent to: ${workshop.speaker.name} (${workshop.contact.email})`);
    } catch (error) {
      console.error('Error sending decline notification:', error);
    }
  }
};

const handleSaveWorkshop = async () => {
  if (!editingWorkshop) return;
  
  const updatedUpcoming = workshops.upcoming.map(w => 
    w.id === editingWorkshop.id ? { ...editingWorkshop } : w
  );
  
  setWorkshops(prev => ({
    ...prev,
    upcoming: updatedUpcoming
  }));
  
  setEditingWorkshop(null);
  setShowWorkshopDetails(false);
  alert('Workshop details updated successfully!');
};

const handleSaveSummary = async () => {
  if (!selectedWorkshop) return;
  
  const summaryData = {
    students: typeof workshopSummary.students === 'string' ? 
      parseInt(workshopSummary.students) || 0 : workshopSummary.students,
    budget: typeof workshopSummary.budget === 'string' ? 
      parseInt(workshopSummary.budget) || 0 : workshopSummary.budget,
    summary: workshopSummary.summary,
    photos: Array.isArray(workshopSummary.photos) ? 
      workshopSummary.photos.length : (typeof workshopSummary.photos === 'string' ? 
        parseInt(workshopSummary.photos) || 0 : workshopSummary.photos)
  };

  const updatedCompleted = workshops.completed.map(w => 
    w.id === selectedWorkshop.id ? { 
      ...w, 
      summary: summaryData,
      hasSummary: true 
    } : w
  );
  
  setWorkshops(prev => ({
    ...prev,
    completed: updatedCompleted
  }));
  
  setShowSummaryModal(false);
  setWorkshopSummary({ students: '', budget: '', summary: '', photos: [] });
  alert('Workshop summary saved successfully!');
};
const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & EventTarget & { files: FileList | null };
}
  const handleEditWorkshop = (workshop: Workshop) => {
    setEditingWorkshop({ ...workshop });
    setSelectedWorkshop(workshop);
    setShowWorkshopDetails(true);
  };
    const handleSummarizeWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setWorkshopSummary(workshop.summary || { students: '', budget: '', summary: '', photos: [] });
    setShowSummaryModal(true);
  };
const handleImageUpload = (event: ImageUploadEvent) => {
  const files: File[] = event.target.files ? Array.from(event.target.files) : [];
  const validFiles: File[] = files.filter((file: File) => {
    const isValidType: boolean = file.type.startsWith('image/');
    const isValidSize: boolean = file.size <= 10 * 1024 * 1024; // 10MB
    return isValidType && isValidSize;
  });
  
  if (validFiles.length !== files.length) {
    alert('Some files were rejected. Only image files under 10MB are allowed.');
  }
  
  setUploadedFiles((prev: File[]) => [...prev, ...validFiles]);
  setWorkshopSummary((prev: WorkshopSummary) => ({
    ...prev,
    photos: [
      ...(Array.isArray(prev.photos) ? prev.photos.filter((p): p is string => typeof p === 'string') : []),
      ...validFiles.map((f: File) => f.name)
    ] as string[]
  }));
};

const removeUploadedFile = (index: number) => {
  const newFiles = uploadedFiles.filter((_, i) => i !== index);
  setUploadedFiles(newFiles);
  setWorkshopSummary(prev => ({
    ...prev,
    photos: newFiles.map(f => f.name)
  }));
};
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">New Academic Session Available Now!</h2>
          <p className="text-blue-100 mb-6">
            Welcome to our new academic portal. Check your results, practice for exams, 
            and access the best resources. This platform will boost your academic performance.
          </p>
          <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
            Explore More <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="w-32 h-32 bg-blue-400 rounded-full flex items-center justify-center">
            <GraduationCap className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Popular Courses</h3>
          <button className="text-blue-600 font-semibold hover:text-blue-700">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{company.name}</h4>
                  <div className="text-2xl font-bold text-gray-900">{company.completion}%</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{company.topics} Topics</span>
                  <span className="w-2 h-2 bg-orange-500 rounded-full ml-4"></span>
                  <span>+{company.students} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{new Date(company.date).toLocaleDateString()}</span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full ml-4"></span>
                  <span>+{company.students} Students</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

const renderWorkshops = () => (
  <div className="space-y-6">
    {/* Upcoming Workshops */}
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Workshops</h3>
      <div className="space-y-4">
        {workshops.upcoming.map((workshop) => (
          <div key={workshop.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{workshop.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    workshop.status === 'approved' ? 'bg-green-100 text-green-800' :
                    workshop.status === 'declined' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {workshop.status.charAt(0).toUpperCase() + workshop.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{workshop.topic}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{workshop.speaker.name} - {workshop.speaker.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(workshop.date).toLocaleDateString()} at {workshop.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{workshop.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Max {workshop.maxParticipants} participants</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setSelectedWorkshop(workshop);
                    setShowWorkshopDetails(true);
                  }}
                  className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditWorkshop(workshop)}
                  className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {workshop.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApproveWorkshop(workshop.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeclineWorkshop(workshop.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Completed Workshops */}
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Completed Workshops</h3>
      <div className="space-y-4">
        {workshops.completed.map((workshop) => (
          <div key={workshop.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{workshop.title}</h4>
                <p className="text-gray-600 mb-2">Speaker: {workshop.speaker.name} - {workshop.speaker.company}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(workshop.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{workshop.venue}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {workshop.hasSummary && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Summary Added
                  </span>
                )}
                <button
                  onClick={() => handleSummarizeWorkshop(workshop)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {workshop.hasSummary ? 'View Summary' : 'Add Summary'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

 
  const renderTraining = () => (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Training Programs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collegeInfo.departments.map((dept, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h4 className="text-lg font-semibold">{dept}</h4>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive training program for {dept} students with industry-relevant curriculum.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start Training
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRanking = () => (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Student Rankings</h3>
      <div className="space-y-4">
        {students.sort((a, b) => b.gpa - a.gpa).map((student, index) => (
          <div key={student.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center font-bold text-yellow-800">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{student.name}</h4>
              <p className="text-sm text-gray-600">{student.department} - {student.year} Year</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{student.gpa}</div>
              <div className="text-sm text-gray-600">GPA</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">College Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{students.length}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Building2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{collegeInfo.departments.length}</div>
          <div className="text-sm text-gray-600">Departments</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{companies.length}</div>
          <div className="text-sm text-gray-600">Company Visits</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="h-32 bg-blue-200 rounded mb-2 flex items-end justify-center">
            <div className="w-8 bg-blue-600 rounded-t" style={{height: `${statistics.graphics}%`}}></div>
          </div>
          <div className="text-sm font-medium">Graphics</div>
        </div>
        <div className="text-center">
          <div className="h-32 bg-blue-200 rounded mb-2 flex items-end justify-center">
            <div className="w-8 bg-blue-600 rounded-t" style={{height: `${statistics.theme}%`}}></div>
          </div>
          <div className="text-sm font-medium">Theme</div>
        </div>
        <div className="text-center">
          <div className="h-32 bg-blue-200 rounded mb-2 flex items-end justify-center">
            <div className="w-8 bg-blue-600 rounded-t" style={{height: `${statistics.template}%`}}></div>
          </div>
          <div className="text-sm font-medium">Template</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'training': return renderTraining();
      case 'workshops': return renderWorkshops();
      case 'ranking': return renderRanking();
      case 'statistics': return renderStatistics();
      case 'home': return (
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">College Information</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Institution Name</h4>
              <p className="text-gray-600">{collegeInfo.name}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Established</h4>
              <p className="text-gray-600">{collegeInfo.established}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Location</h4>
              <p className="text-gray-600">{collegeInfo.location}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Accreditation</h4>
              <p className="text-gray-600">{collegeInfo.accreditation}</p>
            </div>
          </div>
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">GCELT Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Settings
            </div>
            <div className="space-y-1">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-100"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
              <p className="text-gray-600">Manage your academic portal</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for exam"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Profile</div>
                  <div className="text-xs text-gray-600">Admin User</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pending Exams */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Upcoming Workshops</h3>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
                </div>
                <div className="space-y-4">
                  {upcomingWorkshops.slice(0, 2).map((workshop, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{workshop.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          workshop.status === 'approved' ? 'bg-green-100 text-green-800' :
                          workshop.status === 'declined' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {workshop.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{workshop.speaker.name}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 text-sm px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                          View
                        </button>
                        <button className="flex-1 text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Workshop Stats</h3>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Workshops</span>
                    <span className="font-semibold">{upcomingWorkshops.length + completedWorkshops.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Approval</span>
                    <span className="font-semibold text-yellow-600">
                      {upcomingWorkshops.filter(w => w.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="font-semibold text-green-600">
                      {upcomingWorkshops.filter(w => w.status === 'approved').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Workshop Details Modal */}
      {showWorkshopDetails && selectedWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Workshop Details</h2>
                <button
                  onClick={() => {
                    setShowWorkshopDetails(false);
                    setEditingWorkshop(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Speaker Info */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Speaker Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{selectedWorkshop.speaker.name}</h4>
                          <p className="text-sm text-gray-600">{selectedWorkshop.speaker.designation}</p>
                          <p className="text-sm text-gray-600">{selectedWorkshop.speaker.company}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{selectedWorkshop.speaker.bio}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{selectedWorkshop.contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{selectedWorkshop.contact.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workshop Details */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Workshop Title</label>
                      {editingWorkshop ? (
                        <input
                          type="text"
                          value={editingWorkshop.title}
                          onChange={(e) => setEditingWorkshop({...editingWorkshop, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-lg font-semibold">{selectedWorkshop.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                      {editingWorkshop ? (
                        <input
                          type="text"
                          value={editingWorkshop.topic}
                          onChange={(e) => setEditingWorkshop({...editingWorkshop, topic: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-700">{selectedWorkshop.topic}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        {editingWorkshop ? (
                          <input
                            type="date"
                            value={editingWorkshop.date}
                            onChange={(e) => setEditingWorkshop({...editingWorkshop, date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-700">{new Date(selectedWorkshop.date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        {editingWorkshop ? (
                          <input
                            type="text"
                            value={editingWorkshop.time}
                            onChange={(e) => setEditingWorkshop({...editingWorkshop, time: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-700">{selectedWorkshop.time}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                      {editingWorkshop ? (
                        <input
                          type="text"
                          value={editingWorkshop.venue}
                          onChange={(e) => setEditingWorkshop({...editingWorkshop, venue: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-700">{selectedWorkshop.venue}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      {editingWorkshop ? (
                        <textarea
                          value={editingWorkshop.description}
                          onChange={(e) => setEditingWorkshop({...editingWorkshop, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-700">{selectedWorkshop.description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedWorkshop.requirements && selectedWorkshop.requirements.map((req, index) => (
                          <li key={index} className="text-gray-700">{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                        <p className="text-gray-700">{selectedWorkshop.maxParticipants}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                        <p className="text-gray-700">{selectedWorkshop.targetAudience}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                {editingWorkshop ? (
                  <>
                    <button
                      onClick={() => setEditingWorkshop(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveWorkshop}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    {selectedWorkshop.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleDeclineWorkshop(selectedWorkshop.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </button>
                        <button
                          onClick={() => handleApproveWorkshop(selectedWorkshop.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve & Send Email
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workshop Summary Modal */}
      {showSummaryModal && selectedWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Workshop Summary</h2>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedWorkshop.title}</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Students Attended
                </label>
                <input
                  type="number"
                  value={workshopSummary.students}
                  onChange={(e) => setWorkshopSummary({...workshopSummary, students: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter number of students"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Spent (₹)
                </label>
                <input
                  type="number"
                  value={workshopSummary.budget}
                  onChange={(e) => setWorkshopSummary({...workshopSummary, budget: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter budget amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Summary
                </label>
                <textarea
                  value={workshopSummary.summary}
                  onChange={(e) => setWorkshopSummary({...workshopSummary, summary: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a brief summary of the workshop, key highlights, feedback, etc."
                />
              </div>

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Photos Upload
  </label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-600 mb-2">Upload workshop photos</p>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
      id="photo-upload"
    />
    <label
      htmlFor="photo-upload"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
    >
      Select Photos
    </label>
    <p className="text-sm text-gray-500 mt-2">JPG, PNG files up to 10MB each</p>
    
    {/* Display uploaded files */}
    {uploadedFiles.length > 0 && (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <span className="text-sm text-gray-700">{file.name}</span>
              <button
                onClick={() => removeUploadedFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

              {selectedWorkshop.hasSummary && selectedWorkshop.summary && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Current Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Students: </span>
                      <span className="font-medium">{selectedWorkshop.summary.students}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget: </span>
                      <span className="font-medium">₹{selectedWorkshop.summary.budget}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Photos: </span>
                      <span className="font-medium">{selectedWorkshop.summary.photos}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{selectedWorkshop.summary.summary}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSummary}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Summary
              </button>
            </div>
          </div>
        </div>
       
      )}
       </div>
)}
export default CollegeDashboard;
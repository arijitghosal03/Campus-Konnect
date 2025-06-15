import React, { useState, useEffect } from 'react';
import { 
  CheckCircle,
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
  Eye,
  Plus,
  Code,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import {Badge} from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
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
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);


  useEffect(() => {
    const value = localStorage.getItem('role');
    if (value !== "college") {
      router.push("/");
    }
  }, [router]);

  // College data
  const collegeInfo = {
    name: "Government College of Engineering and Leather Technology",
    established: 1919,
    location: "Block-LB, Sector III, Salt Lake City Kolkata - 700098, West Bengal, India",
    accreditation: "NAAC A++ Grade",
    departments: ["Computer Science", "Information Technology", "Leather Technology"]
  };


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

  // Workshop da
  interface Workshop {
  _id?: string;
  id?: number;
  title: string;
  speaker: {
    name: string;
    designation: string;
    company: string;
    bio?: string;
    image?: string;
  };
  topic: string;
  date: string;
  time: string;
  venue: string;
  requirements: string[];
  contact: {
    email: string;
    phone: string;
  };
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'upcoming';
  description: string;
  maxParticipants: number;
  targetAudience: string;
  submittedDate: string;
  hasSummary?: boolean;
  summary?: WorkshopSummary;
}

interface WorkshopSummary {
  students: number | string;
  budget: number | string;
  summary: string;
  photos: string[] | number;
}
const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);


// Fetch all workshops from MongoDB
const fetchWorkshops = async (): Promise<{ upcoming: Workshop[], completed: Workshop[] }> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/workshops`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch workshops: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched data:', data); // Debug log
    
    // Handle different response structures
    let allWorkshops: Workshop[] = [];
    
    if (Array.isArray(data)) {
      allWorkshops = data;
    } else if (data && data.workshops && Array.isArray(data.workshops)) {
      allWorkshops = data.workshops;
    } else if (data && data.data && Array.isArray(data.data)) {
      allWorkshops = data.data;
    } else {
      console.warn('Unexpected data structure:', data);
      return { upcoming: [], completed: [] };
    }
    
    // Validate that we have an array
    if (!Array.isArray(allWorkshops)) {
      console.error('Expected array but got:', typeof allWorkshops, allWorkshops);
      return { upcoming: [], completed: [] };
    }
    
    // Separate workshops by status
    const upcoming = allWorkshops.filter(w => 
      w && w.status && (w.status === 'pending' || w.status === 'approved' || w.status === 'upcoming')
    );
    const completed = allWorkshops.filter(w => 
      w && w.status && w.status === 'completed'
    );
    
    console.log(`Found ${upcoming.length} upcoming and ${completed.length} completed workshops`);
    return { upcoming, completed };
    
  } catch (error) {
    console.error('Error fetching workshops:', error);
    return { upcoming: [], completed: [] };
  }
};

// Update workshop status (approve/decline)
const updateWorkshopStatus = async (workshopId: string, status: 'approved' | 'declined'): Promise<boolean> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/workshops/${workshopId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update workshop status');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating workshop status:', error);
    return false;
  }
};

// Update workshop details
const updateWorkshop = async (workshopId: string, workshopData: Partial<Workshop>): Promise<boolean> => {
  try {
   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/workshops/${workshopId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workshopData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update workshop');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating workshop:', error);
    return false;
  }
};

// Update workshop summary
const updateWorkshopSummary = async (workshopId: string, summaryData: WorkshopSummary): Promise<boolean> => {
  try {
   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/workshops/${workshopId}/summary`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ summary: summaryData, hasSummary: true }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update workshop summary');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating workshop summary:', error);
    return false;
  }
};


  const statistics = {
    graphics: 85,
    theme: 65,
    template: 50
  };
const [workshops, setWorkshops] = useState<{ upcoming: Workshop[], completed: Workshop[] }>({
  upcoming: [],
  completed: []
});


  const menuItems = [
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: BookOpen },
    { id: 'workshops', label: 'Workshops', icon: Calendar },
    { id: 'ranking', label: 'My Ranking', icon: Trophy },
    { id: 'statistics', label: 'Statistics', icon: TrendingUp },
  ];

  const settingsItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];
useEffect(() => {
  const loadWorkshops = async () => {
    const workshopData = await fetchWorkshops();
    setWorkshops(workshopData);
  };
  
  loadWorkshops();
}, []);

  // Workshop functions
const handleApproveWorkshop = async (workshopId: string) => {
  const workshop = workshops.upcoming.find(w => w._id === workshopId);
  if (workshop) {
    const mongoId = workshop._id || workshop.id?.toString() || '';
    const success = await updateWorkshopStatus(mongoId, 'approved');
    
    if (success) {
      // Update local state
      const updatedUpcoming = workshops.upcoming.map(w => w._id === workshopId ? { ...w, status: 'approved' } : w
      );
      
      setWorkshops(prev => ({
  ...prev,
  upcoming: updatedUpcoming.map(w => ({
    ...w,
    status: w.status as "upcoming" | "completed" | "pending" | "approved" | "declined"
  }))
}));

      // Simulate sending email
      try {
        console.log(`Sending approval email to ${workshop.contact.email}`);
        alert(`Workshop "${workshop.title}" approved successfully! 
Approval email sent to: ${workshop.speaker.name} (${workshop.contact.email})`);
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Workshop approved but failed to send email notification.');
      }
    } else {
      alert('Failed to approve workshop. Please try again.');
    }
  }
};
const handleDeclineWorkshop = async (workshopId: string) => {
  const workshop = workshops.upcoming.find(w => w._id === workshopId);
  if (workshop) {
    const mongoId = workshop._id || workshop.id?.toString() || '';
    const success = await updateWorkshopStatus(mongoId, 'declined');
    
    if (success) {
      const updatedUpcoming = workshops.upcoming.map(w => w._id === workshopId? { ...w, status: 'declined' } : w
      );
      
   setWorkshops(prev => ({
  ...prev,
  upcoming: updatedUpcoming.map(w => ({
    ...w,
    status: w.status as "upcoming" | "completed" | "pending" | "approved" | "declined"
  }))
}));
      // Simulate sending decline email
      try {
        console.log(`Sending decline notification to ${workshop.contact.email}`);
        alert(`Workshop "${workshop.title}" declined. 
Notification sent to: ${workshop.speaker.name} (${workshop.contact.email})`);
      } catch (error) {
        console.error('Error sending decline notification:', error);
      }
    } else {
      alert('Failed to decline workshop. Please try again.');
    }
  }
};
const handleSummarizeWorkshop = (workshop: Workshop) => {
  setSelectedWorkshop(workshop);
  setWorkshopSummary(workshop.summary || { students: '', budget: '', summary: '', photos: [] });
  setUploadedFiles([]);
  setShowSummaryModal(true);
  setIsMarkingCompleted(false); // This is for existing completed workshops
}
const handleMarkCompleted = (workshop: Workshop) => {
  setSelectedWorkshop(workshop);
  setWorkshopSummary({ students: '', budget: '', summary: '', photos: [] });
  setUploadedFiles([]);
  setShowSummaryModal(true);
  setIsMarkingCompleted(true); // Add this state variable
};
const handleSaveWorkshop = async () => {
  if (!editingWorkshop) return;
  
  const mongoId = editingWorkshop._id || editingWorkshop.id?.toString() || '';
  const success = await updateWorkshop(mongoId, editingWorkshop);
  
  if (success) {
    const updatedUpcoming = workshops.upcoming.map(w => 
      (w.id || parseInt(w._id || '0')) === (editingWorkshop.id || parseInt(editingWorkshop._id || '0')) 
        ? { ...editingWorkshop } : w
    );
    
    setWorkshops(prev => ({
      ...prev,
      upcoming: updatedUpcoming
    }));
    
    setEditingWorkshop(null);
    setShowWorkshopDetails(false);
    alert('Workshop details updated successfully!');
  } else {
    alert('Failed to update workshop details. Please try again.');
  }
};
interface Student {
  _id: string;
  name: string;
  roll_number: string;
  college: string;
  degree: string;
  stream: string;
  semester: number;
  enrollment_year: number;
  passout_year: number;
  subjects: string[];
  backlogs: number;
  average_cgpa: number;
  status: string;
  total_marks: number;
  pending_fees: number;
  attendance: number;
  dob: string;
  mobile: string;
  email: string;
  city: string;
  gender: string;
  profile_image: string;
  resume: string[];
  skills: string[];
  projects: string[];
  posts: Array<{
    title: string;
    content: string;
    date: string;
    description: string;
  }>;
  certificates: Array<{
    title: string;
    description: string;
    issue_date: string;
    credential_id: string;
  }>;
  internships: Array<{
    title: string;
    description: string;
    date: string;
  }>;
}



interface CollegeStream {
  departments: string[];
}

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  // Mock college info - replace with your actual data
  const collegeStream: CollegeStream = {
    departments: ['Computer Science', 'Leather Technology', 'Information Technology']
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

  const mongoId = selectedWorkshop._id || selectedWorkshop.id?.toString() || '';
  
  // If marking as completed, update status to completed
  if (isMarkingCompleted) {
    const updateData = {
      status: 'completed' as const,
      summary: summaryData,
      hasSummary: true
    };
    
    const success = await updateWorkshop(mongoId, updateData);
    
    if (success) {
      // Move workshop from upcoming to completed
      const updatedUpcoming = workshops.upcoming.filter(w => 
        (w.id || parseInt(w._id || '0')) !== (selectedWorkshop.id || parseInt(selectedWorkshop._id || '0'))
      );
      
      const completedWorkshop = {
        ...selectedWorkshop,
        status: 'completed' as const,
        summary: summaryData,
        hasSummary: true
      };
       setWorkshops(prev => ({
        upcoming: updatedUpcoming,
        completed: [...prev.completed, completedWorkshop]
      }));
      
      setShowSummaryModal(false);
      setWorkshopSummary({ students: '', budget: '', summary: '', photos: [] });
      setUploadedFiles([]);
      setIsMarkingCompleted(false);
      alert('Workshop marked as completed and summary saved successfully!');
    } else {
      alert('Failed to mark workshop as completed. Please try again.');
    }
  } else {
    // Regular summary update for already completed workshops
    const success = await updateWorkshopSummary(mongoId, summaryData);
    
    if (success) {
      const updatedCompleted = workshops.completed.map(w => 
        (w.id || parseInt(w._id || '0')) === (selectedWorkshop.id || parseInt(selectedWorkshop._id || '0')) 
          ? { ...w, summary: summaryData, hasSummary: true } : w
      );
      
      setWorkshops(prev => ({
        ...prev,
        completed: updatedCompleted
      }));
      
      setShowSummaryModal(false);
      setWorkshopSummary({ students: '', budget: '', summary: '', photos: [] });
      setUploadedFiles([]);
      alert('Workshop summary saved successfully!');
    } else {
      alert('Failed to save workshop summary. Please try again.');
    }
  }
};
const fetchStudentsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/college/students', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("Students data", data);
        setStudents(data.students || []);
      } else {
        console.error('Error fetching students:', data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  // Get students by department
  const getStudentsByDepartment = (department: string) => {
    return students.filter(student => 
      student.stream.toLowerCase().includes(department.toLowerCase()) || 
      department.toLowerCase().includes(student.stream.toLowerCase())
    );
  };

  // Handle department selection
  const handleDepartmentClick = (department: string) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  // Handle student selection
  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };
const handleEditWorkshop = (workshop: Workshop) => {
  setEditingWorkshop({ ...workshop });
  setSelectedWorkshop(workshop);
  setShowWorkshopDetails(true);
};

const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  // Remove uploaded file

const removeUploadedFile = (index: number) => {
  const newFiles = uploadedFiles.filter((_, i) => i !== index);
  setUploadedFiles(newFiles);
  setWorkshopSummary(prev => ({
    ...prev,
    photos: newFiles.map(f => f.name)
  }));
};
const renderHomePage = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-6">
    <div className="max-w-7xl mx-auto">
      {/* Main College Card - Minimalist & Spacious */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-xl -mt-16">
        
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 opacity-80"></div>
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-800/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-cyan-800/20 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center min-h-[500px]">
            
            {/* Left Content Section - Takes 3/5 of the space */}
            <div className="lg:col-span-3 space-y-12">
              
              {/* Header Section */}
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                  <span className="text-blue-300 text-sm font-medium">Excellence Since 1919</span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  Government College of
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Engineering and Leather Technology
                  </span>
                </h1>
                
                <p className="text-sm text-blue-100 leading-relaxed max-w-2xl">
                 Pioneer in the field of education and research on Leather Technology was originally started under the name ‘Calcutta Research Tannery’ in year 1919.
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-white">15K+</div>
                  <div className="text-blue-300 text-sm">Students</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-white">3</div>
                  <div className="text-blue-300 text-sm">Departments</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-white">85%</div>
                  <div className="text-blue-300 text-sm">Placement</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold text-white">50</div>
                  <div className="text-blue-300 text-sm">Faculties</div>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white">Why Choose Us</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-white">Academic Excellence</h4>
                      <p className="text-blue-200 text-sm">World-class faculty and cutting-edge curriculum</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-white">Industry Connect</h4>
                      <p className="text-blue-200 text-sm">Strong partnerships with leading organizations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-white">Research Focus</h4>
                      <p className="text-blue-200 text-sm">Innovation-driven learning environment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-white">Global Exposure</h4>
                      <p className="text-blue-200 text-sm">International exchange programs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Information */}
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <p className="text-blue-200 text-xs">
                    <span className="font-medium text-white">Admissions Open:</span> Applications for 2025-26 academic year now being accepted
                  </p>
                  <p className="text-blue-200 text-xs">
                    <span className="font-medium text-white">Campus Address:</span> Block - LB 11, Sector-III, Salt Lake, Kolkata-700106, India
                  </p>
                  <p className="text-blue-200 text-xs">
                    <span className="font-medium text-white">Contact:</span>  +91 33 23356977 | principal@gcelt.gov.in
                  </p>
                  <p className="text-blue-200 text-xs">
                    <span className="font-medium text-white">Visit Hours:</span> Monday to Friday, 9:00 AM   - 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image Section - Takes 2/5 of the space */}
            <div className="lg:col-span-2 relative flex items-center justify-center">
              <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
                
                {/* Irregular Gradient Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Multiple irregular shapes for complex background */}
                  <div className="absolute w-80 h-80 bg-gradient-to-br from-orange-500/30 to-red-500/20 rounded-full blur-2xl transform -rotate-12 -translate-x-8"></div>
                  <div className="absolute w-64 h-96 bg-gradient-to-tr from-purple-500/25 to-pink-500/20 rounded-full blur-3xl transform rotate-45 translate-x-12 translate-y-8"></div>
                  <div className="absolute w-72 h-60 bg-gradient-to-bl from-blue-500/20 to-cyan-500/25 rounded-full blur-2xl transform -rotate-30 translate-y-16"></div>
                  <div className="absolute w-56 h-80 bg-gradient-to-tl from-yellow-500/20 to-orange-500/15 rounded-full blur-3xl transform rotate-60 -translate-x-16 -translate-y-8"></div>
                </div>

                {/* Large PNG Image - Extends beyond background */}
                <div className="relative z-10 w-full h-full flex items-center justify-center -translate-y-28 -translate-x-2">
                  <img 
                    src="college.png" 
                    alt="St. Xavier's College Building" 
                    className="w-full max-w-lg h-auto object-contain drop-shadow-2xl transform scale-[1.5]"
                
                  />
                </div>

                {/* Additional decorative elements */}
                <div className="absolute top-8 right-8 w-4 h-4 bg-cyan-400 rounded-full opacity-80"></div>
                <div className="absolute bottom-12 left-12 w-6 h-6 bg-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute top-1/3 left-8 w-3 h-3 bg-green-400 rounded-full opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
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
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditWorkshop(workshop)}
                  className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                  title="Edit Workshop"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {workshop.status === 'approved' && (
                  <button
                    onClick={() => handleMarkCompleted(workshop)}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    title="Mark as Completed"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {workshop.status === 'upcoming' && (
                  <>
                    <button
                      onClick={() => handleApproveWorkshop(workshop._id!)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeclineWorkshop(workshop._id!)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      title="Decline"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {workshops.upcoming.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No upcoming workshops found.</p>
          </div>
        )}
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
                  {workshop.summary && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{workshop.summary.students} students attended</span>
                    </div>
                  )}
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
                  {workshop.hasSummary ? 'View/Edit Summary' : 'Add Summary'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {workshops.completed.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No completed workshops found.</p>
          </div>
        )}
      </div>
    </div>
    
    {/* Summary Modal */}
    {showSummaryModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isMarkingCompleted ? 'Complete Workshop & Add Summary' : 'Workshop Summary'}
              </h3>
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setIsMarkingCompleted(false);
                  setWorkshopSummary({ students: '', budget: '', summary: '', photos: [] });
                  setUploadedFiles([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {selectedWorkshop && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{selectedWorkshop.title}</h4>
                <p className="text-gray-600">Speaker: {selectedWorkshop.speaker.name}</p>
                <p className="text-gray-600">Date: {new Date(selectedWorkshop.date).toLocaleDateString()}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    value={workshopSummary.students}
                    onChange={(e) => setWorkshopSummary(prev => ({ ...prev, students: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onChange={(e) => setWorkshopSummary(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter budget amount"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workshop Summary
                </label>
                <textarea
                  value={workshopSummary.summary}
                  onChange={(e) => setWorkshopSummary(prev => ({ ...prev, summary: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter workshop summary, key learnings, feedback, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <button
                          onClick={() => removeUploadedFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setIsMarkingCompleted(false);
                  setWorkshopSummary({ students: '', budget: '', summary: '', photos: [] });
                  setUploadedFiles([]);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSummary}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isMarkingCompleted ? 'Complete Workshop' : 'Save Summary'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
const StudentDetailModal = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
      {/* Header with gradient background */}
      
      {selectedStudent && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-white/20 overflow-hidden bg-white/10">
              
                <img
                  src={selectedStudent.profile_image}
                  alt={selectedStudent.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${selectedStudent.name}&background=ffffff&color=3b82f6&size=64`;
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                <p className="text-blue-100">Roll No: {selectedStudent.roll_number}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedStudent.status === 'Passout' ? 'bg-green-500 text-white' : 
                    selectedStudent.status === 'Active' ? 'bg-blue-500 text-white' : 
                    'bg-gray-500 text-white'
                  }`}>
                    {selectedStudent.status}
                  </span>
                  <span className="text-sm text-blue-100">
                    {selectedStudent.gender} • {selectedStudent.city}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowStudentDetail(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      
      {/* Scrollable content */}
      <div className="overflow-y-auto max-h-[calc(95vh-120px)] p-8">
        {selectedStudent && (
          <div className="space-y-8">
            {/* Academic Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-900">CGPA</span>
                </div>
                <p className="text-3xl font-bold text-blue-700">{selectedStudent.average_cgpa}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-green-900">Attendance</span>
                </div>
                <p className="text-3xl font-bold text-green-700">{selectedStudent.attendance}%</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-600 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-yellow-900">Backlogs</span>
                </div>
                <p className="text-3xl font-bold text-yellow-700">{selectedStudent.backlogs}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-purple-900">Total Marks</span>
                </div>
                <p className="text-3xl font-bold text-purple-700">{selectedStudent.total_marks}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal & Academic Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Email</p>
                        <p className="font-semibold text-gray-900">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Mobile</p>
                        <p className="font-semibold text-gray-900">{selectedStudent.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Date of Birth</p>
                        <p className="font-semibold text-gray-900">{new Date(selectedStudent.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">City</p>
                        <p className="font-semibold text-gray-900">{selectedStudent.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    Academic Details
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Stream</p>
                        <p className="font-semibold text-gray-900">{selectedStudent.stream}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <BookOpen className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Degree</p>
                        <p className="font-semibold text-gray-900">{selectedStudent.degree}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Academic Year</p>
                        <p className="font-semibold text-gray-900">{selectedStudent.enrollment_year} - {selectedStudent.passout_year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <BookOpen className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Current Semester</p>
                        <p className="font-semibold text-gray-900">{selectedStudent.semester}</p>
                      </div>
                    </div>
                    {selectedStudent.pending_fees > 0 && (
                      <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm text-red-700 font-medium">Pending Fees</p>
                          <p className="font-semibold text-red-800">₹{selectedStudent.pending_fees}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills & Projects */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-200 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    Projects
                  </h4>
                  <div className="space-y-3">
                    {selectedStudent.projects.map((project, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <p className="font-semibold text-gray-900">{project}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-yellow-600 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    Certificates ({selectedStudent.certificates.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedStudent.certificates.slice(0, 3).map((cert, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                        <p className="font-semibold text-green-900">{cert.title}</p>
                        <p className="text-sm text-gray-700 mt-2">{cert.description.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-600 mt-3 font-medium">
                          Issued: {new Date(cert.issue_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {selectedStudent.certificates.length > 3 && (
                      <div className="text-center">
                        <span className="text-sm text-gray-600 bg-gray-200 px-4 py-2 rounded-full">
                          +{selectedStudent.certificates.length - 3} more certificates
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-pink-600 rounded-lg">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    Internships ({selectedStudent.internships.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedStudent.internships.map((internship, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                        <p className="font-semibold text-purple-900">{internship.title}</p>
                        <p className="text-sm text-gray-700 mt-2">{internship.description.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-600 mt-3 font-medium">
                          Date: {new Date(internship.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-teal-600 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                Subjects
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {selectedStudent.subjects.map((subject, index) => (
                  <div key={index} className="px-4 py-3 bg-white text-gray-800 rounded-lg text-sm text-center border border-gray-200 hover:shadow-md transition-shadow font-medium">
                    {subject}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Students List Modal
const StudentsListModal = () => {
  const departmentStudents = getStudentsByDepartment(selectedDepartment);
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {selectedDepartment} Students
              </h2>
              <p className="text-indigo-100 mt-1">
                {departmentStudents.length} student{departmentStudents.length !== 1 ? 's' : ''} enrolled
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(85vh-120px)]">
          {departmentStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">No students found in this department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentStudents.map((student) => (
                <div
                  key={student._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleStudentClick(student)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-blue-300 transition-all">
                      <img
                        src={student.profile_image}
                        alt={student.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${student.name}&background=3b82f6&color=fff&size=56`;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{student.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{student.roll_number}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600 truncate">{student.email}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold text-blue-700">CGPA: {student.average_cgpa}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'Passout' ? 'bg-green-100 text-green-800' : 
                        student.status === 'Active' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-600">Attendance: {student.attendance}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs text-gray-600">Backlogs: {student.backlogs}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const renderStudents = () => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    {/* Header Section */}
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Student Directory</h3>
              <p className="text-indigo-100 mt-1">Explore students across all departments</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium">
              {collegeInfo.departments.reduce((total, dept) => total + getStudentsByDepartment(dept).length, 0)} Total Students
            </span>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
    </div>

    {/* Content Section */}
    <div className="p-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">Loading Student Data</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the information...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {collegeInfo.departments.map((dept, index) => {
            const departmentStudentCount = getStudentsByDepartment(dept).length;
            const colors = [
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-pink-500', 
              'from-green-500 to-emerald-500',
              'from-orange-500 to-red-500',
              'from-indigo-500 to-purple-500',
              'from-teal-500 to-green-500'
            ];
            const bgColors = [
              'bg-gradient-to-br from-blue-50 to-cyan-50',
              'bg-gradient-to-br from-purple-50 to-pink-50',
              'bg-gradient-to-br from-green-50 to-emerald-50', 
              'bg-gradient-to-br from-orange-50 to-red-50',
              'bg-gradient-to-br from-indigo-50 to-purple-50',
              'bg-gradient-to-br from-teal-50 to-green-50'
            ];
            const iconColors = [
              'text-blue-600',
              'text-purple-600',
              'text-green-600',
              'text-orange-600', 
              'text-indigo-600',
              'text-teal-600'
            ];
            
            return (
              <div 
                key={index} 
                className={`${bgColors[index % bgColors.length]} rounded-2xl p-6 border border-white/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer relative overflow-hidden`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/30 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 bg-gradient-to-r ${colors[index % colors.length]} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Users className="w-4 h-4" />
                        <span>Students</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{departmentStudentCount}</div>
                    </div>
                  </div>

                  {/* Department Name */}
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {dept}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Total: {departmentStudentCount} seats
                  </p>

                 

                  {/* Action Button */}
                  <button
                    onClick={() => handleDepartmentClick(dept)}
                    className={`w-full bg-gradient-to-r ${colors[index % colors.length]} text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group`}
                  >
                    <span>Explore Students</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">({departmentStudentCount})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Stats Bar */}
      {!isLoading && (
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {collegeInfo.departments.length}
              </div>
              <div className="text-sm text-gray-300 mt-1">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {collegeInfo.departments.reduce((total, dept) => total + getStudentsByDepartment(dept).length, 0)}
              </div>
              <div className="text-sm text-gray-300 mt-1">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">100%</div>
              <div className="text-sm text-gray-300 mt-1">Active Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">24/7</div>
              <div className="text-sm text-gray-300 mt-1">Support Available</div>
            </div>
          </div>
        </div>
      )}
    </div>
    
    {/* Modals */}
    {showModal && <StudentsListModal />}
    {showStudentDetail && <StudentDetailModal />}
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
      case 'students': return renderStudents();
      case 'workshops': return renderWorkshops();
      // case 'ranking': return renderRanking();
      case 'statistics': return renderStatistics();
      case 'home': return renderHomePage();
      default: return renderDashboard();
    }
  };

  return (
       <div className="min-h-screen bg-gray-50">
      {/* Header - Full width at the top */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 w-full">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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

                <span className="text-2xl font-semibold text-gray-800 tracking-wide">
                  <span className="font-bold bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent">Campus</span>{' '}
                  <span className="font-bold text-gray-900">Konnect</span>
                </span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                College Portal
              </Badge>
            </div>
              
            <div className="flex items-center space-x-3">
              <nav className="flex items-center space-x-4">
                <a 
                  href="/posts"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 hover:text-blue-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-200 group"
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  <span>Posts</span>
                </a>
                
                <button
                  onClick={() => {
                    localStorage.removeItem('college');
                    localStorage.removeItem('student'); 
                    localStorage.removeItem('company');
                    window.location.href="/"
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 hover:text-red-700 font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-red-100 hover:border-red-200 group"
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span>Logout</span>
                </button>
              </nav>
            
              
            </div>
          </div>
        </div>
      </header>
       
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col min-h-[calc(100vh-80px)]">
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
      <div className="flex-1 flex flex-row">
        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="grid grid-rows-1 lg:grid-rows-6 gap-6">
            {/* Main Content */}
            <div className="lg:row-span-4">
              {renderContent()}
            </div>

         
          </div>
        </main>
      </div>
{/*}
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
                          onClick={() => selectedWorkshop._id !== undefined && handleDeclineWorkshop(selectedWorkshop._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </button>
                        <button
                          onClick={() => selectedWorkshop._id !== undefined && handleApproveWorkshop(selectedWorkshop._id)}
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
       </div>
)}
export default CollegeDashboard;
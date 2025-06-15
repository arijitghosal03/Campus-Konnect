import { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Briefcase, 
  Star, 
  Eye,
  TrendingUp,
  Users,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Badge,
  GraduationCap,
  Building2
} from "lucide-react";
import Link from "next/link";
const Posts = () => {
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

interface UserInfo {
    name: string;
    title: string;
    college: string;
    location: string;
    avatar: string;
    connections: string;
    verified: boolean;
}

interface CertificateInfo {
    issuer: string;
    credentialId: string;
    validUntil?: string;
    completionDate?: string;
}

interface BlogStats {
    readTime: string;
    views: string;
    shares: number;
}

interface Metrics {
    views: number;
    impressions: number;
}

interface PostContent {
    title: string;
    description: string;
    fullDescription: string;
    tags: string[];
    image?: string;
    metrics: Metrics;
    certificate?: CertificateInfo;
    techStack?: string[];
    blogStats?: BlogStats;
}

type PostType = "achievement" | "certificate" | "professional" | "blog";

interface Post {
    id: number;
    type: PostType;
    user: UserInfo;
    timestamp: string;
    content: PostContent;
}

const toggleExpanded = (postId: number) => {
    const newExpanded = new Set<number>(expandedPosts);
    if (newExpanded.has(postId)) {
        newExpanded.delete(postId);
    } else {
        newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
};

  const posts = [
    {
      id: 1,
      type: "achievement",
      user: {
        name: "Arijit Ghosal",
        title: "Full Stack AI Developer",
        college: "Government College of Engineering & Leather Technology",
        location: "Kolkata, West Bengal",
        avatar: "AG",
        connections: "500+",
        verified: true
      },
      timestamp: "2 hours ago",
      content: {
        title: "🏆 Secured 1st Position in National Coding Championship 2025",
        description: "Thrilled to announce that I've won the National Coding Championship organized by TechIndia! Competed against 10,000+ developers nationwide and solved complex algorithmic challenges. This achievement wouldn't have been possible without the constant support of my mentors and peers.",
        fullDescription: "The competition spanned over 3 days with multiple rounds including data structures, algorithms, system design, and a final coding marathon. I'm grateful for this opportunity to showcase my skills and connect with amazing developers from across the country. Special thanks to my college professors who guided me throughout my preparation journey.",
        tags: ["#Coding", "#Achievement", "#TechIndia", "#CompetitiveProgramming"],
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop",
        metrics: {
          views: 1247,
          impressions: 3420
        }
      }
    },
    {
      id: 2,
      type: "certificate",
      user: {
        name: "Shehnaz Islam",
        title: "Final Year IT Student",
        college: "Government College of Engineering & Leather Technology, Kolkata",
        location: "Durgapur, West Bengal",
        avatar: "S",
        connections: "750+",
        verified: true
      },
      timestamp: "5 hours ago",
      content: {
        title: "📜 AWS Solutions Architect Professional Certification Achieved!",
        description: "Just cleared the AWS Solutions Architect Professional exam with a score of 890/1000! This certification validates my expertise in designing distributed applications and systems on AWS platform.",
        fullDescription: "After 3 months of intensive preparation, I've successfully earned this prestigious certification. The journey involved hands-on labs, real-world projects, and deep diving into AWS services. This certification opens up exciting opportunities in cloud architecture and I'm looking forward to applying these skills in upcoming projects. Next target: Azure Solutions Architect Expert!",
        tags: ["#AWS", "#CloudComputing", "#Certification", "#SolutionsArchitect"],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
        certificate: {
          issuer: "Amazon Web Services",
          credentialId: "AWS-SA-PRO-2025-001234",
          validUntil: "March 2028"
        },
        metrics: {
          views: 892,
          impressions: 2156
        }
      }
    },
    {
      id: 3,
      type: "professional",
      user: {
        name: "Sayantan Dam",
        title: "Frontend Developer ",
        college: "Government College of Engineering & Leather Technology, Kolkata",
        location: "Kolkata, West Bengal",
        avatar: "SD",
        connections: "1200+",
        verified: true
      },
      timestamp: "1 day ago",
      content: {
        title: "🚀 Building the Future: My Journey with AI and Machine Learning",
        description: "Sharing insights from my recent project on implementing transformer models for natural language processing. The intersection of AI and real-world applications continues to amaze me every day.",
        fullDescription: "Over the past 6 months, I've been working on a groundbreaking NLP project that processes multilingual content with 95% accuracy. The project involved implementing custom transformer architectures, fine-tuning BERT models, and deploying scalable solutions using Kubernetes. Key achievements include: 40% improvement in processing speed, support for 12+ languages, and successful deployment handling 1M+ requests daily. The learning curve was steep, but the results speak for themselves. Excited to open-source this project soon!",
        tags: ["#AI", "#MachineLearning", "#NLP", "#Transformers", "#OpenSource"],
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=300&fit=crop",
        techStack: ["Python", "TensorFlow", "Kubernetes", "Docker", "AWS"],
        metrics: {
          views: 2341,
          impressions: 5670
        }
      }
    },
    {
      id: 4,
      type: "blog",
      user: {
        name: "Ramik Mukherjee",
        title: "Tech Blogger & Web3 Developer",
        college: "Government College of Engineering & Leather Technology, Kolkata",
        location: "Kolkata, West Bengal",
        avatar: "RM",
        connections: "900+",
        verified: true
      },
      timestamp: "2 days ago",
      content: {
        title: "✍️ The Complete Guide to React Performance Optimization",
        description: "Published a comprehensive guide covering advanced React optimization techniques that can improve your app performance by up to 70%. From memo to useMemo, lazy loading to code splitting - everything you need to know!",
        fullDescription: "This 15-minute read covers practical optimization strategies I've learned while building production applications. Topics include: React.memo and when to use it, useMemo vs useCallback, code splitting strategies, lazy loading implementations, bundle analysis techniques, and performance monitoring tools. Each section includes real-world examples and performance metrics. The guide has already helped 500+ developers optimize their applications. Available on my blog with interactive code examples and performance comparisons.",
        tags: ["#React", "#Performance", "#WebDevelopment", "#JavaScript", "#Frontend"],
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop",
        blogStats: {
          readTime: "15 min read",
          views: "2.3K",
          shares: 156
        },
        metrics: {
          views: 1876,
          impressions: 4320
        }
      }
    },
    {
      id: 5,
      type: "achievement",
      user: {
        name: "Nasir Hosen",
        title: "Data Science Enthusiast",
        college: "Government College of Engineering & Leather Technology, Kolkata",
        location: "Kolkata, West Bengal",
        avatar: "NS",
        connections: "650+",
        verified: false
      },
      timestamp: "3 days ago",
      content: {
        title: "🎯 Completed Google Data Analytics Professional Certificate",
        description: "Just finished the comprehensive 6-month Google Data Analytics program! Learned everything from data cleaning to advanced visualization techniques using R, SQL, and Tableau.",
        fullDescription: "This intensive program covered the entire data analytics workflow: Ask, Prepare, Process, Analyze, Share, and Act. Completed 8 courses with hands-on projects including: Customer segmentation analysis, Sales forecasting using time series, A/B testing for marketing campaigns, and building interactive dashboards. The capstone project involved analyzing e-commerce data to identify growth opportunities, resulting in actionable insights that could potentially increase revenue by 25%. Ready to apply these skills in real-world scenarios!",
        tags: ["#DataAnalytics", "#Google", "#R", "#SQL", "#Tableau", "#DataScience"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
        certificate: {
          issuer: "Google Career Certificates",
          credentialId: "GDAC-2025-VK789",
          completionDate: "March 2025"
        },
        metrics: {
          views: 734,
          impressions: 1890
        }
      }
    }
  ];

  const filteredPosts = posts.filter(post => 
    selectedFilter === "all" || post.type === selectedFilter
  );

  const getPostIcon = (type: PostType) => {
    switch (type) {
      case "achievement": return <Award className="text-yellow-500" size={20} />;
      case "certificate": return <Badge className="text-blue-500" size={20} />;
      case "professional": return <Briefcase className="text-purple-500" size={20} />;
      case "blog": return <BookOpen className="text-green-500" size={20} />;
      default: return <Star className="text-gray-500" size={20} />;
    }
  };

  const getTypeLabel = (type: PostType) => {
    switch (type) {
      case "achievement": return "Achievement";
      case "certificate": return "Certification";
      case "professional": return "Professional Update";
      case "blog": return "Blog Post";
      default: return "Update";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">
            GCELT Network
          </h1>
          <p className="text-gray-600 animate-fade-in-delay">
            Here are highlights of achievements, insights, and professional updates from our college community.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-2 animate-slide-up">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Posts", icon: <Users size={16} /> },
              { key: "achievement", label: "Achievements", icon: <Award size={16} /> },
              { key: "certificate", label: "Certificates", icon: <Badge size={16} /> },
              { key: "professional", label: "Professional", icon: <Briefcase size={16} /> },
              { key: "blog", label: "Blog Posts", icon: <BookOpen size={16} /> }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedFilter === filter.key
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:scale-102"
                }`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.slice(0, visiblePosts).map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {post.user.avatar}
                      </div>
                      {post.user.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star size={12} className="text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                          {post.user.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {getPostIcon(post.type as PostType)}
                          <span className="font-medium">{getTypeLabel(post.type as PostType)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium mb-1">{post.user.title}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <GraduationCap size={14} />
                          <span className="truncate max-w-xs">{post.user.college}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{post.user.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>{post.user.connections} connections</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 leading-tight">
                    {post.content.title}
                  </h2>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {expandedPosts.has(post.id) ? post.content.fullDescription : post.content.description}
                  </p>

                  {post.content.fullDescription.length > post.content.description.length && (
                    <button
                      onClick={() => toggleExpanded(post.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      {expandedPosts.has(post.id) ? (
                        <>Show less <ChevronUp size={16} /></>
                      ) : (
                        <>Show more <ChevronDown size={16} /></>
                      )}
                    </button>
                  )}

                  {/* Special Content Sections */}
                  {post.content.certificate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <Badge size={16} />
                        Certificate Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Issuer:</span>
                          <p className="font-medium">{post.content.certificate.issuer}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Credential ID:</span>
                          <p className="font-medium font-mono text-xs">{post.content.certificate.credentialId}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Valid Until:</span>
                          <p className="font-medium">{post.content.certificate.validUntil || post.content.certificate.completionDate}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {post.content.techStack && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Tech Stack Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.content.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {post.content.blogStats && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <BookOpen size={16} />
                        Blog Statistics
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-green-700">{post.content.blogStats.readTime}</p>
                          <p className="text-gray-600">Read Time</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-700">{post.content.blogStats.views}</p>
                          <p className="text-gray-600">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-700">{post.content.blogStats.shares}</p>
                          <p className="text-gray-600">Shares</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.content.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Post Image */}
              {post.content.image && (
                <div className="relative overflow-hidden group">
                  <img
                    src={post.content.image}
                    alt="Post content"
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              {/* Post Metrics */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{post.content.metrics.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} />
                      <span>{post.content.metrics.impressions.toLocaleString()} impressions</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    <ExternalLink size={14} />
                    View Full Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visiblePosts < filteredPosts.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisiblePosts(prev => prev + 3)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Load More Posts
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Posts;
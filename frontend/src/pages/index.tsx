import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

interface BlogPostProps {
  imgSrc: string;
  alt: string;
  title: string;
  description: string;
  date: string;
  readTime: number;
}

const BlogPost: React.FC<BlogPostProps> = ({ imgSrc, alt, title, description, date, readTime }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1">
    <div className="relative h-64 w-full">
      <Image
        src={imgSrc}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 hover:scale-105"
      />
    </div>
    <div className="p-6">
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{readTime} min read</span>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
      <button className="flex items-center gap-2 text-[#1B4242] font-medium hover:text-[#2d6363] transition-colors">
        Read More <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

const Carousel: React.FC<{ posts: BlogPostProps[] }> = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 3;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentPosts = posts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post, index) => (
          <BlogPost key={index} {...post} />
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={prevPage}
          className="p-2 rounded-full bg-[#1B4242] text-white hover:bg-[#2d6363] transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentPage === index ? 'bg-[#1B4242]' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextPage}
          className="p-2 rounded-full bg-[#1B4242] text-white hover:bg-[#2d6363] transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  useEffect(()=>{
    const student = localStorage.getItem("student")
    const college = localStorage.getItem("college")
    const company = localStorage.getItem("company")
    if(student || college || company){
      setIsLoggedIn(true)
    }
  },[])
  const blogPosts = [
    {
      imgSrc: "/1.jpg",
      alt: "Blog Post 1",
      title: "Getting Started with Your Journey",
      description: "This is the description for the first image. Add more detailed content here to make it more engaging and informative for your readers.",
      date: "Dec 27, 2024",
      readTime: 5
    },
    {
      imgSrc: "/2.jpg",
      alt: "Blog Post 2",
      title: "Exploring New Possibilities",
      description: "This is the description for the second image. Make sure to provide valuable insights and interesting perspectives in your blog posts.",
      date: "Dec 26, 2024",
      readTime: 4
    },
    {
      imgSrc: "/3.jpg",
      alt: "Blog Post 3",
      title: "Advanced Techniques and Tips",
      description: "This is the description for the third image. Share your expertise and help others learn from your experience.",
      date: "Dec 25, 2024",
      readTime: 6
    },
    {
      imgSrc: "/4.jpg",
      alt: "Blog Post 4",
      title: "Future of Technology",
      description: "Discover the latest trends and innovations shaping the future of technology and digital transformation.",
      date: "Dec 24, 2024",
      readTime: 7
    },
    {
      imgSrc: "/5.jpg",
      alt: "Blog Post 5",
      title: "Best Practices Guide",
      description: "Learn about industry best practices and how to implement them effectively in your projects.",
      date: "Dec 23, 2024",
      readTime: 5
    },
    {
      imgSrc: "/white.png",
      alt: "Blog Post 6",
      title: "Innovation Insights",
      description: "Explore innovative solutions and breakthrough technologies transforming the industry landscape.",
      date: "Dec 22, 2024",
      readTime: 8
    },
    {
      imgSrc: "/white.png",
      alt: "Blog Post 7",
      title: "Digital Transformation",
      description: "Understanding the key aspects of digital transformation and its impact on modern businesses.",
      date: "Dec 21, 2024",
      readTime: 6
    },
    {
      imgSrc: "/white.png",
      alt: "Blog Post 8",
      title: "Success Stories",
      description: "Real-world success stories and case studies showcasing exceptional achievements and learnings.",
      date: "Dec 20, 2024",
      readTime: 5
    },
    {
      imgSrc: "/white.png",
      alt: "Blog Post 9",
      title: "Industry Trends",
      description: "Stay ahead of the curve with insights into the latest industry trends and developments.",
      date: "Dec 19, 2024",
      readTime: 7
    },
    {
      imgSrc: "/white.png",
      alt: "Blog Post 10",
      title: "Expert Insights",
      description: "In-depth analysis and expert perspectives on crucial topics and emerging technologies.",
      date: "Dec 18, 2024",
      readTime: 6
    },
    {
      imgSrc: "/white.png",
      alt: "Blog Post 10",
      title: "Expert Insights",
      description: "In-depth analysis and expert perspectives on crucial topics and emerging technologies.",
      date: "Dec 18, 2024",
      readTime: 6
    },
    {
      imgSrc: "/white.png",
      alt: "Blog Post 10",
      title: "Expert Insights",
      description: "In-depth analysis and expert perspectives on crucial topics and emerging technologies.",
      date: "Dec 18, 2024",
      readTime: 6
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/api/placeholder/1920/1080"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B4242]/10 to-[#1B4242]/20" />
      </div>

      <header className="bg-[#1B4242] shadow-md relative z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="relative w-32 h-8">
        <Image
          src="/sar.png"
          alt="SARSS Logo"
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
      </div>
      <nav className="flex gap-8 items-center">
        {!isLoggedIn && <Link href="/login">
          <div className="text-white hover:text-gray-200 transition-colors font-medium">
            Login
          </div>
        </Link>}
        <Link href="/about">
          <div className="text-white hover:text-gray-200 transition-colors font-medium">
            About Us
          </div>
        </Link>
        {/* Logout Button */}
        {isLoggedIn && <button
          onClick={() => {
            localStorage.removeItem('college');
            localStorage.removeItem('student'); 
            localStorage.removeItem('company');  // Clear login info
            window.location.href="/"
          }}
          className="text-white hover:text-gray-200 transition-colors font-medium"
        >
          Logout
        </button>}
      </nav>
    </div>
  </div>
</header>


      <main className="flex-1 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Latest Updates</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Stay informed with our latest news, updates, and insights
            </p>
          </div>

          <Carousel posts={blogPosts} />
        </div>
      </main>

      <footer className="bg-[#1B4242] text-white py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2025 GCELT All Rights Reserved.</p>
            <p className="text-sm">Developed & Maintained by Campus Konnect</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
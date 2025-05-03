import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Briefcase, Users, BarChart2, Clock, ChevronLeft, ChevronRight, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Create context for carousel navigation
interface CarouselContextType {
  currentIndex: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

const CarouselContext = createContext<CarouselContextType | null>(null);

// Liquid Background Animation Component
const LiquidBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,0 L100,0 L100,100 L0,100 Z"
            fill="url(#gradient)"
            initial={{ d: "M0,0 L100,0 L100,100 L0,100 Z" }}
            animate={{
              d: [
                "M0,0 L100,0 L100,100 L0,100 Z",
                "M0,0 L100,0 L95,100 L5,100 Z",
                "M0,0 L100,0 L90,100 L10,100 Z",
                "M0,0 L100,0 L95,100 L5,100 Z",
                "M0,0 L100,0 L100,100 L0,100 Z"
              ]
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#000000" }} />
              <stop offset="100%" style={{ stopColor: "#000000" }} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute rounded-full bg-[#FF6B00] blur-3xl"
            style={{ width: '40%', height: '40%', left: '10%', top: '30%' }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full bg-[#FF8C00] blur-3xl"
            style={{ width: '35%', height: '35%', right: '10%', bottom: '20%' }}
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Bubble animation for the feature cards
const BubbleEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="relative overflow-hidden h-full"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-[#FF6B00] rounded-b-lg opacity-0"
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
};

// Projects data from GitHub repositories
const repositories = [
  { 
    name: "client_management_project", 
    description: "A comprehensive client management system built with TypeScript and React.",
    language: "TypeScript",
    url: "https://github.com/sairosthedev/client_management_project"
  },
  { 
    name: "alamait_backend", 
    description: "Backend system developed in JavaScript.",
    language: "JavaScript",
    url: "https://github.com/sairosthedev/alamait_backend"
  },
  { 
    name: "client-segmentation", 
    description: "Client segmentation analysis using data science techniques.",
    language: "Jupyter Notebook",
    url: "https://github.com/sairosthedev/client-segmentation"
  },
  { 
    name: "camp-meeting", 
    description: "Event management application for camp meetings.",
    language: "TypeScript",
    url: "https://github.com/sairosthedev/camp-meeting"
  },
  { 
    name: "farm", 
    description: "Farm management system for tracking crops and livestock.",
    language: "TypeScript",
    url: "https://github.com/sairosthedev/farm"
  },
  { 
    name: "student-accommodation", 
    description: "Platform for managing student housing and accommodation.",
    language: "JavaScript",
    url: "https://github.com/sairosthedev/student-accommodation"
  },
  { 
    name: "logistics", 
    description: "Logistics and supply chain management application.",
    language: "JavaScript",
    url: "https://github.com/sairosthedev/logistics"
  },
  { 
    name: "SaaS_finance", 
    description: "Financial management tools for SaaS businesses.",
    language: "TypeScript",
    url: "https://github.com/sairosthedev/SaaS_finance"
  },
  { 
    name: "dial-a-mbare", 
    description: "Transportation booking and management system.",
    language: "JavaScript",
    url: "https://github.com/sairosthedev/dial-a-mbare"
  },
  { 
    name: "bookstore_backend", 
    description: "Backend API for a bookstore application.",
    language: "JavaScript",
    url: "https://github.com/sairosthedev/bookstore_backend"
  }
];

// Project Carousel Component
const ProjectCarousel = () => {
  // Use the carousel context
  const carouselContext = useContext(CarouselContext);
  
  if (!carouselContext) {
    throw new Error("ProjectCarousel must be used within a CarouselContext.Provider");
  }
  
  const { currentIndex, nextSlide, prevSlide, goToSlide } = carouselContext;
  const itemsPerPage = 3;
  const totalPages = Math.ceil(repositories.length / itemsPerPage);
  
  const getLanguageColor = (language: string) => {
    switch(language) {
      case 'TypeScript':
        return 'bg-blue-600';
      case 'JavaScript':
        return 'bg-yellow-500';
      case 'Jupyter Notebook':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden rounded-xl opacity-25">
        <motion.div
          className="absolute rounded-full bg-blue-300 blur-3xl"
          style={{ width: '40%', height: '40%', left: '5%', top: '20%' }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full bg-cyan-300 blur-3xl"
          style={{ width: '30%', height: '30%', right: '5%', bottom: '10%' }}
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between mb-6 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevSlide}
          className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none shadow-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      <motion.div
        className="overflow-hidden rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex"
          initial={{ x: 0 }}
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {repositories.map((repo, index) => (
            <motion.div 
              key={repo.name} 
              className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index % itemsPerPage * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="block h-full"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full relative overflow-hidden">
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-blue-50">
                      <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">{repo.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2">{repo.description}</p>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${getLanguageColor(repo.language)} mr-2`}></span>
                    <span className="text-xs text-gray-500">{repo.language}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <motion.button
            key={index}
            className={`mx-1 h-2 w-${currentIndex === index ? "6" : "2"} rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(repositories.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  // Provide carousel navigation functions through context
  const carouselContext: CarouselContextType = {
    currentIndex,
    nextSlide,
    prevSlide,
    goToSlide: (index: number) => setCurrentIndex(index)
  };

  return (
    <CarouselContext.Provider value={carouselContext}>
      <div className="min-h-screen bg-white">
        {/* Header/Navigation */}
        <header className="bg-black border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/D4D0BAQE10hy9aV-n3A/company-logo_200_200/company-logo_200_200/0/1730280141166/clarity_smart_tech_logo?e=2147483647&v=beta&t=J0dirSMeVgwPTJkPOOjGz-DaxmiRXkZWRin1Pzvycn4" 
                    alt="Clarity Smart Tech" 
                    className="h-10 w-auto"
                  />
                  <span className="ml-2 text-lg font-medium text-white">Clarity Smart Tech</span>
                </div>
              </div>
              <div className="flex items-center">
                <Link to="/auth" className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-[#FF6B00] hover:bg-[#FF8C00]">
                  Sign in
                </Link>
                <Link to="/auth" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <LiquidBackground>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                  <motion.h1 
                    className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="block">Smart Solutions for</span>
                    <span className="block text-[#FF6B00]">Client Management</span>
                  </motion.h1>
                  <motion.p 
                    className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Clarity Smart Tech provides an all-in-one platform for managing client relationships, projects, and teams. Streamline your workflow, enhance collaboration, and boost productivity.
                  </motion.p>
                  <motion.div 
                    className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/auth" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#FF6B00] hover:bg-[#FF8C00] md:text-lg">
                        Experience the Clarity Difference
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
                <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                  <motion.div 
                    className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9">
                        <div className="h-full flex items-center justify-center bg-indigo-100 p-8">
                          <div className="max-w-sm mx-auto">
                            <motion.div 
                              className="bg-white rounded-lg shadow-md p-6"
                              animate={{ 
                                y: [0, -10, 0],
                                boxShadow: [
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                ]
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 4, 
                                ease: "easeInOut" 
                              }}
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Project Dashboard</h3>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                              </div>
                              <div className="space-y-3">
                                <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                                <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                  <div className="h-16 bg-indigo-50 rounded-md"></div>
                                  <div className="h-16 bg-blue-50 rounded-md"></div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </LiquidBackground>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Everything you need to manage your clients
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Our platform provides all the tools to streamline client management.
              </p>
            </motion.div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <BubbleEffect>
                    <div className="bg-white rounded-lg px-6 py-8 shadow-sm border border-gray-100 h-full">
                      <div className="p-3 rounded-full bg-[#FF6B00] bg-opacity-10 inline-block">
                        <Briefcase className="h-6 w-6 text-[#FF6B00]" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Project Management</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Track projects from start to finish. Set milestones, deadlines, and deliverables.
                      </p>
                    </div>
                  </BubbleEffect>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <BubbleEffect>
                    <div className="bg-white rounded-lg px-6 py-8 shadow-sm border border-gray-100 h-full">
                      <div className="p-3 rounded-full bg-[#FF6B00] bg-opacity-10 inline-block">
                        <Users className="h-6 w-6 text-[#FF6B00]" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Team Collaboration</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Collaborate with your team seamlessly. Assign tasks, share files, and communicate efficiently.
                      </p>
                    </div>
                  </BubbleEffect>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <BubbleEffect>
                    <div className="bg-white rounded-lg px-6 py-8 shadow-sm border border-gray-100 h-full">
                      <div className="p-3 rounded-full bg-[#FF6B00] bg-opacity-10 inline-block">
                        <BarChart2 className="h-6 w-6 text-[#FF6B00]" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Analytics & Insights</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Gain valuable insights into your projects and clients. Make data-driven decisions.
                      </p>
                    </div>
                  </BubbleEffect>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <BubbleEffect>
                    <div className="bg-white rounded-lg px-6 py-8 shadow-sm border border-gray-100 h-full">
                      <div className="p-3 rounded-full bg-[#FF6B00] bg-opacity-10 inline-block">
                        <Clock className="h-6 w-6 text-[#FF6B00]" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Time Tracking</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Track time spent on projects and tasks. Generate accurate invoices based on time entries.
                      </p>
                    </div>
                  </BubbleEffect>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <BubbleEffect>
                    <div className="bg-white rounded-lg px-6 py-8 shadow-sm border border-gray-100 h-full">
                      <div className="p-3 rounded-full bg-[#FF6B00] bg-opacity-10 inline-block">
                        <CheckCircle2 className="h-6 w-6 text-[#FF6B00]" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Task Management</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Organize tasks with customizable workflows. Never miss a deadline again.
                      </p>
                    </div>
                  </BubbleEffect>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <BubbleEffect>
                    <div className="bg-white rounded-lg px-6 py-8 shadow-sm border border-gray-100 h-full">
                      <div className="p-3 rounded-full bg-[#FF6B00] bg-opacity-10 inline-block">
                        <Users className="h-6 w-6 text-[#FF6B00]" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Client Portal</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Give your clients access to their projects. Improve transparency and communication.
                      </p>
                    </div>
                  </BubbleEffect>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-20 bg-black relative overflow-hidden">
          <motion.div
            className="absolute rounded-full bg-[#FF6B00] blur-3xl opacity-30"
            style={{ width: '50%', height: '50%', right: '-10%', top: '-10%' }}
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full bg-[#FF8C00] blur-3xl opacity-30"
            style={{ width: '40%', height: '40%', left: '-5%', bottom: '-5%' }}
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
                Our Project Portfolio
              </h2>
              <p className="max-w-2xl text-xl text-gray-300 mx-auto">
                Explore our diverse range of projects and solutions
              </p>
            </motion.div>
            
            <ProjectCarousel />
            
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={nextSlide}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#FF6B00] hover:bg-[#FF8C00] shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                View All Projects
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-[#FF6B00] py-16 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="absolute rounded-full bg-[#FF8C00] blur-3xl"
              style={{ width: '50%', height: '50%', left: '10%', top: '10%' }}
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
              }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full bg-[#FFA500] blur-3xl"
              style={{ width: '30%', height: '30%', right: '20%', top: '40%' }}
              animate={{
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            />
          </motion.div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-extrabold text-white">
                  Loved by businesses worldwide
                </h2>
                <p className="mt-4 text-lg text-indigo-100">
                  Our client management solution has helped thousands of businesses streamline their operations, improve collaboration, and boost productivity.
                </p>
                <div className="mt-8">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg 
                        key={i} 
                        className="h-5 w-5 text-yellow-300" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                    <p className="text-white text-sm ml-2">5.0 from over 200 reviews</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="mt-12 lg:mt-0"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    y: -5 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="px-6 py-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <motion.div 
                          className="inline-flex h-10 w-10 rounded-full bg-blue-500 items-center justify-center text-white"
                          animate={{ 
                            boxShadow: [
                              "0 0 0 0 rgba(59, 130, 246, 0.4)",
                              "0 0 0 10px rgba(59, 130, 246, 0)",
                              "0 0 0 0 rgba(59, 130, 246, 0)"
                            ]
                          }}
                          transition={{ repeat: Infinity, duration: 2.5 }}
                        >
                          JP
                        </motion.div>
                      </div>
                      <div className="ml-4">
                        <div className="space-y-6 text-base text-gray-700">
                          <p className="italic">
                            "This platform has transformed how we manage our projects and client relationships. The intuitive interface and powerful features have made our team more efficient and our clients happier."
                          </p>
                        </div>
                        <div className="mt-4">
                          <p className="text-base font-medium text-gray-900">Jane Phillips</p>
                          <p className="text-sm text-gray-500">Product Manager, TechCorp</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="bg-black rounded-lg overflow-hidden shadow-lg relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute rounded-full bg-[#FF6B00] blur-xl"
                  style={{ width: '30%', height: '30%', right: '5%', top: '20%' }}
                  animate={{
                    x: [0, -10, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute rounded-full bg-[#FF8C00] blur-xl"
                  style={{ width: '20%', height: '20%', left: '10%', bottom: '20%' }}
                  animate={{
                    x: [0, 15, 0],
                    y: [0, 5, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                />
              </div>
              
              <div className="px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 md:flex md:items-center md:justify-between relative z-10">
                <div>
                  <motion.h2 
                    className="text-3xl font-extrabold text-white sm:text-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <span className="block">Ready to experience the Clarity difference?</span>
                  </motion.h2>
                  <motion.p 
                    className="mt-3 text-lg text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Start your 14-day free trial with Clarity Smart Tech today. No credit card required.
                  </motion.p>
                </div>
                <motion.div 
                  className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex rounded-md shadow">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/auth" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#FF6B00] hover:bg-[#FF8C00]">
                        Start Your Free Trial
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
              className="grid grid-cols-2 gap-8 md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-sm font-semibold text-[#FF6B00] tracking-wider uppercase">Products</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FF6B00] tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Guides</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FF6B00] tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FF6B00] tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Terms</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </motion.div>
            <motion.div 
              className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex space-x-6 md:order-2">
                {[
                  { name: 'Facebook', icon: (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  ) },
                  { name: 'Twitter', icon: (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  ) },
                  { name: 'GitHub', icon: (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  ) }
                ].map((item, index) => (
                  <motion.a 
                    key={item.name} 
                    href="#" 
                    className="text-gray-400 hover:text-gray-300"
                    whileHover={{ scale: 1.2, color: '#ffffff' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <span className="sr-only">{item.name}</span>
                    {item.icon}
                  </motion.a>
                ))}
              </div>
              <motion.p 
                className="mt-8 text-base text-gray-400 md:mt-0 md:order-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                &copy; 2023 Clarity Smart Tech, Inc. All rights reserved.
              </motion.p>
            </motion.div>
          </div>
        </footer>
      </div>
    </CarouselContext.Provider>
  );
};

export default LandingPage; 
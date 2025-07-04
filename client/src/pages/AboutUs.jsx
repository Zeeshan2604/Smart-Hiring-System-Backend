import React from "react";
import { FaLightbulb, FaRobot, FaFileAlt } from "react-icons/fa";
import Footer from "../organization/Footer";
import Header from "../organization/Header";
import Logo from "../images/Company-Logo.jpg";
import { motion } from "framer-motion";

function AboutUs({ setDisplay }) {
  const features = [
    {
      icon: <FaLightbulb className="w-8 h-8 text-gray-700" />,
      title: "AI-Powered Recruitment",
      description: "Advanced algorithms to assess both hard and soft skills of candidates"
    },
    {
      icon: <FaRobot className="w-8 h-8 text-gray-700" />,
      title: "Smart Chatbot",
      description: "Interactive AI assistant to help users with their queries"
    },
    {
      icon: <FaFileAlt className="w-8 h-8 text-gray-700" />,
      title: "Resume Builder",
      description: "Professional resume templates with easy customization"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header setDisplay={setDisplay} />
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
            }}
          />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About HirEx</h1>
              <p className="text-xl text-gray-200">
                Transforming the recruitment process with cutting-edge AI technology
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Recruiting the right candidate for a job role is a crucial and
              time-consuming task for any company. Interviews require a lot of
              time and resources, which can be saved by automating the
                pre-screening rounds.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our project proposes an AI-based recruitment system that can assess both hard and soft skills of the candidates
                using two algorithms - the personality insights algorithm and the answer relevancy algorithm.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <img src={Logo} alt="Company Logo" className="rounded-2xl shadow-xl w-full" />
            </motion.div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Additional Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose HirEx?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-gray-700 mr-2">•</span>
                    <span className="text-gray-600">Personality prediction using ML</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-700 mr-2">•</span>
                    <span className="text-gray-600">Confidence and tone analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-700 mr-2">•</span>
                    <span className="text-gray-600">Automated email notifications</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-gray-700 mr-2">•</span>
                    <span className="text-gray-600">Fast recruitment for large numbers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-700 mr-2">•</span>
                    <span className="text-gray-600">Concise candidate insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-700 mr-2">•</span>
                    <span className="text-gray-600">Streamlined hiring process</span>
                  </li>
                </ul>
              </div>
          </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;

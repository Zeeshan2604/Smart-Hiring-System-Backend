import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../organization/Header";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaFileAlt, FaVideo, FaChartLine, FaUsers, FaBrain } from "react-icons/fa";
import { Dialog } from '@headlessui/react';

function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem('onboarding_shown')) {
      setShowOnboarding(true);
      sessionStorage.setItem('onboarding_shown', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <AnimatePresence>
        {showOnboarding && (
          <Dialog open={showOnboarding} onClose={() => setShowOnboarding(false)} className="fixed z-50 inset-0 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 z-10 flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Welcome to HirEx!</h2>
              <ul className="text-gray-700 dark:text-gray-200 text-left mb-6 space-y-2">
                <li>• <b>AI-Powered Analysis:</b> Get deep insights into candidate skills and personality.</li>
                <li>• <b>Smart Resume Screening:</b> Quickly identify top candidates.</li>
                <li>• <b>Video Interviews:</b> Conduct and analyze interviews with real-time feedback.</li>
                <li>• <b>Performance Analytics:</b> Track and improve your hiring process.</li>
                <li>• <b>Team Collaboration:</b> Work seamlessly with your hiring team.</li>
              </ul>
              <p className="mb-6 text-gray-600 dark:text-gray-300">Click <b>Get Started</b> to begin or explore the features below!</p>
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Transform Your Hiring Process with{" "}
                <span className="text-blue-600">AI-Powered</span> Solutions
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Streamline your recruitment process with our advanced AI technology. 
                Get deeper insights into candidates' skills, personality, and potential.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/user">
                  <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl">
                    Get Started
                  </button>
                </Link>
                <Link to="/about">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition duration-300 border-2 border-blue-600">
                    Learn More
                  </button>
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-12 lg:mt-0"
            >
              <img
                src="https://images.unsplash.com/photo-1573496130407-57329f01f769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMzczODV8MHwxfHNlYXJjaHw0fHxoaXJpbmd8ZW58MHwwfHx8MTY3OTI4NDk1MA&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Modern Hiring"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Why Choose HirEx?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our comprehensive suite of tools helps you make better hiring decisions
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaRobot className="text-blue-600 text-2xl" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">AI-Powered Analysis</h3>
              <p className="mt-2 text-gray-600">
                Advanced algorithms analyze candidate responses and provide detailed insights
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Smart Resume Screening</h3>
              <p className="mt-2 text-gray-600">
                Automated resume analysis to identify the best candidates quickly
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaVideo className="text-purple-600 text-2xl" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Video Interviews</h3>
              <p className="mt-2 text-gray-600">
                Conduct and analyze video interviews with real-time feedback
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Performance Analytics</h3>
              <p className="mt-2 text-gray-600">
                Track and analyze hiring metrics to improve your recruitment process
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-red-600 text-2xl" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Team Collaboration</h3>
              <p className="mt-2 text-gray-600">
                Enable seamless collaboration between hiring team members
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaBrain className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Smart Matching</h3>
              <p className="mt-2 text-gray-600">
                AI-powered candidate matching based on skills and company culture
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of companies already using HirEx to make better hiring decisions
          </p>
          <div className="mt-10">
            <Link to="/user">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HirEx</h3>
              <p className="text-gray-400">
                Transforming the way companies hire and grow their teams
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/user" className="text-gray-400 hover:text-white">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: support@hirex.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 HirEx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

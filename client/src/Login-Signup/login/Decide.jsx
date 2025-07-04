import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBuilding, FaUserGraduate, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import Header from "../../organization/Header";
import Footer from "../../organization/Footer";

function Decide(props) {
  const { setStatus } = props;
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const fetchQuote = useCallback(async () => {
    const fallbackQuotes = [
      { content: "The best way to predict the future is to create it.", author: "Peter Drucker" },
      { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { content: "Stay hungry, stay foolish.", author: "Steve Jobs" }
    ];

    try {
      const response = await fetch("https://api.quotable.io/random");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (error) {
      console.log("Error fetching quote:", error);
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote.content);
      setAuthor(randomQuote.author);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to HirEx
        </h1>
          <p className="text-xl text-gray-600">
            Choose how you want to use our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <Link to="/org-login" onClick={() => setStatus("org")}>
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBuilding className="text-blue-600 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Organization
                </h2>
                <p className="text-gray-600 text-center">
                  Post jobs, conduct interviews, and find the perfect candidates for your team
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <Link to="/student-login" onClick={() => setStatus("student")}>
              <div className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUserGraduate className="text-green-600 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Candidate
                </h2>
                <p className="text-gray-600 text-center">
                  Apply for jobs, take interviews, and showcase your skills to potential employers
                </p>
          </div>
            </Link>
          </motion.div>
      </div>

        {quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-16 text-center"
          >
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <FaQuoteLeft className="text-blue-600 text-2xl mb-4 mx-auto" />
              <p className="text-xl text-gray-700 italic mb-4">
            {quote}
              </p>
              <FaQuoteRight className="text-blue-600 text-2xl mb-2 mx-auto" />
              <p className="text-gray-600 font-medium">
                ~ {author}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default Decide;

import React, { useState, useRef, useEffect, useMemo } from "react";
import { IoMdSend } from "react-icons/io";
import { BiBot, BiUser } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { FaLightbulb, FaQuestionCircle, FaBook, FaBriefcase, FaCode, FaGraduationCap } from "react-icons/fa";
import Header from "../organization/Header";
import Footer from "../organization/Footer";
import axios from "axios";

const ChatBot = React.memo(function ChatBot({ setDisplay }) {
  const [chat, setChat] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // Initialize with welcome message
  useEffect(() => {
    if (chat.length === 0) {
      setChat([{
        sender: "bot",
        msg: "Hello! I'm your Smart Hire Assistant. I can help you with interview preparation, career advice, programming questions, and study tips. What would you like to know?"
      }]);
    }
  }, []);

  const getAIResponse = async (userMessage) => {
    try {
      // Use our backend chatbot endpoint
      const baseURL = process.env.REACT_APP_SAMPLE || 'http://localhost:8080';
      const apiURL = baseURL.endsWith('/api/v1') ? `${baseURL}/Chatbot` : `${baseURL}/api/v1/Chatbot`;
      
      console.log("Making request to:", apiURL);
      
      const response = await axios.post(
        apiURL,
        {
          message: userMessage
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 15000 // 15 second timeout
        }
      );

      if (response.data && response.data.status === "Success" && response.data.response) {
        return response.data.response;
    } else {
        // Fallback responses for interview/career topics
        return getFallbackResponse(userMessage);
      }
    } catch (error) {
      console.error("Chatbot API Error:", error);
      // Use fallback responses when API fails
      return getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Interview related responses
    if (message.includes('interview') || message.includes('interview tips')) {
      return "Here are some key interview tips:\n\n1. Research the company thoroughly\n2. Practice common questions\n3. Dress professionally\n4. Arrive early\n5. Show enthusiasm and confidence\n6. Ask thoughtful questions\n7. Follow up with a thank you email\n\nWould you like specific tips for any particular type of interview?";
    }
    
    if (message.includes('resume') || message.includes('cv')) {
      return "For a great resume:\n\n1. Keep it concise (1-2 pages)\n2. Use action verbs\n3. Quantify achievements\n4. Tailor it to the job\n5. Include relevant keywords\n6. Proofread carefully\n7. Use a clean, professional format\n\nNeed help with a specific section?";
    }
    
    if (message.includes('programming') || message.includes('code') || message.includes('developer')) {
      return "Programming career advice:\n\n1. Build a strong portfolio\n2. Contribute to open source\n3. Learn version control (Git)\n4. Practice coding daily\n5. Network with other developers\n6. Stay updated with trends\n7. Focus on problem-solving skills\n\nWhat programming language or technology are you interested in?";
    }
    
    if (message.includes('study') || message.includes('learning')) {
      return "Effective study strategies:\n\n1. Use active learning techniques\n2. Break down complex topics\n3. Practice regularly\n4. Teach others what you learn\n5. Use spaced repetition\n6. Take breaks and stay hydrated\n7. Find your optimal study environment\n\nWhat subject are you studying?";
    }
    
    if (message.includes('career') || message.includes('job search')) {
      return "Career development tips:\n\n1. Set clear career goals\n2. Build your professional network\n3. Develop in-demand skills\n4. Seek mentorship\n5. Stay adaptable to change\n6. Build your personal brand\n7. Continuously learn and grow\n\nWhat career field interests you?";
    }
    
    if (message.includes('salary') || message.includes('negotiation')) {
      return "Salary negotiation tips:\n\n1. Research market rates\n2. Know your worth\n3. Practice your pitch\n4. Consider total compensation\n5. Be confident but respectful\n6. Have alternatives ready\n7. Don't accept the first offer\n\nNeed help preparing for a specific negotiation?";
    }
    
    // Default response
    return "I'm here to help with your career and professional development! I can assist with:\n\n• Interview preparation and tips\n• Resume and CV writing\n• Programming and technical questions\n• Study strategies and learning\n• Career advice and job search\n• Salary negotiation\n\nWhat would you like to know more about?";
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    
    if (inputMessage.trim() === "") {
      return;
    }

    const userMessage = inputMessage.trim();
    const request_temp = { sender: "user", msg: userMessage };
    
    // Add user message to chat
    setChat((prevChat) => [...prevChat, request_temp]);
    setBotTyping(true);
    setInputMessage("");

    try {
      // Get AI response
      const botResponse = await getAIResponse(userMessage);
      
      // Add bot response to chat
            const response_temp = {
              sender: "bot",
        msg: botResponse
            };
      
      setBotTyping(false);
      setChat((prevChat) => [...prevChat, response_temp]);
    } catch (error) {
      console.error("Error getting bot response:", error);
            setBotTyping(false);

      // Add error response
      const errorResponse = {
        sender: "bot",
        msg: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to ask me about interview tips, career advice, programming, or study strategies!"
      };
      
      setChat((prevChat) => [...prevChat, errorResponse]);
    }
  };

  const suggestedTopics = [
    { icon: <FaLightbulb />, text: "Interview Tips", description: "Get ready for your next interview" },
    { icon: <FaBriefcase />, text: "Career Advice", description: "Navigate your professional journey" },
    { icon: <FaBook />, text: "Resume Writing", description: "Create a standout resume" },
    { icon: <FaCode />, text: "Programming Help", description: "Technical questions and guidance" },
    { icon: <FaGraduationCap />, text: "Study Strategies", description: "Improve your learning" },
    { icon: <FaQuestionCircle />, text: "Job Search", description: "Find your next opportunity" },
  ];

  const handleSuggestedTopic = (topic) => {
    setInputMessage(topic.text);
  };

  // Memoize mapped chat messages for performance
  const chatMessages = useMemo(() => chat.map((msg, idx) => (
    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}>{msg.msg}</div>
    </div>
  )), [chat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-blue-900 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <BiBot className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-white text-2xl font-bold">Smart Hire Assistant</h1>
                  <p className="text-blue-100">Your AI Career Guide</p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-blue-100 text-sm bg-white/10 px-4 py-2 rounded-lg">
                  Available 24/7
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="h-[500px] overflow-y-auto px-6 py-4 bg-gray-50"
          >
            {chat.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <div className="bg-white p-6 rounded-2xl shadow-sm max-w-md w-full">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <BiBot className="text-3xl text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-center mb-4">How can I help you today?</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {suggestedTopics.map((topic, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col items-center space-y-1 bg-gray-50 hover:bg-blue-50 p-3 rounded-lg transition-colors text-center"
                        onClick={() => handleSuggestedTopic(topic)}
                      >
                        <span className="text-blue-600 text-lg">{topic.icon}</span>
                        <span className="text-sm font-medium">{topic.text}</span>
                        <span className="text-xs text-gray-500">{topic.description}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              chatMessages
            )}
            {botTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start space-x-3 mb-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <BiBot className="text-blue-600" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <input
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about your career..."
                value={inputMessage}
                type="text"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <motion.button
                type="submit"
                disabled={botTyping || !inputMessage.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  botTyping || !inputMessage.trim() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <IoMdSend className="text-xl" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
});

export default ChatBot;

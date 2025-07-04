import React, { useState, useEffect, Suspense, lazy, useMemo } from "react";
import Home from "./stepper/Home";
import { FaBuffer, FaArrowLeft, FaShieldAlt, FaGavel, FaHeadset } from "react-icons/fa";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// Lazy load templates
const Templates = lazy(() => import("./pages/Templates"));
const Template1 = lazy(() => import("./ResumeTemplates/Template1"));
const Template2 = lazy(() => import("./ResumeTemplates/Template2"));

function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="relative bg-white/70 backdrop-blur-lg border border-blue-200 shadow-2xl rounded-3xl max-w-2xl w-full px-10 py-12 flex flex-col items-center">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-500 shadow-lg rounded-full p-5 border-4 border-white">
          <FaShieldAlt size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-blue-800 mt-8 mb-4 tracking-tight">Privacy Policy</h1>
        <div className="w-16 h-1 bg-blue-200 rounded-full mb-8" />
        <p className="mb-6 text-gray-700 text-lg text-center">Your privacy is important to us. We collect only the information necessary to provide our services and do not share your data with third parties except as required by law. All resume data is securely stored and can be deleted upon request. For more details, contact support.</p>
        <ul className="list-disc ml-8 mb-8 text-blue-700 text-base space-y-2">
          <li>We do not sell your personal information.</li>
          <li>All data is encrypted and securely stored.</li>
          <li>You can request deletion of your data at any time.</li>
        </ul>
        <div className="mt-4 bg-blue-50/80 rounded-xl p-4 w-full text-center shadow">
          <span className="font-semibold text-blue-800">Contact us:</span> <a href="mailto:support@smarthire.com" className="text-blue-600 underline">support@smarthire.com</a>
        </div>
      </motion.div>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-200">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="relative bg-white/70 backdrop-blur-lg border border-purple-200 shadow-2xl rounded-3xl max-w-2xl w-full px-10 py-12 flex flex-col items-center">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-purple-500 shadow-lg rounded-full p-5 border-4 border-white">
          <FaGavel size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-purple-800 mt-8 mb-4 tracking-tight">Terms of Service</h1>
        <div className="w-16 h-1 bg-purple-200 rounded-full mb-8" />
        <p className="mb-6 text-gray-700 text-lg text-center">By using Smart Hire, you agree to our terms of service. You are responsible for the accuracy of the information you provide. We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.</p>
        <ul className="list-disc ml-8 mb-8 text-purple-700 text-base space-y-2">
          <li>Do not use the service for unlawful purposes.</li>
          <li>Do not share your account credentials with others.</li>
          <li>We are not responsible for third-party content or links.</li>
        </ul>
        <div className="mt-4 bg-purple-50/80 rounded-xl p-4 w-full text-center shadow">
          <span className="font-semibold text-purple-800">Questions?</span> <a href="mailto:support@smarthire.com" className="text-purple-600 underline">support@smarthire.com</a>
        </div>
      </motion.div>
    </div>
  );
}

function ContactSupport() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="relative bg-white/70 backdrop-blur-lg border border-green-200 shadow-2xl rounded-3xl max-w-2xl w-full px-10 py-12 flex flex-col items-center">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 shadow-lg rounded-full p-5 border-4 border-white">
          <FaHeadset size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-green-800 mt-8 mb-4 tracking-tight">Contact Support</h1>
        <div className="w-16 h-1 bg-green-200 rounded-full mb-8" />
        <p className="mb-6 text-gray-700 text-lg text-center">Need help? Reach out to our support team and we'll get back to you as soon as possible.</p>
        <ul className="mb-8 text-green-800 text-base space-y-2">
          <li>Email: <a href="mailto:support@smarthire.com" className="text-green-600 underline">support@smarthire.com</a></li>
          <li>Phone: <a href="tel:+1234567890" className="text-green-600 underline">+1 234 567 890</a></li>
        </ul>
        <div className="mt-4 bg-green-50/80 rounded-xl p-4 w-full text-center shadow">
          <span className="font-semibold text-green-800">Or fill out our </span>
          <a href="mailto:support@smarthire.com?subject=Support%20Request" className="text-green-600 underline">support request form</a>.
        </div>
      </motion.div>
    </div>
  );
}

function ResumeBuilderMain() {
  const [basicinfo, setBasicInfo] = useState({
    title: "Basic Information",
    name: "",
    designation: "",
    objective: "",
    email: "",
    phone: "",
    image: "",
    file: null,
    skills: [],
    git: "",
    lin: "",
  });

  const [workinfo, setWorkInfo] = useState({
    title: "Work Experience",
    skip: "",
    work: [
      {
        position: "",
        company: "",
        certificate: "",
        location: "",
        start: "",
        end: "",
        description: "",
      },
    ],
  });

  const [eduinfo, setEduInfo] = useState({
    title: "Education",
    education: [
      {
        name: "",
        collage: "",
        percentage: "",
        start: "",
        end: "",
      },
    ],
  });

  const [resume, setResume] = useState(false);
  const [picture, setpicture] = useState(false);
  const [TemNo, setTemNo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasPrevResume, setHasPrevResume] = useState(false);

  // Get user email from cookies or sessionStorage
  let userEmail = "";
  try {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key.trim()] = value;
      return acc;
    }, {});
    if (cookies.UserData) {
      userEmail = JSON.parse(decodeURIComponent(cookies.UserData)).emailId;
    } else if (sessionStorage.getItem("UserData")) {
      userEmail = JSON.parse(sessionStorage.getItem("UserData")).emailId;
    }
  } catch (e) {}

  // Fetch previous resume on mount
  useEffect(() => {
    if (!userEmail) return;
    axios.post("http://localhost:8080/api/v1/login/getResume", { email: userEmail })
      .then(res => {
        if (res.data && res.data.data) {
          const resume = res.data.data;
          setBasicInfo(resume.basicinfo || {});
          setWorkInfo(resume.workinfo || {});
          setEduInfo(resume.eduinfo || {});
          setpicture(resume.basicinfo?.image || "");
          setHasPrevResume(true);
        } else {
          setHasPrevResume(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        setHasPrevResume(false);
        setLoading(false);
        if (err.response && err.response.status === 404) {
          console.warn('No previous resume found for this user.');
        } else {
          console.error('Error fetching resume:', err);
        }
      });
  }, [userEmail]);

  useEffect(() => {
    console.log('Resume state changed:', resume);
  }, [resume]);

  // Save resume to backend
  const handleSaveResume = () => {
    if (!userEmail) return alert("User not logged in");
    const resumeData = {
      basicinfo: { ...basicinfo, image: picture },
      workinfo,
      eduinfo,
      template: TemNo,
    };
    axios.post("http://localhost:8080/api/v1/login/saveResume", { email: userEmail, resume: resumeData })
      .then(res => {
        alert("Resume saved successfully!");
        setHasPrevResume(true);
      })
      .catch(() => alert("Failed to save resume"));
  };

  // View previous resume
  const handleViewPrevResume = () => {
    // If previous resume data has a template, use it; otherwise default to 1
    let prevTemplate = 1;
    try {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key.trim()] = value;
        return acc;
      }, {});
      let resumeData = null;
      if (cookies.UserData) {
        resumeData = JSON.parse(decodeURIComponent(cookies.UserData)).Resume;
      } else if (sessionStorage.getItem("UserData")) {
        resumeData = JSON.parse(sessionStorage.getItem("UserData")).Resume;
      }
      if (resumeData) {
        const parsed = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
        if (parsed.template) prevTemplate = parsed.template;
      }
    } catch (e) {}
    setTemNo(prevTemplate);
    setResume(true);
  };

  // Memoize props for templates at the top level
  const memoBasicInfo = useMemo(() => basicinfo, [basicinfo]);
  const memoEduInfo = useMemo(() => eduinfo, [eduinfo]);
  const memoWorkInfo = useMemo(() => workinfo, [workinfo]);

  return (
    <section className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FaBuffer className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Resume Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              {hasPrevResume && (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  onClick={handleViewPrevResume}
                >
                  View Previous Resume
              </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : !resume ? (
          <div className="max-w-3xl mx-auto">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mx-auto">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Create Your Resume</h2>
                <p className="mt-1 text-sm text-gray-500">Fill in your details to create a professional resume</p>
              </div>
              <div className="p-6">
                <Home
                  basicinfo={basicinfo}
                  workinfo={workinfo}
                  eduinfo={eduinfo}
                  setWorkInfo={setWorkInfo}
                  setBasicInfo={setBasicInfo}
                  setEduInfo={setEduInfo}
                  setResume={setResume}
                  picture={picture}
                  setpicture={setpicture}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<div>Loading template...</div>}>
            {TemNo === 0 ? (
              <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Choose Your Template</h2>
              <p className="mt-2 text-gray-600">Select a professional template for your resume</p>
            </div>
                <Templates setTemNo={setTemNo} setStep={setResume} />
              </>
            ) : (
              <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 mx-auto">
                <button
                  className="absolute top-2 left-2 z-20 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                  onClick={() => setTemNo(0)}
                  title="Back"
                >
                  <FaArrowLeft size={20} />
                </button>
                <div className="p-6">
                  {TemNo === 1 ? (
                    <Template1
                      basicinfo={memoBasicInfo}
                      eduinfo={memoEduInfo}
                      workinfo={memoWorkInfo}
                      picture={picture}
                      setpicture={setpicture}
                    />
                  ) : TemNo === 2 ? (
                    <Template2
                      basicinfo={memoBasicInfo}
                      eduinfo={memoEduInfo}
                      workinfo={memoWorkInfo}
                      picture={picture}
                      setpicture={setpicture}
                    />
                  ) : null}
                  <div className="flex justify-end mt-6 gap-4">
                    <button
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                      onClick={handleSaveResume}
                    >
                      Save Resume
                    </button>
                  </div>
                </div>
              </div>
            )}
            </Suspense>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 Smart Hire. All rights reserved.
            </p>
            <FooterNav />
      </div>
    </div>
      </footer>
    </section>
  );
}

function FooterNav() {
  const navigate = useNavigate();
  return (
    <div className="flex space-x-6">
      <button className="text-sm text-gray-500 hover:text-gray-900" onClick={() => navigate('privacy-policy')}>
        Privacy Policy
      </button>
      <button className="text-sm text-gray-500 hover:text-gray-900" onClick={() => navigate('terms-of-service')}>
        Terms of Service
      </button>
      <button className="text-sm text-gray-500 hover:text-gray-900" onClick={() => navigate('contact-support')}>
        Contact Support
      </button>
    </div>
  );
}

export default function ResumeBuilder() {
  return (
    <Routes>
      <Route path="/" element={<ResumeBuilderMain />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/contact-support" element={<ContactSupport />} />
    </Routes>
  );
}

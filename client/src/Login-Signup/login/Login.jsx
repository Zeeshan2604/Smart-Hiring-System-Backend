import React from "react";
import { motion } from "framer-motion";
import Fields from "./Fields";
import Conference from "./images/conference.png";
import Header from "../../organization/Header";
import Footer from "../../organization/Footer";

function Login(props) {
  const {
    setDisplay,
    candidateLog,
    OrganizationLog,
    isLogged,
    setIsLoggedIn,
    refresher,
    setRefresher,
    status,
    setSignup,
    setCandidateLog,
    setOrganizationLog,
    show,
    setShow,
  } = props;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header setDisplay={setDisplay} />
      
      <div className="flex min-h-[calc(100vh-200px)]">
        {/* Left side - Form */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
            <Fields
              show={show}
              setShow={setShow}
              setCandidateLog={setCandidateLog}
              setOrganizationLog={setOrganizationLog}
              OrganizationLog={OrganizationLog}
              candidateLog={candidateLog}
              isLogged={isLogged}
              setIsLoggedIn={setIsLoggedIn}
              refresher={refresher}
              setRefresher={setRefresher}
              status={status}
              setSignup={setSignup}
            />
          </div>
        </motion.div>

        {/* Right side - Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center p-8"
        >
          <div className="max-w-lg text-center">
            <img 
              src={Conference} 
              alt="Conference" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <h2 className="mt-8 text-3xl font-bold text-white">
              Welcome to HirEx
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              {status === "org" 
                ? "Find the perfect candidates for your organization"
                : "Take the next step in your career journey"}
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;

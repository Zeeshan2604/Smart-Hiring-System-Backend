import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaArrowLeft, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCode, FaFileAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Cookies from "universal-cookie";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { RxCross2 } from "react-icons/rx";
import Header from "../../organization/Header";
import Footer from "../../organization/Footer";
import Conference from "../login/images/conference.png";
import { useSnackbar } from "../../Snackbar/Snackbar";
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const SignupSchema = Yup.object().shape({
  username: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  skills: Yup.object({
    programming: Yup.string().required("Required"),
    frameworks: Yup.string().required("Required"),
    databases: Yup.string().required("Required"),
  }),
  pastPerformance: Yup.object({
    projects: Yup.string().required("Required"),
    internships: Yup.string().required("Required"),
    hackathons: Yup.string().required("Required"),
  }),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string().required("Confirm your password").oneOf([Yup.ref("password"), null], "Passwords must match"),
  terms: Yup.boolean().oneOf([true], "You must accept the terms and privacy policy"),
});

const SignupStudent = (props) => {
  const { setIsLoggedIn, setRefresher, refresher, status } = props;
  const [Error, setError] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const [open, setOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState();
  const [snackbarClass, setSnackbarClass] = useState();
  const handleClose = () => setOpen(false);
  const action = (<button onClick={handleClose}><RxCross2 /></button>);
  const { showSnackbar } = useSnackbar();

  const [initialValues, setInitialvalues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    skills: { programming: "", frameworks: "", databases: "" },
    pastPerformance: { projects: "", internships: "", hackathons: "" },
    resume: "",
    terms: false,
  });

  const SignUpStudent = async () => {
    await axios
      .post(`${BASEURL}/SignUp`, {
        Res_Name: initialValues.username,
        Res_EmailId: initialValues.email,
        Res_Password: initialValues.password,
        Res_TypeOfUser: "student",
        Res_PhoneNumber: initialValues.phone,
        Res_Address: initialValues.address,
        Res_TechinalSkillsProgrammingLanguage: initialValues.skills.programming,
        Res_TechnicalSkillsFrameworks: initialValues.skills.frameworks,
        Res_TechnicalSkillsDatabase: initialValues.skills.databases,
        Res_PastPerformanceProjectDetails: initialValues.pastPerformance.projects,
        Res_PastPerformanceInternshipDetails: initialValues.pastPerformance.internships,
        Res_PastPerformanceHackathonDetails: initialValues.pastPerformance.hackathons,
        Res_Resume: "None",
      })
      .then((Data) => {
        if (Data.data.message === "User found Successfully!") {
          cookies.set("SmartToken", Data.data.data, { maxAge: 86400 });
          cookies.set("UserData", {
            emailId: initialValues.email,
            typeOfUser: "student"
          }, { maxAge: 86400 });
          setIsLoggedIn(true);
          setRefresher(!refresher);
          showSnackbar("Signup successful!", "success");
          setTimeout(() => navigate("/"), 1000);
        }
      })
      .catch((ErrorR) => {
        showSnackbar(ErrorR?.response?.data?.message || "Signup failed", "error");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-[calc(100vh-200px)]">
        {/* Left: Form Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center mb-8">
              <Link to="/user" className="text-blue-600 hover:text-blue-700 transition-colors">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 ml-4">Create Candidate Account</h1>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={SignupSchema}
              onSubmit={() => SignUpStudent()}
            >
              {(props) => (
                <Form className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                      Full Name
                      <span className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                        <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter your legal full name as on official documents.</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="text-gray-400" /></div>
                      <Field type="text" name="username" placeholder="Enter your full name" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                    </div>
                    <ErrorMessage name="username">
                      {msg => (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          <FaExclamationCircle className="text-red-400" /> {msg}
                        </motion.div>
                      )}
                    </ErrorMessage>
                  </div>
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                      Email Address
                      <span className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                        <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter a valid email address.</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaEnvelope className="text-gray-400" /></div>
                      <Field type="email" name="email" placeholder="Enter your email" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                    </div>
                    <ErrorMessage name="email">
                      {msg => (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          <FaExclamationCircle className="text-red-400" /> {msg}
                        </motion.div>
                      )}
                    </ErrorMessage>
                  </div>
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                      Password
                      <span className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                        <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Password must be at least 6 characters.</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="text-gray-400" /></div>
                      <Field type="password" name="password" placeholder="Enter your password" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                    </div>
                    <ErrorMessage name="password">
                      {msg => (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          <FaExclamationCircle className="text-red-400" /> {msg}
                        </motion.div>
                      )}
                    </ErrorMessage>
                  </div>
                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                      Confirm Password
                      <span className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                        <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Passwords must match.</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="text-gray-400" /></div>
                      <Field type="password" name="confirmPassword" placeholder="Re-enter your password" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                    </div>
                    <ErrorMessage name="confirmPassword">
                      {msg => (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          <FaExclamationCircle className="text-red-400" /> {msg}
                        </motion.div>
                      )}
                    </ErrorMessage>
                  </div>
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                      Phone Number
                      <span className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                        <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter a valid phone number.</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="text-gray-400" /></div>
                      <Field type="text" name="phone" placeholder="Enter your phone number" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                    </div>
                    <ErrorMessage name="phone">
                      {msg => (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          <FaExclamationCircle className="text-red-400" /> {msg}
                        </motion.div>
                      )}
                    </ErrorMessage>
                  </div>
                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                      Address
                      <span className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                        <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter your current address.</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaMapMarkerAlt className="text-gray-400" /></div>
                      <Field type="text" name="address" placeholder="Enter your address" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                    </div>
                    <ErrorMessage name="address">
                      {msg => (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          <FaExclamationCircle className="text-red-400" /> {msg}
                        </motion.div>
                      )}
                    </ErrorMessage>
                  </div>
                  {/* Technical Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="skills.programming" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                        Programming Languages
                        <span className="relative group">
                          <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                          <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter the programming languages you are proficient in.</span>
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaCode className="text-gray-400" /></div>
                        <Field type="text" name="skills.programming" placeholder="e.g. Python, Java" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                      </div>
                      <ErrorMessage name="skills.programming">
                        {msg => (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <FaExclamationCircle className="text-red-400" /> {msg}
                          </motion.div>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <label htmlFor="skills.frameworks" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                        Frameworks/Libraries
                        <span className="relative group">
                          <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                          <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter the frameworks/libraries you are familiar with.</span>
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaCode className="text-gray-400" /></div>
                        <Field type="text" name="skills.frameworks" placeholder="e.g. React, Django" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                      </div>
                      <ErrorMessage name="skills.frameworks">
                        {msg => (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <FaExclamationCircle className="text-red-400" /> {msg}
                          </motion.div>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <label htmlFor="skills.databases" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                        Databases
                        <span className="relative group">
                          <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                          <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter the databases you are familiar with.</span>
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaCode className="text-gray-400" /></div>
                        <Field type="text" name="skills.databases" placeholder="e.g. MySQL, MongoDB" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                      </div>
                      <ErrorMessage name="skills.databases">
                        {msg => (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <FaExclamationCircle className="text-red-400" /> {msg}
                          </motion.div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  {/* Past Performance */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="pastPerformance.projects" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                        Projects
                        <span className="relative group">
                          <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                          <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter details about your projects.</span>
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaFileAlt className="text-gray-400" /></div>
                        <Field type="text" name="pastPerformance.projects" placeholder="Project details" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                      </div>
                      <ErrorMessage name="pastPerformance.projects">
                        {msg => (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <FaExclamationCircle className="text-red-400" /> {msg}
                          </motion.div>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <label htmlFor="pastPerformance.internships" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                        Internships
                        <span className="relative group">
                          <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                          <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter details about your internships.</span>
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaFileAlt className="text-gray-400" /></div>
                        <Field type="text" name="pastPerformance.internships" placeholder="Internship details" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                      </div>
                      <ErrorMessage name="pastPerformance.internships">
                        {msg => (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <FaExclamationCircle className="text-red-400" /> {msg}
                          </motion.div>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <label htmlFor="pastPerformance.hackathons" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                        Hackathons
                        <span className="relative group">
                          <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                          <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter details about your hackathons.</span>
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaFileAlt className="text-gray-400" /></div>
                        <Field type="text" name="pastPerformance.hackathons" placeholder="Hackathon details" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-400" />
                      </div>
                      <ErrorMessage name="pastPerformance.hackathons">
                        {msg => (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <FaExclamationCircle className="text-red-400" /> {msg}
                          </motion.div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>
                  {/* Resume Upload (optional, not handled in backend) */}
                  {/* <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaFileAlt className="text-gray-400" /></div>
                      <Field type="file" name="resume" accept="application/pdf" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <ErrorMessage name="resume" component="div" className="text-red-500 text-sm" />
                  </div> */}
                  {/* Terms and Privacy Policy */}
                  <div className="flex items-center">
                    <Field type="checkbox" name="terms" className="mr-2" />
                    <span className="text-sm text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></span>
                  </div>
                  <ErrorMessage name="terms" component="div" className="text-red-500 text-sm" />
                  {/* Submit Button */}
                  <button
                    type="submit"
                    onClick={() => setInitialvalues(props.values)}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <span>Sign Up</span>
                    <FaCheckCircle className="ml-2" />
                  </button>
                  {/* Switch to Login */}
                  <div className="text-center text-sm">
                    <span className="text-gray-600">Already have an account?</span>{" "}
                    <Link to="/student-login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Login</Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
        {/* Right: Image/Message */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center p-8"
        >
          <div className="max-w-lg text-center">
            <img src={Conference} alt="Conference" className="w-full h-auto rounded-lg shadow-2xl" />
            <h2 className="mt-8 text-3xl font-bold text-white">Welcome to HirEx</h2>
            <p className="mt-4 text-xl text-blue-100">Take the next step in your career journey. Sign up and get started!</p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupStudent;

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { FaArrowLeft, FaBuilding, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaGlobe, FaUsers, FaListAlt, FaCheckCircle, FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import { useSnackbar } from "../../Snackbar/Snackbar";
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { FaExclamationCircle } from "react-icons/fa";
import Header from "../../organization/Header";
import Footer from "../../organization/Footer";
import Conference from "../login/images/conference.png";
import { motion } from "framer-motion";

const validationSchema = Yup.object({
  orgName: Yup.string().required("Organization name is required"),
  industry: Yup.string().required("Industry is required"),
  founded: Yup.string().required("Founded year is required"),
  location: Yup.string().required("Location is required"),
  website: Yup.string().required("Website is required"),
  size: Yup.string().required("Size is required"),
  specialities: Yup.string().required("Specialities are required"),
  mission: Yup.string().required("Mission is required"),
  projects: Yup.string().required("Projects are required"),
  technologies: Yup.string().required("Technologies are required"),
  openPositions: Yup.string().required("Open positions are required"),
  description: Yup.string().required("Description is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  linkedin: Yup.string().url("Invalid URL").required("LinkedIn is required"),
  Password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string().required("Confirm your password").oneOf([Yup.ref("Password"), null], "Passwords must match"),
  terms: Yup.boolean().oneOf([true], "You must accept the terms and privacy policy"),
});

function SignupOrganization({ status, setIsLoggedIn }) {
  const [initialValues, setInitialvalues] = useState({
    orgName: "",
    industry: "",
    founded: "",
    location: "",
    website: "",
    size: "",
    specialities: "",
    mission: "",
    projects: "",
    technologies: "",
    openPositions: "",
    description: "",
    email: "",
    phone: "",
    linkedin: "",
    Password: "",
    confirmPassword: "",
    terms: false,
  });
  const [Error, setError] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const [open, setOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState();
  const [snackbarClass, setSnackbarClass] = useState();
  const { showSnackbar } = useSnackbar();

  const SignUpOrg = async () => {
    await axios
      .post(`${BASEURL}/SignUp`, {
        Res_Name: initialValues.orgName,
        Res_EmailId: initialValues.email,
        Res_Password: initialValues.Password,
        Res_TypeOfUser: "org",
        Res_PhoneNumber: initialValues.phone,
        Res_Address: initialValues.location,
        Res_industry: initialValues.industry,
        Res_founded: initialValues.founded,
        Res_website: initialValues.website,
        Res_size: initialValues.size,
        Res_specialities: initialValues.specialities,
        Res_mission: initialValues.mission,
        Res_projects: initialValues.projects,
        Res_technologies: initialValues.technologies,
        Res_openPositions: initialValues.openPositions,
        Res_description: initialValues.description,
        Res_linkedin: initialValues.linkedin,
      })
      .then((Data) => {
        if (Data.data.message === "User found Successfully!") {
          cookies.set("SmartToken", Data.data.data, { maxAge: 86400 });
          cookies.set("UserData", {
            emailId: initialValues.email,
            typeOfUser: "org"
          }, { maxAge: 86400 });
          setIsLoggedIn(true);
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
              <h1 className="text-3xl font-bold text-gray-900 ml-4">Create Organization Account</h1>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={() => SignUpOrg()}
            >
              {(props) => (
                <Form className="space-y-4">
                  {/* Organization Name */}
                  <div>
                    <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                      Organization Name
                      <span className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                        <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter your registered organization name.</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaBuilding className="text-gray-400" /></div>
                      <Field type="text" name="orgName" placeholder="Enter organization name" className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100 transition-colors" />
                    </div>
                    <ErrorMessage name="orgName">
                      {msg => (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          <FaExclamationCircle className="text-red-400" /> {msg}
                        </motion.div>
                      )}
                    </ErrorMessage>
                  </div>
                  {/* Industry & Founded */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <Field type="text" name="industry" placeholder="e.g. IT, Finance" className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      <ErrorMessage name="industry" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="founded" className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
                      <Field type="text" name="founded" placeholder="e.g. 2005" className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      <ErrorMessage name="founded" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                  {/* Location & Website */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaMapMarkerAlt className="text-gray-400" /></div>
                        <Field type="text" name="location" placeholder="Enter location" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaGlobe className="text-gray-400" /></div>
                        <Field type="text" name="website" placeholder="e.g. https://yourcompany.com" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <ErrorMessage name="website" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                  {/* Size & Specialities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUsers className="text-gray-400" /></div>
                        <Field type="text" name="size" placeholder="e.g. 50-200" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <ErrorMessage name="size" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="specialities" className="block text-sm font-medium text-gray-700 mb-1">Specialities</label>
                      <Field type="text" name="specialities" placeholder="e.g. AI, Cloud" className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      <ErrorMessage name="specialities" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                  {/* Mission & Projects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                      <Field type="text" name="mission" placeholder="Company mission" className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      <ErrorMessage name="mission" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="projects" className="block text-sm font-medium text-gray-700 mb-1">Projects</label>
                      <Field type="text" name="projects" placeholder="Key projects" className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      <ErrorMessage name="projects" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                  {/* Technologies & Open Positions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                      <Field type="text" name="technologies" placeholder="e.g. Node.js, AWS" className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      <ErrorMessage name="technologies" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="openPositions" className="block text-sm font-medium text-gray-700 mb-1">Open Positions</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaListAlt className="text-gray-400" /></div>
                        <Field type="text" name="openPositions" placeholder="e.g. Software Engineer" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <ErrorMessage name="openPositions" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <Field type="text" name="description" placeholder="Brief company description" className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                  </div>
                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaEnvelope className="text-gray-400" /></div>
                        <Field type="email" name="email" placeholder="Enter email" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="text-gray-400" /></div>
                        <Field type="text" name="phone" placeholder="Enter phone number" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                  {/* LinkedIn */}
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLinkedin className="text-gray-400" /></div>
                      <Field type="text" name="linkedin" placeholder="LinkedIn profile URL" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <ErrorMessage name="linkedin" component="div" className="text-red-500 text-sm" />
                  </div>
                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="text-gray-400" /></div>
                        <Field type="password" name="Password" placeholder="Enter password" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <ErrorMessage name="Password" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="text-gray-400" /></div>
                        <Field type="password" name="confirmPassword" placeholder="Re-enter password" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
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
                    <Link to="/org-login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Login</Link>
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
            <p className="mt-4 text-xl text-blue-100">Find the perfect candidates for your organization. Sign up and get started!</p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
export default SignupOrganization;

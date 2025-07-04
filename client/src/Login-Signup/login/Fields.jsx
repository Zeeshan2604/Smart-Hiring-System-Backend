import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaEnvelope, FaLock } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";

const Fields = React.memo(function Fields(props) {
  const {
    setIsLoggedIn,
    refresher,
    setRefresher,
    status,
  } = props;
  const [error, setError] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();
  const BASEURL = process.env.REACT_APP_SAMPLE || "http://localhost:8080/api/v1";

  const onsubmit = () => {
    OnClickLogin();
  };

  const [open, setOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarClass, setSnackbarClass] = useState("");
  const handleClose = () => {
    setOpen(false);
  };

  const action = (
    <button onClick={handleClose}>
      <RxCross2 />
    </button>
  );

  const OnClickLogin = async () => {
    setOpen(true);
    setSnackbarMsg("Please Wait ...");
    setSnackbarClass("default");
    
    try {
      // Log only the email for debugging, never the password
      console.log("Attempting login for:", initialValues.name);
      
      const response = await axios.post(`${BASEURL}/login`, {
        Res_EmailId: initialValues.name,
        Res_Password: initialValues.password,
        Res_TypeOfUser: status,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      if (response?.data?.data) {
        cookies.set("SmartToken", response.data.data, { maxAge: 86400 });
        cookies.set("UserData", {
          emailId: initialValues.name,
          typeOfUser: status
        }, { maxAge: 86400 });

        navigate("/");
        setIsLoggedIn(true);
        sessionStorage.setItem('isLoggedIn', 'true');
        setSnackbarClass("valid");
        setOpen(true);
        setSnackbarMsg("Login successful");
        setRefresher(!refresher);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setSnackbarClass("invalid");
      setOpen(true);
      
      // Handle different types of errors
      if (error.code === 'ERR_NETWORK') {
        setSnackbarMsg("Unable to connect to server. Please check your internet connection.");
      } else if (error.response) {
        // Server responded with an error
        setSnackbarMsg(error.response.data?.message || "Invalid credentials");
      } else if (error.request) {
        // Request was made but no response received
        setSnackbarMsg("Server is not responding. Please try again later.");
      } else {
        // Other errors
        setSnackbarMsg("An unexpected error occurred. Please try again.");
      }
      
      setError(error?.response?.data?.message || "An error occurred");
      console.error("Login error:", error.message);
    }
  };

  const [initialValues, setInitialvalues] = useState({
    name: "",
    password: "",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          onsubmit();
        }}
      >
        {(props) => (
          <Form className="space-y-6">
            <div className="flex items-center mb-8">
              <Link to="/user" className="text-blue-600 hover:text-blue-700 transition-colors">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 ml-4">
                Welcome Back
              </h1>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <Field
                    type="email"
                    name="name"
                    placeholder="Enter your email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={() => {
                  setInitialvalues(props.values);
                  setOpen(true);
                }}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <span>Sign in</span>
                <FaArrowRight className="ml-2" />
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign up
              </Link>
            </div>

            <Snackbar
              className={snackbarClass}
              sx={{ width: "310px" }}
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
              action={action}
              message={snackbarMsg}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            />
          </Form>
        )}
      </Formik>
    </motion.div>
  );
});

export default Fields;

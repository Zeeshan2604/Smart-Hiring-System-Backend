import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import { FiUserPlus, FiSend, FiUsers, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useSnackbar } from "../../Snackbar/Snackbar";
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const AddStudent = React.memo(function AddStudent({ UserDataData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [candidateList, setCandidateList] = useState([]); // Backend candidates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hrName, setHrName] = useState("HR Team"); // New: HR name for email
  const [showConfirm, setShowConfirm] = useState(false);
  const [candidateToRemove, setCandidateToRemove] = useState(null);
  const { showSnackbar } = useSnackbar();
  const nameInputRef = useRef(null);
  const [highlightedEmail, setHighlightedEmail] = useState("");

  const BASEURL = process.env.REACT_APP_SAMPLE;

  // Fetch latest interview to get HR name
  useEffect(() => {
    const fetchLatestInterview = async () => {
      try {
        const orgName = UserDataData?.Name;
        if (!orgName) return;
        // Fetch all interviews for this organization, sort by date desc
        const response = await axios.post(`${BASEURL}/FindResult`, {
          Res_Company_Name: orgName,
        });
        if (response.data && response.data.data && response.data.data.length > 0) {
          // Find the latest interview (by Date_Of_Interview)
          const sorted = response.data.data.sort((a, b) => new Date(b.Date_Of_Interview) - new Date(a.Date_Of_Interview));
          const latest = sorted[0];
          if (latest && latest.HR_Name) setHrName(latest.HR_Name);
        }
      } catch (err) {
        setHrName("HR Team");
      }
    };
    fetchLatestInterview();
    // eslint-disable-next-line
  }, [UserDataData]);

  // Wrap sendAcceptanceEmailToCandidate in useCallback
  const sendAcceptanceEmailToCandidate = useCallback(
    (candidateEmail, candidatename) => {
      const orgName = UserDataData?.Name || "Our Organization";
      const subject = `Congratulations from ${orgName}! Interview Progression`;
      const body = `Dear ${candidatename},\n\nCongratulations on successfully passing the recent interview round at ${orgName}! Your skills and performance have impressed our team.\n\nWe are pleased to inform you that you have advanced to the next stage of our selection process. Our HR team will contact you soon to schedule the next round, which will be conducted with our Technical team.\n\nPlease keep an eye on your email for further instructions and details.\n\nWe wish you the best of luck in the upcoming round!\n\nBest regards,\n${hrName}`;
      const mailToLink = `mailto:${candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailToLink;
    },
    [UserDataData, hrName]
  );

  // Fetch all candidates for this organization
  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const orgName = UserDataData?.Name;
      console.log('[AddStudent] Fetching candidates for org:', orgName);
      const response = await axios.get(`${BASEURL}/getCandidates`, {
        params: { OrganizationName: orgName },
      });
      console.log('[AddStudent] Backend response:', response.data);
      if (response.data.status === "Success") {
        setCandidateList(response.data.data);
      } else {
        setCandidateList([]);
      }
    } catch (err) {
      console.error('[AddStudent] Error fetching candidates:', err);
      setCandidateList([]);
      setError("Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (UserDataData?.Name) {
      console.log('[AddStudent] useEffect triggered, UserDataData:', UserDataData);
      fetchCandidates();
    }
    // eslint-disable-next-line
  }, [UserDataData]);

  // Add candidate to backend
  const handleAddCandidate = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    // Case-insensitive duplicate check on frontend
    if (candidateList.some(c => c.emailId.toLowerCase() === email.trim().toLowerCase())) {
      showSnackbar("The candidate has already been added!", "error");
      return;
    }
    setLoading(true);
    try {
      const orgName = UserDataData?.Name;
      const payload = {
        Name: name,
        emailId: email,
        OrganizationName: orgName,
      };
      const response = await axios.post(`${BASEURL}/addCandidate`, payload);
      if (response.data.status === "Success") {
        showSnackbar("Candidate added!", "success");
        setName("");
        setEmail("");
        fetchCandidates();
        setHighlightedEmail(payload.emailId.toLowerCase());
        setTimeout(() => setHighlightedEmail(""), 2000);
        // Auto-focus name input
        setTimeout(() => nameInputRef.current && nameInputRef.current.focus(), 100);
      } else {
        if (response.data.message === "The candidate does not exist!") {
          showSnackbar("The candidate does not exist!", "error");
        } else if (response.data.message === "The candidate has already been added!") {
          showSnackbar("The candidate has already been added!", "error");
        } else {
          showSnackbar("Failed to add candidate.", "error");
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message === "The candidate does not exist!") {
        showSnackbar("The candidate does not exist!", "error");
      } else if (err.response && err.response.data && err.response.data.message === "The candidate has already been added!") {
        showSnackbar("The candidate has already been added!", "error");
      } else {
        showSnackbar("Failed to add candidate.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear messages on input change
  useEffect(() => {
    setError("");
  }, [name, email]);

  // Remove candidate from backend
  const handleRemoveCandidate = async (candidate) => {
    setShowConfirm(true);
    setCandidateToRemove(candidate);
  };
  const confirmRemove = async () => {
    if (!candidateToRemove) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${BASEURL}/removeCandidate`, {
        emailId: candidateToRemove.emailId,
        OrganizationName: candidateToRemove.OrganizationName,
      });
      if (response.data.status === "Success") {
        showSnackbar("Candidate removed!", "success");
        fetchCandidates();
        setTimeout(() => showSnackbar("Candidate removed!", "success"), 2000);
      } else {
        showSnackbar("Failed to remove candidate.", "error");
      }
    } catch (err) {
      showSnackbar("Failed to remove candidate.", "error");
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setCandidateToRemove(null);
    }
  };
  const cancelRemove = () => {
    setShowConfirm(false);
    setCandidateToRemove(null);
  };

  // Memoize candidate rows for performance
  const candidateRows = useMemo(() => candidateList.map((candidate, idx) => (
    <tr key={candidate._id || idx} className={`bg-white even:bg-blue-50 ${highlightedEmail === candidate.emailId.toLowerCase() ? 'highlight-row' : ''}`} tabIndex={0} aria-label={`Candidate ${candidate.Name}, email ${candidate.emailId}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.Name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{candidate.emailId}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all"
          onClick={() => sendAcceptanceEmailToCandidate(candidate.emailId, candidate.Name)}
          aria-label={`Send mail to ${candidate.Name}`}
        >
          <FiSend /> Send Mail
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition-all"
          onClick={() => handleRemoveCandidate(candidate)}
          aria-label={`Remove ${candidate.Name}`}
        >
          <FiTrash2 /> Remove
        </button>
      </td>
    </tr>
  )), [candidateList, highlightedEmail, sendAcceptanceEmailToCandidate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-blue-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-2">
            <FiUsers className="text-blue-700 text-5xl drop-shadow" />
            <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight drop-shadow">Add Students</h1>
          </div>
          <p className="text-blue-700/70 text-lg text-center max-w-2xl">Add the name and email of the students to allow them for the interview.</p>
        </div>
        {/* Add Candidate Form */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 flex flex-col items-center border-l-8 border-blue-600 relative overflow-hidden">
          <div className="absolute -top-8 right-8 opacity-10 text-[8rem] pointer-events-none select-none">
            <FiUserPlus />
        </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2 z-10">
            <FiUserPlus className="text-blue-600" /> Add Candidate
          </h2>
          <Formik>
            <Form className="w-full z-10" onSubmit={handleAddCandidate}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                  Candidate Name
                  <span className="relative group">
                    <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                    <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter the candidate's full name.</span>
                  </span>
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  placeholder="Enter Name"
                  required
                  className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  inputRef={nameInputRef}
                  aria-label="Candidate Name"
                />
              </div>
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <FaExclamationCircle className="text-red-400" /> {error}
                </motion.div>
              )}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-1">
                  Candidate Email
                  <span className="relative group">
                    <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                    <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter the candidate's email.</span>
                  </span>
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Enter Email"
                  required
                  className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  aria-label="Candidate Email"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-xl shadow-lg transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                aria-disabled={loading}
                aria-busy={loading}
              >
                {loading ? <span className="loader mr-2" /> : <FiCheckCircle />} Add Candidate
              </button>
            </Form>
          </Formik>
        </div>
        {/* Candidate List Table */}
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col border-l-8 border-blue-600 relative overflow-hidden">
          <div className="absolute -top-8 left-8 opacity-10 text-[8rem] pointer-events-none select-none">
            <FiUsers />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2 z-10">
            <FiUsers className="text-blue-600" /> Candidate List
            </h2>
          <div className="overflow-x-auto z-10">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Send Mail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Remove</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidateList.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-blue-600 text-xl font-semibold">
                      <div className="flex flex-col items-center justify-center min-h-[120px]">
                        <FiUsers className="text-4xl mb-2 animate-bounce" />
                        No candidates available.
                      </div>
                    </td>
                  </tr>
                ) : (
                  candidateRows
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Confirm Remove Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center gap-6 border-l-8 border-red-600">
            <div className="text-xl font-bold text-red-700 flex items-center gap-2">
              <FiTrash2 /> Remove Candidate
            </div>
            <div className="text-gray-700 text-lg">Are you sure you want to remove <span className="font-bold">{candidateToRemove?.Name}</span>?</div>
            <div className="flex gap-6 mt-4">
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                onClick={confirmRemove}
              >
                Yes
              </button>
              <button
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-bold"
                onClick={cancelRemove}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AddStudent;

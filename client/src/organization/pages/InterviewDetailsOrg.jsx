import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiBookOpen, FiUsers, FiCalendar, FiClock, FiList, FiCheckCircle, FiXCircle, FiUserPlus, FiTrash2 } from "react-icons/fi";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useSnackbar } from '../../Snackbar/Snackbar';
import Select from 'react-select';

function InterviewDetailsOrg({ UserDataData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [candidates, setCandidates] = useState([]); // [{email, attended, name}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCandidateEmail, setNewCandidateEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [orgCandidates, setOrgCandidates] = useState([]);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [candidateToRemove, setCandidateToRemove] = useState(null);

  // Wrap fetchInterview in useCallback
  const fetchInterview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch interview details
      const response = await axios.post(`${BASEURL}/ViewInterview`, {
        Res_Interview_ID: id,
      });
      if (response.data.status === "Success") {
        setInterview(response.data.data1);
        // Fetch attended status for each candidate
        const emails = response.data.data1.Email_Arrays || [];
        const candidateDetails = await Promise.all(
          emails.map(async (email) => {
            // Try to get candidate name from candidate DB
            let name = "-";
            try {
              const candRes = await axios.get(`${BASEURL}/getCandidateByEmail`, {
                params: { emailId: email, OrganizationName: UserDataData?.Name },
              });
              if (candRes.data.status === "Success" && candRes.data.data.Name) {
                name = candRes.data.data.Name;
              }
            } catch {}
            // Check if attended
            let attended = false;
            try {
              const attRes = await axios.post(`${BASEURL}/CheckInterviewAttempt`, {
                Interview_ID: response.data.data1.Interview_ID,
                Candidate_Email: email,
              });
              attended = attRes.data.hasAttempted;
            } catch {}
            return { email, name, attended };
          })
        );
        setCandidates(candidateDetails);
      } else {
        setError("Interview not found.");
      }
    } catch (err) {
      setError("Failed to fetch interview details.");
    } finally {
      setLoading(false);
    }
  }, [id, BASEURL, UserDataData]);

  // In useEffect:
  useEffect(() => {
    if (id) fetchInterview();
  }, [id, BASEURL, UserDataData, fetchInterview]);

  // Fetch all org candidates for dropdown
  useEffect(() => {
    const fetchOrgCandidates = async () => {
      if (!UserDataData?.Name) return;
      try {
        const res = await axios.get(`${BASEURL}/getCandidates`, {
          params: { OrganizationName: UserDataData.Name },
        });
        if (res.data.status === "Success") {
          setOrgCandidates(res.data.data);
        }
      } catch {}
    };
    fetchOrgCandidates();
  }, [UserDataData, BASEURL]);

  // Add candidate to interview
  const handleAddCandidate = async () => {
    if (!newCandidateEmail) return;
    // Prevent duplicate
    if (interview.Email_Arrays && interview.Email_Arrays.some(e => e.toLowerCase() === newCandidateEmail.toLowerCase())) {
      showSnackbar("Candidate already added to this interview!", "error");
      return;
    }
    setAddLoading(true);
    try {
      const res = await axios.post(`${BASEURL}/addCandidateToInterview`, {
        Interview_ID: interview.Interview_ID,
        Candidate_Email: newCandidateEmail,
      });
      if (res.data.status === "Success") {
        showSnackbar("Candidate added to interview!", "success");
        setAddModalOpen(false);
        setNewCandidateEmail("");
        await fetchInterview();
      } else {
        showSnackbar(res.data.message || "Failed to add candidate.", "error");
      }
    } catch (err) {
      showSnackbar("Failed to add candidate.", "error");
    } finally {
      setAddLoading(false);
    }
  };

  // Remove candidate from interview (with custom modal)
  const handleRemoveCandidate = (email) => {
    setCandidateToRemove(email);
    setRemoveModalOpen(true);
  };
  const confirmRemoveCandidate = async () => {
    setRemoveModalOpen(false);
    if (!candidateToRemove) return;
    try {
      const res = await axios.post(`${BASEURL}/removeCandidateFromInterview`, {
        Interview_ID: interview.Interview_ID,
        Candidate_Email: candidateToRemove,
      });
      if (res.data.status === "Success") {
        showSnackbar("Candidate removed from interview!", "success");
        await fetchInterview();
      } else {
        showSnackbar(res.data.message || "Failed to remove candidate.", "error");
      }
    } catch (err) {
      showSnackbar("Failed to remove candidate.", "error");
    }
    setCandidateToRemove(null);
  };
  const cancelRemoveCandidate = () => {
    setRemoveModalOpen(false);
    setCandidateToRemove(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Arrow Button */}
        <button
          className="mb-6 flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold text-lg focus:outline-none"
          onClick={() => navigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        {loading ? (
          <div className="text-blue-700 font-semibold">Loading interview details...</div>
        ) : error ? (
          <div className="text-red-600 font-semibold">{error}</div>
        ) : interview ? (
          <>
            {/* Interview Details Section */}
            <div className="bg-white rounded-2xl shadow-xl border-l-8 border-blue-600 p-8 mb-10 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -top-8 left-8 opacity-10 text-[6rem] pointer-events-none select-none">
                <FiBookOpen />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-700 text-2xl font-bold flex items-center gap-2"><FiList /> {interview.Name_Technology}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-gray-700 text-lg">
                <div className="flex items-center gap-2"><FiUsers className="text-blue-600" /> <span className="font-semibold">HR:</span> {interview.HR_Name || 'N/A'}</div>
                <div className="flex items-center gap-2"><FiCalendar className="text-blue-600" /> <span className="font-semibold">Date:</span> {interview.Date_Of_Interview ? new Date(interview.Date_Of_Interview).toLocaleDateString() : 'N/A'}</div>
                <div className="flex items-center gap-2"><FiClock className="text-blue-600" /> <span className="font-semibold">Time:</span> {interview.Time_Of_Interview || 'N/A'}</div>
              </div>
              <div className="flex flex-wrap gap-4 text-gray-700 text-lg">
                <div className="flex items-center gap-2"><FiList className="text-blue-600" /> <span className="font-semibold">Questions:</span> {interview.Number_Of_Questions}</div>
                <div className="flex items-center gap-2"><FiClock className="text-blue-600" /> <span className="font-semibold">Duration:</span> {interview.Time_Duration} min</div>
                <div className="flex items-center gap-2"><FiUsers className="text-blue-600" /> <span className="font-semibold">Candidates:</span> {Array.isArray(interview.Email_Arrays) ? interview.Email_Arrays.length : 0}</div>
              </div>
              {interview.Description && (
                <div className="mt-2 text-gray-600 text-base"><span className="font-semibold text-blue-700">Description:</span> {interview.Description}</div>
              )}
              {interview.Instruction && (
                <div className="mt-2 text-gray-600 text-base"><span className="font-semibold text-blue-700">Instruction:</span> {interview.Instruction}</div>
              )}
              {/* Questions Section */}
              {Array.isArray(interview.Question_Arrays) && interview.Question_Arrays.length > 0 && (
                <div className="mt-4">
                  <div className="text-blue-700 font-semibold text-lg mb-2 flex items-center gap-2"><FiList /> Questions</div>
                  <ol className="list-decimal list-inside space-y-1 text-gray-800">
                    {interview.Question_Arrays.map((q, idx) => (
                      <li key={idx} className="pl-2">{q}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            {/* Candidates Section */}
            <div className="bg-white rounded-2xl shadow-xl border-l-8 border-blue-600 p-8 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="text-blue-700 text-2xl" />
                <span className="text-xl font-bold text-blue-700">Candidates</span>
                <button
                  className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow font-semibold"
                  onClick={() => setAddModalOpen(true)}
                >
                  <FiUserPlus /> Add Candidate
                </button>
              </div>
              {candidates.length === 0 ? (
                <div className="text-blue-600">No candidates found for this interview.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Attended</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((cand, idx) => (
                      <tr key={cand.email || idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{cand.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{cand.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cand.attended ? (
                            <span className="flex items-center gap-2 text-green-700 font-semibold"><FiCheckCircle /> Attended</span>
                          ) : (
                            <span className="flex items-center gap-2 text-red-600 font-semibold"><FiXCircle /> Not Attended</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow font-semibold"
                            onClick={() => handleRemoveCandidate(cand.email)}
                          >
                            <FiTrash2 /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Add Candidate Modal */}
            <Modal
              open={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              aria-labelledby="add-candidate-modal-title"
              aria-describedby="add-candidate-modal-description"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #1976d2',
                boxShadow: 24,
                p: 4,
                borderRadius: 3,
                outline: 'none',
              }}>
                <h2 id="add-candidate-modal-title" className="text-xl font-bold mb-4 text-blue-700">Add Candidate to Interview</h2>
                <Select
                  options={orgCandidates
                    .filter(c => !(interview.Email_Arrays || []).some(e => e.toLowerCase() === c.emailId.toLowerCase()))
                    .map(c => ({ value: c.emailId, label: `${c.Name} (${c.emailId})` }))}
                  value={orgCandidates
                    .filter(c => c.emailId === newCandidateEmail)
                    .map(c => ({ value: c.emailId, label: `${c.Name} (${c.emailId})` }))}
                  onChange={opt => setNewCandidateEmail(opt ? opt.value : "")}
                  placeholder="Select candidate email"
                  isClearable
                  classNamePrefix="react-select"
                />
                <button
                  className="w-full mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold"
                  onClick={handleAddCandidate}
                  disabled={addLoading || !newCandidateEmail}
                >
                  {addLoading ? 'Adding...' : 'Add Candidate'}
                </button>
              </Box>
            </Modal>
            {/* Remove Candidate Modal */}
            <Modal
              open={removeModalOpen}
              onClose={cancelRemoveCandidate}
              aria-labelledby="remove-candidate-modal-title"
              aria-describedby="remove-candidate-modal-description"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 350,
                bgcolor: 'background.paper',
                border: '2px solid #ef4444',
                boxShadow: 24,
                p: 4,
                borderRadius: 3,
                outline: 'none',
                textAlign: 'center',
              }}>
                <h2 id="remove-candidate-modal-title" className="text-xl font-bold mb-4 text-red-700">Remove Candidate?</h2>
                <div className="mb-6 text-gray-800">Are you sure you want to remove <span className="font-bold">{candidateToRemove}</span> from this interview?</div>
                <div className="flex gap-4 justify-center">
                  <button
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                    onClick={confirmRemoveCandidate}
                  >
                    Yes
                  </button>
                  <button
                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-bold"
                    onClick={cancelRemoveCandidate}
                  >
                    No
                  </button>
                </div>
              </Box>
            </Modal>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default InterviewDetailsOrg; 
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCode, FiBookOpen, FiAward, FiBriefcase, FiLayers, FiDatabase } from "react-icons/fi";
import { GoProject } from "react-icons/go";
import axios from "axios";

const SearchCandidate = ({ UserDataData }) => {
  const [email, setEmail] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASEURL = process.env.REACT_APP_SAMPLE;

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCandidate(null);
    try {
      const orgName = UserDataData?.Name;
      const response = await axios.get(`${BASEURL}/getCandidateByEmail`, {
        params: { emailId: email, OrganizationName: orgName },
      });
      if (response.data.status === "Success") {
        setCandidate(response.data.data);
      } else {
        setError("Candidate not found.");
      }
    } catch (err) {
      setError("Candidate not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4 mb-2">
            <BsSearch className="text-blue-700 text-5xl drop-shadow" />
            <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow">Search Candidate</h1>
          </div>
          <p className="text-blue-700/70 text-lg text-center max-w-xl">Search for a candidate by email and view their full profile details.</p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter candidate email"
            className="flex-1 px-4 py-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900 text-lg"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-xl shadow-lg transition-all duration-200"
            disabled={loading}
          >
            <BsSearch /> Search
          </button>
        </form>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 font-semibold mb-6">{error}</div>
        )}
        {(!candidate && !loading && !error) && (
          <div className="flex flex-col items-center justify-center py-16 text-blue-600/80">
            <BsSearch className="text-7xl mb-4 animate-pulse" />
            <div className="text-2xl font-bold mb-2">No candidate selected</div>
            <div className="text-lg text-blue-700/70 max-w-md text-center">Search for a candidate by entering their email above. Their profile will appear here when found.</div>
          </div>
        )}
        {candidate && (
          <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-2xl border-l-8 border-blue-600 p-0 overflow-hidden max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center justify-center bg-blue-700 py-8 rounded-t-3xl shadow-md">
              <div className="bg-white rounded-full p-3 shadow-lg mb-3 border-4 border-blue-200">
                <FiUser className="text-blue-700 text-5xl" />
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-2">
                {candidate.Name || 'N/A'}
              </h2>
              <div className="text-blue-100/80 text-lg flex items-center gap-2">
                <FiMail className="inline-block mr-1 text-2xl align-middle" /> {candidate.emailId || 'N/A'}
              </div>
            </div>
            {/* Details Section */}
            <div className="p-10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-7 bg-white rounded-b-3xl">
              <div className="space-y-6">
                <div>
                  <div className="text-blue-700 font-bold text-lg mb-2 flex items-center gap-2"><FiUser className="text-2xl align-middle" /> Personal Info</div>
                  <div className="flex items-center mb-2"><FiPhone className="mr-2 text-blue-600 text-2xl align-middle" /> <span className="font-semibold">Phone:</span> <span className="ml-2 break-words whitespace-pre-line text-wrap">{candidate.PhoneNumber || 'N/A'}</span></div>
                  <div className="flex items-center mb-2"><FiMapPin className="mr-2 text-blue-600 text-2xl align-middle" /> <span className="font-semibold">Address:</span> <span className="ml-2 break-words whitespace-pre-line text-wrap">{candidate.Address || 'N/A'}</span></div>
                </div>
                <div>
                  <div className="text-blue-700 font-bold text-lg mb-2 flex items-center gap-2"><FiCode className="text-2xl align-middle" /> Technical Skills</div>
                  <div className="flex items-center mb-2"><FiCode className="mr-2 text-blue-600 text-2xl align-middle" /> <span className="font-semibold">Programming Languages:</span> <span className="ml-2 break-words whitespace-pre-line text-wrap">{candidate.TechinalSkillsProgrammingLanguage || 'N/A'}</span></div>
                  <div className="flex items-center mb-2"><FiLayers className="mr-2 text-blue-600 text-2xl align-middle" /> <span className="font-semibold">Frameworks:</span> <span className="ml-2 break-words whitespace-pre-line text-wrap">{candidate.TechnicalSkillsFrameworks || 'N/A'}</span></div>
                  <div className="flex items-center mb-2"><FiDatabase className="mr-2 text-blue-600 text-2xl align-middle" /> <span className="font-semibold">Databases:</span> <span className="ml-2 break-words whitespace-pre-line text-wrap">{candidate.TechnicalSkillsDatabase || 'N/A'}</span></div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-blue-700 font-bold text-lg mb-2 flex items-center gap-2"><FiBookOpen className="text-2xl align-middle" /> Achievements</div>
                  <div className="flex items-center mb-2"><GoProject className="mr-2 text-blue-600 text-3xl align-middle" /> <span className="font-semibold">Project Details:</span> <span className="ml-2 break-words whitespace-pre-line text-wrap">{candidate.PastPerformanceProjectDetails || 'N/A'}</span></div>
                  <div className="flex items-center mb-2"><FiBriefcase className="mr-2 text-blue-600 text-3xl align-middle" /> <span className="font-semibold">Internship Details:</span> <span className="ml-2 break-words whitespace-pre-line text-wrap">{candidate.PastPerformanceInternshipDetails || 'N/A'}</span></div>
                  <div className="flex items-center mb-2"><FiAward className="mr-2 text-blue-600 text-3xl align-middle" /> <span className="font-semibold">Hackathon Details:</span> <span className="ml-2 break-words whitespace-pre-line text-wrap">{candidate.PastPerformanceHackathonDetails || 'N/A'}</span></div>
                </div>
                <div>
                  <div className="text-blue-700 font-bold text-lg mb-2 flex items-center gap-2"><FiBookOpen className="text-2xl align-middle" /> Resume</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCandidate; 
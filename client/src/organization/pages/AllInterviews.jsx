import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiBookOpen, FiUsers, FiCalendar, FiClock, FiList } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function AllInterviews({ UserDataData }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      setError("");
      try {
        const orgName = UserDataData?.Name;
        if (!orgName) return;
        const response = await axios.post(`${BASEURL}/ViewAllInterviews`, {
          Company_Name: orgName,
        });
        if (response.data.status === "Success") {
          setInterviews(response.data.data);
        } else {
          setError("No interviews found.");
        }
      } catch (err) {
        setError("Failed to fetch interviews.");
      } finally {
        setLoading(false);
      }
    };
    if (UserDataData?.Name) fetchInterviews();
  }, [UserDataData, BASEURL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-2">
            <FiList className="text-blue-700 text-5xl drop-shadow" />
            <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight drop-shadow">All Interviews</h1>
          </div>
          <p className="text-blue-700/70 text-lg text-center max-w-2xl">View all interviews created by your organization.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col border-l-8 border-blue-600 relative overflow-hidden">
          <div className="absolute -top-8 left-8 opacity-10 text-[8rem] pointer-events-none select-none">
            <FiBookOpen />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2 z-10">
            <FiUsers className="text-blue-600" /> Interview List
          </h2>
          {loading ? (
            <div className="text-blue-700 font-semibold">Loading interviews...</div>
          ) : error ? (
            <div className="text-red-600 font-semibold">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10">
              {interviews.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center min-h-[120px]">
                  <FiList className="text-4xl mb-2 animate-bounce text-blue-600" />
                  <span className="text-blue-600 text-xl font-semibold">No interviews available.</span>
                </div>
              ) : (
                interviews.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="bg-white rounded-2xl shadow-xl border-l-8 border-blue-600 p-8 flex flex-col gap-4 relative overflow-hidden hover:shadow-2xl transition-all"
                  >
                    <div className="absolute -top-8 left-8 opacity-10 text-[6rem] pointer-events-none select-none">
                      <FiBookOpen />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-blue-700 text-2xl font-bold flex items-center gap-2"><FiList /> {item.Name_Technology}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-gray-700 text-lg">
                      <div className="flex items-center gap-2"><FiUsers className="text-blue-600" /> <span className="font-semibold">HR:</span> {item.HR_Name || 'N/A'}</div>
                      <div className="flex items-center gap-2"><FiCalendar className="text-blue-600" /> <span className="font-semibold">Date:</span> {item.Date_Of_Interview ? new Date(item.Date_Of_Interview).toLocaleDateString() : 'N/A'}</div>
                      <div className="flex items-center gap-2"><FiClock className="text-blue-600" /> <span className="font-semibold">Time:</span> {item.Time_Of_Interview || 'N/A'}</div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-gray-700 text-lg">
                      <div className="flex items-center gap-2"><FiList className="text-blue-600" /> <span className="font-semibold">Questions:</span> {item.Number_Of_Questions}</div>
                      <div className="flex items-center gap-2"><FiClock className="text-blue-600" /> <span className="font-semibold">Duration:</span> {item.Time_Duration} min</div>
                      <div className="flex items-center gap-2"><FiUsers className="text-blue-600" /> <span className="font-semibold">Candidates:</span> {Array.isArray(item.Email_Arrays) ? item.Email_Arrays.length : 0}</div>
                    </div>
                    {item.Description && (
                      <div className="mt-2 text-gray-600 text-base"><span className="font-semibold text-blue-700">Description:</span> {item.Description}</div>
                    )}
                    {item.Instruction && (
                      <div className="mt-2 text-gray-600 text-base"><span className="font-semibold text-blue-700">Instruction:</span> {item.Instruction}</div>
                    )}
                    {Array.isArray(item.Email_Arrays) && item.Email_Arrays.length > 0 && (
                      <div className="mt-2">
                      </div>
                    )}
                    <div className="flex justify-end mt-4">
                      <button
                        className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow transition-all"
                        onClick={() => navigate(`/interview-details/${item.Interview_ID}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllInterviews; 
import React, { useState, useEffect } from "react";
import CardList from "./CardList";
import axios from "axios";
import Cookies from "universal-cookie";
import { FaBriefcase, FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";

const InterviewList = React.memo(function InterviewList({ setItrId, UserDataData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, upcoming, completed
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0
  });
  const [interviewList, setInterviewList] = useState([]);
  const BASEURL = process.env.REACT_APP_SAMPLE;

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const cookies = new Cookies();
        const userData = cookies.get("UserData");
        if (!userData || !userData.emailId) return;

        const response = await axios.post(`${BASEURL}/ViewInterviewList`, {
          Res_Interviewer_Email: userData.emailId,
        });

        const interviews = response.data.data1;
        
        // Check attempts for each interview
        const interviewsWithAttempts = await Promise.all(
          interviews.map(async (interview) => {
            try {
              const attemptResponse = await axios.post(`${BASEURL}/CheckInterviewAttempt`, {
                Interview_ID: interview.Interview_ID,
                Candidate_Email: userData.emailId
              });
              return {
                ...interview,
                hasAttempted: attemptResponse.data.hasAttempted
              };
            } catch (error) {
              console.error("Error checking attempt for interview:", interview.Interview_ID, error);
              return {
                ...interview,
                hasAttempted: false
              };
            }
          })
        );

        setInterviewList(interviewsWithAttempts);

        // Calculate statistics
        const now = new Date();
        const stats = interviewsWithAttempts.reduce((acc, interview) => {
          const interviewDate = new Date(interview.Date_Of_Interview);

          acc.total++;
          if (interviewDate > now) {
            acc.upcoming++;
          }
          if (interview.hasAttempted) {
            acc.completed++;
          }
          return acc;
        }, { total: 0, upcoming: 0, completed: 0 });

        setStats(stats);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterviews();
  }, [BASEURL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Interview Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through available interviews and showcase your skills. Each interview is an opportunity to demonstrate your expertise and grow professionally.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("upcoming")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filterStatus === "upcoming"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filterStatus === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <FaBriefcase className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <FaCalendarAlt className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <FaClock className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Interview Cards Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <CardList 
            cards={interviewList} 
            UserDataData={UserDataData} 
            setItrId={setItrId}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
          />
        </div>
      </div>
    </div>
  );
});

export default InterviewList;

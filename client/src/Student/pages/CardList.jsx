import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import DateConverter from "../../assets/DateConverter";
// import { Button } from "@mui/material";
import { FaBuilding, FaCalendarAlt, FaClock, FaQuestionCircle, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Card = React.memo(({
  organization,
  jobPosition,
  interviewDate,
  interviewTime,
  qsnNumber,
  timeDuration,
  jobDesc,
  id,
  setItrId,
  visited_Array,
  testEmail,
  card,
  searchTerm,
  filterStatus
}) => {
  // const [validIntr, setValidIntr] = useState(false);
  const [, setLoading] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [attemptScore, setAttemptScore] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const BASEURL = process.env.REACT_APP_SAMPLE;

  useEffect(() => {
    const cookies = new Cookies();
    const checkAttempt = async () => {
      try {
        const userData = cookies.get("UserData");
        if (!userData || !userData.emailId) {
          console.log("User data not found in cookies");
          return;
        }

        const response = await axios.post(`${BASEURL}/CheckInterviewAttempt`, {
          Interview_ID: card.Interview_ID,
          Candidate_Email: userData.emailId
        });
        
        if (response.data.hasAttempted) {
          setHasAttempted(true);
          setAttemptScore(response.data.attempt.Score);
          setTotalAttempts(response.data.totalAttempts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking interview attempt:", error);
        setLoading(false);
      }
    };
    checkAttempt();
  }, [BASEURL, card.Interview_ID]);

  // Calculate interview status
  const now = new Date();
  const startDate = new Date(interviewDate);
  // Use the organization-set validity period
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (card.Validity_Period || 30)); // Fallback to 30 days if not set

  const isUpcoming = startDate > now;
  const isActive = now >= startDate && now <= endDate;
  // const isExpired = now > endDate;

  // Filter logic
  const matchesSearch = 
    organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jobDesc.toLowerCase().includes(searchTerm.toLowerCase());

  const shouldShow = matchesSearch && (
    filterStatus === "all" ||
    (filterStatus === "upcoming" && isUpcoming) ||
    (filterStatus === "completed" && hasAttempted)
  );

  if (!shouldShow) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full">
      <div className="p-6 flex flex-col h-full flex-1 justify-between">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {jobPosition}
            </h3>
            <div className="flex items-center text-gray-600">
              <FaBuilding className="mr-2 text-blue-500" />
              <span className="font-medium">{organization}</span>
            </div>
          </div>
          <div className="flex items-center">
            {hasAttempted ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                <FaCheckCircle className="mr-1.5" />
                Completed
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <FaClock className="mr-1.5" />
                Upcoming
              </span>
            ) : isActive ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                <FaHourglassHalf className="mr-1.5" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                <FaTimesCircle className="mr-1.5" />
                Expired
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-2 text-sm">
          {jobDesc}
        </p>

        {/* Interview Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            <span className="text-sm">Start: {DateConverter(interviewDate, "Date")}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="mr-2 text-blue-500" />
            <span className="text-sm">{interviewTime}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaQuestionCircle className="mr-2 text-blue-500" />
            <span className="text-sm">{qsnNumber} Questions</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaHourglassHalf className="mr-2 text-blue-500" />
            <span className="text-sm">Valid until: {DateConverter(endDate.toISOString(), "Date")}</span>
          </div>
        </div>

        {/* Score and Attempts */}
        {hasAttempted && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Latest Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {attemptScore?.toFixed(1)}%
                </p>
              </div>
              {totalAttempts > 1 && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Attempts</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {totalAttempts}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {(isUpcoming || isActive) && (
          <Link to="/interview" className="block">
            <button
              onClick={() => setItrId(card.Interview_ID)}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                hasAttempted
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {hasAttempted ? "Retake Interview" : "Start Interview"}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
});

const CardList = React.memo(({ cards, UserDataData, setItrId, searchTerm, filterStatus }) => {
  const [testEmail, setTestEmail] = useState("");
  const [IntrList, setIntrList] = useState([]);
  const BASEURL = process.env.REACT_APP_SAMPLE;

  const findInterviewList = useCallback(async () => {
    await axios
      .post(`${BASEURL}/ViewInterviewList`, {
        Res_Interviewer_Email: testEmail,
      })
      .then((Data) => {
        setIntrList(Data.data.data1);
      })
      .catch((ErrorR) => {
        console.log("kkkkk", ErrorR);
      });
  }, [BASEURL, testEmail]);

  useEffect(() => {
    
    setTestEmail(UserDataData.emailId);
    findInterviewList();
  }, [BASEURL, UserDataData.emailId, findInterviewList]);

  // Memoize the mapped Card components for performance
  const cardComponents = useMemo(() => IntrList.map((card, index) => (
    <Card
      key={index}
      organization={card.Company_Name}
      jobPosition={card.Name_Technology}
      jobDesc={card.Description}
      interviewDate={card.Date_Of_Interview}
      interviewTime={card.Time_Of_Interview}
      qsnNumber={card.Number_Of_Questions}
      timeDuration={card.Time_Duration}
      setItrId={setItrId}
      card={card}
      searchTerm={searchTerm}
      filterStatus={filterStatus}
    />
  )), [IntrList, setItrId, searchTerm, filterStatus]);

  if (IntrList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <FaBuilding className="mx-auto text-6xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Interviews Found</h3>
        <p className="text-gray-500">There are no interviews available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardComponents}
    </div>
  );
});

export default CardList;

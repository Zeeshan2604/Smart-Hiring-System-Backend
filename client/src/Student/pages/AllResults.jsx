import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import DateConverter from "../../assets/DateConverter";

const AllResults = React.memo(() => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const userData = cookies.get("UserData");
        if (!userData || !userData.emailId) {
          console.log("User data not found in cookies");
          return;
        }

        const response = await axios.post(`${BASEURL}/GetCandidateResults`, {
          Candidate_Email: userData.emailId
        });

        if (response.data.status === "Success") {
          // Sort results by date in descending order (most recent first)
          const sortedResults = response.data.data.sort((a, b) => 
            new Date(b.Date_Of_Interview) - new Date(a.Date_Of_Interview)
          );
          setResults(sortedResults);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Memoize the mapped result cards for performance
  const resultCards = useMemo(() => results.map((result, index) => (
    <div
      key={index}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="p-6 flex flex-col h-full flex-1 justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {result.Name_Technology}
            </h3>
            <p className="text-sm text-gray-500">
              {result.Company_Name}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {result.Overall_Percentage?.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date:</span>
            <span className="text-gray-900">
              {DateConverter(result.Date_Of_Interview, "Date")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time:</span>
            <span className="text-gray-900">{result.Time_Of_Interview}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Questions:</span>
            <span className="text-gray-900">{result.Number_Of_Questions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duration:</span>
            <span className="text-gray-900">{result.Time_Duration} mins</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Text Score</p>
              <p className="text-lg font-semibold text-gray-900">
                {result.Text_Percentage?.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time Score</p>
              <p className="text-lg font-semibold text-gray-900">
                {result.Time_Percentage?.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/viewresult/${result._id}`)}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          View Detailed Results
        </button>
      </div>
    </div>
  )), [results, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Interview Results</h1>
          <p className="mt-2 text-gray-600">View all your interview performances</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No interview results found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resultCards}
          </div>
        )}
      </div>
    </div>
  );
});

export default AllResults; 
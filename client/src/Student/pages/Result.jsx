import React, { useEffect, useState, useMemo } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { FaChartBar, FaChartLine, FaChartPie, FaSmile, FaRegSmile, FaCalendarAlt, FaClock, FaQuestionCircle, FaHourglassHalf, FaFileAlt, FaStopwatch, FaArrowRight, FaArrowLeft, FaHeart, FaFrown, FaAngry, FaSurprise, FaMeh } from "react-icons/fa";
import axios from "axios";
import Cookies from "universal-cookie";
import DateConverter from "../../assets/DateConverter";
import { useNavigate, useLocation } from "react-router-dom";

const Result = ({ UserDataData }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailedResult, setDetailedResult] = useState(null);
  const BASEURL = process.env.REACT_APP_SAMPLE;
  const navigate = useNavigate();
  const location = useLocation();

  // --- Memoized values for detailedResult ---
  // These will be empty/default if detailedResult is null
  let rawArray = useMemo(() => Array.isArray(detailedResult?.result1) ? detailedResult.result1 : [], [detailedResult]);
  const scores = useMemo(() => rawArray.filter(val => typeof val === 'number'), [rawArray]);
  const emotionData = useMemo(() => {
    if (rawArray.length > 0) {
      if (rawArray[0] && typeof rawArray[0] === 'object' && rawArray[0].Emotions) {
        return rawArray.map(faceObj => {
          if (!faceObj.Emotions) return null;
          const summary = {};
          faceObj.Emotions.forEach(e => {
            if (e.Type && typeof e.Confidence === 'number') {
              summary[e.Type.toUpperCase()] = e.Confidence;
            }
          });
          return summary;
        }).filter(Boolean);
      } else {
        return rawArray.filter(frame => frame && typeof frame === 'object' && !Array.isArray(frame) && !frame.BoundingBox && !frame.AgeRange);
      }
    }
    return [];
  }, [rawArray]);
  // Memoize chart data
  const data = useMemo(() => {
    const questionArray = detailedResult?.interviewData?.Question_Arrays || [];
    return {
      labels: questionArray.map((_, index) => `Question ${index + 1}`),
      datasets: [
        {
          label: "Score resultlist",
          backgroundColor: "rgba(46, 204, 113,0.2)",
          borderColor: "rgba(46, 204, 113,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(46, 204, 113,0.4)",
          hoverBorderColor: "rgba(46, 204, 113,1)",
          data: scores,
        },
      ],
    };
  }, [detailedResult, scores]);

  useEffect(() => {
    // Check if we have detailed result data in location state
    if (location.state) {
      setDetailedResult(location.state);
      setLoading(false);
      return;
    }

    // Only fetch results list if we don't have detailed result data
    const fetchResults = async () => {
      try {
        const cookies = new Cookies();
        const userData = cookies.get("UserData");
        console.log("User data from cookies:", userData);

        if (!userData || !userData.emailId) {
          console.log("User data not found in cookies");
          return;
        }

        console.log("Fetching results for email:", userData.emailId);
        const response = await axios.post(`${BASEURL}/GetCandidateResults`, {
          Candidate_Email: userData.emailId
        });

        console.log("API Response:", response.data);

        if (response.data.status === "Success") {
          const sortedResults = response.data.data.sort((a, b) => 
            new Date(b.Date_Of_Interview) - new Date(a.Date_Of_Interview)
          );
          console.log("Sorted results:", sortedResults);
          setResults(sortedResults);
        } else {
          console.log("API returned non-success status:", response.data.status);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        console.error("Error details:", error.response?.data);
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.state, BASEURL]);

  const handleViewDetails = (result) => {
    // Store the result data in localStorage for the detailed view
    localStorage.setItem("AWSResult", JSON.stringify(result.Performance_Array));
    localStorage.setItem("InterviewData", JSON.stringify({
      Question_Arrays: result.Question_Arrays,
      Candidate_Name: result.Candidate_Name
    }));

    // Extract emotion data from AWS Rekognition face objects if present
    let emotionData = [];
    if (Array.isArray(result.Performance_Array) && result.Performance_Array.length > 0) {
      // If the first element has an 'Emotions' array, assume AWS Rekognition format
      if (result.Performance_Array[0] && result.Performance_Array[0].Emotions) {
        emotionData = result.Performance_Array.map(faceObj => {
          if (!faceObj.Emotions) return null;
          // Convert AWS Rekognition Emotions array to a summary object
          const summary = {};
          faceObj.Emotions.forEach(e => {
            if (e.Type && typeof e.Confidence === 'number') {
              summary[e.Type.toUpperCase()] = e.Confidence;
            }
          });
          return summary;
        }).filter(Boolean);
      } else {
        // Already in summary format
        emotionData = result.Performance_Array.filter(frame => frame && typeof frame === 'object' && !Array.isArray(frame) && Object.keys(frame).length > 0 && !frame.BoundingBox);
      }
    }
    // Set the detailed result state directly
    setDetailedResult({
      result1: result.Performance_Array,
      result2: result.Overall_Percentage,
      result3: result.Time_Percentage,
      interviewData: {
        Question_Arrays: result.Question_Arrays,
        Candidate_Name: result.Candidate_Name
      },
      toneScores: result.Tone_Scores || [],
      emotionData: emotionData
    });
  };

  const handleBackToResults = () => {
    setDetailedResult(null);
    navigate('/viewresult', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your results...</p>
        </div>
      </div>
    );
  }

  // If we have detailed result data, show the detailed view
  if (detailedResult) {
    // --- Fix: Extract only numeric scores and emotion summaries ---
    const { result2, result3, interviewData, toneScores } = detailedResult;
    const questionArray = interviewData?.Question_Arrays || [];
    const candidateName = interviewData?.Candidate_Name || "Candidate";
    const overall = result2 || 0;
    const confidenceScore = result3 || 0;

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            font: {
              size: 12,
              family: "'Poppins', sans-serif"
            }
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
              family: "'Poppins', sans-serif"
            }
          }
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    };

    const datapi = data.labels.map((label, index) => ({
      labels: [`${label} Correct`, `${label} Incorrect`],
      datasets: [
        {
          data: [scores[index], 100 - scores[index]],
          backgroundColor: ["rgba(46, 204, 113, 0.5)", "rgba(231, 76, 60, 0.5)"],
          borderColor: ["rgba(46, 204, 113, 1)", "rgba(231, 76, 60, 1)"],
          borderWidth: 1,
        },
      ],
    }));

    const datarespie = {
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          data: [overall, 100 - overall],
          backgroundColor: ["rgba(46, 204, 113,0.2)", "rgba(255, 99, 132,0.2)"],
          borderColor: ["rgba(46, 204, 113,1)", "rgba(255, 99, 132,1)"],
          borderWidth: 1,
        },
      ],
    };

    const datares2pie = {
      labels: ["Positive Face", "Negative Face"],
      datasets: [
        {
          data: [confidenceScore, 100 - confidenceScore],
          backgroundColor: ["rgba(255, 165, 0, 0.5)", "rgba(255, 99, 132,0.2)"],
          borderColor: ["rgba(46, 204, 113,1)", "rgba(255, 99, 132,1)"],
          borderWidth: 1,
        },
      ],
    };

    const optionsrespie = {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            font: {
              size: 12,
              family: "'Poppins', sans-serif"
            }
          }
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    };

    return (
      <div className="w-11/12 ml-auto p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with Back Button */}
          <div className="mb-8">
            <button
              onClick={handleBackToResults}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" />
              <span className="font-medium">Back to Results</span>
            </button>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Interview Results</h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-700">Candidate</h2>
                <p className="text-2xl font-bold text-blue-900">{candidateName}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-700">Overall Score</h2>
                <p className="text-2xl font-bold text-green-600">{overall}%</p>
              </div>
            </div>
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FaChartBar className="text-blue-900 text-2xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Question-wise Performance</h3>
              </div>
              <div className="h-80">
                <Bar data={data} options={options} />
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FaChartLine className="text-blue-900 text-2xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Performance Trend</h3>
              </div>
              <div className="h-80">
                <Line data={data} options={options} />
              </div>
            </div>
          </div>

          {/* Pie Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Overall Performance Pie */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FaChartPie className="text-blue-900 text-2xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Overall Performance</h3>
              </div>
              <div className="h-80">
                <Pie data={datarespie} options={optionsrespie} />
              </div>
            </div>

            {/* Facial Analysis Pie */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FaSmile className="text-blue-900 text-2xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Facial Analysis</h3>
              </div>
              <div className="h-80">
                <Pie data={datares2pie} options={optionsrespie} />
              </div>
            </div>
          </div>

          {/* Emotion Analysis Section */}
          <div className="mb-12">
            <EmotionLineGraph emotionData={emotionData} />
          </div>

          {/* Question-wise Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Detailed Question Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questionArray && questionArray.length > 0 ? (
                questionArray.map((question, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-blue-900">Question {index + 1}</h4>
                        <p className="text-sm text-gray-600 mt-1">{question}</p>
                      </div>
                      <div className="text-right">
                          <div className="mb-2">
                            <span className="text-lg font-bold text-green-600">{scores[index]}%</span>
                            <p className="text-xs text-gray-500">Content Score</p>
                          </div>
                          {toneScores && toneScores[index] !== undefined && (
                            <div>
                              <span className="text-lg font-bold text-purple-600">{toneScores[index]}%</span>
                              <p className="text-xs text-gray-500">Tone Score</p>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="h-48">
                      <Pie data={datapi[index]} options={optionsrespie} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">No questions available for analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the list view if no detailed result
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Interview Results</h1>
          <p className="text-lg text-gray-600">Track your progress and performance across all interviews</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChartBar className="text-gray-400 text-2xl" />
            </div>
            <p className="text-xl text-gray-600 mb-2">No interview results found</p>
            <p className="text-gray-500">Complete an interview to see your results here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Header Section */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {result.Name_Technology}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {result.Company_Name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        result.Overall_Percentage >= 70 ? 'bg-green-100 text-green-800' :
                        result.Overall_Percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.Overall_Percentage?.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Interview Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-3 text-blue-500" />
                      <span>{DateConverter(result.Date_Of_Interview, "Date")}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-3 text-blue-500" />
                      <span>{result.Time_Of_Interview}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaQuestionCircle className="mr-3 text-blue-500" />
                      <span>{result.Number_Of_Questions} Questions</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaHourglassHalf className="mr-3 text-blue-500" />
                      <span>{result.Time_Duration} mins</span>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <FaFileAlt className="text-blue-500 mr-2" />
                          <p className="text-sm font-medium text-gray-600">Text Score</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {result.Text_Percentage?.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <FaStopwatch className="text-blue-500 mr-2" />
                          <p className="text-sm font-medium text-gray-600">Time Score</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {result.Time_Percentage?.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(result)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <span>View Detailed Results</span>
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Emotion Line Graph Component
const EmotionLineGraph = ({ emotionData }) => {
  if (!emotionData || emotionData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaHeart className="text-red-500 mr-2" />
          Emotion Analysis
        </h3>
        <div className="text-center py-8">
          <FaMeh className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No emotion data available</p>
        </div>
      </div>
    );
  }

  // Process emotion data for the chart
  const chartData = {
    labels: emotionData.map((_, index) => `Frame ${index + 1}`),
    datasets: [
      {
        label: 'Happy',
        data: emotionData.map(frame => frame?.HAPPY || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Calm',
        data: emotionData.map(frame => frame?.CALM || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Angry',
        data: emotionData.map(frame => frame?.ANGRY || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Sad',
        data: emotionData.map(frame => frame?.SAD || 0),
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        tension: 0.4
      },
      {
        label: 'Fear',
        data: emotionData.map(frame => frame?.FEAR || 0),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4
      },
      {
        label: 'Disgusted',
        data: emotionData.map(frame => frame?.DISGUSTED || 0),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Emotion Analysis Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Emotion Intensity (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Video Frames'
        }
      }
    }
  };

  // Calculate emotion statistics
  const emotionStats = {
    happy: emotionData.reduce((sum, frame) => sum + (frame?.HAPPY || 0), 0) / emotionData.length,
    calm: emotionData.reduce((sum, frame) => sum + (frame?.CALM || 0), 0) / emotionData.length,
    angry: emotionData.reduce((sum, frame) => sum + (frame?.ANGRY || 0), 0) / emotionData.length,
    sad: emotionData.reduce((sum, frame) => sum + (frame?.SAD || 0), 0) / emotionData.length,
    fear: emotionData.reduce((sum, frame) => sum + (frame?.FEAR || 0), 0) / emotionData.length,
    disgusted: emotionData.reduce((sum, frame) => sum + (frame?.DISGUSTED || 0), 0) / emotionData.length
  };

  const dominantEmotion = Object.entries(emotionStats).reduce((a, b) => emotionStats[a] > emotionStats[b] ? a : b);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaHeart className="text-red-500 mr-2" />
        Emotion Analysis
      </h3>
      
      {/* Emotion Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <FaSmile className="text-green-500 text-2xl mx-auto mb-2" />
          <p className="text-sm text-gray-600">Happy</p>
          <p className="text-lg font-semibold text-green-700">{emotionStats.happy.toFixed(1)}%</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <FaRegSmile className="text-blue-500 text-2xl mx-auto mb-2" />
          <p className="text-sm text-gray-600">Calm</p>
          <p className="text-lg font-semibold text-blue-700">{emotionStats.calm.toFixed(1)}%</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <FaAngry className="text-red-500 text-2xl mx-auto mb-2" />
          <p className="text-sm text-gray-600">Angry</p>
          <p className="text-lg font-semibold text-red-700">{emotionStats.angry.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <FaFrown className="text-gray-500 text-2xl mx-auto mb-2" />
          <p className="text-sm text-gray-600">Sad</p>
          <p className="text-lg font-semibold text-gray-700">{emotionStats.sad.toFixed(1)}%</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <FaSurprise className="text-purple-500 text-2xl mx-auto mb-2" />
          <p className="text-sm text-gray-600">Fear</p>
          <p className="text-lg font-semibold text-purple-700">{emotionStats.fear.toFixed(1)}%</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <FaMeh className="text-yellow-500 text-2xl mx-auto mb-2" />
          <p className="text-sm text-gray-600">Disgusted</p>
          <p className="text-lg font-semibold text-yellow-700">{emotionStats.disgusted.toFixed(1)}%</p>
        </div>
      </div>

      {/* Dominant Emotion */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-2">Dominant Emotion</h4>
        <p className="text-2xl font-bold text-indigo-600 capitalize">{dominantEmotion}</p>
        <p className="text-sm text-gray-600">Most frequently detected emotion during the interview</p>
      </div>

      {/* Line Chart */}
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Result;

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBarChart2, FiUser, FiMail, FiClock, FiList, FiBookOpen, FiVideo, FiVolume2, FiArrowLeft } from "react-icons/fi";

const OrganizationCandidateResult = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BASEURL = process.env.REACT_APP_SAMPLE;

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(`${BASEURL}/FindResult`, {
          Result_ID: resultId,
        });
        console.log('Detailed result API response:', response.data);
        if (response.data.status === "Success" || response.data.message?.includes("successfully")) {
          setResult(response.data.data);
        } else {
          setError("No result found.");
        }
      } catch (err) {
        setError("Failed to fetch result.");
      } finally {
        setLoading(false);
      }
    };
    if (resultId) fetchResult();
  }, [resultId, BASEURL]);

  // Memoize emotion data rows for performance
  const emotionRows = useMemo(() => {
    if (!Array.isArray(result?.Performance_Array)) return null;
    return result.Performance_Array.map((frame, idx) => {
      // AWS Rekognition format
      if (frame && frame.Emotions && Array.isArray(frame.Emotions)) {
        return (
          <tr key={idx}>
            <td className="px-4 py-2">{idx + 1}</td>
            <td className="px-4 py-2">
              {frame.Emotions.map((e, i) => (
                <span key={i} className="inline-block mr-2">
                  <span className="font-semibold text-blue-700">{e.Type}:</span> {e.Confidence.toFixed(1)}%
                </span>
              ))}
            </td>
          </tr>
        );
      }
      // Already summarized format
      if (frame && typeof frame === 'object' && !Array.isArray(frame)) {
        return (
          <tr key={idx}>
            <td className="px-4 py-2">{idx + 1}</td>
            <td className="px-4 py-2">
              {Object.entries(frame).map(([emotion, value], i) => (
                <span key={i} className="inline-block mr-2">
                  <span className="font-semibold text-blue-700">{emotion}:</span> {typeof value === 'number' ? value.toFixed(1) : value}%
                </span>
              ))}
            </td>
          </tr>
        );
      }
      return null;
    });
  }, [result?.Performance_Array]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-blue-700 font-medium">Loading result...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <FiBarChart2 className="text-6xl text-blue-600 mb-4" />
        <p className="text-2xl text-blue-700 font-bold mb-2">No result available</p>
        <p className="text-blue-700/70 mb-6">{error || "No detailed result found for this candidate."}</p>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow">
          <FiArrowLeft /> Back
        </button>
      </div>
    );
  }

  // Placeholder: video/audio URL fields (update if backend provides these)
  const videoUrl = result.videoUrl || result.VideoUrl || result.video_url || "";
  const audioUrl = result.audioUrl || result.AudioUrl || result.audio_url || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow">
          <FiArrowLeft /> Back to Results
        </button>
        <div className="bg-white rounded-3xl shadow-2xl border-l-8 border-blue-600 p-10 relative overflow-hidden">
          <div className="absolute -top-8 left-8 opacity-10 text-[8rem] pointer-events-none select-none">
            <FiBarChart2 />
          </div>
          <div className="flex flex-col md:flex-row gap-10 mb-10">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-3xl font-extrabold text-blue-700 mb-2">
                <FiUser className="text-blue-600" /> {result.Candidate_Name || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-blue-700/80 text-lg">
                <FiMail /> {result.Candidate_Email || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-blue-700/80 text-lg">
                <FiBookOpen /> {result.Name_Technology || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-blue-700/80 text-lg">
                <FiClock /> {result.Time_Of_Interview || "N/A"} on {result.Date_Of_Interview ? new Date(result.Date_Of_Interview).toLocaleDateString() : "N/A"}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2"><FiList /> Interview Details</div>
              <div><span className="font-semibold">HR Name:</span> {result.HR_Name || "N/A"}</div>
              <div><span className="font-semibold">Number of Questions:</span> {result.Number_Of_Questions || "N/A"}</div>
              <div><span className="font-semibold">Duration:</span> {result.Time_Duration || "N/A"} mins</div>
              <div><span className="font-semibold">Company:</span> {result.Company_Name || "N/A"}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-blue-50 rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-blue-600 shadow">
              <div className="text-lg font-bold text-blue-700 flex items-center gap-2"><FiBarChart2 /> Scores</div>
              <div><span className="font-semibold">Performance Score:</span> {result.Text_Percentage !== undefined ? result.Text_Percentage.toFixed(2) : "N/A"}%</div>
              <div><span className="font-semibold">Time Score:</span> {result.Time_Percentage !== undefined ? result.Time_Percentage.toFixed(2) : "N/A"}%</div>
              <div><span className="font-semibold">Overall Score:</span> {result.Overall_Percentage !== undefined ? result.Overall_Percentage.toFixed(2) : "N/A"}%</div>
              <div><span className="font-semibold">Confidence Score:</span> {result.confidence_Percentage !== undefined ? result.confidence_Percentage.toFixed(2) : "N/A"}%</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-blue-600 shadow">
              <div className="text-lg font-bold text-blue-700 flex items-center gap-2"><FiList /> Questions & Answers</div>
              {Array.isArray(result.Question_Arrays) && Array.isArray(result.Answer_Arrays) ? (
                result.Question_Arrays.map((q, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="font-semibold text-blue-700">Q{idx + 1}: {q}</div>
                    <div className="ml-4 text-gray-700">A: {result.Answer_Arrays[idx] || "N/A"}</div>
                  </div>
                ))
              ) : (
                <div>No questions/answers available.</div>
              )}
            </div>
          </div>
          {/* Emotion Data Section */}
          {Array.isArray(result.Performance_Array) && result.Performance_Array.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-blue-600 shadow mb-10">
              <div className="text-lg font-bold text-blue-700 flex items-center gap-2">
                <FiBarChart2 /> Candidate Emotion Data
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Frame</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Emotions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emotionRows}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Video/Audio Section */}
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow flex flex-col gap-4 items-start">
            <div className="text-lg font-bold text-blue-700 flex items-center gap-2"><FiVideo /> Interview Recording</div>
            {videoUrl ? (
              <video controls className="w-full max-w-lg rounded-xl border border-blue-200">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-blue-700/70 flex items-center gap-2"><FiVideo /> No video recording available.</div>
            )}
            <div className="text-lg font-bold text-blue-700 flex items-center gap-2 mt-4"><FiVolume2 /> Audio Recording</div>
            {audioUrl ? (
              <audio controls className="w-full max-w-lg rounded-xl border border-blue-200">
                <source src={audioUrl} type="audio/mp3" />
                Your browser does not support the audio tag.
              </audio>
            ) : (
              <div className="text-blue-700/70 flex items-center gap-2"><FiVolume2 /> No audio recording available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCandidateResult; 
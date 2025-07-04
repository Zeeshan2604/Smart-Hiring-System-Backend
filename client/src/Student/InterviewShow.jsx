// import BlobToVideo from "../TestingAssets/BlobHelpingFunction";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRecordWebcam } from "react-record-webcam";
import Webcam from "react-webcam"; // using this for clickng images
import TakeSnapFunction from "../organization/TakeSnap";
import base64ToHttps from "../organization/ImageConverter";
import axios from "axios";
import Cookies from "universal-cookie";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdError, MdWarning } from "react-icons/md";

import Result from "../Student/pages/Result";
import "./InterviewShow.css";
import InterviewDetails from "./components/InterviewDetails";
import { Button } from "@mui/material";

function InterviewShow({ ItrId, UserDataData, onInterviewStart }) {
  const [link, setLink] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackButton, setShowBackButton] = useState(true);

  const webcamRef = React.useRef(null);
  const {
    createRecording,
    openCamera,
    startRecording,
    stopRecording,
    downloadRecording,
    activeRecordings,
    clearAllRecordings,
  } = useRecordWebcam({
    audio: true,
  });
  const [recording, setRecording] = useState(null);

  const capture = React.useCallback(() => {
    setTimeout(async () => {
      if (webcamRef.current && webcamRef.current.getScreenshot) {
        const dataUri = webcamRef.current.getScreenshot();
        // console.log(dataUri);
        var httpImage = await base64ToHttps(dataUri);
        if (httpImage) {
          // console.log("-------------->", httpImage);
        }
      } else {
        // console.warn("webcamRef.current is null or getScreenshot is not a function");
      }
    }, 10000);
  }, [webcamRef]);

  // dend
  const [tempData, setTEmpData] = useState({});
  const [switchWindow, setSwitchWindow] = useState(true);
  const [camRefresh, setCamREfresh] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [startInterview, setStartInterview] = useState(false);
  const [finishInterview, setFinishedInterview] = useState(false);
  const [lastQsn, setLastQsn] = useState(false);
  const [firstQsn, setFirstQsn] = useState(false);
  const [time, setTime] = useState(20 * 60);
  const [isActive, setIsActive] = useState(false);
  const [camOpener, setCamOpen] = useState(false);
  const [BASEURL] = useState(process.env.REACT_APP_SAMPLE);
  const cookies = new Cookies();
  const [firstTime, setFirstTime] = useState("");
  //Interview Detials state
  const [interviewData, setInterviewData] = useState({});
  const [loading, setLoading] = useState(true);
  const [questionArray, setQuestionArray] = useState([]);
  //Result State
  const [result1, setResult1] = useState([]);
  const [result2, setResult2] = useState(0);
  const [result3, setResult3] = useState(0);
  // console.log("nnn",recordWebcam.status);
  const [imageTrigger, setImageTrigger] = useState(false);
  const [pendingStart, setPendingStart] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Add at the top of the component, after useState declarations:
  const [recordingWarning, setRecordingWarning] = useState("");
  let warningTimeoutRef = useRef();

  // Memoize questionArray length
  const questionArrayLength = useMemo(() => questionArray.length, [questionArray]);

  // Clean up useEffect dependencies
  useEffect(() => {
    setTEmpData(UserDataData);
    fetchInterview();
    // Only run on mount or when UserDataData changes
    // eslint-disable-next-line
  }, [UserDataData]);

  // Remove logs from countIncrement
  const countIncrement = () => {
    if (currentQuestionIndex >= questionArrayLength - 1) {
      setLastQsn(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const [, forceUpdate] = useState(0);
  const submitInterview = async () => {
    console.log('[LOG] submitInterview called', { currentQuestionIndex });
    try {
      pushAnswerFunction();
      setFinishedInterview(true);
      SpeechRecognition.stopListening();
      setStartInterview(false);
      if (isRecording && recording) {
        await stopRecording(recording.id);
        setIsRecording(false);
      }
      setCurrentQuestionIndex(0);
      console.log('[LOG] Interview finished, finishInterview set to true');
    } catch (error) {
      console.error('[LOG] Error in submitInterview:', error);
    }
  };

  const pushAnswerFunction = () => {
    const ArrayFromCookie = cookies.get("AnswerArray");
    const newSpreadedArray = Array.isArray(ArrayFromCookie) ? [...ArrayFromCookie] : [];
    if (transcript === "") {
      newSpreadedArray[currentQuestionIndex] = "none";
    } else {
      newSpreadedArray[currentQuestionIndex] = transcript;
    }
    cookies.set("AnswerArray", newSpreadedArray, { maxAge: 43200 });
  };
  const fetchInterview = async () => {
    const viewData = await axios
      .post(`${BASEURL}/ViewInterview`, {
        Res_Interview_ID: ItrId,
      })
      .then((Data) => {
        setInterviewData(Data.data.data1);
        setQuestionArray(Data.data.data1.Question_Arrays);
        setTime(Data.data.data1.Time_Duration * 60);
        setFirstTime(formatTime(time));
        if (questionArray) {
          setLoading(false);
        }
      })
      .catch((ErrorR) => {
        // console.log("kkkkk", ErrorR);
      });
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time <= 1 && !isSubmitting) {
            clearInterval(interval);
            setIsActive(false);
            handleAPIRecording();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, camRefresh, startInterview, isSubmitting]);

  // Refactored: Initialize recording in handleStart
  const handleStart = async () => {
    console.log('[LOG] handleStart called', { allChecksPassed, stream });
    if (!allChecksPassed || !stream) {
      // console.error('System checks not passed or stream not available', { allChecksPassed, stream });
      return;
    }
    try {
      localStorage.removeItem("submitRecord");
      setTime(interviewData.Time_Duration ? interviewData.Time_Duration * 60 : 20 * 60);
      setIsSubmitting(false);

      // Create recording and open camera
      // console.log('[LOG] Creating recording in handleStart...');
      const rec = await createRecording();
      // console.log('[LOG] createRecording returned:', rec);
      if (!rec || !rec.id) {
        // console.error("Failed to create recording instance or missing id:", rec);
        setRecording(null);
        setIsInitialized(false);
        return;
      }
      setRecording(rec);
      await openCamera(rec.id);
      setIsInitialized(true);

      // Start recording
      await startRecording(rec.id);
      setIsRecording(true);
      // console.log('[LOG] Recording started');
      setStartInterview(true);
      setPendingStart(true);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setFirstQsn(true);
      setShowBackButton(false);
      setCurrentQuestionIndex(0);
    } catch (error) {
      // console.error('Error starting interview:', error);
    }
  };

  // Add this useEffect after handleStart
  useEffect(() => {
    const fullDuration = interviewData.Time_Duration ? interviewData.Time_Duration * 60 : 20 * 60;
    if (pendingStart && time === fullDuration) {
      setIsActive(true);
      setPendingStart(false);
    }
    // eslint-disable-next-line
  }, [pendingStart, time, interviewData.Time_Duration]);

  // Add a new function to handle next question
  const handleNextQuestion = () => {
    console.log('[LOG] handleNextQuestion called', { currentQuestionIndex });
    countIncrement();
    setImageTrigger(!imageTrigger);
    resetTranscript();
    // Stop and restart listening to ensure it's active
    SpeechRecognition.stopListening();
    setTimeout(() => {
      SpeechRecognition.startListening({ continuous: true });
    }, 100);
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true });
    }
    pushAnswerFunction();
    capture();
  };

  function secondCounter(time) {
    const timeArr = time.split(":"); // Split the time string into an array
    const minutes = parseInt(timeArr[0]); // Parse the minutes as an integer
    const seconds = parseInt(timeArr[1]); // Parse the seconds as an integer
    const totalSeconds = minutes * 60 + seconds; // Calculate the total number of seconds
    return totalSeconds; // Return the total number of seconds
  }

  const handleStop = async () => {
    // console.log('[LOG] handleStop called', { isRecording, recording });
    try {
      setStartInterview(false);
      setIsActive(false);
      SpeechRecognition.stopListening();
      if (isRecording && recording) {
        // console.log('[LOG] Stopping recording...');
        await stopRecording(recording.id);
        setIsRecording(false);
        // console.log('Recording stopped');
      }
      setCamOpen(!camOpener);
    } catch (error) {
      // console.error('Error stopping interview:', error);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(20 * 60);
    setCurrentQuestionIndex(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const handleAPIRecording = async () => {
    console.log('[LOG] handleAPIRecording called', { isSubmitting, finishInterview, switchWindow });
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      console.log('[LOG] Before SpeechRecognition.stopListening()');
      SpeechRecognition.stopListening();
      console.log('[LOG] After SpeechRecognition.stopListening()');
      setStartInterview(false);
      console.log('[LOG] After setStartInterview(false)');
      console.log('[LOG] recording value:', recording);
      if (recording) {
        try {
          console.log('[LOG] Before await stopRecording(recording.id)');
          // Timeout wrapper for stopRecording
          const stopPromise = stopRecording(recording.id);
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('stopRecording timeout')), 2000));
          await Promise.race([stopPromise, timeoutPromise]);
          console.log('[LOG] After await stopRecording(recording.id)');
        setIsRecording(false);
          console.log('[LOG] After setIsRecording(false)');
        } catch (err) {
          setRecordingWarning("Warning: Unable to stop recording. Your answer was still submitted.");
          if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
          warningTimeoutRef.current = setTimeout(() => setRecordingWarning(""), 5000);
      }
      }
      console.log('[LOG] Before pushAnswerFunction()');
      pushAnswerFunction();
      console.log('[LOG] After pushAnswerFunction()');
      resetTranscript();
      console.log('[LOG] After resetTranscript()');
      const awsResult = JSON.parse(localStorage.getItem("AWSResult") || '[]');
      const ArrayFromCookie = cookies.get("AnswerArray");
      const newSpreadedArray = [...ArrayFromCookie];
      console.log('[LOG] About to call /CalculateResult API', { BASEURL, interviewId: interviewData.Interview_ID });
      const submitInterviewData = await axios.post(`${BASEURL}/CalculateResult`, {
        Res_Interview_ID: interviewData.Interview_ID,
        Res_Answer_Array: newSpreadedArray,
        Res_Interview_Timing: secondCounter(firstTime) - secondCounter(formatTime(time)),
        AWSResult: JSON.stringify(awsResult)
      });
      console.log('[LOG] /CalculateResult API response', submitInterviewData.data);
      if (submitInterviewData.data.message === "Result found successfully !") {
        const overallScore = Number(submitInterviewData.data.overAllPercentage);
        if (isNaN(overallScore)) {
          console.error('[LOG] Invalid score received:', submitInterviewData.data.overAllPercentage);
          return;
        }
        await addNewResult(overallScore);
        if (onInterviewStart) {
          onInterviewStart(false);
          document.body.style.marginLeft = "90px";
        }
        setSwitchWindow(false);
        console.log('[LOG] Navigating to /viewresult');
        navigate('/viewresult', {
          state: {
            result1: submitInterviewData.data.answerPercentageList,
            result2: overallScore,
            result3: submitInterviewData.data.timeResult,
            interviewData: {
              Question_Arrays: interviewData.Question_Arrays,
              Candidate_Name: interviewData.Candidate_Name
            },
            emotionData: awsResult,
            toneScores: submitInterviewData.data.tonePercentageList
          }
        });
      } else {
        console.error('[LOG] Unexpected API response:', submitInterviewData.data);
      }
    } catch (error) {
      console.error('[LOG] Error submitting interview:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewResult = async (finalScore) => {
    try {
      const ArrayFromCookieT = cookies.get("AnswerArray");
      const newSpreadedArrayT = [...ArrayFromCookieT];

      // console.log("Adding new result with score:", finalScore);
      
      // Calculate time score based on remaining time
      const timeScore = Math.min(100, Math.max(0, 
        (time / (interviewData.Time_Duration * 60)) * 100
      ));
      
      // console.log("Time score calculated:", timeScore);
      
      const submitInterviewResult = await axios.post(`${BASEURL}/AddNewResult`, {
        Res_Candidate_Name: tempData.Name,
        Res_Candidate_Email: tempData.emailId,
        Res_Company_Name: interviewData.Company_Name,
        Res_HR_Name: interviewData.HR_Name,
        Res_Name_Technology: interviewData.Name_Technology,
        Res_Number_Of_Questions: interviewData.Number_Of_Questions,
        Res_Time_Duration: interviewData.Time_Duration,
        Res_Time_Of_Interview: interviewData.Time_Of_Interview,
        Res_Date_Of_Interview: interviewData.Date_Of_Interview,
        Res_Question_Arrays: interviewData.Question_Arrays,
        Res_Answer_Arrays: newSpreadedArrayT,
        Res_Performance_Array: JSON.parse(localStorage.getItem("AWSResult") || "[]"),
        Res_Text_Percentage: finalScore,
        Res_Time_Percentage: timeScore,
        Res_confidence_Percentage: 0,
        Res_Overall_Percentage: finalScore,
      });

      if (submitInterviewResult.data.message === "Interview result added successfully !") {
        // console.log("Saving interview attempt with score:", finalScore);
        const attemptResponse = await axios.post(`${BASEURL}/AddInterviewAttempt`, {
          Interview_ID: interviewData.Interview_ID,
          Candidate_Email: tempData.emailId,
          Result_ID: submitInterviewResult.data.data._id,
          Score: finalScore
        });
        // console.log("Interview attempt saved successfully:", attemptResponse.data);
    }
    } catch (error) {
      // console.error("Error in addNewResult:", error);
      throw error;
    }
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    // Always call the effect, but only update if onInterviewStart exists
    if (onInterviewStart) {
      // console.log('Hiding navbar at interview start');
      onInterviewStart(true);
      document.body.style.marginLeft = "0px";
    }
    
    return () => {
      if (onInterviewStart) {
        // console.log('Showing navbar on component unmount');
        onInterviewStart(false);
        document.body.style.marginLeft = "90px";
      }
    };
  }, [onInterviewStart]);

  // Modify the useEffect for speech recognition
  useEffect(() => {
    if (startInterview && !listening) {
      SpeechRecognition.startListening({ continuous: true });
    }
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [startInterview, listening]);

  const checkTime = (time) => {
    // console.log(time);
    if (time === 0) {
      handleAPIRecording();
    }
  };

  const navigate = useNavigate();

  // System check states
  const [systemChecks, setSystemChecks] = useState({
    camera: { status: 'checking', message: 'Checking camera...' },
    microphone: { status: 'checking', message: 'Checking microphone...' },
    browserCompatibility: { status: 'checking', message: 'Checking browser compatibility...' }
  });
  const [isChecking, setIsChecking] = useState(true);
  const [allChecksPassed, setAllChecksPassed] = useState(false);

  // Function to check camera access
  const checkCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      // console.error('Camera check failed:', error);
      return false;
    }
  };

  // Function to check microphone access
  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      // console.error('Microphone check failed:', error);
      return false;
    }
  };

  // Function to check browser compatibility
  const checkBrowserCompatibility = () => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);
    
    return isChrome || isFirefox || isEdge;
  };

  // Run all system checks
  const runSystemChecks = async () => {
    setIsChecking(true);
    setAllChecksPassed(false);

    // Check camera
    const cameraResult = await checkCamera();
    setSystemChecks(prev => ({
      ...prev,
      camera: {
        status: cameraResult ? 'success' : 'error',
        message: cameraResult ? 'Camera is working' : 'Camera access denied'
      }
    }));

    // Check microphone
    const micResult = await checkMicrophone();
    setSystemChecks(prev => ({
      ...prev,
      microphone: {
        status: micResult ? 'success' : 'error',
        message: micResult ? 'Microphone is working' : 'Microphone access denied'
      }
    }));

    // Check browser compatibility
    const browserResult = checkBrowserCompatibility();
    setSystemChecks(prev => ({
      ...prev,
      browserCompatibility: {
        status: browserResult ? 'success' : 'error',
        message: browserResult ? 'Browser is compatible' : 'Please use Chrome, Firefox, or Edge'
      }
    }));

    // Set final status
    const allPassed = cameraResult && micResult && browserResult;
    setAllChecksPassed(allPassed);
    setIsChecking(false);
  };

  // Run checks when component mounts
  useEffect(() => {
    runSystemChecks();
  }, []);

  // Add logging for state after system checks
  useEffect(() => {
    // console.log('[LOG] System checks completed:', { allChecksPassed, systemChecks });
  }, [allChecksPassed, systemChecks]);

  // Add logging when stream is set
  useEffect(() => {
    if (stream) {
      // console.log('[LOG] Webcam stream set:', stream);
    } else {
      // console.log('[LOG] Webcam stream is null');
    }
  }, [stream]);

  // Add logging when recording is initialized
  useEffect(() => {
    if (recording) {
      // console.log('[LOG] Recording instance set:', recording);
    } else {
      // console.log('[LOG] Recording instance is null');
        }
  }, [recording]);

  // Add logging when isInitialized changes
  useEffect(() => {
    // console.log('[LOG] isInitialized changed:', isInitialized);
  }, [isInitialized]);

  // Derived state for enabling Start Interview
  const canStartInterview = allChecksPassed && stream;

  // Add logging for switchWindow
  useEffect(() => {
    // console.log('[LOG] switchWindow changed:', switchWindow);
  }, [switchWindow]);

  useEffect(() => {
    // console.log('[LOG] Rendering controls-container', { finishInterview: finishInterview, switchWindow });
  }, [finishInterview, switchWindow]);

  // Add a log at the top of the component to show finishInterview and switchWindow on every render
  // console.log('[LOG] InterviewShow render', { finishInterview: finishInterviewRef.current, switchWindow });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // At the start of the render, if on the end screen, return only the video and submit button
  if (finishInterview) {
    return (
      <div className="interview-container" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Animated Confetti SVG (smaller height) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 90, pointerEvents: 'none', zIndex: 1 }}>
          <svg width="100%" height="90" viewBox="0 0 600 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
            <circle cx="100" cy="30" r="6" fill="#60a5fa">
              <animate attributeName="cy" values="30;50;30" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="20" r="4" fill="#fbbf24">
              <animate attributeName="cy" values="20;40;20" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="300" cy="35" r="7" fill="#34d399">
              <animate attributeName="cy" values="35;60;35" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="400" cy="25" r="5" fill="#f472b6">
              <animate attributeName="cy" values="25;45;25" dur="2.1s" repeatCount="indefinite" />
            </circle>
            <circle cx="500" cy="40" r="6" fill="#a78bfa">
              <animate attributeName="cy" values="40;60;40" dur="2.3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
        {/* Card Container (more compact) */}
        <div style={{
          background: 'white',
          borderRadius: '1.2rem',
          boxShadow: '0 4px 16px rgba(37,99,235,0.10), 0 1.5px 8px rgba(0,0,0,0.04)',
          padding: '1.2rem 0.8rem 1.2rem 0.8rem',
          maxWidth: 420,
          width: '100%',
          margin: '0 auto',
          border: '3px solid',
          borderImage: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%) 1',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Glowing Confetti Icon (smaller) */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 0 10px #a78bfa88)' }} role="img" aria-label="celebrate">🎉</span>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 48,
              height: 48,
              background: 'radial-gradient(circle, #a78bfa33 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: -1,
            }} />
          </div>
          <div className="interview-header" style={{ alignItems: 'center', marginTop: 0, marginBottom: '0.3rem' }}>
            <h1 className="interview-title" style={{ textAlign: 'center', marginBottom: 0, fontSize: '1.2rem' }}>
              {interviewData.Company_Name} - {interviewData.Name_Technology} Interview
            </h1>
          </div>
          {/* Animated Success Message */}
          <div style={{ marginTop: '0.7rem', marginBottom: '0.3rem', textAlign: 'center', animation: 'fadeInBounce 1.2s' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.5px', marginBottom: 0 }}>Interview Completed!</h2>
            <p style={{ color: '#475569', fontSize: '0.98rem', marginTop: '0.3rem', marginBottom: 0 }}>Thank you for participating. Your responses have been submitted for review.</p>
          </div>
          <div className="webcam-container" style={{ marginTop: '1rem', marginBottom: '1.2rem', maxHeight: 280, minHeight: 180 }}>
          <Webcam
            audio={true}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
          {/* Divider */}
          <div style={{ width: '100%', maxWidth: 380, margin: '0 auto 1rem', borderTop: '1px solid #e2e8f0' }} />
          {recordingWarning && (
            <div className="flex items-center justify-center mb-4 w-full max-w-lg" style={{margin: '0.7rem auto'}}>
              <div className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-lg w-full shadow">
                <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                <span className="font-semibold">{recordingWarning}</span>
              </div>
            </div>
          )}
          <div className="controls-container" style={{marginTop: '1.2rem', display: 'flex', justifyContent: 'center', width: '100%'}}>
            <button
              className="control-button start-button"
              style={{ fontSize: '1.1rem', padding: '0.9rem 2.5rem', borderRadius: '1.3rem', fontWeight: 700, boxShadow: '0 4px 16px rgba(37,99,235,0.13)' }}
              onClick={handleAPIRecording}
            >
            Submit
          </button>
        </div>
          {/* Secondary message */}
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.95rem', marginTop: '1.1rem', fontWeight: 500 }}>
            Submit and get your results.
          </div>
        </div>
        {/* Keyframes for fadeInBounce */}
        <style>{`
          @keyframes fadeInBounce {
            0% { opacity: 0; transform: translateY(30px) scale(0.95); }
            60% { opacity: 1; transform: translateY(-8px) scale(1.04); }
            80% { transform: translateY(4px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="interview-container">
      {showBackButton && !startInterview && (
        <button
          className="back-button"
          onClick={async () => {
            try {
              // Stop recording if active
              if (isRecording && recording) {
                await stopRecording(recording.id);
                setIsRecording(false);
                // console.log('Recording stopped during back navigation');
              }

              // Close recordWebcam
              if (recording && recording.close) {
                await recording.close();
                // console.log('RecordWebcam closed during back navigation');
              }

              // Stop all media tracks
              if (stream) {
                stream.getTracks().forEach(track => {
                  // console.log('Stopping track:', track.kind);
                  track.stop();
                });
                setStream(null);
              }

              // Reset webcam state
              setIsInitialized(false);
              setCamOpen(false);

              // Navigate back
              window.history.back();
            } catch (error) {
              // console.error('Error during cleanup:', error);
              // Still navigate back even if cleanup fails
              window.history.back();
            }
          }}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '8px 16px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
        >
          ← Back
        </button>
      )}
      {switchWindow ? (
        <>
          <div className="interview-header">
            <h1 className="interview-title">
              {interviewData.Company_Name} - {interviewData.Name_Technology} Interview
            </h1>
            <div className={`timer-display ${time < 300 ? 'warning' : ''} ${time < 60 ? 'danger' : ''}`}>
              Time Remaining: {formatTime(time)}
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <>
              <div className={`webcam-container ${startInterview ? 'minimized' : ''}`}>
                {allChecksPassed && (
                <Webcam
                    audio={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                  }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onUserMedia={(mediaStream) => {
                      // console.log('Webcam onUserMedia called with stream:', mediaStream);
                      setStream(mediaStream);
                    }}
                    onUserMediaError={(error) => {
                      // console.error('Webcam onUserMediaError:', error);
                      setIsInitialized(false);
                    }}
                />
                )}
              </div>

              {!startInterview && !finishInterview && switchWindow && (
              <div className="system-checks-container">
                <h2 className="text-xl font-bold mb-4">System Checks</h2>
                {Object.entries(systemChecks).map(([check, { status, message }]) => (
                  <div key={check} className="check-item mb-3 flex items-center">
                    {status === "checking" && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3" />
                    )}
                    {status === "success" && (
                      <MdCheckCircle className="text-green-500 text-xl mr-3" />
                    )}
                    {status === "error" && (
                      <MdError className="text-red-500 text-xl mr-3" />
                    )}
                    <span className="capitalize">
                      {check.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <span className="ml-2">{message}</span>
                  </div>
                ))}

                {!isChecking && !allChecksPassed && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center">
                      <MdWarning className="text-yellow-500 text-xl mr-2" />
                      <span>
                        Please fix the issues above before starting the interview
                      </span>
                    </div>
                    <button
                      onClick={runSystemChecks}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Run Checks Again
                    </button>
                  </div>
                )}
              </div>
            )}

              <div className={`interview-content ${startInterview ? 'visible' : ''}`}>
                {startInterview && (
                  <>
                    <div className="question-container">
                      <div className="question-header">
                        <h2>
                          Question {currentQuestionIndex + 1} of {questionArray.length}
                  </h2>
                        <h3>
                          {questionArray[currentQuestionIndex]}
                        </h3>
                </div>
              </div>

                    <div className="transcript-container">
                      <h4 className="transcript-title">Your Answer:</h4>
                      <p className="transcript-text">{transcript}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="controls-container">
                {finishInterview && switchWindow ? (
                  <div className="flex">
                    <button
                      className="control-button start-button"
                      onClick={handleAPIRecording}
                    >
                      Submit Results
                    </button>
                  </div>
                ) : (
                  <>
                  {!isActive && !finishInterview && (
                    <>
                      <button
                        className={`control-button start-button ${!canStartInterview ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          if (canStartInterview) {
                            handleStart();
                            setImageTrigger(!imageTrigger);
                            capture();
                          }
                        }}
                        disabled={!canStartInterview}
                      >
                        Start Interview
                      </button>
                      {!canStartInterview && allChecksPassed && (
                        <div style={{marginTop: '10px', color: '#888', fontSize: '0.95rem'}}>
                          Initializing webcam and recording, please wait...
                        </div>
                      )}
                    </>
                  )}

                  {startInterview && (
                    <div className="flex">
                      {!lastQsn && (
                        <button
                          className="control-button start-button"
                          onClick={handleNextQuestion}
                              >
                                Next Question
                        </button>
                      )}
                      {lastQsn && (
                      <button
                        className="control-button stop-button"
                            onClick={() => {
                            console.log('[LOG] Finish Interview button clicked');
                              submitInterview();
                              resetTranscript();
                            }}
                          >
                        Finish Interview
                      </button>
                      )}
                        </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <Result
          result1={result1}
          result2={result2}
          result3={result3}
          interviewData={interviewData}
          onInterviewStart={onInterviewStart}
        />
      )}
    </div>
  );
}

export default InterviewShow;

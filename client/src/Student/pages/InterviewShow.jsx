import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';

const InterviewShow = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const cookies = new Cookies();
  const BASEURL = process.env.REACT_APP_SAMPLE;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const interviewId = location.state?.interviewId;
        if (!interviewId) {
          console.error('No interview ID provided');
          return;
        }

        const response = await axios.post(`${BASEURL}/getQuestions`, {
          Interview_ID: interviewId
        });
        
        setQuestions(response.data);
        setTotalQuestions(response.data.length);
        // Set isLastQuestion to true if there's only one question
        setIsLastQuestion(response.data.length === 1);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, [location.state]);

  const handleStart = () => {
    setIsRecording(true);
    // Start recording logic here
  };

  const handleNextQuestion = () => {
    // Save current answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(newAnswers);

    // Move to next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setCurrentAnswer('');
    setShowNextButton(false);
    setIsRecording(false);
  };

  const handleFinish = async () => {
    try {
      // Save final answer
      const finalAnswers = [...answers];
      finalAnswers[currentQuestionIndex] = currentAnswer;
      setAnswers(finalAnswers);

      // Calculate score and save results
      const userData = cookies.get('UserData');
      const response = await axios.post(`${BASEURL}/saveInterviewResults`, {
        answers: finalAnswers,
        questions: questions,
        candidateEmail: userData.emailId,
        Interview_ID: location.state?.interviewId
      });

      // Navigate to results page
      navigate('/interview-results', { state: { score: response.data.score } });
    } catch (error) {
      console.error('Error saving interview results:', error);
    }
  };

  const handleAnswerSubmit = () => {
    setShowNextButton(true);
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {questions.length > 0 && (
                  <>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold mb-2">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </h2>
                      <p className="text-gray-700">{questions[currentQuestionIndex].Question}</p>
                    </div>
                    <div className="mt-4">
                      <textarea
                        className="w-full p-2 border rounded"
                        rows="4"
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={handleStart}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={isRecording}
                      >
                        {isRecording ? "Recording..." : "Start Recording"}
                      </button>
                      {!showNextButton && (
                        <button
                          onClick={handleAnswerSubmit}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Submit Answer
                        </button>
                      )}
                      {showNextButton && !isLastQuestion && totalQuestions > 1 && (
                        <button
                          onClick={handleNextQuestion}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Next Question
                        </button>
                      )}
                      {showNextButton && (isLastQuestion || totalQuestions === 1) && (
                        <button
                          onClick={handleFinish}
                          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                        >
                          Finish Interview
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewShow; 
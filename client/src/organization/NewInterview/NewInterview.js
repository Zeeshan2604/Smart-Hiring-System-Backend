import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "axios";
// import Cookies from "universal-cookie";
import { FiUser, FiCalendar, FiClock, FiList, FiCheckCircle, FiAlertCircle, FiPlus, FiMinus, FiBookOpen, FiUsers } from "react-icons/fi";
import { useSnackbar } from "../../Snackbar/Snackbar";
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";

function NewInterview({ UserDataData }) {
  const BASEURL = process.env.REACT_APP_SAMPLE;
  // const cookies = new Cookies();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [candidateList, setCandidateList] = useState([]);
  const [fetchingCandidates, setFetchingCandidates] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalSelected, setModalSelected] = useState([]);
  const { showSnackbar } = useSnackbar();

  // Fetch all candidates for this organization
  useEffect(() => {
    const fetchCandidates = async () => {
      setFetchingCandidates(true);
      try {
        const orgName = UserDataData?.Name;
        const response = await axios.get(`${BASEURL}/getCandidates`, {
          params: { OrganizationName: orgName },
        });
        if (response.data.status === "Success") {
          setCandidateList(response.data.data);
        } else {
          setCandidateList([]);
        }
      } catch (err) {
        setCandidateList([]);
      } finally {
        setFetchingCandidates(false);
      }
  };
    if (UserDataData?.Name) {
      fetchCandidates();
    }
  }, [UserDataData, BASEURL]);

  const initialVal = {
    technologyName: "",
    descriptionD: "",
    instructionD: "",
    hrName: "",
    noQuestions: 0,
    interviewDate: "",
    interviewTime: "",
    interviewDuration: 0,
    validityPeriod: 30,
    questions: [],
    answers: [],
    emails: [], // Will be filled by selected candidates
  };

  function generateRandomNumber() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }

  const createNewInterview = async (values, resetForm) => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const response = await axios.post(`${BASEURL}/AddNewInterview`, {
        Res_Company_Name: UserDataData?.Name,
        Res_Description: values.technologyName,
        Res_HR_Name: values.hrName,
        Res_Instruction: values.instructionD,
        Res_Name_Technology: values.descriptionD,
        Res_Interview_ID: generateRandomNumber(),
        Res_Number_Of_Questions: values.noQuestions,
        Res_Time_Duration: values.interviewDuration,
        Res_Time_Of_Interview: values.interviewTime?.toString(),
        Res_Date_Of_Interview: values.interviewDate,
        Res_Validity_Period: values.validityPeriod,
        Res_Question_Arrays: values.questions,
        Res_Answer_Arrays: values.answers,
        Res_Email_Arrays: values.emails,
      });
      if (response.data.message === "Interview added successfully !") {
        setSuccess("Interview created successfully!");
        showSnackbar("Interview created successfully!", "success");
        resetForm();
      } else {
        setError("Failed to create interview.");
        showSnackbar("Failed to create interview.", "error");
      }
    } catch (err) {
      setError("An error occurred while creating the interview.");
      showSnackbar("An error occurred while creating the interview.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-2">
            <FiBookOpen className="text-blue-700 text-5xl drop-shadow" />
            <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight drop-shadow">New Interview</h1>
                  </div>
          <p className="text-blue-700/70 text-lg text-center max-w-2xl">Fill in the form below to schedule a new interview. All fields are required.</p>
                </div>
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col border-l-8 border-blue-600 relative overflow-hidden">
          <div className="absolute -top-8 left-8 opacity-10 text-[8rem] pointer-events-none select-none">
            <FiBookOpen />
          </div>
                <Formik
                  initialValues={initialVal}
            validate={values => {
                    const errors = {};
              if (!values.technologyName) errors.technologyName = "Required";
              if (!values.descriptionD) errors.descriptionD = "Required";
              if (!values.instructionD) errors.instructionD = "Required";
              if (!values.hrName) errors.hrName = "Required";
              if (!values.interviewDate) errors.interviewDate = "Required";
              if (!values.interviewTime) errors.interviewTime = "Required";
              if (!values.interviewDuration || values.interviewDuration <= 0) errors.interviewDuration = "Enter a valid duration";
              if (!values.noQuestions || values.noQuestions <= 0) errors.noQuestions = "Enter at least 1 question";
              if (values.questions.length !== values.noQuestions) errors.questions = `Please enter ${values.noQuestions} questions`;
              if (values.answers.length !== values.noQuestions) errors.answers = `Please enter ${values.noQuestions} answers`;
              if (!values.emails || values.emails.length === 0) errors.emails = "Select at least one candidate";
              if (!values.validityPeriod || values.validityPeriod < 1) errors.validityPeriod = "Enter a valid period";
                    return errors;
                  }}
            onSubmit={(values, { resetForm }) => createNewInterview(values, resetForm)}
                >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-200 mb-1">
                      <FiList /> Technology Name
                      <span className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 inline-block group-hover:text-blue-600" />
                        <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">Enter the technology or subject for this interview.</span>
                      </span>
                    </label>
                    <Field name="technologyName" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.technologyName && touched.technologyName && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaExclamationCircle className="text-red-400" />{errors.technologyName}
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
                      <FiBookOpen /> Detailed Description
                        </label>
                    <Field name="descriptionD" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.descriptionD && touched.descriptionD && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.descriptionD}</div>}
                      </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
                      <FiAlertCircle /> Instructions
                        </label>
                    <Field name="instructionD" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.instructionD && touched.instructionD && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.instructionD}</div>}
                      </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
                      <FiUser /> HR Name
                        </label>
                    <Field name="hrName" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.hrName && touched.hrName && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.hrName}</div>}
                      </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
                      <FiCalendar /> Interview Date
                        </label>
                    <Field type="date" name="interviewDate" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.interviewDate && touched.interviewDate && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.interviewDate}</div>}
                      </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
                      <FiClock /> Interview Time
                        </label>
                    <Field type="time" name="interviewTime" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.interviewTime && touched.interviewTime && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.interviewTime}</div>}
                      </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
                      <FiClock /> Duration (minutes)
                        </label>
                    <Field type="number" name="interviewDuration" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.interviewDuration && touched.interviewDuration && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.interviewDuration}</div>}
                      </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
                      <FiCheckCircle /> Validity Period (days)
                        </label>
                    <Field type="number" name="validityPeriod" min="1" max="365" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.validityPeriod && touched.validityPeriod && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.validityPeriod}</div>}
                      </div>
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-blue-700 mb-1">
                      <FiList /> Number of Questions
                          </label>
                    <Field type="number" name="noQuestions" className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-gray-900" />
                    {errors.noQuestions && touched.noQuestions && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.noQuestions}</div>}
                  </div>
                </div>
                {/* Questions Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <FiList className="text-blue-700" />
                    <h2 className="text-xl font-bold text-blue-700">Questions</h2>
                  </div>
                          <FieldArray name="questions">
                            {({ push, remove }) => (
                      <div>
                        {values.questions.map((q, idx) => (
                          <div key={idx} className="flex items-center gap-2 mb-2">
                            <Field name={`questions.${idx}`} placeholder={`Question ${idx + 1}`} className="flex-1 px-4 py-2 border-2 border-blue-600 rounded-lg bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                            <button type="button" onClick={() => remove(idx)} className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors" aria-label="Remove question">
                              <FiMinus className="text-red-600" />
                            </button>
                                  </div>
                                ))}
                        {values.questions.length < values.noQuestions && (
                          <button type="button" onClick={() => push("")} className="flex items-center gap-2 px-4 py-2 mt-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow transition-colors">
                            <FiPlus /> Add Question
                          </button>
                        )}
                        {errors.questions && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.questions}</div>}
                                  </div>
                            )}
                          </FieldArray>
                        </div>
                {/* Answers Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <FiList className="text-blue-700" />
                    <h2 className="text-xl font-bold text-blue-700">Answers</h2>
                      </div>
                          <FieldArray name="answers">
                            {({ push, remove }) => (
                      <div>
                        {values.answers.map((a, idx) => (
                          <div key={idx} className="flex items-center gap-2 mb-2">
                            <Field name={`answers.${idx}`} placeholder={`Answer ${idx + 1}`} className="flex-1 px-4 py-2 border-2 border-blue-600 rounded-lg bg-blue-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                            <button type="button" onClick={() => remove(idx)} className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors" aria-label="Remove answer">
                              <FiMinus className="text-red-600" />
                            </button>
                                  </div>
                                ))}
                        {values.answers.length < values.noQuestions && (
                          <button type="button" onClick={() => push("")} className="flex items-center gap-2 px-4 py-2 mt-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow transition-colors">
                            <FiPlus /> Add Answer
                          </button>
                        )}
                        {errors.answers && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.answers}</div>}
                                  </div>
                            )}
                          </FieldArray>
                        </div>
                {/* Candidate Selection Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUsers className="text-blue-700" />
                    <h2 className="text-xl font-bold text-blue-700">Candidate Emails</h2>
                      </div>
                  <button
                    type="button"
                    className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow mb-4"
                    onClick={() => {
                      setModalSelected(values.emails);
                      setShowModal(true);
                    }}
                  >
                    Add candidates
                  </button>
                  {/* Show selected candidates */}
                  {values.emails.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUsers className="text-blue-700" />
                        <h2 className="text-lg font-bold text-blue-700">Selected Candidates</h2>
                      </div>
                      <ul className="list-disc pl-6">
                        {values.emails.map(email => {
                          const candidate = candidateList.find(c => c.emailId === email);
                          return (
                            <li key={email} className="text-blue-700 font-medium">
                              {candidate ? `${candidate.Name} (${candidate.emailId})` : email}
                            </li>
                          );
                        })}
                      </ul>
                                  </div>
                                )}
                  {errors.emails && touched.emails && <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{errors.emails}</div>}
                </div>
                {/* Modal for candidate selection */}
                {showModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative">
                      <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FiUsers /> Select Candidates</h3>
                      {fetchingCandidates ? (
                        <div className="text-blue-600">Loading candidates...</div>
                      ) : candidateList.length === 0 ? (
                        <div className="text-gray-500">No candidates found. Please add candidates first.</div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                          {candidateList.map((candidate) => (
                            <label key={candidate._id} className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2 cursor-pointer border border-blue-200 hover:bg-blue-100">
                              <input
                                type="checkbox"
                                checked={modalSelected.includes(candidate.emailId)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setModalSelected(prev => [...prev, candidate.emailId]);
                                  } else {
                                    setModalSelected(prev => prev.filter(email => email !== candidate.emailId));
                                  }
                                }}
                              />
                              <span className="font-medium text-blue-700">{candidate.Name}</span>
                              <span className="text-gray-500 text-sm">({candidate.emailId})</span>
                            </label>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                          onClick={() => {
                            setFieldValue("emails", modalSelected);
                            setShowModal(false);
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full shadow-xl transition-colors duration-200 font-bold text-xl"
                    disabled={loading}
                  >
                    <FiCheckCircle /> {loading ? "Creating..." : "Create Interview"}
                  </button>
                </div>
                {success && <div className="mt-4 text-green-600 font-semibold flex items-center gap-2"><FiCheckCircle /> {success}</div>}
                {error && <div className="mt-4 text-red-600 font-semibold flex items-center gap-2"><FiAlertCircle /> {error}</div>}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
  );
}

export default NewInterview;

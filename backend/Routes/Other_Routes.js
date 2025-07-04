const express = require('express');
const router = express.Router();

const {
  Add_Interview_Attempt,
  Get_Candidate_Attempts,
  Check_Interview_Attempt
} = require("../Controllers/Other_Controller/Interview_Attempt_Controller");
const { Get_Candidate_Results } = require("../Controllers/Other_Controller/Get_Candidate_Results");
const { UpdateStudentProfile } = require("../Controllers/Other_Controller/UpdateStudentProfile");
const { addCandidate, getCandidates, getCandidateByEmail, removeCandidate } = require("../Controllers/Other_Controller/CandidateController");
const { View_Interview_List_Function, View_All_Interviews_Function } = require("../Controllers/Other_Controller/View_Interview_List");
const { View_New_Interview_Function, addCandidateToInterview, removeCandidateFromInterview } = require("../Controllers/Other_Controller/View_New_Interview");


// Candidate routes
router.post("/addCandidate", addCandidate);
router.get("/getCandidates", getCandidates);
router.get("/getCandidateByEmail", getCandidateByEmail);
router.post("/removeCandidate", removeCandidate);

router.post("/AddInterviewAttempt", Add_Interview_Attempt);
router.post("/GetCandidateAttempts", Get_Candidate_Attempts);
router.post("/CheckInterviewAttempt", Check_Interview_Attempt);
router.post("/GetCandidateResults", Get_Candidate_Results);

// Profile Routes
router.post("/ViewProfile/update", UpdateStudentProfile);

// Debug route to check if router is working
router.get("/test", (req, res) => {
  res.json({ message: "Other routes are working" });
});

router.post("/ViewAllInterviews", View_All_Interviews_Function);
router.post("/addCandidateToInterview", addCandidateToInterview);
router.post("/removeCandidateFromInterview", removeCandidateFromInterview);

module.exports = router; 
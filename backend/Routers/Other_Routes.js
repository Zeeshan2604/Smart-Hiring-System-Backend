const express = require("express");
const router = express.Router();

// ... existing imports ...
const { addCandidate, getCandidates, getCandidateByEmail } = require("../Controllers/Other_Controller/CandidateController");

// ... existing routes ...

// Candidate routes
router.post("/addCandidate", addCandidate);
router.get("/getCandidates", getCandidates);
router.get("/getCandidateByEmail", getCandidateByEmail);

module.exports = router; 
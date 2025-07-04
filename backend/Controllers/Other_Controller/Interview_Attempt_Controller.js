const { Interview_Attempt_Model } = require("../../DatabaseSetup/Mongoose.InterviewAttempt.Schema");
const { Interview_Result_Model } = require("../../DatabaseSetup/Mongoose.Result.Schema");

// Add a new interview attempt
const Add_Interview_Attempt = async (req, res) => {
  try {
    const { Interview_ID, Candidate_Email, Result_ID, Score, Candidate_Name, Organization_Name, Interview_Name } = req.body;

    const attempt = await Interview_Attempt_Model.create({
      Interview_ID,
      Candidate_Email,
      Result_ID,
      Score,
      Candidate_Name,
      Organization_Name,
      Interview_Name
    });

    res.status(200).json({
      status: "Success",
      message: "Interview attempt recorded successfully!",
      data: attempt
    });
  } catch (error) {
    console.error("Error recording interview attempt:", error);
    res.status(500).json({
      status: "Error",
      message: "Failed to record interview attempt"
    });
  }
};

// Get all attempts for a candidate
const Get_Candidate_Attempts = async (req, res) => {
  try {
    const { Candidate_Email } = req.body;

    const attempts = await Interview_Attempt_Model.find({ Candidate_Email })
      .populate('Result_ID')
      .sort({ Attempt_Date: -1 });

    res.status(200).json({
      status: "Success",
      message: "Interview attempts retrieved successfully!",
      data: attempts
    });
  } catch (error) {
    console.error("Error retrieving interview attempts:", error);
    res.status(500).json({
      status: "Error",
      message: "Failed to retrieve interview attempts"
    });
  }
};

// Check if candidate has attempted an interview
const Check_Interview_Attempt = async (req, res) => {
  try {
    const { Interview_ID, Candidate_Email } = req.body;

    // Find all attempts for this interview and candidate, sorted by date
    const attempts = await Interview_Attempt_Model.find({
      Interview_ID,
      Candidate_Email
    })
    .populate('Result_ID')
    .sort({ Attempt_Date: -1 }); // Sort by date in descending order

    // Get the latest attempt (first in the sorted array)
    const latestAttempt = attempts[0];

    res.status(200).json({
      status: "Success",
      message: "Interview attempt check completed!",
      hasAttempted: attempts.length > 0,
      attempt: latestAttempt,
      totalAttempts: attempts.length
    });
  } catch (error) {
    console.error("Error checking interview attempt:", error);
    res.status(500).json({
      status: "Error",
      message: "Failed to check interview attempt"
    });
  }
};

module.exports = {
  Add_Interview_Attempt,
  Get_Candidate_Attempts,
  Check_Interview_Attempt
}; 
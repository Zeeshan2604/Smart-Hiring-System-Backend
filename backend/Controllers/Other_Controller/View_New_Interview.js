const {
  Interview_Details_Model,
} = require("../../DatabaseSetup/Mongoose.InterviewDetails.Schema");
const View_New_Interview_Function = async (req, res, next) => {
  try {
    const { Res_Interview_ID } = req.body;
    if (!Res_Interview_ID) {
      return res.status(400).json({ status: "Error", message: "Interview ID is required!" });
    }
    const View_Interview_Result = await Interview_Details_Model.findOne({
      Interview_ID: Res_Interview_ID,
    });

    if (View_Interview_Result) {
      res.status(200).json({
        status: "Success",
        message: "Interview found successfully !",
        data1: View_Interview_Result,
      });
    } else {
      res.status(404).json({
        status: "Error",
        message: "Unable to find interview !",
      });
    }
  } catch (err) {
    console.error("Error in View_New_Interview_Function:", err);
    res.status(500).json({
      status: "Error",
      message: "Server error while fetching interview!",
      error: err.message,
    });
  }
};

// Add candidate to interview
const addCandidateToInterview = async (req, res) => {
  try {
    const { Interview_ID, Candidate_Email } = req.body;
    if (!Interview_ID || !Candidate_Email) {
      return res.status(400).json({ status: "Error", message: "Interview_ID and Candidate_Email are required." });
    }
    const interview = await Interview_Details_Model.findOneAndUpdate(
      { Interview_ID },
      { $addToSet: { Email_Arrays: Candidate_Email } },
      { new: true }
    );
    if (!interview) {
      return res.status(404).json({ status: "Error", message: "Interview not found." });
    }
    res.status(200).json({ status: "Success", message: "Candidate added to interview.", data: interview });
  } catch (err) {
    res.status(500).json({ status: "Error", message: "Failed to add candidate to interview.", error: err.message });
  }
};

// Remove candidate from interview
const removeCandidateFromInterview = async (req, res) => {
  try {
    const { Interview_ID, Candidate_Email } = req.body;
    if (!Interview_ID || !Candidate_Email) {
      return res.status(400).json({ status: "Error", message: "Interview_ID and Candidate_Email are required." });
    }
    const interview = await Interview_Details_Model.findOneAndUpdate(
      { Interview_ID },
      { $pull: { Email_Arrays: Candidate_Email } },
      { new: true }
    );
    if (!interview) {
      return res.status(404).json({ status: "Error", message: "Interview not found." });
    }
    res.status(200).json({ status: "Success", message: "Candidate removed from interview.", data: interview });
  } catch (err) {
    res.status(500).json({ status: "Error", message: "Failed to remove candidate from interview.", error: err.message });
  }
};

module.exports = {
  View_New_Interview_Function,
  addCandidateToInterview,
  removeCandidateFromInterview
};

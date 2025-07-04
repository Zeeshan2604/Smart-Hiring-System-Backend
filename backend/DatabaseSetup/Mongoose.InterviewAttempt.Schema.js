const mongoose = require("mongoose");

const Interview_Attempt_Schema = new mongoose.Schema({
  Interview_ID: {
    type: Number,
    required: true
  },
  Candidate_Email: {
    type: String,
    required: true
  },
  Attempt_Date: {
    type: Date,
    default: Date.now
  },
  Result_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview_Result_Model_DB'
  },
  Score: {
    type: Number
  },
  Candidate_Name: {
    type: String
  },
  Organization_Name: {
    type: String
  },
  Interview_Name: {
    type: String
  }
});

const Interview_Attempt_Model = mongoose.model(
  "Interview_Attempt_Model_DB",
  Interview_Attempt_Schema
);

module.exports = {
  Interview_Attempt_Model
}; 
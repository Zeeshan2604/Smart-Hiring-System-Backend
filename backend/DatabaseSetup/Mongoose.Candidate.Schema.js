const mongoose = require("mongoose");

const Candidate_Schema = new mongoose.Schema({
  Name: { type: String, required: true },
  emailId: { type: String, required: true },
  PhoneNumber: { type: String },
  Address: { type: String },
  TechinalSkillsProgrammingLanguage: { type: String },
  TechnicalSkillsFrameworks: { type: String },
  TechnicalSkillsDatabase: { type: String },
  PastPerformanceProjectDetails: { type: String },
  PastPerformanceInternshipDetails: { type: String },
  PastPerformanceHackathonDetails: { type: String },
  Resume: { type: String },
  // Reference to organization (by name or id)
  OrganizationName: { type: String, required: true },
  OrganizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'SignUp_Model_DB' },
  // Optionally, add createdAt/updatedAt
}, { timestamps: true });

Candidate_Schema.index({ emailId: 1, OrganizationName: 1 });

const Candidate_Model = mongoose.model("Candidate_Model_DB", Candidate_Schema);
module.exports = { Candidate_Model }; 
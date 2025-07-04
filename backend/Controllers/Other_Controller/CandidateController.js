const { Candidate_Model } = require("../../DatabaseSetup/Mongoose.Candidate.Schema");
const { SignUp_Model } = require("../../DatabaseSetup/Mongoose.SignUp.Schema");

// Add a candidate for an organization
const addCandidate = async (req, res) => {
  try {
    const {
      Name,
      emailId,
      PhoneNumber,
      Address,
      TechinalSkillsProgrammingLanguage,
      TechnicalSkillsFrameworks,
      TechnicalSkillsDatabase,
      PastPerformanceProjectDetails,
      PastPerformanceInternshipDetails,
      PastPerformanceHackathonDetails,
      Resume,
      OrganizationName,
      OrganizationId
    } = req.body;

    // Check for required fields
    if (!Name || !emailId || !OrganizationName) {
      return res.status(400).json({ status: "Error", message: "Name, email, and organization are required." });
    }

    // Check if candidate exists in SignUp_Model (case-insensitive)
    const userProfile = await SignUp_Model.findOne({ emailId: { $regex: `^${emailId}$`, $options: 'i' } });
    if (!userProfile) {
      return res.status(404).json({ status: "Error", message: "The candidate does not exist!" });
    }

    // Check if candidate already exists for this organization
    const existingCandidate = await Candidate_Model.findOne({ emailId, OrganizationName });
    if (existingCandidate) {
      return res.status(409).json({ status: "Error", message: "The candidate has already been added!" });
    }

    // Allow duplicate emails for different organizations
    const candidate = new Candidate_Model({
      Name,
      emailId,
      PhoneNumber,
      Address,
      TechinalSkillsProgrammingLanguage,
      TechnicalSkillsFrameworks,
      TechnicalSkillsDatabase,
      PastPerformanceProjectDetails,
      PastPerformanceInternshipDetails,
      PastPerformanceHackathonDetails,
      Resume,
      OrganizationName,
      OrganizationId
    });
    await candidate.save();
    res.status(201).json({ status: "Success", message: "Candidate added successfully!", data: candidate });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Failed to add candidate", error: error.message });
  }
};

// Get all candidates for an organization
const getCandidates = async (req, res) => {
  try {
    const { OrganizationName, page = 0, limit = 20 } = req.query;
    if (!OrganizationName) {
      return res.status(400).json({ status: "Error", message: "Organization name is required." });
    }
    const candidates = await Candidate_Model.find({ OrganizationName })
      .skip(page * limit)
      .limit(Number(limit))
      .lean();
    res.status(200).json({ status: "Success", data: candidates });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Failed to fetch candidates", error: error.message });
  }
};

// Get a candidate by email and organization
const getCandidateByEmail = async (req, res) => {
  try {
    const { emailId, OrganizationName } = req.query;
    if (!emailId || !OrganizationName) {
      return res.status(400).json({ status: "Error", message: "Email and organization name are required." });
    }
    // Find candidate in Candidate_Model (organization-specific, case-insensitive email)
    let candidate = await Candidate_Model.findOne({ emailId: { $regex: `^${emailId}$`, $options: 'i' }, OrganizationName }).lean();
    // If not found, search by email only (across all orgs)
    if (!candidate) {
      candidate = await Candidate_Model.findOne({ emailId: { $regex: `^${emailId}$`, $options: 'i' } }).lean();
    }
    if (!candidate) {
      return res.status(404).json({ status: "Error", message: "Candidate not found." });
    }
    // Find user details in SignUp_Model (main user profile, case-insensitive email)
    const userProfile = await SignUp_Model.findOne({ emailId: { $regex: `^${emailId}$`, $options: 'i' } }).lean();
    if (!userProfile) {
      // If not found in SignUp_Model, just return candidate data
      return res.status(200).json({ status: "Success", data: candidate });
    }
    // Merge candidate and userProfile (userProfile takes precedence for user fields)
    const merged = { ...candidate, ...userProfile };
    res.status(200).json({ status: "Success", data: merged });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Failed to fetch candidate", error: error.message });
  }
};

// Remove a candidate for an organization
const removeCandidate = async (req, res) => {
  try {
    const { emailId, OrganizationName } = req.body;
    if (!emailId || !OrganizationName) {
      return res.status(400).json({ status: "Error", message: "Email and organization name are required." });
    }
    const result = await Candidate_Model.deleteOne({ emailId, OrganizationName });
    if (result.deletedCount === 1) {
      res.status(200).json({ status: "Success", message: "Candidate removed successfully!" });
    } else {
      res.status(404).json({ status: "Error", message: "Candidate not found." });
    }
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Failed to remove candidate", error: error.message });
  }
};

module.exports = { addCandidate, getCandidates, getCandidateByEmail, removeCandidate }; 
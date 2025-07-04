const { SignUp_Model } = require("../../DatabaseSetup/Mongoose.SignUp.Schema.js");

const SaveResume = async (req, res) => {
  const { email, resume } = req.body;
  if (!email || !resume) {
    return res.status(400).json({ status: "Error", message: "Email and resume are required" });
  }
  try {
    const updated = await SignUp_Model.findOneAndUpdate(
      { emailId: email },
      { Resume: JSON.stringify(resume) },
      { new: true }
    );
    if (updated) {
      res.status(200).json({ status: "Success", message: "Resume saved", data: updated.Resume });
    } else {
      res.status(404).json({ status: "Error", message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ status: "Error", message: "Failed to save resume", error: err.message });
  }
};

const GetResume = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: "Error", message: "Email is required" });
  }
  try {
    const user = await SignUp_Model.findOne({ emailId: email });
    if (user && user.Resume) {
      try {
        // If Resume is empty or invalid, treat as not found
        if (typeof user.Resume !== 'string' || user.Resume.trim() === "") {
          return res.status(404).json({ status: "Error", message: "No resume found" });
        }
        const parsed = JSON.parse(user.Resume);
        res.status(200).json({ status: "Success", data: parsed });
      } catch (err) {
        // JSON parse error, treat as not found
        return res.status(404).json({ status: "Error", message: "No resume found (invalid format)" });
      }
    } else {
      res.status(404).json({ status: "Error", message: "No resume found" });
    }
  } catch (err) {
    res.status(500).json({ status: "Error", message: "Failed to get resume", error: err.message });
  }
};

module.exports = { SaveResume, GetResume };

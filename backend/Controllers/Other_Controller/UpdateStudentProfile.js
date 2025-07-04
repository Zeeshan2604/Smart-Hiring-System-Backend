const {
  SignUp_Model,
} = require("../../DatabaseSetup/Mongoose.SignUp.Schema.js");

const UpdateStudentProfile = async (req, res) => {
  if (process.env.NODE_ENV !== 'production') console.log('UpdateStudentProfile called with body:', req.body);
  
  const {
    Res_EmailId,
    Res_Name,
    Res_PhoneNumber,
    Res_Address,
    Res_TechinalSkillsProgrammingLanguage,
    Res_TechnicalSkillsFrameworks,
    Res_TechnicalSkillsDatabase,
    Res_PastPerformanceProjectDetails,
    Res_PastPerformanceInternshipDetails,
    Res_PastPerformanceHackathonDetails,
    // Organization fields
    Res_Industry,
    Res_Founded,
    Res_Location,
    Res_Website,
    Res_Size,
    Res_Specialities,
    Res_Mission,
    Res_Projects,
    Res_Technologies,
    Res_OpenPositions,
    Res_Description,
    Res_Linkedin
  } = req.body;

  try {
    if (process.env.NODE_ENV !== 'production') console.log('Finding and updating profile for email:', Res_EmailId);
    // Fetch the user from the DB
    const user = await SignUp_Model.findOne({ emailId: Res_EmailId }).lean();
    // Build update object dynamically
    const updateObj = {};
    if (Res_Name !== undefined) updateObj.Name = Res_Name;
    if (Res_PhoneNumber !== undefined) updateObj.PhoneNumber = Res_PhoneNumber;
    if (Res_Address !== undefined) updateObj.Address = Res_Address;
    if (Res_TechinalSkillsProgrammingLanguage !== undefined) updateObj.TechinalSkillsProgrammingLanguage = Res_TechinalSkillsProgrammingLanguage;
    if (Res_TechnicalSkillsFrameworks !== undefined) updateObj.TechnicalSkillsFrameworks = Res_TechnicalSkillsFrameworks;
    if (Res_TechnicalSkillsDatabase !== undefined) updateObj.TechnicalSkillsDatabase = Res_TechnicalSkillsDatabase;
    if (Res_PastPerformanceProjectDetails !== undefined) updateObj.PastPerformanceProjectDetails = Res_PastPerformanceProjectDetails;
    if (Res_PastPerformanceInternshipDetails !== undefined) updateObj.PastPerformanceInternshipDetails = Res_PastPerformanceInternshipDetails;
    if (Res_PastPerformanceHackathonDetails !== undefined) updateObj.PastPerformanceHackathonDetails = Res_PastPerformanceHackathonDetails;
    // Organization fields
    if (Res_Industry !== undefined) updateObj.Industry = Res_Industry;
    if (Res_Founded !== undefined) updateObj.Founded = Res_Founded;
    if (Res_Location !== undefined) updateObj.Location = Res_Location;
    if (Res_Website !== undefined) updateObj.Website = Res_Website;
    if (Res_Size !== undefined) updateObj.Size = Res_Size;
    if (Res_Specialities !== undefined) updateObj.Specialities = Res_Specialities;
    if (Res_Mission !== undefined) updateObj.Mission = Res_Mission;
    if (Res_Projects !== undefined) updateObj.Projects = Res_Projects;
    if (Res_Technologies !== undefined) updateObj.Technologies = Res_Technologies;
    if (Res_OpenPositions !== undefined) updateObj.OpenPositions = Res_OpenPositions;
    if (Res_Description !== undefined) updateObj.Description = Res_Description;
    if (Res_Linkedin !== undefined) updateObj.Linkedin = Res_Linkedin;

    if (process.env.NODE_ENV !== 'production') console.log('Update object to be sent to DB:', updateObj);

    const updatedProfile = await SignUp_Model.findOneAndUpdate(
      { emailId: Res_EmailId },
      updateObj,
      { new: true }
    );

    if (process.env.NODE_ENV !== 'production') console.log('Update result:', updatedProfile);

    if (updatedProfile) {
      if (process.env.NODE_ENV !== 'production') console.log('Profile updated successfully');
      res.status(200).json({
        status: "Success",
        message: "Profile updated successfully",
        data: updatedProfile
      });

      // If organization name is being updated, update Company_Name/OrganizationName in all related collections
      if (user && user.TypeofUser === 'org' && Res_Name !== undefined && Res_Name !== user.Name) {
        const { Interview_Result_Model } = require('../../DatabaseSetup/Mongoose.Result.Schema');
        const { Interview_Details_Model } = require('../../DatabaseSetup/Mongoose.InterviewDetails.Schema');
        const { Candidate_Model } = require('../../DatabaseSetup/Mongoose.Candidate.Schema');
        // Update Interview Results
        const res1 = await Interview_Result_Model.updateMany(
          { Company_Name: user.Name },
          { $set: { Company_Name: Res_Name } }
        );
        if (process.env.NODE_ENV !== 'production') console.log('[OrgNameUpdate] Updated Interview_Result_Model:', res1.modifiedCount);
        // Update Interview Details
        const res2 = await Interview_Details_Model.updateMany(
          { Company_Name: user.Name },
          { $set: { Company_Name: Res_Name } }
        );
        if (process.env.NODE_ENV !== 'production') console.log('[OrgNameUpdate] Updated Interview_Details_Model:', res2.modifiedCount);
        // Update Candidates
        if (process.env.NODE_ENV !== 'production') console.log('[OrgNameUpdate] Candidate_Model update query:', { OrganizationName: user.Name });
        // Log all matching candidates before update
        const candidatesBefore = await Candidate_Model.find({ OrganizationName: user.Name }).lean();
        if (process.env.NODE_ENV !== 'production') console.log('[OrgNameUpdate] Candidates matching old org name:', candidatesBefore.map(c => ({ _id: c._id, Name: c.Name, OrganizationName: c.OrganizationName })));
        // Update all candidates with old or new org name (handles multiple renames)
        const res3 = await Candidate_Model.updateMany(
          { OrganizationName: { $in: [user.Name, Res_Name] } },
          { $set: { OrganizationName: Res_Name } }
        );
        if (process.env.NODE_ENV !== 'production') console.log('[OrgNameUpdate] Updated Candidate_Model:', res3.modifiedCount);
        // Fallback: try case-insensitive update if nothing was updated
        if (res3.modifiedCount === 0) {
          const regex = new RegExp(`^${user.Name}$`, 'i');
          const res3b = await Candidate_Model.updateMany(
            { OrganizationName: regex },
            { $set: { OrganizationName: Res_Name } }
          );
          if (process.env.NODE_ENV !== 'production') console.log('[OrgNameUpdate] Fallback regex update Candidate_Model:', res3b.modifiedCount);
        }
      }
    } else {
      if (process.env.NODE_ENV !== 'production') console.log('Student not found');
      res.status(404).json({
        status: "Error",
        message: "Student not found"
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Error in UpdateStudentProfile:', error);
    res.status(500).json({
      status: "Error",
      message: "Failed to update profile",
      error: error.message
    });
  }
};

module.exports = {
  UpdateStudentProfile,
}; 
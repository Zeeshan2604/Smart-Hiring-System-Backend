const { Interview_Result_Model } = require("../../DatabaseSetup/Mongoose.Result.Schema");
const { getCache, setCache } = require('../../cache');

const Get_Candidate_Results = async (req, res) => {
  try {
    const { Candidate_Email } = req.body;
    console.log("Received request for email:", Candidate_Email);

    if (!Candidate_Email) {
      console.log("No email provided in request");
      return res.status(400).json({
        status: "Error",
        message: "Candidate email is required"
      });
    }

    // Redis cache key
    const cacheKey = `candidateResults:${Candidate_Email}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json({
        status: "Success",
        message: "Interview results retrieved successfully (from cache)",
        data: cached
      });
    }

    console.log("Querying database for results...");
    const results = await Interview_Result_Model.find({
      Candidate_Email: Candidate_Email
    }).sort({ Date_Of_Interview: -1 }); // Sort by date in descending order

    await setCache(cacheKey, results, 60); // cache for 60s

    console.log("Found results:", results);

    res.status(200).json({
      status: "Success",
      message: "Interview results retrieved successfully",
      data: results
    });
  } catch (error) {
    console.error("Error retrieving candidate results:", error);
    res.status(500).json({
      status: "Error",
      message: "Failed to retrieve interview results"
    });
  }
};

module.exports = {
  Get_Candidate_Results
}; 
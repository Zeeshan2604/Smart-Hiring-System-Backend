const {
  Interview_Result_Model,
} = require("../../DatabaseSetup/Mongoose.Result.Schema");
const mongoose = require("mongoose");
const { getCache, setCache } = require('../../cache');
const View_Candidate_Result_Function = async (req, res, next) => {
  const { Result_ID, Res_Company_Name, page = 0, limit = 20 } = req.body;
  if (process.env.NODE_ENV !== 'production') console.log('Request body:', req.body);
  try {
    if (Result_ID) {
      if (process.env.NODE_ENV !== 'production') console.log('Branch: Result_ID provided');
      if (process.env.NODE_ENV !== 'production') console.log('Fetching result by Result_ID:', Result_ID, 'Type:', typeof Result_ID);
      let result = null;
      // Try as string
      result = await Interview_Result_Model.findOne({ _id: Result_ID }).lean();
      if (!result && mongoose.Types.ObjectId.isValid(Result_ID)) {
        // Try as ObjectId
        result = await Interview_Result_Model.findOne({ _id: new mongoose.Types.ObjectId(Result_ID) }).lean();
      }
      if (process.env.NODE_ENV !== 'production') console.log('Result found:', result);
      if (!result) {
        return res.status(404).json({
          status: "Error",
          message: "Result not found",
        });
      }
      return res.status(200).json({
        status: "Success",
        message: "Result found successfully!",
        data: result,
      });
    } else if (Res_Company_Name) {
      if (process.env.NODE_ENV !== 'production') console.log('Branch: Res_Company_Name provided');
      // Redis cache key
      const cacheKey = `results:${Res_Company_Name}:${page}:${limit}`;
      const cached = await getCache(cacheKey);
      if (cached) {
        return res.status(200).json({
          status: "Success",
          message: "Interview result found successfully ! (from cache)",
          data: cached,
        });
      }
      // Use aggregation to get the oldest result per candidate per interview
      const View_Interview_Result = await Interview_Result_Model.aggregate([
        { $match: { Company_Name: Res_Company_Name } },
        { $sort: { createdAt: 1, _id: 1 } }, // sort by createdAt, fallback to _id
        { $group: {
            _id: { Candidate_Email: "$Candidate_Email", Interview_ID: "$Interview_ID" },
            doc: { $first: "$$ROOT" }
        }},
        { $replaceRoot: { newRoot: "$doc" } },
        { $skip: page * limit },
        { $limit: limit }
      ]).allowDiskUse(true);
      await setCache(cacheKey, View_Interview_Result, 60); // cache for 60s
      if (process.env.NODE_ENV !== 'production') console.log('Results found for company (first per candidate/interview):', View_Interview_Result.length);
      return res.status(200).json({
        status: "Success",
        message: "Interview result found successfully !",
        data: View_Interview_Result,
      });
    } else {
      if (process.env.NODE_ENV !== 'production') console.log('Branch: No valid identifier provided');
      return res.status(400).json({
        status: "Error",
        message: "Result_ID or Res_Company_Name is required",
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.log('Error in View_Candidate_Result_Function:', err);
    return res.status(500).json({
      status: "Error",
      message: "Unable to fetch result!",
    });
  }
};

module.exports = { View_Candidate_Result_Function };

const mongoose = require("mongoose");
const Interview_Result_Schema = new mongoose.Schema({
//Company Details
  Candidate_Name:{
    type: String,
  },
  Candidate_Email:{
    type : String,
  },
  Company_Name:{
    type:String,
  },
  HR_Name: {
    type: String,
  },
  //Interview Details
  Name_Technology: {
    type: String,
  },
  Number_Of_Questions: {
    type: Number,
  },
  Time_Duration: {
    type: Number,
  },
  Time_Of_Interview: {
    type: String,
  },
  Date_Of_Interview: {
    type: Date,
  },
//Question bank details
  Question_Arrays: {
    type: Array,
  },
  Answer_Arrays: {
    type: Array,
  },
  Performance_Array: {
    type: Array,
  },
  Text_Percentage: {
    type: Number,
  },
  Time_Percentage: {
    type: Number,
  },
  confidence_Percentage: {
    type: Number,
  },
  Overall_Percentage: {
    type: Number,
  },
}, { timestamps: true });

//Model for SignUp Testing
const Interview_Result_Model = mongoose.model("Interview_Result_Model_DB", Interview_Result_Schema);

Interview_Result_Schema.index({ Candidate_Email: 1, Interview_ID: 1, Company_Name: 1 });

module.exports = {
  Interview_Result_Model, 
};
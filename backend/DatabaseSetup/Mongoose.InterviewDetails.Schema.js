const mongoose = require("mongoose");
const Interview_Details_Schema = new mongoose.Schema({
  //Company Details
  Company_Name: {
    type: String,
  },
  Description: {
    type: String,
  },
  HR_Name: {
    type: String,
  },
  Instruction: {
    type: String,
  },
  //Interview Details
  Name_Technology: {
    type: String,
  },
  Interview_ID: {
    type: Number,
  },
  Number_Of_Questions: {
    type: Number,
    min: 0,
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
  Validity_Period: {
    type: Number,  // Number of days the interview remains active
    default: 30    // Default to 30 days if not specified
  },
  //Question bank details
  Question_Arrays: {
    type: Array,
  },
  Answer_Arrays: {
    type: Array,
  },
  Email_Arrays: {
    type: Array,
  }
});

//Model for SignUp Testing
const Interview_Details_Model = mongoose.model(
  "Interview_Details_Model_DB",
  Interview_Details_Schema
);
module.exports = {
  Interview_Details_Model,
};

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const bcrypt=require("bcryptjs");

dotenv.config({
  path: "./.env",
});

// Get MongoDB connection string with fallback
const MONGOOSE_CONNECTION = process.env.MONGOOSE_CONNECTION || process.env.MONGODB_URI || "mongodb://localhost:27017/smart-hiring-system";

mongoose.set("strictQuery", false);

// Connect to MongoDB with error handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGOOSE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.log("Application will continue without database connection");
    // Don't throw error, let the app continue
  }
};

// Call the connection function
connectDB();

mongoose.connection.on("open", () => {
  console.log("Database connection established");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

//Schema for SignUp Testing
const SignUp_Schema = new mongoose.Schema({
  Name:{
    type:String,
  },
  emailId: {
    type: String,
  },
  Password: {
    type: String,
  },
  TypeofUser: {
    type: String,
  },
  //For Students
  PhoneNumber: {
    type: String,
  },
  Address :{
    type: String,
  },
  TechinalSkillsProgrammingLanguage :{
    type: String,
  },
  TechnicalSkillsFrameworks :{
    type: String,
  },
  TechnicalSkillsDatabase :{
    type: String,
  },
  PastPerformanceProjectDetails :{
    type: String,
  },
  PastPerformanceInternshipDetails :{
    type: String,
  },
  PastPerformanceHackathonDetails :{
    type: String,
  },
  Resume :{
    type: String,
  },

  //For Organization
  Industry:{
    type: String,
  },
  Founded:{
    type: String,
  },
  Location:{
    type: String,
  },
  Website:{
    type: String,
  },
  Size:{
    type:String,
  },
  Specialities:{
    type: String,
  },
  Mission:{
    type: String,
  },
  Projects:{
    type: String,
  },
  Technologies:{
    type: String,
  },
  OpenPositions:{
    type: String,
  },
  Description:{
    type: String,
  },
  Linkedin:{
    type: String,
  },
});

//Pre-SaveMiddleware for Password Encryption
SignUp_Schema.pre("save", async function(){
  this.Password= await bcrypt.hash(this.Password, 12);
})

//Model for SignUp Testing
const SignUp_Model = mongoose.model("SignUp_Model_DB", SignUp_Schema);

SignUp_Schema.index({ emailId: 1 });
SignUp_Schema.index({ Name: 1 });

module.exports = {
  SignUp_Model, 
};


const mongoose = require("mongoose");

const VisibletestCaseS = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true // true for visible test cases, false for hidden/private
  },
  explanation: {
    type: String
  }
});



const HiddentestCaseS = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
});


const problemSchema = new mongoose.Schema({

  ProblemID: {
    type: Number,
    default: null,
    required: [true],
    trim: true,
    minlength: [1],
    unique: true
  },


  Title: {
    type: String,
    default: null,
    required: [true],
    trim: true,
    minlength: [2],
    maxlength: [60]
  },


  topics: {
    type: Array,
    required: true,

  },


  difficulty: {
    type: String,
    required: true,
    enum: {
      values: ["easy", "medium", "hard"],
      message: "{VALUE} is not a valid difficulty level"
      //The {VALUE} is a placeholder provided by Mongoose that 
      // automatically gets replaced with the actual invalid value that was passed to the schema.
    }
  },

  Description: {
    type: String,
    default: null,
    required: true,
    trim: true,
    minlength: [2],

  },

  VisibletestCase: [VisibletestCaseS],
  HiddentestCase: [HiddentestCaseS]


}, {
  timestamps: true
});


// Create and export the User model based on the schema
module.exports = mongoose.model("problem", problemSchema);

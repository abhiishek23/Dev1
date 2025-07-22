
const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  contestName: String,
  contestId:String , 
  startTime: Date,
  endTime: Date,

     AdminExpectation: {
      type: String,
      trim: true,
    },
  problems: [
    {
     problemID: Number,
      points: Number
    }
  ],
 participants: [
  {
    participantId: {
      type: String,           // custom user ID from frontend
      required: true
    },
    submissions: [
      {
        problemID: {
          type: Number,       // custom problem ID from your Problem schema
          required: true
        },
        submittedAt: {
          type: Date,         // stores exact timestamp
          required: true,
          default: Date.now
        },
        verdict: {
          type: String,       // e.g. "Accepted", "Wrong Answer"
          enum: ["Accepted", "Wrong Answer", "TLE", "Compilation Error", "Runtime Error"],
          required: true
        },
        pointsEarned: {
          type: Number,
          default: 0
        }
      }
    ],
    totalScore: {
      type: Number,
      default: 0
    },
    lastSubmissionTime: {
      type: Date,
      default: null
    }
  }
] , 

leaderboard: [
    {
      participantId: {
        type: String,
        required: true,
      },
      totalScore: {
        type: Number,
        default: 0
      },
      lastSubmissionTime: {
        type: Date,
        default: null
      },
      submissions: [
        {
          problemID: {
            type: Number,
           
          },
          submittedAt: {
            type: Date,
            required: true,
          },
          verdict: {
            type: String,
            required: true,
          },
          pointsEarned: {
            type: Number,
            default: 0
          }
        }
      ]
    }
  ]

});
module.exports = mongoose.model("Contest", contestSchema);
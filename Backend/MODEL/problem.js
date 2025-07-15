// const mongoose = require("mongoose");

// const VisibletestCaseS = new mongoose.Schema({
//   input: { type: String, required: true },
//   expectedOutput: { type: String, required: true },
//   isPublic: { type: Boolean, default: true },
//   explanation: { type: String },
// });

// const HiddentestCaseS = new mongoose.Schema({
//   input: { type: String, required: true },
//   expectedOutput: { type: String, required: true },
//   isPublic: { type: Boolean, default: false },
// });

// const problemSchema = new mongoose.Schema(
//   {
//     ProblemID: {
//       type: Number,
//       default: null,
//       required: [true],
//       trim: true,
//       minlength: [1],
//       unique: true,
//     },

//     Title: {
//       type: String,
//       default: null,
//       required: [true],
//       trim: true,
//       minlength: [2],
//       maxlength: [60],
//     },

//     topics: {
//       type: Array,
//       required: true,
//     },

//     difficulty: {
//       type: String,
//       required: true,
//       enum: {
//         values: ["easy", "medium", "hard"],
//         message: "{VALUE} is not a valid difficulty level",
//       },
//     },

//     Description: {
//       type: String,
//       default: null,
//       required: true,
//       trim: true,
//       minlength: [2],
//     },

//     points: Number,

//     // ✅ Added inputFormat field
//     inputFormat: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // ✅ Added outputFormat field
//     outputFormat: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     VisibletestCase: [VisibletestCaseS],
//     HiddentestCase: [HiddentestCaseS],
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("problem", problemSchema);
const mongoose = require("mongoose");

const VisibletestCaseS = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  explanation: { type: String },
});

const HiddentestCaseS = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
});

const problemSchema = new mongoose.Schema(
  {
    ProblemID: {
      type: Number,
      default: null,
      required: [true],
      trim: true,
      minlength: [1],
      unique: true,
    },

    Title: {
      type: String,
      default: null,
      required: [true],
      trim: true,
      minlength: [2],
      maxlength: [60],
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
        message: "{VALUE} is not a valid difficulty level",
      },
    },

    Description: {
      type: String,
      default: null,
      required: true,
      trim: true,
      minlength: [2],
    },

    points: Number,

    inputFormat: {
      type: String,
      required: true,
      trim: true,
    },

    outputFormat: {
      type: String,
      required: true,
      trim: true,
    },
       Solution: {
      type: String,
      trim: true,
    },

    VisibletestCase: [VisibletestCaseS],
    HiddentestCase: [HiddentestCaseS],

    // ✅ Added InvisibleTime as an optional object with start and end date-times
    InvisibleTime: {
      start: { type: Date, default: null },
      end: { type: Date, default: null },
    },
     contestId:String ,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("problem", problemSchema);


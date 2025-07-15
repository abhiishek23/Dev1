// // backend/createContest.js
// const Contest = require("./MODEL/contest");
// const Problem = require("./MODEL/problem");

// async function createContest(data) {
//   try {
//     const { contestId, name, startTime, endTime, problems } = data;

//     if (!contestId || !name || !startTime || !endTime || !Array.isArray(problems)) {
//       return { success: false, error: "Missing required fields" };
//     }

//     const validatedProblems = [];

//     for (const p of problems) {
//       const problem = await Problem.findOne({ ProblemID: p.problemId });
//       if (!problem) {
//         return { success: false, error: `Problem with ID ${p.problemId} not found` };
//       }
//       validatedProblems.push({ problemId: p.problemId, points: p.points });
//     }

//     const newContest = new Contest({
//       contestId,
//       name,
//       startTime: new Date(startTime),
//       endTime: new Date(endTime),
//       problems: validatedProblems,
//       leaderboard: [],
//     });

//     await newContest.save();

//     return { success: true, message: "Contest created successfully", contest: newContest };
//   } catch (err) {
//     return { success: false, error: err.message };
//   }
// }

// module.exports = createContest;
// backend/createContest.js
const Contest = require("./MODEL/contest");
const Problem = require("./MODEL/problem");

async function createContest(data) {
  try {
    const { contestId, contestName, startTime, endTime, problems } = data;

    if (!contestId || !contestName || !startTime || !endTime || !Array.isArray(problems)) {
      return { success: false, error: "Missing required fields" };
    }

    const validatedProblems = [];

    for (const p of problems) {
      // ✅ Updated field: problemID instead of problemId, using Number type
      const problem = await Problem.findOne({ ProblemID: p.problemID });
      if (!problem) {
        return { success: false, error: `Problem with ID ${p.problemID} not found` };
      }
      validatedProblems.push({ problemID: p.problemID, points: p.points });
    }

    const newContest = new Contest({
      contestId,
      contestName,                 // ✅ Updated: contestName instead of name
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      problems: validatedProblems,
      leaderboard: [],
    });

    await newContest.save();

    return { success: true, message: "Contest created successfully", contest: newContest };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = createContest;

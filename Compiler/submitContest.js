// const Contest = require("../Backend/MODEL/contest"); // Adjust the path if needed
// const { handleSubmission } = require("./handleSubmission"); // Correctly import

// const submitContest = async ({
//   contestId,
//  ProblemID,
//   userId,
//   language = 'cpp',
//   code,
//   topics = [],
//   difficulty = null
// }) => {
//   if (!contestId || !ProblemID || !userId || !code) {
//     return { success: false, error: "Missing contestId,ProblemID, userId, or code." };
//   }

//   try {
//     console.log("📥 Starting normal submission...");

//     // 🛠 Call handleSubmission correctly and destructure from result.body
//     const result = await handleSubmission({ language, code,ProblemID, userId, topics, difficulty });

//     if (!result || typeof result.body?.verdict === "undefined") {
//       return { success: false, error: "Failed to evaluate submission" };
//     }

//     const { verdict, results } = result.body;

//     console.log("✅ Submission result:", verdict);

//     const contest = await Contest.findOne({ contestId });

//     if (!contest) {
//       return { success: false, error: "Contest not found" };
//     }

//     const now = new Date();
//     const isWithinTime = now >= contest.startTime && now <= contest.endTime;

//     console.log("🕒 Contest time check:", {
//       now,
//       startTime: contest.startTime,
//       endTime: contest.endTime,
//       isWithinTime
//     });

//     if (isWithinTime) {
//       const problemEntry = contest.problems.find(p => p.ProblemID ===ProblemID);

//       if (!problemEntry) {
//         return { success: false, error: `Problem ${ProblemID} not part of this contest` };
//       }

//       const pointsForProblem = problemEntry.points || 0;
//       const pointsEarned = verdict === "Accepted" ? pointsForProblem : 0;

//       // Find or create participant
//       let participant = contest.participants.find(p => p.participantId === userId);

//       if (!participant) {
//         participant = {
//           participantId: userId,
//           submissions: [],
//           totalScore: 0,
//           lastSubmissionTime: now
//         };
//         contest.participants.push(participant);
//       }

//       // Append this submission
//       participant.submissions.push({
//    ProblemID,
//         submittedAt: now,
//         verdict,
//         pointsEarned
//       });

//       participant.totalScore += pointsEarned;
//       participant.lastSubmissionTime = now;

//       // Update leaderboard
//       contest.leaderboard = contest.participants.map(p => ({
//         participantId: p.participantId,
//         totalScore: p.totalScore,
//         lastSubmissionTime: p.lastSubmissionTime,
//         submissions: p.submissions
//       }));

//       contest.leaderboard.sort((a, b) => {
//         if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
//         return new Date(a.lastSubmissionTime) - new Date(b.lastSubmissionTime);
//       });

//       await contest.save();

//       console.log("🏁 Contest updated successfully");
//     } else {
//       console.log("⏱ Outside contest time. Submission accepted but not counted.");
//     }

//     return {
//       success: true,
//       message: isWithinTime ? "Submitted & contest updated" : "Submitted, but outside contest time",
//       verdict,
//       results
//     };

//   } catch (error) {
//     console.error("❌ Error in submitContest:", error);
//     return { success: false, error: "Internal server error" };
//   }
// };

// module.exports = submitContest;
const Contest = require("../Backend/MODEL/contest");
const problemModel = require("../Backend/MODEL/problem");
const { handleSubmission } = require("./handleSubmission");

const submitContest = async ({
  ProblemID,
  userId,
  language = 'cpp',
  code,
  topics = [],
  difficulty = null
}) => {
  if (!ProblemID || !userId || !code) {
    return { success: false, error: "Missing ProblemID, userId, or code." };
  }

  try {
    console.log("📥 Starting normal submission...");

    // Fetch problem using ProblemID to get contestId
    const problemDoc = await problemModel.findOne({ ProblemID });

    if (!problemDoc || !problemDoc.contestId) {
      return { success: false, error: "Problem not found or contestId missing in problem." };
    }

    const contestId = problemDoc.contestId;

    // Evaluate submission
    const result = await handleSubmission({ language, code, ProblemID, userId, topics, difficulty });

    if (!result || typeof result.body?.verdict === "undefined") {
      return { success: false, error: "Failed to evaluate submission" };
    }

    const { verdict, results } = result.body;

    console.log("✅ Submission result:", verdict);

    const contest = await Contest.findOne({ contestId });

    if (!contest) {
      return { success: false, error: "Contest not found" };
    }

    const now = new Date();
    const isWithinTime = now >= contest.startTime && now <= contest.endTime;

    console.log("🕒 Contest time check:", {
      now,
      startTime: contest.startTime,
      endTime: contest.endTime,
      isWithinTime
    });

    if (isWithinTime) {
      const problemEntry = contest.problems.find(p => p.ProblemID === ProblemID);

      if (!problemEntry) {
        return { success: false, error: `Problem ${ProblemID} not part of this contest` };
      }

      const pointsForProblem = problemEntry.points || 0;
      const pointsEarned = verdict === "Accepted" ? pointsForProblem : 0;

      // Find or create participant
      let participant = contest.participants.find(p => p.participantId === userId);

      if (!participant) {
        participant = {
          participantId: userId,
          submissions: [],
          totalScore: 0,
          lastSubmissionTime: now
        };
        contest.participants.push(participant);
      }

      // Append this submission
      participant.submissions.push({
        ProblemID,
        submittedAt: now,
        verdict,
        pointsEarned
      });

      participant.totalScore += pointsEarned;
      participant.lastSubmissionTime = now;

      // Update leaderboard
      contest.leaderboard = contest.participants.map(p => ({
        participantId: p.participantId,
        totalScore: p.totalScore,
        lastSubmissionTime: p.lastSubmissionTime,
        submissions: p.submissions
      }));

      contest.leaderboard.sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return new Date(a.lastSubmissionTime) - new Date(b.lastSubmissionTime);
      });

      await contest.save();

      console.log("🏁 Contest updated successfully");
    } else {
      console.log("⏱ Outside contest time. Submission accepted but not counted.");
    }

    return {
      success: true,
      message: isWithinTime ? "Submitted & contest updated" : "Submitted, but outside contest time",
      verdict,
      results
    };

  } catch (error) {
    console.error("❌ Error in submitContest:", error);
    return { success: false, error: "Internal server error" };
  }
};

module.exports = submitContest;

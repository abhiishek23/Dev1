import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContestPage = () => {
  const [contestList, setContestList] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentContestName, setCurrentContestName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("http://51.21.190.160:4000/api/contests");
        setContestList(response.data.contests);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  const fetchLeaderboard = async (contestId, contestName) => {
    try {
      const response = await axios.get(
        `http://51.21.190.160:4000/contest/${contestId}/leaderboard`
      );
      setLeaderboardData(response.data.leaderboard);
      setCurrentContestName(contestName);
      setShowLeaderboard(true);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const filterContests = (type) => {
    const now = new Date();
    return contestList.filter((contest) => {
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);

      if (type === "ongoing") return now >= start && now <= end;
      if (type === "upcoming") return now < start;
      if (type === "past") return now > end;
      return false;
    });
  };

  const renderTable = (contests, title) => (
    <div className="relative overflow-x-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">
        {title}
      </h2>
      {contests.length === 0 ? (
        <p className="text-slate-300 italic">No contests available.</p>
      ) : (
        <table className="w-full text-sm text-left text-slate-300 border-separate border-spacing-y-2">
          <thead className="text-xs text-slate-200 uppercase bg-slate-800">
            <tr>
              <th className="px-6 py-3">Contest Name</th>
              <th className="px-6 py-3">Contest ID</th>
              <th className="px-6 py-3">Start Time</th>
              <th className="px-6 py-3">Length</th>
              <th className="px-6 py-3">Leaderboard</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest, index) => (
              <tr
                key={index}
                className="bg-slate-900 border border-slate-700 hover:bg-slate-800 transition"
              >
                <td
                  className="px-6 py-4 font-medium text-white cursor-pointer hover:underline"
                  onClick={() => navigate(`/contest/${contest.contestId}`)}
                >
                  {contest.contestName}
                </td>
                <td className="px-6 py-4">{contest.contestId}</td>
                <td className="px-6 py-4">
                  {new Date(contest.startTime).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {Math.round(
                    (new Date(contest.endTime) -
                      new Date(contest.startTime)) /
                      (1000 * 60)
                  )}{" "}
                  mins
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      fetchLeaderboard(contest.contestId, contest.contestName)
                    }
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    Leaderboard
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="pt-24 px-6 text-white min-h-screen bg-slate-950">
      <h1 className="text-2xl font-bold mb-6 text-center tracking-wide">
        All Contests
      </h1>

      {renderTable(filterContests("ongoing"), "Ongoing Contests")}
      {renderTable(filterContests("upcoming"), "Upcoming Contests")}
      {renderTable(filterContests("past"), "Past Contests")}

      {showLeaderboard && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-slate-900 text-slate-200 p-6 rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-wide">
                Leaderboard - {currentContestName}
              </h2>
              <button
                className="text-red-400 font-bold text-2xl hover:text-red-500"
                onClick={() => setShowLeaderboard(false)}
              >
                ✕
              </button>
            </div>
            {leaderboardData.length === 0 ? (
              <p className="italic text-slate-400">No leaderboard data available.</p>
            ) : (
              <table className="w-full text-sm text-left text-slate-300 border-separate border-spacing-y-2">
                <thead className="text-xs text-slate-200 uppercase bg-slate-700">
                  <tr>
                    <th className="px-4 py-2">Participant ID</th>
                    <th className="px-4 py-2">Total Score</th>
                    <th className="px-4 py-2">Last Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, idx) => (
                    <tr key={idx} className="bg-slate-800 border border-slate-600">
                      <td className="px-4 py-2">{entry.participantId}</td>
                      <td className="px-4 py-2">{entry.totalScore}</td>
                      <td className="px-4 py-2">
                        {entry.lastSubmissionTime
                          ? new Date(
                              entry.lastSubmissionTime
                            ).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestPage;

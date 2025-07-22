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
        const response = await axios.get("http://localhost:4000/api/contests");
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
        `http://localhost:4000/contest/${contestId}/leaderboard`
      );
      setLeaderboardData(response.data.leaderboard);
      setCurrentContestName(contestName);
      setShowLeaderboard(true);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const filterContests = (type) => {
    const now = new Date(); // Fresh timestamp per call
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
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {contests.length === 0 ? (
        <p className="text-gray-500">No contests available.</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">CONTEST NAME</th>
              <th className="px-6 py-3">CONTEST ID</th>
              <th className="px-6 py-3">START TIME</th>
              <th className="px-6 py-3">LENGTH</th>
              <th className="px-6 py-3">LEADERBOARD</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-100">
                <td
                  className="px-6 py-4 font-medium cursor-pointer"
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
                    className="text-blue-600 underline"
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
    <div className="pt-20 px-4">
      <h1 className="text-xl font-bold">All Contests</h1>

      {renderTable(filterContests("ongoing"), "Ongoing Contests")}
      {renderTable(filterContests("upcoming"), "Upcoming Contests")}
      {renderTable(filterContests("past"), "Past Contests")}

      {showLeaderboard && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Leaderboard - {currentContestName}
              </h2>
              <button
                className="text-red-500 font-bold text-xl"
                onClick={() => setShowLeaderboard(false)}
              >
                ✕
              </button>
            </div>
            {leaderboardData.length === 0 ? (
              <p>No leaderboard data available.</p>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Participant ID</th>
                    <th className="px-4 py-2">Total Score</th>
                    <th className="px-4 py-2">Last Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, idx) => (
                    <tr key={idx} className="bg-white border-b">
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

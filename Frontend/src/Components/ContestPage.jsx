import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContestPage = () => {
  const [contestList, setContestList] = useState([]);
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

  const now = new Date();

  const filterContests = (type) => {
    return contestList.filter(contest => {
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);
      if (type === "ongoing") return now >= start && now <= end;
      if (type === "upcoming") return now < start;
      if (type === "past") return now > end;
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
              <th className="px-6 py-3">LEADER BOARD</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/contest/${contest.contestId}`)}
                className="bg-white border-b hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-6 py-4 font-medium">{contest.contestName}</td>
                <td className="px-6 py-4">{contest.contestId}</td>
                <td className="px-6 py-4">{new Date(contest.startTime).toLocaleString()}</td>
                <td className="px-6 py-4">
                  {Math.round((new Date(contest.endTime) - new Date(contest.startTime)) / (1000 * 60))} mins
                </td>
                <td className="px-6 py-4 text-blue-600">Leaderboard</td>
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
    </div>
  );
};

export default ContestPage;

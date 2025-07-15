import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Table = () => {
  const [problemList, setProblemList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/problems");
        console.log("API Response:", response.data); // ✅ Debug
        setProblemList(response.data.problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="relative overflow-x-auto mt-20 px-4">
      <h1 className="text-xl font-bold mb-4">Problem List</h1>

      {problemList.length === 0 ? (
        <p className="text-gray-500">No problems available.</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">QUESTION NAME</th>
              <th className="px-6 py-3">QUESTION ID</th>
              <th className="px-6 py-3">DIFFICULTY</th>
            </tr>
          </thead>
          <tbody>
            {problemList.map((problem, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/problem/${problem.ProblemID}`)}
                className="bg-white border-b hover:bg-gray-100 cursor-pointer"
              >
                <th className="px-6 py-4 font-medium">{problem.Title}</th>
                <td className="px-6 py-4">{problem.ProblemID}</td>
                <td className="px-6 py-4">{problem.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;

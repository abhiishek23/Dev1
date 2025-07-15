// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const ContestDetailPage = () => {
//   const { contestId } = useParams();
//   const [contest, setContest] = useState(null);
//   const [problemList, setProblemList] = useState([]);

//   useEffect(() => {
//     const fetchContestDetails = async () => {
//       try {
//         const res = await axios.get(`http://localhost:4000/api/contest/${contestId}`);
//         setContest(res.data.contest);
//         setProblemList(res.data.problemDetails);
//       } catch (error) {
//         console.error("Error fetching contest:", error);
//       }
//     };
//     fetchContestDetails();
//   }, [contestId]);

//   return (
//     <div className="pt-20 px-4">
//       {contest && (
//         <>
//           <h1 className="text-xl font-bold mb-4">{contest.contestName} - Problems</h1>
//           <table className="w-full text-sm text-left text-gray-500">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3">PROBLEM NAME</th>
//                 <th className="px-6 py-3">PROBLEM ID</th>
//                 <th className="px-6 py-3">DIFFICULTY</th>
//                 <th className="px-6 py-3">POINTS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {problemList.map((problem, index) => (
//                 <tr
//                   key={index}
//                   className="bg-white border-b hover:bg-gray-100"
//                 >
//                   <td className="px-6 py-4">{problem.Title}</td>
//                   <td className="px-6 py-4">{problem.ProblemID}</td>
//                   <td className="px-6 py-4">{problem.difficulty}</td>
//                   <td className="px-6 py-4">{problem.points}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default ContestDetailPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ContestDetailPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [problemList, setProblemList] = useState([]);
  const navigate = useNavigate(); // ✅ Added navigate hook

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/contest/${contestId}`);
        setContest(res.data.contest);
        setProblemList(res.data.problemDetails);
      } catch (error) {
        console.error("Error fetching contest:", error);
      }
    };
    fetchContestDetails();
  }, [contestId]);

  return (
    <div className="pt-20 px-4">
      {contest && (
        <>
          <h1 className="text-xl font-bold mb-4">{contest.contestName} - Problems</h1>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">PROBLEM NAME</th>
                <th className="px-6 py-3">PROBLEM ID</th>
                <th className="px-6 py-3">DIFFICULTY</th>
                <th className="px-6 py-3">POINTS</th>
              </tr>
            </thead>
            <tbody>
              {problemList.map((problem, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/problem/${problem.ProblemID}`)} // ✅ Navigate on click
                >
                  <td className="px-6 py-4">{problem.Title}</td>
                  <td className="px-6 py-4">{problem.ProblemID}</td>
                  <td className="px-6 py-4">{problem.difficulty}</td>
                  <td className="px-6 py-4">{problem.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ContestDetailPage;

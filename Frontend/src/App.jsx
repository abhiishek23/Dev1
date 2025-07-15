// // import './App.css';
// // import Navbar from "./Components/Navbar.jsx";
// // import Card1 from "./Components/Card1.jsx";
// // import Card2 from "./Components/Card2.jsx";
// // import Card3 from "./Components/Card2.jsx";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
// // import Table from "./Components/Table.jsx";
// // import CodingPage from "./Components/CodingPage.jsx";


import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Home from "./Components/Home.jsx";
import Table from "./Components/Table.jsx";
import CodingPage from "./Components/CodingPage.jsx";
import ContestPage from "./Components/ContestPage.jsx";
import ContestDetailPage from "./Components/ContestDetailPage.jsx"; // ✅ Import added
import WritePop from "./Components/WritePop.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Table />} />
        <Route path="/problem/:id" element={<CodingPage />} />
        <Route path="/contests" element={<ContestPage />} /> {/* ✅ Added */}
        <Route path="/contest/:contestId" element={<ContestDetailPage />} /> {/* ✅ Added */}
         <Route path="/login" element={<Login/>} />
         <Route path="/signup" element={<Signup/>} />
      </Routes>
  
    </>
  );
}

export default App;



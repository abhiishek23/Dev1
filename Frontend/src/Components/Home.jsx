// src/Components/Home.jsx
import React from "react";
import Card1 from "./Card1.jsx";
import Card2 from "./Card2.jsx";
import Card3 from "./Card3.jsx";
import Card4 from "./Card4.jsx";

const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-2 mb-4">Select a problem from the Problems tab.</p>

      {/* Flex container for cards */}
      <div className="flex space-x-4">
        <Card1 />
        <Card2 />
        <Card3 />
        <Card4/>
      </div>
    </div>
  );
};

export default Home;

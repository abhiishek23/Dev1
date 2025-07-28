import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../Features/signupSlice.js";
import axios from "axios";

const Signup = () => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(password && (email || userId))) {
      alert("Please enter email or userId and password");
      return;
    }

    try {
      const response = await axios.post("http://51.21.190.160:4000/signup", {
        email,
        userId,
        password, 
      });

      const data = response.data;

      if (response.status === 200 && data.success) {
        dispatch(signup({ ...data.user, token: data.token, loggedIn: true }));
        alert("Login successful!");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      if (err.response && err.response.data) {
        alert(`Error: ${err.response.data}`);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="signup p-8 max-w-md w-full mx-auto bg-gray-800 rounded-lg shadow-2xl">
        <form className="signup_form flex flex-col gap-4" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4 text-center text-white">Log in Here</h1>

          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

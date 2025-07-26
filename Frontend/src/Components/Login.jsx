import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Features/userSlice.js";
import axios from "axios";

const LoginPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(firstname && lastname && email && password && userId)) {
      alert("Please enter all the information");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/register", {
        firstname,
        lastname,
        email,
        password,
        userId,
      });

      const data = response.data;

      if (response.status === 200 && data.success) {
        dispatch(login({ ...data.user, token: data.token, loggedIn: true }));
        alert("Registered successfully!");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      if (err.response && err.response.data) {
        alert(`Error: ${err.response.data}`);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="p-8 w-full max-w-md bg-gray-800 rounded-xl shadow-2xl">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-2 text-center text-white">Register Here</h1>

          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

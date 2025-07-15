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
      const response = await axios.post("http://localhost:4000/signup", {
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
    <div className="signup p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <form className="signup_form flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold mb-2">Sign Up Here</h1>

        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;

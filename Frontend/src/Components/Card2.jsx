import React, { useState } from "react";
import { useSelector } from "react-redux";

const Card2 = () => {
  const [toUserId, setToUserId] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const loggedInUser = useSelector((state) => state.user.user);
  const signedUpUser = useSelector((state) => state.signup.user);
  const user = loggedInUser || signedUpUser;

  const handleSendRequest = async () => {
    if (!user || !user.userId) {
      setResponseMessage("You must be logged in to send a request.");
      setShowPopup(true);
      return;
    }

    try {
      const res = await fetch("http://51.21.190.160:4000/friend-request/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUserId: user.userId,
          toUserId: toUserId.trim(),
        }),
      });

      const data = await res.json();
      setResponseMessage(data.message || "No response message");
    } catch (error) {
      setResponseMessage("Error sending request");
    }

    setShowPopup(true);
    setToUserId("");
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl shadow-md w-72 border border-slate-700">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-2 text-white">Send Friend Request</h2>

      {/* Original description */}
      <p className="text-white text-sm mb-4">
        Making friend will help you to compare yourself with your friend , by comparing errors ,consistency , contest performance ,approaches .
      </p>

      {/* Input + OK Button below description */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={toUserId}
          onChange={(e) => setToUserId(e.target.value)}
          placeholder="User ID"
          className="flex-1 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={handleSendRequest}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          OK
        </button>
      </div>

      {/* Response Popup */}
      {showPopup && (
        <div className="mt-3 p-2 bg-green-100 text-green-800 text-sm rounded shadow-sm">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default Card2;

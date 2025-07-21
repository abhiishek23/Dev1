import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function Card4() {
  const loggedInUser = useSelector((state) => state.user.user);
  const signedUpUser = useSelector((state) => state.signup.user);
  const user = loggedInUser || signedUpUser;

  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.userId) return;

      try {
        const response = await axios.get(`http://localhost:4000/user/${user.userId}/friendRequests`);
        if (response.data.success) {
          setPendingRequests(response.data.friendRequests || []);
        } else {
          setError("Failed to fetch friend requests.");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching requests.");
      }
    };

    fetchRequests();
  }, [user?.userId]);

  const handleAction = async (fromUserId, action) => {
    const url =
      action === "accept"
        ? "http://localhost:4000/friend-request/accept"
        : "http://localhost:4000/friend-request/decline";

    try {
      await axios.post(url, {
        fromUserId,
        toUserId: user.userId,
      });

      setPendingRequests((prev) =>
        prev.filter((id) => id !== fromUserId)
      );
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      setError(`Failed to ${action} request.`);
    }
  };

  return (
    <div className="flex justify-center my-6">
      <div className="bg-white border border-gray-200 shadow rounded-lg w-96 p-4">
        <h5 className="text-xl font-semibold text-gray-800 mb-4">Pending Friend Requests</h5>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {pendingRequests.length === 0 ? (
          <p className="text-sm text-gray-600">No pending requests.</p>
        ) : (
          <ul className="space-y-3">
            {pendingRequests.map((fromId) => (
              <li key={fromId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-gray-700 text-sm">{fromId}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAction(fromId, "accept")}
                    className="text-green-600 hover:text-green-800 text-sm"
                    title="Accept"
                  >
                    ✔
                  </button>
                  <button
                    onClick={() => handleAction(fromId, "decline")}
                    className="text-red-600 hover:text-red-800 text-sm"
                    title="Decline"
                  >
                    ✖
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Card4;

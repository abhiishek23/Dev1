import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Popup from "./popup"; // Adjust path if needed

function Card3() {
  const loggedInUser = useSelector((state) => state.user.user);
  const signedUpUser = useSelector((state) => state.signup.user);
  const user = loggedInUser || signedUpUser;

  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch friends of the logged-in user from backend
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.userId) return;

      try {
        const response = await axios.get(`http://localhost:4000/user/${user.userId}/friends`);
        if (response.data.success) {
          setFriends(response.data.friends || []);
        } else {
          setErrorMsg("Failed to load friends.");
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        setErrorMsg("Server error while fetching friends.");
      }
    };

    fetchFriends();
  }, [user?.userId]);

  // 🧠 Compare with selected friend
  const handleCompare = async () => {
    if (!user || !user.userId || !selectedFriend) {
      setErrorMsg("Please select a friend.");
      setPopupOpen(true);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setAnalysis("");

    try {
      const response = await axios.post("http://localhost:4000/compare", {
        userId1: user.userId,
        userId2: selectedFriend,
      });

      if (response.data.success) {
        setAnalysis(response.data.analysis);
      } else {
        setErrorMsg(response.data.error || "Comparison failed.");
      }
    } catch (error) {
      console.error("Compare error:", error);
      setErrorMsg("Server error during comparison.");
    }

    setLoading(false);
    setPopupOpen(true);
  };

  return (
    <>
      <div className="flex justify-center my-6">
        <div className="relative flex flex-col bg-slate-900 shadow-sm border border-slate-700 rounded-lg w-96">
          <div className="p-4">
            <h5 className="mb-2 text-white text-xl font-semibold">
              Compare with Friends
            </h5>
            <p className="text-white leading-normal font-light mb-4">
              Compare yourself with a friend to see how you stack up.
            </p>

            {/* Dropdown with friends fetched from backend */}
          <select
  value={selectedFriend}
  onChange={(e) => setSelectedFriend(e.target.value)}
  className="w-full border border-slate-600 px-2 py-2 rounded mb-3 text-sm bg-slate-800 text-white placeholder:text-slate-400"
>
  <option value="" disabled hidden>
    Select a friend
  </option>
  {friends.map((friendId) => (
    <option key={friendId} value={friendId}>
      {friendId}
    </option>
  ))}
</select>

            <button
              className="rounded-md bg-blue-600 py-2 px-4 w-full text-white hover:bg-blue-700"
              type="button"
              onClick={handleCompare}
              disabled={loading}
            >
              {loading ? "Comparing..." : "Compare"}
            </button>
          </div>
        </div>
      </div>

      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        content={
          errorMsg
            ? <p className="text-red-500">{errorMsg}</p>
            : <pre className="whitespace-pre-wrap">{analysis}</pre>
        }
      />
    </>
  );
}

export default Card3;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Popup from "./popup";

function Card1() {
  const loggedInUser = useSelector((state) => state.user.user);
  const signedUpUser = useSelector((state) => state.signup.user);

  const user = loggedInUser || signedUpUser;

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);

  const handleGetReview = async () => {
    if (!user || !user.userId) {
      setErrorMsg("User not logged in or signed up.");
      setPopupOpen(true);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setReview("");

    try {
      const response = await axios.post("http://13.60.230.88:4000/errorAnalysis", {
        userId: user.userId,
      });

      if (response.data.success) {
        setReview(response.data.review);
        setPopupOpen(true);
      } else {
        setErrorMsg(response.data.error || "Failed to get review.");
        setPopupOpen(true);
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      setErrorMsg("Internal error while fetching review.");
      setPopupOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center my-6">
        <div className="relative flex flex-col bg-slate-900 shadow-sm border border-slate-700 rounded-lg w-96">
          <div className="p-4">
            <h5 className="mb-2 text-white text-xl font-semibold">
              BugTracker+: Your Personal Coding Error Analyst
            </h5>
            <p className="text-white leading-normal font-light">
              It analyzes your past code errors to highlight common mistakes, weak topics, and difficulty levels you struggle with.
            </p>

            <button
              className="rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 mt-6 text-white"
              type="button"
              onClick={handleGetReview}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Get Review"}
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
            : <pre className="whitespace-pre-wrap">{review}</pre>
        }
      />
    </>
  );
}

export default Card1;

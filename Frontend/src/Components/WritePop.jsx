import React, { useState } from "react";

const WritePop = ({ onSubmitApproach, onClose }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmitApproach(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-2xl shadow-2xl transition-all duration-300"
      >
        <h3 className="text-2xl font-semibold mb-4 text-white">Write Your Approach</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded resize-none h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="submit"
            className={`px-5 py-2 rounded font-medium transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded font-medium transition text-white"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePop;

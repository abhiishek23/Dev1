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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Write Your Approach</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-2 rounded resize-none h-48"
          disabled={loading}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
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

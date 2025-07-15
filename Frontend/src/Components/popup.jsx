// Components/Popup.jsx
import React from "react";

function Popup({ isOpen, onClose, content }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white max-h-[80vh] w-[600px] p-6 rounded-lg shadow-lg overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default Popup;

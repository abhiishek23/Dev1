// // Components/Popup.jsx
// import React from "react";

// function Popup({ isOpen, onClose, content }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
//       <div className="bg-white max-h-[80vh] w-[600px] p-6 rounded-lg shadow-lg overflow-y-auto relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black"
//         >
//           ✕
//         </button>
//         <div>{content}</div>
//       </div>
//     </div>
//   );
// }

// export default Popup;
// Components/Popup.jsx
import React from "react";

function Popup({ isOpen, onClose, content }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white w-full max-w-2xl max-h-[85vh] p-8 rounded-xl shadow-2xl overflow-y-auto relative transition-all duration-300 ease-in-out">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-xl font-bold transition duration-200"
        >
          ✕
        </button>
        <div className="space-y-4 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}

export default Popup;



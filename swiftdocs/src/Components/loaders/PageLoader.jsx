import React from "react";

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      <p className="text-purple-600 text-md font-medium">Loading page...</p>
    </div>
  );
}

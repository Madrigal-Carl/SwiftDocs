import React from "react";

export default function DataLoader() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-300"></div>
      </div>
      <span className="ml-3 text-gray-600 font-medium">Loading data...</span>
    </div>
  );
}

import React from "react";
import logo from "../assets/colored_logo.png";

export default function Loader() {
  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200">
      <div className="flex flex-col items-center">
        {/* Logo / Image */}
        <img src={logo} alt="Loading" className="w-36 mb-4 object-contain" />

        {/* Jumping dots */}
        <div className="flex space-x-2">
          <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}

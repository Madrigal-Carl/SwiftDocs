import React from "react";
import logo from "../assets/colored_logo.png";

export default function TableLoader({ colSpan = 6, rows = 7 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx}>
          <td colSpan={colSpan} className="py-6">
            {idx === Math.floor(rows / 2) ? (
              // Only show loader in the middle row
              <div className="flex flex-col items-center justify-center gap-4">
                <img src={logo} alt="Loading" className="w-20 object-contain" />
                <div className="flex space-x-2">
                  <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" />
                </div>
              </div>
            ) : null}
          </td>
        </tr>
      ))}
    </>
  );
}

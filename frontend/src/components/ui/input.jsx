import React from "react";

export function Input({ className, ...props }) {
  return (
    <input
      className={`px-3 py-2 border border-gray-300 rounded-md bg-[#1A012F] text-white focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] ${className}`}
      {...props}
    />
  );
}
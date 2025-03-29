import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";

export const Sidebar = ({ roomId }) => {
  const [files, setFiles] = useState([
    "4_Mar_RegulaFalsi.c",
    "4_Mar_RegulaFalsi.exe",
    "18_2.c",
    "18_2.exe",
    "18_3.c",
    "18Feb.exe",
    "18FebBisectionMethod.c",
    "18FebBisectionMethod.exe",
  ]);

  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`);
        if (!response.ok) throw new Error("Failed to fetch room details");

        const data = await response.json();
        setCollaborators(data.collaborators);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  return (
    <div className="w-64 h-full bg-[#0D021F] text-[#EAEAEA] flex flex-col p-4 border-r border-[#4A00E0]">
      {/* Logo */}
      <h2 className="text-2xl font-bold text-[#7E3AF2] mb-4">SyncIDE</h2>

      {/* Upload Button */}
      <button className="flex items-center justify-center bg-[#7E3AF2] text-white py-2 px-4 rounded-lg mb-4 hover:bg-[#9B51E0] transition">
        <FaUpload className="mr-2" /> Upload
      </button>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="flex items-center text-sm py-1 px-2 hover:bg-[#1E1E2F] rounded">
            📄 {file}
          </div>
        ))}
      </div>

      {/* Room Info */}
      <div className="mt-4 p-3 bg-[#1E1E2F] rounded-lg text-sm">
        <p>🔑 <strong>Room ID:</strong> {roomId}</p>
      </div>

      {/* Collaborators */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Collaborators</h3>
        {collaborators.length > 0 ? (
          collaborators.map((user, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <p>{user.name}</p>
            </div>
          ))
        ) : (
          <p>No collaborators yet</p>
        )}
      </div>
    </div>
  );
};

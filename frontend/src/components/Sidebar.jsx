import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";

export const Sidebar = ({ roomId, setCode, handleCodeChange, code, language }) => {
  const [files, setFiles] = useState([
    "4_Mar_RegulaFalsi.c",
    "4_Mar_RegulaFalsi.exe",
    "18_2.c",
    "18_2.exe"
  ]);

  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/rooms/get/${roomId}`);
        if (!response.ok) throw new Error("Failed to fetch room details");

        const data = await response.json();
        setCollaborators(data.collaborators);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  // Handles file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("File content:", e.target.result);
      setCode(e.target.result);
      handleCodeChange(e.target.result);
      setFiles((prevFiles) =>
        prevFiles.includes(file.name) ? prevFiles : [...prevFiles, file.name]
      );
    };

    reader.readAsText(file);
  };

  // Handles file selection
  const handleFileClick = async (filename) => {
    try {
      const response = await fetch(`/files/${filename}`);
      const text = await response.text();
      setCode(text);
      setFilename(filename);
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };

  // Function to handle file download
  const handleDownload = () => {
    console.log("Code to download:", code); // Check the code content
    if (!code) {
      alert("No code to download!");
      return;
    }
    
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // Set the download filename based on the language
    const extension = language === 'javascript' ? 'js' :
                      language === 'python' ? 'py' :
                      language === 'c' ? 'c' :
                      language === 'cpp' ? 'cpp' : 'txt'; // Default to .txt if no match
                      
    link.download = `code.${extension}`; // Use a default filename based on the language
    link.click();
    URL.revokeObjectURL(link.href); // Clean up
  };


  return (
    <div className="w-64 h-full bg-[#0D021F] text-[#EAEAEA] flex flex-col p-4 border-r border-[#4A00E0]">
      <h2 className="text-2xl font-bold text-[#7E3AF2] mb-4">SyncIDE</h2>

      <label className="flex items-center justify-center bg-[#7E3AF2] text-white py-2 px-4 rounded-lg mb-4 hover:bg-[#9B51E0] transition cursor-pointer">
        <FaUpload className="mr-2" /> Upload
        <input type="file" accept=".c,.cpp,.js,.py" className="hidden" onChange={handleFileUpload} />
      </label>

      {/* Download Button */}
      <button
        className="bg-[#4A00E0] text-white px-4 py-2 rounded-lg mb-4"
        onClick={handleDownload}
      >
        📥 Download
      </button>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center text-sm py-1 px-2 hover:bg-[#1E1E2F] rounded cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            📄 {file}
          </div>
        ))}
      </div>

      {/* Room Info */}
      <div 
        className="mt-4 p-3 bg-[#1E1E2F] rounded-lg text-sm cursor-copy"
        onClick={() => navigator.clipboard.writeText(roomId)}
      >
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

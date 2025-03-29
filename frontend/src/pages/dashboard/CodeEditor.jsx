import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client"; // WebSocket client
import { Sidebar } from "../../components/Sidebar.jsx";
import { WriteCode } from "../../components/Editor.jsx";
import { OutputConsole } from "../../components/OutputConsole.jsx";

const socket = io("http://localhost:3000"); // Replace with your backend URL

export const CodeEditor = () => {
  const { roomId } = useParams(); // Get roomId from URL
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [messages, setMessages] = useState([]); // Chat messages
  const [message, setMessage] = useState(""); // Current input message

  console.log(roomId);
  useEffect(() => {
    if (!roomId) return;

    // Join the room
    socket.emit("joinRoom", roomId);

    // Receive code updates from other users
    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    // Receive chat messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, [roomId]);

  // Handle code changes & emit updates
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeUpdate", { roomId, newCode });
  };

  // Send a chat message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { roomId, message });
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="flex h-screen bg-[#0D021F]">
      {/* Sidebar */}
      <Sidebar roomId={roomId}/>

      {/* Code Editor + Chat Box Section */}
      <div className="flex flex-col flex-1">
        {/* Code Editor & Chat Box */}
        <div className="flex flex-1">
          <WriteCode code={code} setCode={handleCodeChange} language={language} setLanguage={setLanguage} />
          
          {/* Chat Box */}
          <div className="w-80 border-l border-[#4A00E0] bg-[#1E1E2F] p-4 flex flex-col">
            <h2 className="text-lg text-white font-semibold">💬 ChatBox</h2>
            <div className="flex-1 overflow-y-auto bg-[#0D021F] rounded-lg mt-2 p-2">
              {messages.map((msg, index) => (
                <div key={index} className="text-white text-sm p-1">{msg}</div>
              ))}
            </div>
            {/* Chat Input */}
            <div className="mt-2 flex">
              <input
                type="text"
                className="flex-1 p-2 bg-[#222] text-white rounded-lg"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="ml-2 bg-[#4A00E0] text-white p-2 rounded-lg" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Output Console */}
        <OutputConsole code={code} language={language} />
      </div>
    </div>
  );
};

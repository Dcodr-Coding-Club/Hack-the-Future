import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { WriteCode } from "../../components/Editor.jsx";
import { OutputConsole } from "../../components/OutputConsole.jsx";
import { Sidebar } from "../../components/Sidebar.jsx";

const socket = io.connect("http://localhost:3000");

export const CodeEditor = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [activeFile, setActiveFile] = useState("");

  const activeFileRef = useRef(activeFile); // Store activeFile as a ref
  const username = "YourUsername"; // Replace with actual username logic

  useEffect(() => {
    activeFileRef.current = activeFile; // Keep ref updated with latest activeFile
  }, [activeFile]);

  useEffect(() => {
    // Join the room when the component mounts
    socket.emit("joinRoom", roomId);

    socket.on("receivedmessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("changeCode", (newC, currentFile) => {
      // Compare with ref instead of state
      if (activeFileRef.current === currentFile) {
        setCode(newC);
      }
    });

    return () => {
      socket.off("receivedmessage");
      socket.off("changeCode");
    };
  }, [roomId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeUpdate", { roomId, newCode, activeFile: activeFileRef.current }); // Ensure latest activeFile is sent

    // Send a request to update the database
    if (activeFileRef.current) {
      fetch(`http://localhost:3000/api/file/update/${activeFileRef.current}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newCode }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            console.error("Error updating file in database:", data.message);
          }
        })
        .catch((error) => console.error("Error updating file:", error));
    }
  };

  const handleSendButton = () => {
    if (message.trim()) {
      socket.emit("send_message", { roomId, username, message }); // Include username in the emission
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-[#0D021F]">
      {/* Sidebar */}
      <Sidebar
        roomId={roomId}
        setCode={setCode}
        handleCodeChange={handleCodeChange}
        code={code}
        language={language}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
      />

      {/* Code Editor + Chat Box Section */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-1">
          <WriteCode code={code} setCode={handleCodeChange} language={language} setLanguage={setLanguage} />

          {/* Chat Box */}
          <div className="w-80 border-l border-[#4A00E0] bg-[#1E1E2F] p-4 flex flex-col">
            <h2 className="text-lg text-white font-semibold">💬 ChatBox</h2>
            <div className="flex-1 overflow-y-auto bg-[#0D021F] rounded-lg mt-2 p-2">
              {messages.map((msg, index) => (
                <div key={index} className="text-white text-sm p-1">{msg.username}: {msg.message}</div>
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
              <button className="ml-2 bg-[#4A00E0] text-white p-2 rounded-lg" onClick={handleSendButton}>
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

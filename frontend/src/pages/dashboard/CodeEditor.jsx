import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
// import { jwtDecode } from "jwt-decode"; // Import JWT decode package
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
  const [userid, setUserid] = useState(null);
  const [user, setUser] = useState(null);

  const activeFileRef = useRef(activeFile); // Store activeFile as a ref
  // const username = "YourUsername"; // Replace with actual username logic

  useEffect(() => {
    activeFileRef.current = activeFile; // Keep ref updated with latest activeFile
  }, [activeFile]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        // Decode JWT token to get user ID
        const decoded = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token:", decoded); // Debugging

        const userId = decoded.id; // Ensure this matches your backend's userId field
        if (!userId) {
          console.error("User ID not found in token");
          return;
        }

        // Fetch user details from backend
        const response = await fetch(`http://localhost:3000/auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        console.log("Fetched User Data:", userData); // Debugging
        setUser(userData); // Set user state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("previousMessages", (oldMessages) => {
      setMessages(oldMessages);
    });

    socket.on("receivedmessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("changeCode", (newC) => {
      setCode(newC);
    });

    return () => {
      socket.off("previousMessages");
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
    if (message.trim() && user) {
      socket.emit("send_message", { roomId, username: user.username, message });
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
      <div className="flex flex-1">
        <div className="flex flex-col flex-1 gap-0">
          <div className="flex-1">
            <WriteCode code={code} setCode={handleCodeChange} language={language} setLanguage={setLanguage} />
          </div>

          <div className="h-[47%]">
            <OutputConsole code={code} language={language} />
          </div>
        </div>

        {/* Chat Box */}
        <div className="w-80 border-l border-[#4A00E0] bg-[#1E1E2F] p-4 flex flex-col">
          <h2 className="text-lg text-white font-semibold">💬 ChatBox</h2>
          <div className="flex-1 overflow-y-auto bg-[#0D021F] rounded-lg mt-2 p-2">
            {messages.map((msg, index) => (
              <div key={index} className="text-white text-sm p-1">
                <span className="text-gray-500 font-semibold">{msg.username}:</span>{" "}
                <span className="text-white">{msg.message}</span>
              </div>
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
            <button
              className="ml-2 bg-[#4A00E0] text-white p-2 rounded-lg"
              onClick={handleSendButton}
              disabled={!user}
            >
              Send
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

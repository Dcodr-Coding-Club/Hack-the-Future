import { useEffect, useState } from "react";
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

  const handleCodeChange = (newCode) => {
    // setCode(newCode);
    // console.log(newCode);
    socket.emit("codeUpdate",newCode);
  };

  const handleSendButton = () => {
    if (message.trim()) {
      socket.emit("send_message", { message }); // ✅ Send message as an object
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receivedmessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]); // ✅ Store entire object
    });

    socket.on("changeCode", (newC) => {
      setCode(newC);
    })

    return () => {
      socket.off("receivedmessage");
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#0D021F]">
      {/* Sidebar */}
      <Sidebar roomId={roomId} setCode={setCode} handleCodeChange={handleCodeChange} code={code} language={language} />

      {/* Code Editor + Chat Box Section */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-1">
          <WriteCode code={code} setCode={handleCodeChange} language={language} setLanguage={setLanguage} />

          {/* Chat Box */}
          <div className="w-80 border-l border-[#4A00E0] bg-[#1E1E2F] p-4 flex flex-col">
            <h2 className="text-lg text-white font-semibold">💬 ChatBox</h2>
            <div className="flex-1 overflow-y-auto bg-[#0D021F] rounded-lg mt-2 p-2">
              {messages.map((msg, index) => (
                <div key={index} className="text-white text-sm p-1">{msg.message}</div>
                // ✅ Extract `message` to avoid React error
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

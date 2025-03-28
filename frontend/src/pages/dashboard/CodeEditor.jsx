import { Sidebar } from "../../components/Sidebar.jsx";
import { WriteCode } from "../../components/Editor.jsx";
import { OutputConsole } from "../../components/OutputConsole.jsx";
import { useState } from "react";

export const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");

  return (
    <div className="flex h-screen bg-[#0D021F]">
      {/* Sidebar */}
      <Sidebar />

      {/* Code Editor + Chat Box Section */}
      <div className="flex flex-col flex-1">
        {/* Code Editor & Chat Box */}
        <div className="flex flex-1">
          <WriteCode code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
          <div className="w-80 border-l border-[#4A00E0] bg-[#1E1E2F] p-4">
            <h2 className="text-lg text-white font-semibold">💬 ChatBox</h2>
            {/* Chat Messages & Input */}
            <div className="h-full bg-[#0D021F] rounded-lg mt-2"></div>
          </div>
        </div>

        {/* Output Console */}
        <OutputConsole code={code} language={language} />
      </div>
    </div>
  );
};

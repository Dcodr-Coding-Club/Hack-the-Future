import Editor from "@monaco-editor/react";

export const WriteCode = ({ code, setCode, language, setLanguage }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#0D021F] text-[#EAEAEA] p-4">
      {/* Language Selector */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-lg font-semibold">Language:</label>
        <select
          className="bg-[#1E1E2F] text-[#EAEAEA] border border-[#4A00E0] rounded-lg px-3 py-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Code Editor */}
      <div className="flex-1 border border-[#4A00E0] rounded-lg overflow-hidden">
        <Editor
          height="25rem"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={setCode}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};

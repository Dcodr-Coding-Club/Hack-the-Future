import Editor from "@monaco-editor/react";

export const WriteCode = ({ code, setCode, language, setLanguage, filename }) => {
  // Function to handle file download
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || `code.${language}`; // Default filename if none provided
    link.click();
    URL.revokeObjectURL(link.href); // Clean up
  };

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

      {/* Filename Display */}
      {filename && <p className="text-sm text-gray-400 mb-2">📂 Editing: {filename}</p>}

      {/* Download Button */}
      <div className="mb-2">
        <button
          className="bg-[#4A00E0] text-white px-4 py-2 rounded-lg"
          onClick={handleDownload}
        >
          📥 Download
        </button>
      </div>

      {/* Code Editor */}
      <div className="flex-1 border border-[#4A00E0] rounded-lg overflow-hidden h-full">
        <Editor
          height="400px"
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

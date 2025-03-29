import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { EditorComponent } from "../../components/Editor";

export const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("");
  const [language, setLanguage] = useState("c");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar setCode={setCode} setFilename={setFilename} />

      {/* Editor Section */}
      <div className="flex-1 flex flex-col">
        <EditorComponent code={code} setCode={setCode} language={language} setLanguage={setLanguage} filename={filename} />
      </div>
    </div>
  );
};

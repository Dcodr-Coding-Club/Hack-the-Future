import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { FaCode, FaFolderOpen, FaPlus, FaSyncAlt, FaUsers, FaUpload } from "react-icons/fa";

export const Home = () => {
  const [username, setUsername] = useState("User");
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D021F] text-[#EAEAEA] flex flex-col items-center justify-center p-8 space-y-8">
      {/* Header with Animation */}
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome, {username}!
      </motion.h1>

      {/* Main Grid Layout */}
      <div className="grid gap-6 w-full max-w-2xl">
        {/* Live Collaboration Section */}
        <Card className="bg-[#1A012F] hover:shadow-2xl transition transform hover:scale-105">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaUsers /> Live Collaboration
            </h2>
            <p className="text-sm text-gray-400">Join active coding sessions or create your own room.</p>
            <div className="mt-4 flex space-x-4">
              <Button className="bg-[#4A00E0] hover:bg-[#7E3AF2] flex-1" onClick={() => router("/join-room")}>
                Join Room
              </Button>
              <Button className="bg-[#4A00E0] hover:bg-[#7E3AF2] flex-1" onClick={() => router("/create-room")}>
                Create Room
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="bg-[#1A012F] hover:shadow-2xl transition transform hover:scale-105">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaFolderOpen /> Recent Projects
            </h2>
            <ul className="space-y-2">
              <li className="bg-[#7E3AF2] p-2 rounded-lg cursor-pointer hover:bg-[#9B51E0] transition flex items-center gap-2">
                <FaCode /> Project A
              </li>
              <li className="bg-[#7E3AF2] p-2 rounded-lg cursor-pointer hover:bg-[#9B51E0] transition flex items-center gap-2">
                <FaCode /> Project B
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Button
          className="bg-[#7E3AF2] hover:bg-[#9B51E0] p-3 text-lg rounded-lg flex items-center gap-2 justify-center"
          onClick={() => router("/new-project")}
        >
          <FaPlus /> New Project
        </Button>

        {/* Code Editor Access */}
        <Button
          className="bg-[#FF5733] hover:bg-[#E14A2B] p-3 text-lg rounded-lg flex items-center gap-2 justify-center"
          onClick={() => router("/editor")}
        >
          <FaCode /> Open Code Editor
        </Button>

        {/* Version Control & Offline Sync */}
        <Card className="bg-[#1A012F] hover:shadow-2xl transition transform hover:scale-105">
          <CardContent className="p-6 flex flex-col space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaSyncAlt /> Version Control & Offline Sync
            </h2>
            <p className="text-sm text-gray-400">Track your code changes, sync when online, and resolve conflicts.</p>
            <div className="flex space-x-4">
              <Button className="bg-[#00C853] hover:bg-[#00A844] flex-1 flex items-center gap-2 justify-center">
                <FaUpload /> Commit Changes
              </Button>
              <Button className="bg-[#FF1744] hover:bg-[#D50000] flex-1 flex items-center gap-2 justify-center">
                <FaSyncAlt /> Sync Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
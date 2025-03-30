import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { FaCode, FaFolderOpen, FaUsers } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

export const Home = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentRooms, setRecentRooms] = useState([]);
  const [name, setName] = useState("");
  const router = useNavigate();

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const token = localStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded) {
          setName(decoded.username)
          setUsername(decoded.id); // Set username
        }
      } catch (error) {
        toast.error('Inavalid token');
        console.error("Invalid token:", error);
      }
    }

    // Load recent rooms
    const savedRooms = JSON.parse(localStorage.getItem("recentRooms")) || [];
    setRecentRooms(savedRooms);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router('/login');
    }
  }, [])
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert("Room name cannot be empty!");
      return;
    }

    const roomId = uuidv4();
    const newRoom = { roomId, roomName, ownerId: username, collaborators: [] };

    try {
      const response = await fetch("http://localhost:3000/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (response.ok) {
        setIsModalOpen(false);

        // Save room in local storage
        const updatedRooms = [...recentRooms, newRoom].slice(-5);
        localStorage.setItem("recentRooms", JSON.stringify(updatedRooms));
        setRecentRooms(updatedRooms);
        toast.success("Room created Successfully!");
        router(`/editor/${roomId}`);
      } else {
        toast.error("Failed to create room");
      }
    } catch (error) {
      toast.error('Error creating room')
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = async () => {
    const enteredRoomId = prompt("Enter Room ID:");
    console.log(enteredRoomId);
    // da015c43-df07-4736-aaf2-bc28b844b001
    if (!enteredRoomId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/rooms/join/${enteredRoomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }), // Send username in body
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Joined room successfully!");
        router(`/editor/${enteredRoomId}`); // Redirect to the editor
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("Failed to join room");
    }
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token"); // Check if token exists
    if (token) {
      localStorage.removeItem("token"); // Clear the token
      router("/login"); // Redirect to login page
    }
  };

  return (
    <div className="min-h-screen bg-[#0D021F] text-[#EAEAEA] flex flex-col items-center justify-center p-8 space-y-8">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome, {name}!
      </motion.h1>

      <div className="grid gap-6 w-full max-w-2xl">
        <Card className="bg-[#1A012F] hover:shadow-2xl transition transform hover:scale-105">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaUsers /> Live Collaboration
            </h2>
            <p className="text-sm text-gray-400">
              Join active coding sessions or create your own room.
            </p>
            <div className="mt-4 flex space-x-4">
              <Button
                className="bg-[#4A00E0] hover:bg-[#7E3AF2] flex-1"
                onClick={handleJoinRoom}
              >
                Join Room
              </Button>
              <Button
                className="bg-[#4A00E0] hover:bg-[#7E3AF2] flex-1"
                onClick={() => setIsModalOpen(true)}
              >
                Create Room
              </Button>
            </div>
          </CardContent>
        </Card>

        {recentRooms.length > 0 && (
          <Card className="bg-[#1A012F] hover:shadow-2xl transition transform hover:scale-105">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaFolderOpen /> Recent Rooms
              </h2>
              <ul className="space-y-2">
                {recentRooms.map((room, index) => (
                  <li
                    key={index}
                    className="bg-[#7E3AF2] p-2 rounded-lg cursor-pointer hover:bg-[#9B51E0] transition flex items-center gap-2"
                    onClick={() => router(`/editor/${room.roomId}`)}
                  >
                    <FaCode /> {room.roomName}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1A012F] p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">Enter Room Name</h2>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-2 border rounded bg-gray-800 text-white"
            />
            <div className="flex justify-between mt-4">
              <Button className="bg-[#4A00E0] hover:bg-[#7E3AF2]" onClick={handleCreateRoom}>
                Create
              </Button>
              <Button className="bg-gray-600 hover:bg-gray-500" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

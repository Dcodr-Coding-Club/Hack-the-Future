import React, { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [profilePic, setProfilePic] = useState("/pp.png"); // Default placeholder image
  const [showEditOptions, setShowEditOptions] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
      setShowEditOptions(false);
    }
  };

  const removeImage = () => {
    setProfilePic("/pp.png"); // Reset to default image
    setShowEditOptions(false);
  };

  return (
    <div className="font-sans antialiased bg-gradient-to-br from-blue-300 to-pink-300 min-h-screen flex items-center justify-center p-8"
      style={{ backgroundImage: "url('/sky.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-[70%] flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden p-6">
        <div className="w-full md:w-1/3 flex flex-col items-center mt-16 relative"> 
          <div className="relative">
            <img
              src={profilePic} // Corrected image reference
              alt="Profile"
              className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-full shadow-lg border-4 border-white"
            />
          </div>
          <label className="mt-4 cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-600">
            📷 Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          {profilePic !== "/pp.png" && ( // Show edit button only if not default image
            <button
              onClick={() => setShowEditOptions(true)}
              className="absolute bottom-0 right-0 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800"
            >
              ✏️
            </button>
          )}
          {showEditOptions && (
            <div className="absolute top-1/2 bg-white shadow-lg p-4 rounded-lg flex flex-col space-y-2">
              <button onClick={removeImage} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
                ❌ Remove Photo
              </button>
              <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600">
                🖼 Choose from Media
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3 bg-white p-6 md:p-12 rounded-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-600 text-center md:text-left">
            Hii SuperStar!
          </h1>
          <p className="text-gray-500 text-lg mt-2 text-center md:text-left">
            🎉 Your journey is epic, and you're totally rocking it! Keep being awesome! 🚀😄✨
          </p>
          <div className="mt-6 space-y-4">
            <input type="text" placeholder="🌟 Enter your name" className="w-full p-3 rounded-lg border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="📍 Enter your location" className="w-full p-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" value={location} onChange={(e) => setLocation(e.target.value)} />
            <input type="number" placeholder="🎂 Enter your age" className="w-full p-3 rounded-lg border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700" value={age} onChange={(e) => setAge(e.target.value)} />
            <input type="text" placeholder="💡 Enter your hobbies" className="w-full p-3 rounded-lg border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
          </div>
          <div className="mt-6 bg-blue-100 p-4 rounded-xl shadow-md">
            <p className="text-lg font-semibold text-blue-600">Did you know? 🎈</p>
            <p className="text-gray-600 text-sm">
              This little superstar has already written their first short story!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

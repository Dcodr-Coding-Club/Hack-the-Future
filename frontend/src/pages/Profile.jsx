import React, { useState,useEffect } from "react";

const Profile = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [profilePic, setProfilePic] = useState("/pp.png"); // Default placeholder image
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
      setSelectedFile(file);
      setShowEditOptions(false);
    }
  };

 const handleSubmit = async () => {
    try {
        // Step 1: Fetch authenticated user ID before submitting
        const authResponse = await fetch("http://localhost:5000/api/auth/check-auth", {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();
        if (!authResponse.ok || !authData.isAuthenticated) {
            alert("User not authenticated. Please log in.");
            return;
        }

        const userId = authData.user.user_id; // Get user_id
        if (!userId) {
            alert("User ID is missing. Please try again.");
            return;
        }

        // Step 2: Create form data and include user_id
        const formData = new FormData();
        formData.append("user_id", userId); 
        formData.append("name", name);
        formData.append("location", location);
        formData.append("age", age);
        formData.append("hobbies", hobbies);

        if (selectedFile) {
            formData.append("profile_pic", selectedFile);
        }

        // Step 3: Submit form data
        const response = await fetch("http://localhost:5000/api/auth/profile", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
            alert("Profile updated successfully!");
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
};


  
  const removeImage = () => {
    setProfilePic("/pp.png"); // Reset to default image
    setShowEditOptions(false);
  };
  useEffect(() => {
    const fetchUserAndProfile = async () => {
        try {
            // Step 1: Get authenticated user
            const authResponse = await fetch("http://localhost:5000/api/auth/check-auth", {
                method: "GET",
                credentials: "include", // Ensures cookies are sent
            });

            const authData = await authResponse.json();

            if (!authResponse.ok || !authData.isAuthenticated) {
                console.warn("User not authenticated");
                return;
            }

            const userId = authData.user.user_id; // Get user ID from authentication

            // Step 2: Fetch Profile using user ID
            const profileResponse = await fetch("http://localhost:5000/api/auth/profile", {
              method: "GET",
              credentials: "include", // Send cookies for session authentication
          });
            const profileData = await profileResponse.json();

            if (profileResponse.ok) {
              setUserId(profileData.user_id);
                setName(profileData.name || "");
                setLocation(profileData.location || "");
                setAge(profileData.age || "");
                setHobbies(profileData.hobbies || "");

                if (profileData.profile_pic) {
                    setProfilePic(`http://localhost:5000${profileData.profile_pic}`);
                }
            } else {
                console.warn("Profile not found:", profileData.message);
            }
        } catch (error) {
            console.error("Error fetching user/profile:", error);
        }
    };

    fetchUserAndProfile();
}, []);

  return (
    <div className="font-sans antialiased bg-gradient-to-br from-blue-300 to-pink-300 min-h-screen flex items-center justify-center p-8"
      style={{ backgroundImage: "url('/sky.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-[70%] flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden p-6">
        <div className="w-full md:w-1/3 flex flex-col items-center mt-16 relative"> 
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-full shadow-lg border-4 border-white"
            />
          </div>
          <label className="mt-4 cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-600">
            📷 Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          {profilePic !== "/pp.png" && (
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
          {/* Save Profile Button */}
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition duration-200"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authResponse = await fetch("http://localhost:5000/api/auth/check-auth", {
          method: "GET",
          credentials: "include",
        });

        const authData = await authResponse.json();
        if (authResponse.ok && authData.isAuthenticated) {
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");

          const profileResponse = await fetch("http://localhost:5000/api/auth/profile", {
            method: "GET",
            credentials: "include",
          });

          const profileData = await profileResponse.json();
          if (profileResponse.ok) {
            setProfileImage(profileData.profile_pic ? `http://localhost:5000${profileData.profile_pic}` : null);
          }
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
          setProfileImage(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        setProfileImage(null);
      }
    };

    fetchProfile();

    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
      fetchProfile();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    setProfileImage(null);

    window.dispatchEvent(new Event("authChange"));
    window.location.href = "/";
  };

  return (
    <header className="header flex items-center justify-between p-4 bg-gray-900 text-white">
      <NavLink to="/">
        <img src={logo} alt="logo" className="w-18 h-18 object-contain" />
      </NavLink>

      <div className="flex space-x-8 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-12 h-12 bg-white rounded-full"></div>
              )}
            </Link>
            <button onClick={handleLogout} className="text-lg font-sans transition-transform transform hover:scale-110 hover:text-red-400">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-lg font-sans transition-transform transform hover:scale-110 hover:text-blue-400">
              Login
            </Link>
            <Link to="/signup" className="text-lg font-sans transition-transform transform hover:scale-110 hover:text-purple-400">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

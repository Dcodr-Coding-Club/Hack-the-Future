import { NavLink } from "react-router-dom";
import { logo } from "../assets/images";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="header flex items-center justify-between p-4 bg-gray-900 text-white">
      <NavLink to="/">
        <img src={logo} alt="logo" className="w-18 h-18 object-contain" />
      </NavLink>
      <div className="flex space-x-8">
        <Link to="/login" className="text-lg font-sans transition-transform transform hover:scale-110 hover:text-blue-400">
          Login
        </Link>
        <Link to="/signup" className="text-lg font-sans transition-transform transform hover:scale-110 hover:text-purple-400">
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

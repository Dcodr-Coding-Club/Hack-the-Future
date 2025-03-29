import React from "react";
import { FaInstagram, FaFacebook, FaPhone } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-300 to-yellow-100 text-gray-900">
      {/* Top Image */}
      <div className="relative w-full h-80">
        <img
          src="https://source.unsplash.com/1600x900/?team,office"
          alt="About Us"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-gray-800">About Us</h1>
        </div>
      </div>

      {/* About Us Content */}
      <div className="max-w-5xl mx-auto p-10 bg-white text-gray-800 shadow-lg rounded-lg mt-8">
        <h2 className="text-4xl font-semibold text-center">Who We Are?</h2>
        <p className="mt-4 text-gray-700 text-lg text-center">
        🚀We’re a bunch of tech wizards, design dreamers, and coffee-fueled innovators on a mission to make digital magic! ✨ From crafting user-friendly wonders to building solutions that actually get you, we sprinkle creativity and a pinch of genius into everything we do.

Right now, we’re bringing something truly special to life—a fun and interactive learning app for deaf and mute children! 🧩📱💡 Designed with love, technology, and a whole lot of heart,our app makes learning exciting, accessible, and inclusive. Think engaging visuals, smart interactions, and a world where every child can explore, learn, and thrive. 🌈💙
        </p>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center mt-6 space-x-6 text-3xl">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:text-pink-700"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-600"
        >
          <FaFacebook />
        </a>
        <a
          href="tel:+1234567890"
          className="text-green-400 hover:text-green-600"
        >
          <FaPhone />
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-gray-100 text-gray-800 text-center py-4 shadow-inner">
        <p>&copy; 2025 Our Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
import React, { useRef } from "react";
import { FaInstagram, FaFacebook, FaPhone, FaTwitter } from "react-icons/fa";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { Footer, Loader } from "../components";
import { Plane } from "../models";

// Animated Plane Component
const MovingPlane = () => {
  const planeRef = useRef();
  
  useFrame(({ clock }) => {
    if (planeRef.current) {
      // Forward movement + slight up/down oscillation
      planeRef.current.position.z = -5 + Math.sin(clock.elapsedTime) * 2;
      planeRef.current.position.y = -1 + Math.sin(clock.elapsedTime * 3) * 0.8;
    }
  });

  return (
    <Plane
      ref={planeRef}
      position={[0, -3, -8]}  // Adjusted for better visibility
      rotation={[0, Math.PI / 18, 0]} // Facing forward
      scale={[15, 15, 15]}  // Increased size
    />
  );
};

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-fixed text-gray-900 relative" style={{ backgroundImage: "url('/sky.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Top Image */}
      <div className="relative w-full h-40 flex items-center justify-center font-[Inter] bg-black/5">
        <h1 className="text-3xl font-bold text-white">About Us</h1>
      </div>

      {/* About Us Content */}
      <div className="max-w-5xl mx-auto p-6 mt-2 text-center font-[Inter]">
        <h2 className="text-white text-2xl font-semibold">Who We Are?</h2>
        <p className="mt-3 text-[#1c3f91] text-center">
          🚀 We’re a bunch of tech wizards, design dreamers, and coffee-fueled innovators on a mission to make digital magic! ✨ From crafting user-friendly wonders to building solutions that actually get you, we sprinkle creativity and a pinch of genius into everything we do.
          <br /><br />
          Right now, we’re bringing something truly special to life—a fun and interactive learning app for deaf and mute children! 🧩📱💡 Designed with love, technology, and a whole lot of heart, our app makes learning exciting, accessible, and inclusive. Think engaging visuals, smart interactions, and a world where every child can explore, learn, and thrive. 🌈💙
        </p>
      </div>

      {/* Moving Plane Model */}
      <div className="w-full h-[300px] relative flex items-center justify-center">
      <Canvas className="w-full h-full">
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[1, 1, 1]} intensity={2} />
            <spotLight position={[0, 10, 5]} intensity={3} angle={0.3} />
            <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1.2} />
            
            <MovingPlane />
          </Suspense>
        </Canvas>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center py-4 mt-4 space-x-8 text-3xl">
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
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 hover:text-blue-700"
  >
    <FaTwitter />
  </a>
  <a
    href="tel:+1234567890"
    className="text-green-400 hover:text-green-600"
  >
    <FaPhone />
  </a>
</div>
      <Footer/>
    </div>
  );
};

export default AboutUs;

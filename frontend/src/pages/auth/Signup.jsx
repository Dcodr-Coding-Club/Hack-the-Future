import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/Inputs/Input';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

export const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");  // Added username field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle signup form submit
  const handleSignUp = async (e) => {
    e.preventDefault();
  
    if (!fullName || !username || !email || !password) {
      setError("All fields are required!");
      return;
    }
  
    setError("");
  
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, username, email, password }),
        credentials: "include", // To include cookies
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Signup successful! Please log in.");
        navigate("/login"); // Redirect after successful signup
      } else {
        setError(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <div className='text-xl font-semibold text-black'>Create an Account</div>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp}>
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Full Name"
            type="text"
          />
          <Input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            label="Username"
            placeholder="Enter your username"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="email@gmail.com"
            type="email"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            SIGN UP
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className='font-medium text-blue-800 underline' to='/login'>
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

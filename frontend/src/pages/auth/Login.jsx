import React, { useState } from 'react';
import { AuthLayout } from '../../components/layouts/AuthLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Inputs/Input.jsx';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper.js';
import { toast } from "react-toastify";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
  
    if (!password) {
      setError("Please enter the password");
      return;
    }
  
    setError("");
  
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensures cookies (JWT) are stored in the browser
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token for future API calls
        toast.success("Login successful!");
        navigate("/dashboard"); // Redirect user on successful login
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            type="email"
            value={email}
            label="Email Address"
            placeholder='abc@example.com'
            onChange={({ target }) => setEmail(target.value)}
          />
          <Input
            type="password"
            value={password}
            label="Password"
            placeholder='Enter your password'
            onChange={({ target }) => setPassword(target.value)}
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className='font-medium text-blue-800 underline' to='/signup'>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

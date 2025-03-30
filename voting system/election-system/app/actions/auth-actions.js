"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Mock database for demonstration purposes
// In a real application, you would use a database like Supabase, MongoDB, etc.
const users = [{ id: "1", voterIdCard: "VOTER123", password: "password123" }]

const admins = [{ id: "1", aadharId: "AADHAR123", password: "admin123" }]

const superAdmins = [{ id: "1", superAdminId: "SUPER123", password: "super123" }]

// User login
export async function loginUser({ voterIdCard, password }) {
  // In a real app, you would hash the password and compare with the stored hash
  const user = users.find((u) => u.voterIdCard === voterIdCard && u.password === password)

  if (!user) {
    return { success: false, error: "Invalid voter ID or password" }
  }

  // Set a cookie to maintain the session
  cookies().set(
    "auth",
    JSON.stringify({
      id: user.id,
      role: "user",
      voterIdCard: user.voterIdCard,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    },
  )

  return { success: true }
}

// Admin login
export async function loginAdmin({ aadharId, password }) {
  const admin = admins.find((a) => a.aadharId === aadharId && a.password === password)

  if (!admin) {
    return { success: false, error: "Invalid Aadhar ID or password" }
  }

  cookies().set(
    "auth",
    JSON.stringify({
      id: admin.id,
      role: "admin",
      aadharId: admin.aadharId,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    },
  )

  return { success: true }
}

// Super Admin login
export async function loginSuperAdmin({ superAdminId, password }) {
  const superAdmin = superAdmins.find((sa) => sa.superAdminId === superAdminId && sa.password === password)

  if (!superAdmin) {
    return { success: false, error: "Invalid Super Admin ID or password" }
  }

  cookies().set(
    "auth",
    JSON.stringify({
      id: superAdmin.id,
      role: "superAdmin",
      superAdminId: superAdmin.superAdminId,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    },
  )

  return { success: true }
}

// User registration
export async function registerUser({ voterIdCard, password }) {
  // Check if user already exists
  const existingUser = users.find((u) => u.voterIdCard === voterIdCard)

  if (existingUser) {
    return { success: false, error: "Voter ID already registered" }
  }

  // In a real app, you would hash the password and store in a database
  const newUser = {
    id: `${users.length + 1}`,
    voterIdCard,
    password,
  }

  users.push(newUser)

  return { success: true }
}

// Logout
export async function logout() {
  cookies().delete("auth")
  redirect("/")
}

// Get current user
export async function getCurrentUser() {
  const authCookie = cookies().get("auth")

  if (!authCookie) {
    return null
  }

  try {
    return JSON.parse(authCookie.value)
  } catch (error) {
    return null
  }
}

// Auth middleware
export async function requireAuth(role) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (role && user.role !== role) {
    redirect("/")
  }

  return user
}


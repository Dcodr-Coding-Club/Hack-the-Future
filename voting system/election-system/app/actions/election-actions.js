"use server"

import { requireAuth } from "./auth-actions"

// Mock database for demonstration purposes
// In a real application, you would use a database like Supabase, MongoDB, etc.
const electionRooms = [
  {
    id: "1",
    name: "City Council Election",
    description: "Elections for the city council members",
    createdAt: new Date().toISOString(),
    teamMembers: 2,
    elections: 1,
  },
]

const electionTeams = [
  {
    id: "1",
    roomId: "1",
    members: [
      { name: "John Doe", email: "john@example.com", aadharId: "AADHAR001", password: "password123" },
      { name: "Jane Smith", email: "jane@example.com", aadharId: "AADHAR002", password: "password456" },
    ],
  },
]

const elections = [
  {
    id: "1",
    roomId: "1",
    title: "City Mayor Election",
    description: "Election for the position of city mayor",
    nominees: [
      { id: "1", name: "Alice Johnson", partyName: "Progress Party" },
      { id: "2", name: "Bob Williams", partyName: "Future Alliance" },
      { id: "3", name: "Carol Davis", partyName: "Citizens United" },
    ],
    startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now  // 1 hour ago
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
    status: "active",
    votes: 0,
    announced: false,
  },
]

const votes = [
  // { id: "1", userId: "1", electionId: "1", nomineeId: "2", votedAt: new Date().toISOString() }
]

// Super Admin Actions
export async function getElectionRooms() {
  await requireAuth("superAdmin")
  return electionRooms
}

export async function createElectionRoom({ roomName, description }) {
  await requireAuth("superAdmin")

  const newRoom = {
    id: `${electionRooms.length + 1}`,
    name: roomName,
    description,
    createdAt: new Date().toISOString(),
    teamMembers: 0,
    elections: 0,
  }

  electionRooms.push(newRoom)

  return { success: true, roomId: newRoom.id }
}

export async function createElectionTeam({ roomId, teamMembers }) {
  await requireAuth("superAdmin")

  // Find the room
  const room = electionRooms.find((r) => r.id === roomId)
  if (!room) {
    return { success: false, error: "Election room not found" }
  }

  // Create the team
  const newTeam = {
    id: `${electionTeams.length + 1}`,
    roomId,
    members: teamMembers,
  }

  electionTeams.push(newTeam)

  // Update room with team member count
  room.teamMembers = teamMembers.length

  // Add team members to admins (in a real app, you would create actual user accounts)
  teamMembers.forEach((member) => {
    // This is just for demo purposes
    // In a real app, you would create proper user accounts with hashed passwords
  })

  return { success: true }
}

// Admin Actions
export async function getAdminElections() {
  await requireAuth("admin")

  // In a real app, you would filter elections by the admin's team/room
  return elections
}

export async function createElection({ title, description, nominees, startTime, endTime }) {
  await requireAuth("admin")

  const newElection = {
    id: `${elections.length + 1}`,
    roomId: "1", // In a real app, this would be determined by the admin's team
    title,
    description,
    nominees: nominees.map((nominee, index) => ({
      id: `${index + 1}`,
      name: nominee.name,
      partyName: nominee.partyName,
    })),
    startTime,
    endTime,
    status: new Date(startTime) <= new Date() ? "active" : "scheduled",
    votes: 0,
    announced: false,
  }

  elections.push(newElection)

  // Update room with election count
  const room = electionRooms.find((r) => r.id === newElection.roomId)
  if (room) {
    room.elections = (room.elections || 0) + 1
  }

  return { success: true, electionId: newElection.id }
}

export async function calculateResults(electionId) {
  await requireAuth("admin")

  const election = elections.find((e) => e.id === electionId)
  if (!election) {
    return { success: false, error: "Election not found" }
  }

  // Check if election has ended
  if (new Date(election.endTime) > new Date()) {
    return { success: false, error: "Election has not ended yet" }
  }

  // Calculate results
  const electionVotes = votes.filter((v) => v.electionId === electionId)
  const results = election.nominees
    .map((nominee) => {
      const nomineeVotes = electionVotes.filter((v) => v.nomineeId === nominee.id).length
      return {
        ...nominee,
        votes: nomineeVotes,
      }
    })
    .sort((a, b) => b.votes - a.votes)

  // Update election status
  election.status = "completed"

  return { success: true, results }
}

export async function announceResults(electionId) {
  await requireAuth("admin")

  const election = elections.find((e) => e.id === electionId)
  if (!election) {
    return { success: false, error: "Election not found" }
  }

  if (election.status !== "completed") {
    return { success: false, error: "Cannot announce results for an active election" }
  }

  election.announced = true

  return { success: true }
}

// User Actions
export async function getAvailableElections() {
  await requireAuth("user")

  // Get active elections
  return elections.filter((e) => {
    const now = new Date()
    const startTime = new Date(e.startTime)
    const endTime = new Date(e.endTime)
    return startTime <= now && endTime >= now
  })
}

export async function getUserVotingHistory() {
  const user = await requireAuth("user")

  // Get user's votes
  const userVotes = votes.filter((v) => v.userId === user.id)

  // Map to include election details
  return userVotes.map((vote) => {
    const election = elections.find((e) => e.id === vote.electionId)
    return {
      id: vote.id,
      electionId: vote.electionId,
      electionTitle: election?.title || "Unknown Election",
      electionStatus: election?.status || "unknown",
      votedAt: vote.votedAt,
    }
  })
}

export async function getElectionDetails(electionId) {
  await requireAuth("user")

  return elections.find((e) => e.id === electionId)
}

export async function castVote({ electionId, nomineeId }) {
  const user = await requireAuth("user")

  // Check if election exists and is active
  const election = elections.find((e) => e.id === electionId)
  if (!election) {
    return { success: false, error: "Election not found" }
  }

  const now = new Date()
  const startTime = new Date(election.startTime)
  const endTime = new Date(election.endTime)

  if (startTime > now || endTime < now) {
    return { success: false, error: "Election is not active" }
  }

  // Check if user has already voted
  const existingVote = votes.find((v) => v.userId === user.id && v.electionId === electionId)
  if (existingVote) {
    return { success: false, error: "You have already voted in this election" }
  }

  // Check if nominee exists
  const nominee = election.nominees.find((n) => n.id === nomineeId)
  if (!nominee) {
    return { success: false, error: "Invalid nominee" }
  }

  // Record the vote
  const newVote = {
    id: `${votes.length + 1}`,
    userId: user.id,
    electionId,
    nomineeId,
    votedAt: new Date().toISOString(),
  }

  votes.push(newVote)

  // Update vote count
  election.votes = (election.votes || 0) + 1

  return { success: true }
}


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { getElectionRooms } from "@/app/actions/election-actions"
import ElectionRoomCard from "@/components/election-room-card"

export default function SuperAdminDashboard() {
  const [electionRooms, setElectionRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadElectionRooms() {
      try {
        const rooms = await getElectionRooms()
        setElectionRooms(rooms)
      } catch (error) {
        console.error("Failed to load election rooms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadElectionRooms()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/super-admin/create-room">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Election Room
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Election Rooms</h2>
        {isLoading ? (
          <p>Loading election rooms...</p>
        ) : electionRooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="mb-4 text-center text-muted-foreground">No election rooms have been created yet.</p>
              <Button asChild>
                <Link href="/dashboard/super-admin/create-room">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Election Room
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {electionRooms.map((room) => (
              <ElectionRoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


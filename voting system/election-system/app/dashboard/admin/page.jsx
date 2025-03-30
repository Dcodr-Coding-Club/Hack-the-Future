"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Clock, CheckCircle } from "lucide-react"
import { getAdminElections } from "@/app/actions/election-actions"

export default function AdminDashboard() {
  const [elections, setElections] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadElections() {
      try {
        const data = await getAdminElections()
        setElections(data)
      } catch (error) {
        console.error("Failed to load elections:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadElections()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/admin/create-election">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Election
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Your Elections</h2>
        {isLoading ? (
          <p>Loading elections...</p>
        ) : elections.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="mb-4 text-center text-muted-foreground">You haven't created any elections yet.</p>
              <Button asChild>
                <Link href="/dashboard/admin/create-election">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Election
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {elections.map((election) => (
              <Card key={election.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{election.title}</CardTitle>
                    {election.status === "active" ? (
                      <span className="flex items-center text-sm font-medium text-green-600">
                        <Clock className="mr-1 h-4 w-4" />
                        Active
                      </span>
                    ) : election.status === "completed" ? (
                      <span className="flex items-center text-sm font-medium text-blue-600">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center text-sm font-medium text-gray-600">Scheduled</span>
                    )}
                  </div>
                  <CardDescription>
                    {election.nominees?.length || 0} Nominees •
                    {election.status === "completed"
                      ? ` ${election.votes || 0} Votes Cast`
                      : ` Ends on ${new Date(election.endTime).toLocaleDateString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/dashboard/admin/elections/${election.id}`}>View Details</Link>
                    </Button>
                    {election.status === "active" && (
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/dashboard/admin/elections/${election.id}/results`}>Calculate Results</Link>
                      </Button>
                    )}
                    {election.status === "completed" && !election.announced && (
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/dashboard/admin/elections/${election.id}/announce`}>Announce Results</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { getAvailableElections, getUserVotingHistory } from "@/app/actions/election-actions"

export default function UserDashboard() {
  const [availableElections, setAvailableElections] = useState([])
  const [votingHistory, setVotingHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [elections, history] = await Promise.all([getAvailableElections(), getUserVotingHistory()])
        setAvailableElections(elections)
        setVotingHistory(history)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Check if user has already voted in an election
  function hasVoted(electionId) {
    return votingHistory.some((vote) => vote.electionId === electionId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Voter Dashboard</h1>
        <p className="mt-2 text-muted-foreground">View available elections and cast your vote</p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Available Elections</h2>
        {isLoading ? (
          <p>Loading elections...</p>
        ) : availableElections.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">There are no active elections available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableElections.map((election) => {
              const voted = hasVoted(election.id)
              const endTime = new Date(election.endTime)
              const now = new Date()
              const timeRemaining = endTime.getTime() - now.getTime()
              const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
              const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

              return (
                <Card key={election.id}>
                  <CardHeader>
                    <CardTitle>{election.title}</CardTitle>
                    <CardDescription>
                      {election.nominees?.length || 0} Nominees •
                      {timeRemaining > 0 ? ` ${hoursRemaining}h ${minutesRemaining}m remaining` : " Ended"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      {voted ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          <span>You have cast your vote</span>
                        </div>
                      ) : timeRemaining <= 0 ? (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-2 h-5 w-5" />
                          <span>Election has ended</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-blue-600">
                          <Clock className="mr-2 h-5 w-5" />
                          <span>Voting is open</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {!voted && timeRemaining > 0 ? (
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/user/vote/${election.id}`}>Cast Your Vote</Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/dashboard/user/elections/${election.id}`}>View Details</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Your Voting History</h2>
        {isLoading ? (
          <p>Loading history...</p>
        ) : votingHistory.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">You haven't voted in any elections yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Election</th>
                  <th className="px-4 py-3 text-left font-medium">Date Voted</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {votingHistory.map((vote) => (
                  <tr key={vote.id} className="border-t">
                    <td className="px-4 py-3">{vote.electionTitle}</td>
                    <td className="px-4 py-3">{new Date(vote.votedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {vote.electionStatus === "completed" ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center text-blue-600">
                          <Clock className="mr-1 h-4 w-4" />
                          In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


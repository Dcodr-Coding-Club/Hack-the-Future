"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, AlertCircle } from "lucide-react"
import { getElectionDetails, castVote } from "@/app/actions/election-actions"

export default function VotePage({ params }) {
  const router = useRouter()
  const [election, setElection] = useState(null)
  const [selectedNominee, setSelectedNominee] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    async function loadElection() {
      try {
        const data = await getElectionDetails(params.electionId)
        setElection(data)

        // Calculate time remaining
        if (data) {
          const endTime = new Date(data.endTime)
          updateTimeRemaining(endTime)

          // Set up timer to update time remaining
          const timer = setInterval(() => {
            const remaining = updateTimeRemaining(endTime)
            if (remaining <= 0) {
              clearInterval(timer)
              router.push("/dashboard/user")
            }
          }, 1000)

          return () => clearInterval(timer)
        }
      } catch (error) {
        console.error("Failed to load election:", error)
        setError("Failed to load election details")
      } finally {
        setIsLoading(false)
      }
    }

    loadElection()
  }, [params.electionId, router])

  function updateTimeRemaining(endTime) {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()

    if (diff <= 0) {
      setTimeRemaining("Election has ended")
      return diff
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s remaining`)
    return diff
  }

  async function handleSubmitVote() {
    if (!selectedNominee) {
      setError("Please select a nominee to vote")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const result = await castVote({
        electionId: params.electionId,
        nomineeId: selectedNominee,
      })

      if (result.success) {
        router.push("/dashboard/user?voted=true")
      } else {
        setError(result.error || "Failed to cast vote. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <p>Loading election details...</p>
      </div>
    )
  }

  if (!election) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
            <p className="text-center text-lg font-medium">Election not found or no longer available</p>
            <Button onClick={() => router.push("/dashboard/user")} className="mt-6">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{election.title}</CardTitle>
            <div className="flex items-center text-blue-600">
              <Clock className="mr-2 h-5 w-5" />
              <span>{timeRemaining}</span>
            </div>
          </div>
          <CardDescription>{election.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium">Select a nominee to vote for:</h3>
            <RadioGroup value={selectedNominee} onValueChange={setSelectedNominee}>
              {election.nominees?.map((nominee) => (
                <div key={nominee.id} className="mb-4 rounded-lg border p-4 hover:bg-muted/50">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value={nominee.id} id={nominee.id} />
                    <div className="grid gap-1.5">
                      <Label htmlFor={nominee.id} className="text-base font-medium">
                        {nominee.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{nominee.partyName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium">Important Information</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>You can only vote once in this election</li>
              <li>Your vote is confidential and secure</li>
              <li>Once submitted, your vote cannot be changed</li>
              <li>Results will be announced after the election ends</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmitVote} disabled={!selectedNominee || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Cast Your Vote"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


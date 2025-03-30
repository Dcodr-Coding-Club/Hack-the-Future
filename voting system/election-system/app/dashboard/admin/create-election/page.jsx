"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
import { createElection } from "@/app/actions/election-actions"

export default function CreateElectionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [nominees, setNominees] = useState([{ id: "1", name: "", partyName: "" }])
  const [electionDate, setElectionDate] = useState("")
  const [electionTime, setElectionTime] = useState("")
  const [electionDuration, setElectionDuration] = useState("2")

  function addNominee() {
    setNominees([...nominees, { id: Date.now().toString(), name: "", partyName: "" }])
  }

  function removeNominee(id) {
    if (nominees.length > 1) {
      setNominees(nominees.filter((nominee) => nominee.id !== id))
    }
  }

  function updateNominee(id, field, value) {
    setNominees(nominees.map((nominee) => (nominee.id === id ? { ...nominee, [field]: value } : nominee)))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const title = formData.get("title")
    const description = formData.get("description")

    // Validate nominees
    const invalidNominees = nominees.filter((nominee) => !nominee.name || !nominee.partyName)

    if (invalidNominees.length > 0) {
      setError("Please fill in all fields for each nominee")
      setIsLoading(false)
      return
    }

    // Validate date and time
    if (!electionDate || !electionTime) {
      setError("Please select a date and time for the election")
      setIsLoading(false)
      return
    }

    const startDateTime = new Date(`${electionDate}T${electionTime}`)
    if (isNaN(startDateTime.getTime())) {
      setError("Invalid date or time format")
      setIsLoading(false)
      return
    }

    // Calculate end time based on duration
    const durationHours = Number.parseInt(electionDuration)
    const endDateTime = new Date(startDateTime.getTime() + durationHours * 60 * 60 * 1000)

    try {
      const result = await createElection({
        title,
        description,
        nominees: nominees.map(({ id, ...nominee }) => nominee),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      })

      if (result.success) {
        router.push(`/dashboard/admin`)
      } else {
        setError(result.error || "Failed to create election. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Election</CardTitle>
          <CardDescription>Set up a new election with nominees and schedule</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title</Label>
              <Input id="title" name="title" placeholder="e.g., Student Council Election 2023" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide details about this election"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Election Schedule</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="electionDate">Date</Label>
                  <Input
                    id="electionDate"
                    type="date"
                    value={electionDate}
                    onChange={(e) => setElectionDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electionTime">Start Time</Label>
                  <Input
                    id="electionTime"
                    type="time"
                    value={electionTime}
                    onChange={(e) => setElectionTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electionDuration">Duration (hours)</Label>
                  <Input
                    id="electionDuration"
                    type="number"
                    min="1"
                    max="24"
                    value={electionDuration}
                    onChange={(e) => setElectionDuration(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Nominees</h3>
              {nominees.map((nominee, index) => (
                <div key={nominee.id} className="rounded-lg border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Nominee {index + 1}</h4>
                    {nominees.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeNominee(nominee.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${nominee.id}`}>Nominee Name</Label>
                      <Input
                        id={`name-${nominee.id}`}
                        value={nominee.name}
                        onChange={(e) => updateNominee(nominee.id, "name", e.target.value)}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`party-${nominee.id}`}>Party Name</Label>
                      <Input
                        id={`party-${nominee.id}`}
                        value={nominee.partyName}
                        onChange={(e) => updateNominee(nominee.id, "partyName", e.target.value)}
                        placeholder="Party Name"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addNominee} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Nominee
              </Button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Election"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


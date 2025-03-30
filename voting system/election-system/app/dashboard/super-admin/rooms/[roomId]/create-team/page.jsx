"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
import { createElectionTeam } from "@/app/actions/election-actions"

export default function CreateElectionTeamPage({ params }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [teamMembers, setTeamMembers] = useState([{ id: "1", name: "", email: "", aadharId: "", password: "" }])

  function addTeamMember() {
    setTeamMembers([...teamMembers, { id: Date.now().toString(), name: "", email: "", aadharId: "", password: "" }])
  }

  function removeTeamMember(id) {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id))
    }
  }

  function updateTeamMember(id, field, value) {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate team members
    const invalidMembers = teamMembers.filter(
      (member) => !member.name || !member.email || !member.aadharId || !member.password,
    )

    if (invalidMembers.length > 0) {
      setError("Please fill in all fields for each team member")
      setIsLoading(false)
      return
    }

    try {
      const result = await createElectionTeam({
        roomId: params.roomId,
        teamMembers: teamMembers.map(({ id, ...member }) => member),
      })

      if (result.success) {
        router.push(`/dashboard/super-admin`)
      } else {
        setError(result.error || "Failed to create election team. Please try again.")
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
          <CardTitle className="text-2xl">Create Election Team</CardTitle>
          <CardDescription>Add team members who will manage this election</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">Team Member {index + 1}</h3>
                  {teamMembers.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeTeamMember(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${member.id}`}>Name</Label>
                    <Input
                      id={`name-${member.id}`}
                      value={member.name}
                      onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`email-${member.id}`}>Email</Label>
                    <Input
                      id={`email-${member.id}`}
                      type="email"
                      value={member.email}
                      onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`aadhar-${member.id}`}>Aadhar ID</Label>
                    <Input
                      id={`aadhar-${member.id}`}
                      value={member.aadharId}
                      onChange={(e) => updateTeamMember(member.id, "aadharId", e.target.value)}
                      placeholder="Aadhar ID Number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`password-${member.id}`}>Password</Label>
                    <Input
                      id={`password-${member.id}`}
                      type="password"
                      value={member.password}
                      onChange={(e) => updateTeamMember(member.id, "password", e.target.value)}
                      placeholder="Create Password"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addTeamMember} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Team Member
            </Button>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Back
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Team..." : "Create Team"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


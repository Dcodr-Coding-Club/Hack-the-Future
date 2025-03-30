import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar } from "lucide-react"

/**
 * @param {Object} props
 * @param {Object} props.room - The election room data
 * @param {string} props.room.id - Room ID
 * @param {string} props.room.name - Room name
 * @param {string} [props.room.description] - Room description
 * @param {string} props.room.createdAt - Creation date
 * @param {number} [props.room.teamMembers] - Number of team members
 * @param {number} [props.room.elections] - Number of elections
 */
export default function ElectionRoomCard({ room }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>Created on {new Date(room.createdAt).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {room.description && <p className="text-sm text-muted-foreground">{room.description}</p>}
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{room.teamMembers || 0} Team Members</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{room.elections || 0} Elections</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/dashboard/super-admin/rooms/${room.id}`}>Manage Room</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


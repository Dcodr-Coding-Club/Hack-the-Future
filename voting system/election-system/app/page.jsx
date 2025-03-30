import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Election Management System</h1>
        <p className="text-center text-lg text-gray-600">A secure platform for creating and managing elections</p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Link href="/login/user">
            <Button size="lg" className="w-full">
              Voter Login
            </Button>
          </Link>
          <Link href="/login/admin">
            <Button size="lg" variant="outline" className="w-full">
              Admin Login
            </Button>
          </Link>
          <Link href="/login/super-admin">
            <Button size="lg" variant="secondary" className="w-full">
              Super Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


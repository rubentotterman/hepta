import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MainNav() {
  return (
    <div className="flex w-full items-center justify-between">
      <Link href="/" className="text-xl font-bold">
        Hepta
      </Link>
      <nav className="flex items-center gap-6">
        <Link href="/">Hjem</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/faktura">Faktura</Link>
        <Link href="/innstillinger">Innstillinger</Link>
        <Button variant="default" className="bg-orange-500 hover:bg-orange-600">
          Login
        </Button>
      </nav>
    </div>
  )
}


import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import Image from "next/image"
import { BarChart3, Palette, LogIn, LogOut, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server" // <--- CORRECTED: Import server-side Supabase client
import { redirect } from "next/navigation"

export async function Header() {
  // Use the server-side Supabase client here
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const handleSignOut = async () => {
    "use server"
    // Ensure this also uses the server-side client
    const supabaseServer = createClient()
    await supabaseServer.auth.signOut()
    redirect("/login")
  }

  return (
    <header className="w-full border-b bg-white dark:bg-gray-950 transition-colors">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/chat" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/images/overthinkr-logo.png"
            alt="Overthinkr Logo"
            width={120}
            height={30}
            className="dark:invert"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/analytics"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <Link
            href="/customize"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            <Palette className="h-5 w-5" />
            <span className="hidden sm:inline">Customize</span>
          </Link>
          <Link
            href="/what-if"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            <Lightbulb className="h-5 w-5" />
            <span className="hidden sm:inline">What If</span>
          </Link>
          <ThemeToggle />
          {user ? (
            <form action={handleSignOut}>
              <Button type="submit" variant="outline" size="icon" className="h-9 w-9">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </form>
          ) : (
            <Link href="/login" passHref>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <LogIn className="h-4 w-4" />
                <span className="sr-only">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

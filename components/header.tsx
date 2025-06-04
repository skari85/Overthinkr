import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import Image from "next/image"
import { BarChart3, Palette, LogIn, LogOut } from "lucide-react" // Import LogIn and LogOut icons
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client" // Import client-side Supabase client
import { redirect } from "next/navigation" // For server-side redirect

export async function Header() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const handleSignOut = async () => {
    "use server"
    const supabaseServer = createClient()
    await supabaseServer.auth.signOut()
    redirect("/login") // Redirect to login page after logout
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

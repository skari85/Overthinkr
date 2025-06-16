"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  Palette,
  Lightbulb,
  Trophy,
  LayoutDashboard,
  Store,
  LogIn,
  LogOut,
  DollarSign,
  UserPlus,
} from "lucide-react" // Import UserPlus
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { signOut } from "firebase/auth" // Only signOut needed here
import { auth } from "@/lib/firebase"
import { toast } from "@/components/ui/use-toast"

export function Header() {
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logged Out",
        description: "Your session has ended.",
      })
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Logout Failed",
        description: "Could not log out. Please try again.",
        variant: "destructive",
      })
    }
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
            href="/dashboard"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="https://overthinkr.printify.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors flex items-center gap-1"
          >
            <Store className="h-5 w-5" />
            <span className="hidden sm:inline">Store</span>
          </Link>
          <Link
            href="/analytics"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
          <Link
            href="/achievements"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            <Trophy className="h-5 w-5" />
            <span className="hidden sm:inline">Achievements</span>
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
          <Link
            href="/subscribe"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            <DollarSign className="h-5 w-5" />
            <span className="hidden sm:inline">Premium</span>
          </Link>
          <ThemeToggle />
          {/* Login/Logout/Signup Buttons */}
          {!loading &&
            (user ? (
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="ghost" size="icon" aria-label="Login">
                    <LogIn className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button variant="ghost" size="icon" aria-label="Sign Up">
                    <UserPlus className="h-5 w-5" />
                    <span className="sr-only">Sign Up</span>
                  </Button>
                </Link>
              </>
            ))}
        </div>
      </div>
    </header>
  )
}

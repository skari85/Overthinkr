"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const router = useRouter()

  const handleEnter = () => {
    router.push("/chat")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors relative">
      {/* Theme toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <Image
            src="/images/overthinkr-logo.png"
            alt="Overthinkr Logo"
            width={400}
            height={100}
            className="dark:invert"
            priority
          />
        </div>

        <Button
          onClick={handleEnter}
          size="lg"
          className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white px-8 py-3 text-lg font-medium rounded-lg transition-colors"
        >
          Enter
        </Button>
      </div>
    </div>
  )
}

import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import Image from "next/image"
import { BarChart3, Palette } from "lucide-react" // Import the Palette icon

export function Header() {
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
        </div>
      </div>
    </header>
  )
}

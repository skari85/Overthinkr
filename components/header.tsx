import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import Image from "next/image"

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
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

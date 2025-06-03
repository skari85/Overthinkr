export function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-950 transition-colors">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Overthinkr. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <a
            href="/privacy"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}

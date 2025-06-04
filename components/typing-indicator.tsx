export function TypingIndicator() {
  return (
    <div
      className="flex items-center space-x-1 px-3 py-2 max-w-[80px] bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none shadow-md border border-gray-100 dark:border-gray-700 transition-colors"
      aria-hidden="true" // Added aria-hidden for screen readers
    >
      <div
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
        style={{ animationDelay: "300ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
        style={{ animationDelay: "600ms" }}
      ></div>
    </div>
  )
}

export default function SuccessTestPage() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-2xl font-bold">Success Route Test</h1>
      <p>If you can see this, the /success route is working!</p>
      <p>Current URL: {typeof window !== "undefined" ? window.location.href : "Server-side"}</p>
    </div>
  )
}

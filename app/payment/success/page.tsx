import type { Metadata } from "next"
import { Suspense } from "react"
import PaymentSuccessClient from "./PaymentSuccessClient"

export const metadata: Metadata = {
  title: "Payment Success - Overthinkr",
  description: "Your Overthinkr Premium subscription is now active!",
}

function PaymentSuccessLoading() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-md text-center">
        <div className="border-2 shadow-lg rounded-xl overflow-hidden border-blue-200 bg-blue-50 dark:bg-blue-900/20 p-8">
          <div className="text-xl text-blue-600 mb-4">Loading...</div>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessClient />
    </Suspense>
  )
}

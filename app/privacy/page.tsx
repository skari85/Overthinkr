import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Database } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Overthinkr protects your privacy and data",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-overthinkr-600 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your privacy is our priority. Here's how we protect your data.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Local Storage Only
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your API keys and conversations are stored only in your browser's local storage. We never see or store
                them on our servers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                No Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We don't use analytics, cookies, or any tracking mechanisms. Your usage patterns remain completely
                private.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                No Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We don't collect, store, or process any personal information. Your conversations never leave your
                device.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Third-Party APIs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When you use your API keys, your messages go directly to your chosen AI service (Groq/OpenRouter).
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Privacy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What We Don't Collect</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Personal information (name, email, phone, etc.)</li>
                <li>Chat conversations or messages</li>
                <li>API keys or credentials</li>
                <li>Usage analytics or behavioral data</li>
                <li>IP addresses or location data</li>
                <li>Browser fingerprints or device information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How Your Data Flows</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>You enter your API key (stored locally in your browser)</li>
                <li>You type a message in the chat</li>
                <li>Your message + API key are sent directly to your chosen AI service</li>
                <li>The AI response comes back and is displayed</li>
                <li>Nothing is stored on our servers</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Third-Party Services</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                When you use Overthinkr, your messages are sent to your chosen AI service:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <strong>Groq:</strong> Subject to{" "}
                  <a
                    href="https://groq.com/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-overthinkr-600 hover:underline"
                  >
                    Groq's Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>OpenRouter:</strong> Subject to{" "}
                  <a
                    href="https://openrouter.ai/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-overthinkr-600 hover:underline"
                  >
                    OpenRouter's Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Your Control</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Clear your chat history anytime with the "Clear Chat" button</li>
                <li>Remove API keys by clearing your browser's local storage</li>
                <li>Use private/incognito browsing for extra privacy</li>
                <li>No account required - use anonymously</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you have questions about this privacy policy, please contact us through our GitHub repository.
              </p>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-500 pt-4 border-t">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertTriangle, Users, Gavel } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-overthinkr-600 mb-2">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400">Simple terms for using Overthinkr responsibly.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Free to Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overthinkr is completely free. You only pay for your own AI API usage directly to the providers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Your Responsibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You're responsible for your API keys, usage costs, and ensuring your messages comply with AI service
                terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                No Guarantees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI responses are for entertainment/reflection only. Don't rely on them for medical, legal, or critical
                decisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-purple-600" />
                Fair Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use Overthinkr responsibly. Don't attempt to hack, abuse, or use it for harmful purposes.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Full Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By using Overthinkr, you agree to these terms. If you don't agree, please don't use the service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Description of Service</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overthinkr is a web application that helps users reflect on whether they might be overthinking a
                situation. It uses AI services (via your API keys) to provide responses and insights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Your Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Provide and manage your own API keys for AI services</li>
                <li>Pay for your own API usage directly to the AI service providers</li>
                <li>Use the service responsibly and legally</li>
                <li>Not attempt to hack, abuse, or misuse the service</li>
                <li>Comply with the terms of service of the AI providers you choose</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. API Keys and Third-Party Services</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>You must provide your own API keys for Groq, OpenRouter, or other supported services</li>
                <li>We don't provide, manage, or pay for API usage</li>
                <li>You're responsible for keeping your API keys secure</li>
                <li>Your usage is subject to the terms and pricing of your chosen AI service</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. Disclaimers</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <strong>Not Professional Advice:</strong> Responses are for entertainment and reflection only
                </li>
                <li>
                  <strong>No Medical/Legal Advice:</strong> Don't use for health, legal, or critical life decisions
                </li>
                <li>
                  <strong>AI Limitations:</strong> AI responses may be inaccurate, biased, or inappropriate
                </li>
                <li>
                  <strong>No Guarantees:</strong> We don't guarantee accuracy, availability, or fitness for any purpose
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">6. Limitation of Liability</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overthinkr is provided "as is" without warranties. We're not liable for any damages, losses, or issues
                arising from your use of the service, including but not limited to API costs, AI responses, or technical
                problems.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">7. Privacy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We don't collect or store your personal data. See our{" "}
                <a href="/privacy" className="text-overthinkr-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                for details.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">8. Prohibited Uses</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Illegal activities or content</li>
                <li>Harassment, hate speech, or harmful content</li>
                <li>Attempting to hack or abuse the service</li>
                <li>Violating third-party rights or terms of service</li>
                <li>Generating spam or malicious content</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">9. Changes to Terms</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We may update these terms occasionally. Continued use of the service constitutes acceptance of any
                changes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">10. Contact</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Questions about these terms? Contact us through our GitHub repository.
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

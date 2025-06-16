"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { guidedSessions } from "@/lib/guided-sessions"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { copyToClipboard } from "@/utils/export-utils"

export default function PromptFeed() {
  const handleCopyPrompt = async (prompt: string) => {
    const success = await copyToClipboard(prompt)
    if (success) {
      toast({
        title: "Prompt Copied!",
        description: "You can now paste this into the 'What If' explorer.",
      })
    } else {
      toast({
        title: "Failed to Copy",
        description: "Could not copy the prompt to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Overthinking Prompt Feed
            </CardTitle>
            <CardDescription>
              Explore a feed of common overthinking scenarios. Click to copy a prompt and use it in the "What If"
              explorer.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {guidedSessions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No prompts available yet. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {guidedSessions.map((session) => (
                  <Card key={session.id} className="flex flex-col justify-between">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{session.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription className="text-sm line-clamp-3">{session.description}</CardDescription>
                    </CardContent>
                    <div className="p-4 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleCopyPrompt(session.prompt)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Prompt
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

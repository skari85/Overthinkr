"use client"

import { Message } from "@/components/message"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LinkIcon } from "lucide-react"
import Link from "next/link"
import type { Message as AIMessage } from "ai"

interface SharedContentViewProps {
  messages: AIMessage[]
}

export function SharedContentView({ messages }: SharedContentViewProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <Card className="border-2 shadow-lg rounded-xl p-8">
            <CardTitle className="text-2xl mb-4">Content Not Found</CardTitle>
            <CardDescription className="mb-6">The shared content could not be loaded or is invalid.</CardDescription>
            <Link href="/chat" passHref>
              <Button className="bg-overthinkr-600 hover:bg-overthinkr-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Full Chat
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Shared Conversation Snippet
            </CardTitle>
            <CardDescription>This is a shared portion of an Overthinkr conversation.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {messages.map((m) => (
              <Message key={m.id} content={m.content} role={m.role as "user" | "assistant"} />
            ))}
          </CardContent>
          <div className="border-t p-4 flex justify-center">
            <Link href="/chat" passHref>
              <Button className="bg-overthinkr-600 hover:bg-overthinkr-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Full Chat
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

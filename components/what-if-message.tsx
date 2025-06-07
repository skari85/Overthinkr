"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WhatIfMessageProps {
  content: string
  isNew?: boolean
  onShare?: () => void
  showShareButton?: boolean
}

interface ParsedWhatIfResponse {
  outcomes: string
  probabilities: string
  strategies: string
}

// Helper function to parse the AI's structured response
function parseWhatIfResponse(text: string): ParsedWhatIfResponse | null {
  const outcomesMatch = text.match(/### Potential Outcomes\n([\s\S]*?)(?=\n### Probabilities|$)/)
  const probabilitiesMatch = text.match(/### Probabilities\n([\s\S]*?)(?=\n### Coping Strategies|$)/)
  const strategiesMatch = text.match(/### Coping Strategies\n([\s\S]*?)$/)

  if (outcomesMatch && probabilitiesMatch && strategiesMatch) {
    return {
      outcomes: outcomesMatch[1].trim(),
      probabilities: probabilitiesMatch[1].trim(),
      strategies: strategiesMatch[1].trim(),
    }
  }
  return null // Return null if parsing fails
}

export function WhatIfMessage({ content, isNew = false, onShare, showShareButton = false }: WhatIfMessageProps) {
  const parsedContent = parseWhatIfResponse(content)

  return (
    <div
      className={cn(
        "flex items-start gap-3 transition-opacity justify-start", // Always justify-start for assistant
        isNew && "animate-bounce-in",
      )}
    >
      <Avatar className="h-8 w-8 border bg-white dark:bg-gray-800 shadow-sm">
        <AvatarFallback className="bg-overthinkr-100 dark:bg-overthinkr-900 text-overthinkr-600 dark:text-overthinkr-400 font-bold">
          O
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[80%] p-3 chat-bubble-ai">
        {parsedContent ? (
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="outcomes">
              <AccordionTrigger className="text-sm font-semibold">Potential Outcomes</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed whitespace-pre-wrap">
                {parsedContent.outcomes}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="probabilities">
              <AccordionTrigger className="text-sm font-semibold">Probabilities</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed whitespace-pre-wrap">
                {parsedContent.probabilities}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="strategies">
              <AccordionTrigger className="text-sm font-semibold">Coping Strategies</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed whitespace-pre-wrap">
                {parsedContent.strategies}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          // Fallback to plain text if parsing fails
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        )}

        {showShareButton && onShare && (
          <div className="mt-2 flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={onShare}
                    aria-label="Share this message"
                  >
                    <Share2 className="h-3 w-3" />
                    <span className="sr-only">Share this message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}

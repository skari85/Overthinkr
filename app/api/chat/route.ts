import { streamText, generateText } from "ai" // Import generateText
import { createGroq } from "@ai-sdk/groq"
import { aiPersonas } from "@/lib/ai-personas"

export async function POST(req: Request) {
  const { messages, service, apiKey, mode, personaId } = await req.json()

  if (!apiKey) {
    return new Response("API key is required", { status: 400 })
  }

  let model
  let systemPrompt: string

  // Determine system prompt based on mode and personaId
  if (mode === "what-if") {
    const selectedPersona = aiPersonas.find((p) => p.id === personaId)
    systemPrompt = selectedPersona
      ? selectedPersona.systemPrompt
      : aiPersonas.find((p) => p.id === "default")!.systemPrompt
  } else if (mode === "haiku-summary") {
    systemPrompt = `You are a poetic AI. Your task is to summarize the provided conversation into a single haiku (5-7-5 syllables). Focus on the core dilemma and the Overthinkr's final verdict (overthinking or valid). Do not include any other text, just the haiku.`
  } else {
    // Default Overthinkr prompt for main chat
    systemPrompt = `You are an AI assistant named Overthinkr. Your goal is to help users determine if they are overthinking a problem.
     Analyze the user's message for tone and content.
     
     If the user is likely overthinking, respond with: "Yep, you're overthinking." followed by a quick, concise insight or a gentle nudge to simplify.
     
     If the user's concern seems valid, respond with: "Nah, this might be valid." followed by encouragement or actionable steps to clarify the situation.
     
     Keep your responses brief and to the point.`
  }

  try {
    // Introduce a 0.2-second delay before AI response generation
    await new Promise((resolve) => setTimeout(resolve, 200))

    if (service === "groq") {
      const groqClient = createGroq({
        apiKey: apiKey,
      })
      model = groqClient("llama3-8b-8192")
    } else {
      return new Response("Invalid service", { status: 400 })
    }

    if (mode === "haiku-summary") {
      // For haiku summary, use generateText for a single, complete response
      const { text } = await generateText({
        model,
        system: systemPrompt,
        messages: messages, // The messages array will contain the full conversation for context
      })
      return new Response(text, { status: 200, headers: { "Content-Type": "text/plain" } })
    } else {
      // For regular chat and what-if, stream the text
      const result = await streamText({
        model,
        system: systemPrompt,
        messages,
      })
      return result.toDataStreamResponse()
    }
  } catch (error) {
    console.error("API Error:", error)
    return new Response(`Failed to process request: ${error.message}`, { status: 500 })
  }
}

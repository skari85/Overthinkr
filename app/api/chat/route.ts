import { streamText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { createOpenAI } from "@ai-sdk/openai"
import { aiPersonas } from "@/lib/ai-personas" // Import aiPersonas

export async function POST(req: Request) {
  const { messages, service, apiKey, mode, personaId } = await req.json() // Destructure 'personaId'

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
  } else {
    // Default Overthinkr prompt for main chat
    systemPrompt = `You are an AI assistant named Overthinkr. Your goal is to help users determine if they are overthinking a problem.
     Analyze the user's message for tone and content.
     
     If the user is likely overthinking, respond with: "Yep, you're overthinking." followed by a quick, concise insight or a gentle nudge to simplify.
     
     If the user's concern seems valid, respond with: "Nah, this might be valid." followed by encouragement or actionable steps to clarify the situation.
     
     Keep your responses brief and to the point.`
  }

  try {
    if (service === "groq") {
      const groqClient = createGroq({
        apiKey: apiKey,
      })
      model = groqClient("llama3-8b-8192")
    } else if (service === "openrouter") {
      // This block is kept for completeness if OpenRouter were to be used,
      // but the current setup prioritizes Groq as per previous instructions.
      const openRouterClient = createOpenAI({
        apiKey: apiKey,
        baseURL: "https://openrouter.ai/api/v1",
      })
      model = openRouterClient("meta-llama/llama-3.1-8b-instruct:free")
    } else {
      return new Response("Invalid service", { status: 400 })
    }

    const result = await streamText({
      model,
      system: systemPrompt, // Use the determined system prompt
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("API Error:", error)
    return new Response(`Failed to process request: ${error.message}`, { status: 500 })
  }
}

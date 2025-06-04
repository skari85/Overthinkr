import { streamText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages, service, apiKey } = await req.json()

  if (!apiKey) {
    return new Response("API key is required", { status: 400 })
  }

  let model

  try {
    if (service === "groq") {
      const groqClient = createGroq({
        apiKey: apiKey,
      })
      model = groqClient("llama3-8b-8192")
    } else if (service === "openrouter") {
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
      system: `You are an AI assistant named Overthinkr. Your goal is to help users determine if they are overthinking a problem.
      Analyze the user's message for tone and content.
      
      If the user is likely overthinking, respond with: "Yep, you're overthinking." followed by a quick, concise insight or a gentle nudge to simplify.
      
      If the user's concern seems valid, respond with: "Nah, this might be valid." followed by encouragement or actionable steps to clarify the situation.
      
      Keep your responses brief and to the point.`,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("API Error:", error)
    return new Response(`Failed to process request: ${error.message}`, { status: 500 })
  }
}

import { streamText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages, service, apiKey, mode, model: selectedModelId } = await req.json() // Destructure 'mode' and 'model'

  if (!apiKey) {
    return new Response("API key is required", { status: 400 })
  }

  let modelInstance
  let systemPrompt: string

  // Determine system prompt based on mode
  if (mode === "what-if") {
    systemPrompt = `You are an AI assistant specialized in exploring hypothetical 'what if' scenarios. When presented with a 'what if' question, your task is to logically break down the scenario into potential outcomes, assess their approximate probabilities (low, medium, high), and suggest practical coping strategies or next steps. Structure your response clearly with the following markdown headings:

### Potential Outcomes
- Outcome 1
- Outcome 2

### Probabilities
- Outcome 1: [Low/Medium/High]
- Outcome 2: [Low/Medium/High]

### Coping Strategies
- Strategy 1
- Strategy 2

Keep responses concise and focused on practical guidance.`
  } else {
    // Default Overthinkr prompt
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
      modelInstance = groqClient(selectedModelId || "llama3-8b-8192") // Use selected model or default
    } else if (service === "openrouter") {
      const openRouterClient = createOpenAI({
        apiKey: apiKey,
        baseURL: "https://openrouter.ai/api/v1",
      })
      modelInstance = openRouterClient(selectedModelId || "meta-llama/llama-3.1-8b-instruct:free") // Use selected model or default
    } else {
      return new Response("Invalid service", { status: 400 })
    }

    const result = await streamText({
      model: modelInstance,
      system: systemPrompt, // Use the determined system prompt
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("API Error:", error)
    return new Response(`Failed to process request: ${error.message}`, { status: 500 })
  }
}

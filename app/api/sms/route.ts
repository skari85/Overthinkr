import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

// This route will handle incoming Twilio SMS webhooks
export async function POST(req: Request) {
  // Twilio sends form-encoded data, so we need to parse it
  const body = await req.text()
  const params = new URLSearchParams(body)

  const incomingMessage = params.get("Body") // The actual SMS message
  const fromNumber = params.get("From") // The sender's phone number

  if (!incomingMessage || !fromNumber) {
    return new Response("<Response><Message>Error: Missing message or sender.</Message></Response>", {
      status: 400,
      headers: { "Content-Type": "text/xml" },
    })
  }

  // --- AI Response Generation ---
  // You would typically get the API key from environment variables
  // For this example, we'll use GROQ_API_KEY from the environment.
  const groqApiKey = process.env.GROQ_API_KEY

  if (!groqApiKey) {
    console.error("GROQ_API_KEY is not configured.")
    return new Response("<Response><Message>AI service not configured.</Message></Response>", {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    })
  }

  const groqClient = createGroq({ apiKey: groqApiKey })
  const model = groqClient("llama3-8b-8192")

  const systemPrompt = `You are an AI assistant named Overthinkr. Your goal is to help users determine if they are overthinking a problem.
    Analyze the user's message for tone and content.
    If the user is likely overthinking, respond with: "Yep, you're overthinking." followed by a quick, concise insight or a gentle nudge to simplify.
    If the user's concern seems valid, respond with: "Nah, this might be valid." followed by encouragement or actionable steps to clarify the situation.
    Keep your responses brief and to the point, suitable for an SMS message.`

  let aiResponseText: string
  try {
    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: incomingMessage,
    })
    aiResponseText = text
  } catch (error) {
    console.error("AI Generation Error:", error)
    aiResponseText = "I'm sorry, I couldn't process your request at the moment. Please try again later."
  }

  // --- Construct TwiML Response ---
  // Twilio expects TwiML (XML) to send a reply
  const twimlResponse = `
    <Response>
      <Message>${aiResponseText}</Message>
    </Response>
  `.trim()

  return new Response(twimlResponse, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  })
}

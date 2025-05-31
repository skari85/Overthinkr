"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, MessageSquare, Heart, AlertTriangle, CheckCircle } from "lucide-react"

export default function Component() {
  const [message, setMessage] = useState("")
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeMessage = () => {
    if (!message.trim()) return

    setIsAnalyzing(true)

    // Simulate analysis delay
    setTimeout(() => {
      const emojiCount = (
        message.match(
          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
        ) || []
      ).length
      const exclamationCount = (message.match(/!/g) || []).length
      const questionCount = (message.match(/\?/g) || []).length
      const capsCount = (message.match(/[A-Z]/g) || []).length
      const wordCount = message.trim().split(/\s+/).length

      const concerns = []
      const reassurances = []

      // Emoji analysis
      if (emojiCount === 0) {
        concerns.push("No emojis detected - might seem too serious or cold")
        reassurances.push(
          "Actually, some people prefer straightforward communication without emojis. You're being clear and professional!",
        )
      } else if (emojiCount > 3) {
        concerns.push(`${emojiCount} emojis might be excessive - could seem unprofessional`)
        reassurances.push("Emojis show enthusiasm and friendliness! Better to be warm than cold.")
      } else {
        reassurances.push("Perfect emoji balance - friendly but not overwhelming")
      }

      // Punctuation analysis
      if (exclamationCount > 2) {
        concerns.push("Multiple exclamation points might seem too excited or aggressive")
        reassurances.push("Your enthusiasm is contagious! People appreciate energy and positivity.")
      }

      if (questionCount > 1) {
        concerns.push("Too many questions might seem needy or uncertain")
        reassurances.push("Questions show you care about their input and want to engage - that's thoughtful!")
      }

      // Length analysis
      if (wordCount < 5) {
        concerns.push("Message might be too short - could seem dismissive")
        reassurances.push("Concise communication is efficient and respectful of their time.")
      } else if (wordCount > 50) {
        concerns.push("Message might be too long - could overwhelm the recipient")
        reassurances.push("You're being thorough and considerate by providing context.")
      }

      // Caps analysis
      if (capsCount > wordCount * 0.3) {
        concerns.push("Too many capital letters might seem like shouting")
        reassurances.push("Emphasis shows passion! Just make sure it's intentional.")
      }

      // Tone analysis based on keywords
      const positiveWords = ["thanks", "please", "appreciate", "great", "awesome", "love", "excited"]
      const hasPositiveWords = positiveWords.some((word) => message.toLowerCase().includes(word))

      if (!hasPositiveWords && wordCount > 10) {
        concerns.push("Might sound a bit neutral or formal")
        reassurances.push("Professional tone is perfectly appropriate for most situations.")
      }

      // Default reassurances if no concerns
      if (concerns.length === 0) {
        concerns.push("Your anxious brain is working overtime - this message is actually fine!")
        reassurances.push("Seriously, stop overthinking. This is a perfectly normal message.")
      }

      const overallScore = Math.max(1, 5 - concerns.length)

      setAnalysis({
        concerns,
        reassurances,
        score: overallScore,
        emojiCount,
        wordCount,
        exclamationCount,
      })
      setIsAnalyzing(false)
    }, 1500)
  }

  const getScoreColor = (score) => {
    if (score >= 4) return "text-green-600"
    if (score >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreText = (score) => {
    if (score >= 4) return "Chill out, you're good!"
    if (score >= 3) return "Minor overthinking detected"
    return "Maximum anxiety mode activated"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Overthinkr</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">AI that worries so you don't have to.</p>
          <p className="text-gray-500">Type something you sent and we'll analyze it like your anxious brain would.</p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              What did you send?
            </CardTitle>
            <CardDescription>
              Paste your text, email, Slack message, or any communication you're second-guessing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Hey! Thanks for the meeting today. I think the project is going well, but let me know if you have any concerns? Looking forward to hearing your thoughts!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <Button onClick={analyzeMessage} disabled={!message.trim() || isAnalyzing} className="w-full" size="lg">
              {isAnalyzing ? "Overthinking..." : "Analyze My Anxiety"}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.score)} mb-2`}>{analysis.score}/5</div>
                  <p className="text-lg text-gray-600">{getScoreText(analysis.score)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.wordCount}</div>
                  <p className="text-sm text-gray-600">Words</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{analysis.emojiCount}</div>
                  <p className="text-sm text-gray-600">Emojis</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{analysis.exclamationCount}</div>
                  <p className="text-sm text-gray-600">Exclamations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{analysis.concerns.length}</div>
                  <p className="text-sm text-gray-600">Concerns</p>
                </CardContent>
              </Card>
            </div>

            {/* Concerns & Reassurances */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Anxious Thoughts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Your Anxious Brain Says:
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.concerns.map((concern, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{concern}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reassurances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Heart className="h-5 w-5" />
                    Reality Check:
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.reassurances.map((reassurance, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">{reassurance}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Bottom Message */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="pt-6 text-center">
                <p className="text-lg font-medium text-gray-800 mb-2">
                  Bottom Line: You're probably overthinking this.
                </p>
                <p className="text-gray-600">
                  Most people are too busy with their own lives to analyze your message this deeply. You're being
                  thoughtful, and that's a good thing! 💜
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Example Messages */}
        {!analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Try these examples:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() =>
                  setMessage(
                    "Hey! Thanks for the meeting today. I think the project is going well, but let me know if you have any concerns? Looking forward to hearing your thoughts!",
                  )
                }
              >
                <div>
                  <div className="font-medium">Work email</div>
                  <div className="text-sm text-gray-500">{"Hey! Thanks for the meeting today..."}</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => setMessage("k")}
              >
                <div>
                  <div className="font-medium">The dreaded "k"</div>
                  <div className="text-sm text-gray-500">Just the letter k</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() =>
                  setMessage(
                    "Sorry to bother you again, but I was just wondering if you had a chance to look at my email from yesterday? No rush at all!!! Just wanted to follow up 😅😅😅",
                  )
                }
              >
                <div>
                  <div className="font-medium">Over-apologetic follow-up</div>
                  <div className="text-sm text-gray-500">{"Sorry to bother you again..."}</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

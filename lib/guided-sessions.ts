export interface GuidedSession {
  id: string
  title: string
  description: string
  prompt: string
}

export const guidedSessions: GuidedSession[] = [
  {
    id: "job-interview-anxiety",
    title: "Job Interview Anxiety",
    description: "What if I mess up my upcoming job interview?",
    prompt: "What if I completely freeze or say something wrong during my job interview next week?",
  },
  {
    id: "social-rejection-fear",
    title: "Fear of Social Rejection",
    description: "What if my friends get mad if I say no to their plans?",
    prompt: "What if my friends get upset or exclude me if I decline their invitation to hang out tonight?",
  },
  {
    id: "performance-review-worry",
    title: "Performance Review Worry",
    description: "What if my boss gives me negative feedback?",
    prompt: "What if my annual performance review reveals unexpected negative feedback or criticism?",
  },
  {
    id: "health-scare",
    title: "Health Scare",
    description: "What if this minor symptom is something serious?",
    prompt:
      "What if this persistent headache (or other minor symptom) is a sign of a serious underlying health condition?",
  },
  {
    id: "financial-instability",
    title: "Financial Instability",
    description: "What if I can't pay my bills next month?",
    prompt: "What if I lose my job or face unexpected expenses and can't cover my bills next month?",
  },
  {
    id: "relationship-conflict",
    title: "Relationship Conflict",
    description: "What if my partner is secretly unhappy?",
    prompt: "What if my partner is secretly unhappy with our relationship and is considering leaving?",
  },
]

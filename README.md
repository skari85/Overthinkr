# Overthinkr

**Overthinkr** is a web application designed to help people determine whether they're overthinking a problem or situation.

---

## 🧠 Who It's For:

- **Anyone prone to overthinking** – people who get stuck in analysis paralysis
- **Decision-makers** who second-guess themselves frequently
- **Anxious individuals** who spiral into worry loops
- **People seeking quick perspective** on everyday dilemmas

---

## 💡 What It Does:

Overthinkr acts as a digital "reality check" friend. Users describe their problem or concern, and the AI responds with one of two verdicts:

1. **"Yep, you're overthinking."** – followed by gentle advice to simplify or let go  
2. **"Nah, this might be valid."** – followed by encouragement or actionable steps

---

## 🔑 Key Features:

- 🗨️ **Simple chat interface** – just type your concern and get instant feedback
- 🔒 **Privacy-focused** – conversations stay local, no data collection
- 🧠 **Multiple AI services** – supports Groq and OpenRouter (bring your own key)
- ⚡ **Quick responses** – designed for brief, to-the-point insights
- 🆓 **Free to use** – you only pay for your own AI API usage

---

## 📦 Example Use Cases:

- "Should I text them again?"
- "I'm worried about my presentation tomorrow"
- "Am I making too big a deal about this?"
- "Should I quit my job over this issue?"

---

## 🗝️ Bring Your Own API Key (Required)

To use Overthinkr, you must supply your own API key for one of the supported services:

### Supported Backends:
- 🧠 [Groq API](https://console.groq.com/)
- 🔁 [OpenRouter API](https://openrouter.ai/)

### Setup:
1. Create a `.env` file
2. Add one of the following:

```env
# For Groq
GROQ_API_KEY=your-groq-key-here

# Or for OpenRouter
OPENROUTER_API_KEY=your-openrouter-key-here
```

3. Run the app – no bundled key is included. You’re in full control of your data and costs.

---

Overthinkr is a **digital overthinking detector** — a lightweight, privacy-first tool for quick clarity on your concerns.


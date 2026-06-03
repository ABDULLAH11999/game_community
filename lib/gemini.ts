import { GoogleGenerativeAI } from '@google/generative-ai'

function isGamingIssueQuery(message: string) {
  const value = message.toLowerCase()
  return [
    'game',
    'gaming',
    'bug',
    'crash',
    'freeze',
    'stuck',
    'loading',
    'fps',
    'lag',
    'patch',
    'update',
    'error',
    'issue',
    'glitch',
    'performance',
    'settings',
    'workaround',
    'fix',
  ].some((term) => value.includes(term))
}

function localFallback(message: string) {
  const value = message.toLowerCase()
  if (value.includes('loading') || value.includes('stuck') || value.includes('freeze')) {
    return 'Try verifying game files, disabling overlays, clearing shader cache, and restarting the launcher. If the issue persists, share your platform, game name, and the exact point where loading stops.'
  }
  if (value.includes('crash') || value.includes('error')) {
    return 'Try lowering graphics settings, disabling background overlays, updating drivers, and checking for a fresh patch. If you want, share the game name and the exact error so I can narrow it down.'
  }
  if (value.includes('fps') || value.includes('lag') || value.includes('performance')) {
    return 'Try switching to borderless fullscreen, lowering shadows, closing overlays, and updating GPU drivers. If you share the game and hardware, I can suggest a more specific fix.'
  }
  return 'I can help with gaming issues like crashes, loading loops, FPS drops, bugs, patches, and troubleshooting. Share the game name and the exact problem, and I will suggest a fix.'
}

export async function askGamingAssistant(message: string) {
  const normalized = message.trim()
  if (!isGamingIssueQuery(normalized)) {
    return 'I only help with game issue related questions. Ask me about crashes, bugs, patches, FPS drops, loading problems, or other gaming troubleshooting.'
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    return localFallback(normalized)
  }

  try {
    const client = new GoogleGenerativeAI(apiKey)
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `
You are PatchRadar's gaming issue assistant.
Only answer questions related to video games, patches, crashes, bugs, performance issues, settings, and gaming troubleshooting.
If the user asks about anything outside gaming issues, reply with a short refusal that you only handle game issue related questions.
Keep answers helpful, practical, and concise.

User question: ${normalized}
  `.trim()

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    return text || localFallback(normalized)
  } catch {
    return localFallback(normalized)
  }
}

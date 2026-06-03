import { NextResponse } from 'next/server'
import { askGamingAssistant } from '@/lib/gemini'

export async function POST(request: Request) {
  const { message } = await request.json()
  const normalized = String(message || '').trim()
  if (!normalized) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  const reply = await askGamingAssistant(normalized)
  return NextResponse.json({ reply })
}

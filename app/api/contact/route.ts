import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getContactMessages, saveContactMessages } from '@/lib/db'
import { sendContactNotification } from '@/lib/email'

export async function POST(request: Request) {
  const { name, email, topic, message } = await request.json()
  const normalizedName = String(name || '').trim()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedTopic = String(topic || '').trim()
  const normalizedMessage = String(message || '').trim()

  if (!normalizedName || !normalizedEmail || !normalizedTopic || !normalizedMessage) {
    return NextResponse.json({ error: 'Please complete the contact form.' }, { status: 400 })
  }

  const messages = getContactMessages()
  const record = {
    id: crypto.randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
    topic: normalizedTopic,
    message: normalizedMessage,
    createdAt: new Date().toISOString(),
    status: 'Unread' as const,
  }

  await saveContactMessages([record, ...messages])
  await sendContactNotification(normalizedName, normalizedEmail, normalizedTopic, normalizedMessage)

  return NextResponse.json({ success: true })
}

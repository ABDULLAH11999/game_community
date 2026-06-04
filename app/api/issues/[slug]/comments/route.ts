import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getIssueComments, saveIssueComments } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: Readonly<{ params: { slug: string } }>,
) {
  const user = getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Please sign in to comment.' }, { status: 401 })
  }

  const { message } = await request.json()
  const normalizedMessage = String(message || '').trim()
  if (!normalizedMessage) {
    return NextResponse.json({ error: 'Comment message is required.' }, { status: 400 })
  }

  const comments = getIssueComments()
  const current = comments[params.slug] || []
  comments[params.slug] = [
    ...current,
    {
      id: crypto.randomUUID(),
      author: user.name,
      role: user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Moderator' : 'Player',
      message: normalizedMessage,
      createdAt: 'Just now',
    },
  ]

  await saveIssueComments(comments)
  return NextResponse.json({ success: true })
}

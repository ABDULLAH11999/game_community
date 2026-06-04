import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPostComments, savePostComments } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: Readonly<{ params: { slug: string } }>,
) {
  const user = getCurrentUser()
  const body = await request.json().catch(() => ({}))
  const normalizedMessage = String(body?.message || '').trim()
  const normalizedAuthor = String(body?.author || user?.name || '').trim()

  if (!normalizedMessage) {
    return NextResponse.json({ error: 'Comment message is required.' }, { status: 400 })
  }

  if (!normalizedAuthor) {
    return NextResponse.json({ error: 'A display name is required.' }, { status: 400 })
  }

  const comments = getPostComments()
  const current = comments[params.slug] || []
  comments[params.slug] = [
    ...current,
    {
      id: crypto.randomUUID(),
      author: normalizedAuthor,
      role: user ? (user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Moderator' : 'Player') : 'Guest',
      message: normalizedMessage,
      createdAt: 'Just now',
    },
  ]

  await savePostComments(comments)
  return NextResponse.json({ success: true })
}
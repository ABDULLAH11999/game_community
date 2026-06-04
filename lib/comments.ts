import type { CommentRole } from '@/lib/types'

export function getCommentTone(role: CommentRole) {
  if (role === 'Admin') return 'violet'
  if (role === 'Moderator') return 'blue'
  if (role === 'Guest') return 'amber'
  if (role === 'Google') return 'yellow'
  return 'emerald'
}
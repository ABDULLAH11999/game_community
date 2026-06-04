import { CommunityCommentForm } from '@/components/community-comment-form'

export function PostCommentForm({
  slug,
  currentUserName,
}: Readonly<{
  slug: string
  currentUserName?: string | null
}>) {
  return (
    <CommunityCommentForm
      endpoint={`/api/posts/${slug}/comments`}
      currentUserName={currentUserName}
      mode="guest"
      nameLabel="Display name"
      namePlaceholder="How should other players see you?"
      helperText="You can comment as a guest without signing up or logging in."
      messagePlaceholder="Share a fix, bug note, or current status..."
      submitLabel="Post guest comment"
    />
  )
}
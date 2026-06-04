import { CommunityCommentForm } from '@/components/community-comment-form'

export function IssueCommentForm({
  slug,
  currentUserName,
}: Readonly<{
  slug: string
  currentUserName?: string | null
}>) {
  return (
    <CommunityCommentForm
      endpoint={`/api/issues/${slug}/comments`}
      currentUserName={currentUserName}
      mode="google"
      nameLabel="Google account name"
      namePlaceholder="Use the display name on your Google account"
      helperText="Use the display name on your Google account. No LivePatch login required."
      messagePlaceholder="Share a workaround, reproduction step, or live update..."
      submitLabel="Post Google comment"
    />
  )
}
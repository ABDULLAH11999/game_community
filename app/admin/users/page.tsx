import Link from 'next/link'
import { Eye, Shield } from 'lucide-react'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getUsers } from '@/lib/db'

export default function AdminUsersPage() {
  const users = getUsers()

  return (
    <GlassPanel>
      <SectionHeading
        eyebrow="User Management"
        title="Manage players, moderators, and risky accounts"
        detail="Table designed for moderation actions, message review, bans, and profile-level investigation."
      />
      
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="min-w-full divide-y divide-border text-left text-xs font-semibold text-text">
          <thead className="bg-panel-2/30 text-muted">
            <tr>
              <th className="px-4 py-3.5">User</th>
              <th className="px-4 py-3.5">Role</th>
              <th className="px-4 py-3.5">Joined</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Flags</th>
              <th className="px-4 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-panel-2/10 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-bold text-text">{user.name}</p>
                  <p className="text-[10px] text-muted font-medium mt-0.5">{user.email}</p>
                </td>
                <td className="px-4 py-4 text-muted">{user.role}</td>
                <td className="px-4 py-4 text-muted">{new Date(user.createdAt).toISOString().slice(0, 10)}</td>
                <td className="px-4 py-4">
                  <StatusBadge label={user.verified ? 'Active' : 'Pending'} tone={user.verified ? 'emerald' : 'amber'} />
                </td>
                <td className="px-4 py-4 text-muted">0</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel px-2.5 py-1.5 text-[10px] text-text hover:border-accent/40 transition-all font-semibold"
                    >
                      <Eye className="h-3 w-3 text-accent" />
                      View
                    </Link>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/5 px-2.5 py-1.5 text-[10px] text-amber-600 hover:bg-amber-500/10 transition-all font-semibold">
                      <Shield className="h-3 w-3" />
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!users.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted font-medium">
                  No users have signed up yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  )
}

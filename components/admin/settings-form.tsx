'use client'

import { useState } from 'react'
import type { SiteSettings } from '@/lib/types'

export function SettingsForm({ settings }: Readonly<{ settings: SiteSettings }>) {
  const [smtpEnabled, setSmtpEnabled] = useState(settings.smtpEnabled)
  const [otpRequired, setOtpRequired] = useState(settings.otpRequired)
  const [status, setStatus] = useState('')

  async function onSubmit(formData: FormData) {
    const payload = {
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      keywords: String(formData.get('keywords') || ''),
      canonicalUrl: String(formData.get('canonicalUrl') || ''),
      ogImage: String(formData.get('ogImage') || ''),
      favicon: String(formData.get('favicon') || ''),
      smtpEnabled,
      otpRequired,
      smtpHost: String(formData.get('smtpHost') || ''),
      smtpPort: String(formData.get('smtpPort') || ''),
      smtpSender: String(formData.get('smtpSender') || ''),
      adminReceivers: String(formData.get('adminReceivers') || ''),
    }

    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setStatus(response.ok ? 'Settings saved successfully.' : 'Failed to save settings.')
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-bg/80 px-4 py-2.5 text-xs text-text outline-none transition-all font-semibold placeholder:text-muted dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]'
  const labelClass = "text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block"

  return (
    <form action={async (formData) => onSubmit(formData)} className="space-y-5">
      <div className="grid gap-4">
        <div>
          <label className={labelClass}>Site Title</label>
          <input name="title" defaultValue={settings.title} className={inputClass} placeholder="Site title" />
        </div>
        <div>
          <label className={labelClass}>Site Description</label>
          <textarea name="description" defaultValue={settings.description} rows={3} className={inputClass} placeholder="Site description" />
        </div>
        <div>
          <label className={labelClass}>Keywords (comma separated)</label>
          <input name="keywords" defaultValue={settings.keywords.join(', ')} className={inputClass} placeholder="Keywords" />
        </div>
        <div>
          <label className={labelClass}>Canonical URL</label>
          <input name="canonicalUrl" defaultValue={settings.canonicalUrl} className={inputClass} placeholder="Canonical URL" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>OG Image Path</label>
            <input name="ogImage" defaultValue={settings.ogImage} className={inputClass} placeholder="OG image path" />
          </div>
          <div>
            <label className={labelClass}>Favicon Path</label>
            <input name="favicon" defaultValue={settings.favicon} className={inputClass} placeholder="Favicon path" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-panel-2/10 p-4 md:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-panel px-4 py-2.5 text-xs font-bold text-text">
          SMTP Enabled
          <input type="checkbox" checked={smtpEnabled} onChange={(event) => setSmtpEnabled(event.target.checked)} className="h-4 w-4 rounded border-border text-accent focus:ring-accent" />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-panel px-4 py-2.5 text-xs font-bold text-text">
          Signup Requires OTP
          <input type="checkbox" checked={otpRequired} onChange={(event) => setOtpRequired(event.target.checked)} disabled={!smtpEnabled} className="h-4 w-4 rounded border-border text-accent focus:ring-accent" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelClass}>SMTP Host</label>
          <input name="smtpHost" defaultValue={settings.smtpHost} className={inputClass} placeholder="SMTP Host" />
        </div>
        <div>
          <label className={labelClass}>SMTP Port</label>
          <input name="smtpPort" defaultValue={settings.smtpPort} className={inputClass} placeholder="SMTP Port" />
        </div>
        <div>
          <label className={labelClass}>Sender Email</label>
          <input name="smtpSender" defaultValue={settings.smtpSender} className={inputClass} placeholder="Sender Email" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Admin Receiver Emails (comma separated)</label>
        <textarea
          name="adminReceivers"
          defaultValue={settings.adminReceivers.join(', ')}
          rows={2}
          className={inputClass}
          placeholder="Admin receiver emails"
        />
      </div>

      {status ? <p className="text-xs font-semibold text-accent">{status}</p> : null}
      
      <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]">
        Save settings
      </button>
    </form>
  )
}

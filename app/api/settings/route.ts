import { NextResponse } from 'next/server'
import { getStoredSettings, saveStoredSettings } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()
  const current = getStoredSettings()
  const hasKey = (key: string) => Object.prototype.hasOwnProperty.call(body, key)
  const nextSettings = {
    ...current,
    ...body,
    keywords: Array.isArray(body.keywords)
      ? body.keywords
      : typeof body.keywords === 'string'
        ? body.keywords.split(',').map((item: string) => item.trim()).filter(Boolean)
        : current.keywords,
    adminReceivers: Array.isArray(body.adminReceivers)
      ? body.adminReceivers
      : typeof body.adminReceivers === 'string'
        ? body.adminReceivers.split(',').map((item: string) => item.trim()).filter(Boolean)
        : current.adminReceivers,
    smtpEnabled: hasKey('smtpEnabled') ? Boolean(body.smtpEnabled) : current.smtpEnabled,
    otpRequired: hasKey('otpRequired') ? Boolean(body.otpRequired) : current.otpRequired,
  }

  await saveStoredSettings(nextSettings)
  return NextResponse.json({ success: true })
}

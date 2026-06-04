import { Resend } from 'resend'
import { getStoredSettings } from '@/lib/db'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getFromEmail() {
  return process.env.RESEND_FROM?.trim() || getStoredSettings().smtpSender
}

export async function sendOtpEmail(email: string, name: string, otp: string) {
  const resend = getResendClient()
  if (!resend) return

  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: 'Your LivePatch verification code',
    html: `
      <div style="background:#060918;padding:32px;font-family:Arial,sans-serif;color:#e5efff">
        <div style="max-width:620px;margin:0 auto;background:linear-gradient(180deg,#141c3d,#0a1028);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:32px">
          <div style="font-size:12px;letter-spacing:.35em;text-transform:uppercase;color:#91c5ff">LivePatch Account Security</div>
          <h1 style="font-size:32px;margin:16px 0 12px;color:#fff">Verify your email</h1>
          <p style="font-size:16px;line-height:1.7;color:#d4ddf4">Hi ${name}, use the code below to finish creating your LivePatch account.</p>
          <div style="margin:28px 0;padding:18px 22px;border-radius:18px;background:linear-gradient(90deg,#7c3aed,#2563eb,#22d3ee);font-size:34px;font-weight:700;letter-spacing:.3em;text-align:center;color:#fff">${otp}</div>
          <p style="font-size:14px;line-height:1.7;color:#94a3b8">This code expires in 10 minutes. If you did not request this account, you can ignore this email.</p>
        </div>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  const resend = getResendClient()
  if (!resend) return

  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: 'Welcome to LivePatch',
    html: `
      <div style="background:#060918;padding:32px;font-family:Arial,sans-serif;color:#e5efff">
        <div style="max-width:620px;margin:0 auto;background:linear-gradient(180deg,#141c3d,#0a1028);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:32px">
          <div style="font-size:12px;letter-spacing:.35em;text-transform:uppercase;color:#91c5ff">LivePatch Community</div>
          <h1 style="font-size:32px;margin:16px 0 12px;color:#fff">Welcome, ${name}</h1>
          <p style="font-size:16px;line-height:1.7;color:#d4ddf4">Your account is ready. You can now track game issues, join discussions, and follow AI-assisted bug reports.</p>
          <div style="margin-top:24px;padding:16px 18px;border-radius:18px;background:rgba(255,255,255,.05);font-size:14px;line-height:1.7;color:#cbd5e1">
            You will receive community and account-related updates here whenever the site settings allow it.
          </div>
        </div>
      </div>
    `,
  })
}

export async function sendAdminSignupNotification(email: string, name: string) {
  const resend = getResendClient()
  const settings = getStoredSettings()
  if (!resend || !settings.adminReceivers.length) return

  await resend.emails.send({
    from: getFromEmail(),
    to: settings.adminReceivers,
    subject: 'New LivePatch user registered',
    html: `
      <div style="background:#060918;padding:32px;font-family:Arial,sans-serif;color:#e5efff">
        <div style="max-width:620px;margin:0 auto;background:linear-gradient(180deg,#141c3d,#0a1028);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:32px">
          <div style="font-size:12px;letter-spacing:.35em;text-transform:uppercase;color:#91c5ff">Admin Alert</div>
          <h1 style="font-size:28px;margin:16px 0 12px;color:#fff">New account created</h1>
          <p style="font-size:16px;line-height:1.7;color:#d4ddf4">${name} signed up with ${email}.</p>
        </div>
      </div>
    `,
  })
}

export async function sendContactNotification(name: string, email: string, topic: string, message: string) {
  const resend = getResendClient()
  const settings = getStoredSettings()
  if (!resend || !settings.adminReceivers.length) return

  await resend.emails.send({
    from: getFromEmail(),
    to: settings.adminReceivers,
    subject: `New contact form: ${topic}`,
    html: `
      <div style="background:#060918;padding:32px;font-family:Arial,sans-serif;color:#e5efff">
        <div style="max-width:620px;margin:0 auto;background:linear-gradient(180deg,#141c3d,#0a1028);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:32px">
          <h1 style="font-size:28px;margin:0 0 12px;color:#fff">New contact submission</h1>
          <p style="font-size:16px;line-height:1.7;color:#d4ddf4"><strong>Name:</strong> ${name}<br /><strong>Email:</strong> ${email}<br /><strong>Topic:</strong> ${topic}</p>
          <div style="margin-top:24px;padding:18px;border-radius:18px;background:rgba(255,255,255,.05);font-size:14px;line-height:1.7;color:#cbd5e1">${message}</div>
        </div>
      </div>
    `,
  })
}

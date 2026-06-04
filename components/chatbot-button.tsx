'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Send, X } from 'lucide-react'

interface Message {
  role: 'user' | 'bot'
  text: string
}

export function ChatbotButton() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'I am your LivePatch gaming assistant. Ask me about game crashes, performance, bugs, patches, or troubleshooting.',
    },
  ])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const content = input.trim()
    setMessages((current) => [...current, { role: 'user', text: content }])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      const data = await response.json()
      setMessages((current) => [...current, { role: 'bot', text: data.reply || data.error || 'No reply received.' }])
    } catch {
      setMessages((current) => [...current, { role: 'bot', text: 'The gaming assistant is temporarily unavailable.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((current) => !current)}
        aria-label="Open gaming assistant"
        className="animate-float fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-transparent p-0 shadow-none transition-transform hover:scale-105"
      >
        <Image
          src="/chatbot-icon.png"
          alt=""
          width={52}
          height={52}
          className="h-14 w-14 animate-pulse object-contain"
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-border bg-panel shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-border bg-panel-2/50 px-4 py-3.5">
            <Image src="/chatbot-icon.png" alt="" width={22} height={22} className="h-5 w-5 object-contain" aria-hidden="true" />
            <div>
              <p className="font-display text-sm font-bold text-text">PatchBot</p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-accent">Gaming helper</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-muted transition hover:text-text">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                      : 'border border-border bg-panel-2/20 text-muted'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading ? <div className="text-[10px] font-bold text-accent animate-pulse">Thinking...</div> : null}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    void sendMessage()
                  }
                }}
                placeholder="Ask about crashes, FPS, bugs..."
                className="flex-1 rounded-xl border border-border bg-bg/80 px-4 py-2.5 text-xs text-text outline-none transition-all font-semibold placeholder:text-muted dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
              />
              <button
                onClick={() => void sendMessage()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md transition-all hover:shadow-[0_0_10px_rgba(59,130,246,0.25)]"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

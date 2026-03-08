import { NextRequest, NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
const CRISP_WEBHOOK_SECRET = process.env.CRISP_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  // 1. Verify webhook secret (URL param ?key=xxx)
  if (CRISP_WEBHOOK_SECRET) {
    const key = req.nextUrl.searchParams.get("key")
    if (key !== CRISP_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // 2. Parse payload
  let payload: CrispWebhookPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // 3. Only forward user-sent messages (not operator replies)
  if (payload.event !== "message:send" || payload.data?.from !== "user") {
    return NextResponse.json({ status: "ignored" })
  }

  // 4. Guard: Telegram config must exist
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("[crisp-webhook] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID")
    return NextResponse.json({ status: "ok" })
  }

  // 5. Build Telegram message
  const { content, type, user, session_id } = payload.data
  const nickname = user?.nickname || "Anonymous"
  const messageText = type === "text" ? content : `[${type}]`
  const crispInboxUrl = `https://app.crisp.chat/website/${payload.website_id}/inbox/${session_id}/`

  const telegramText = [
    `🔔 <b>New Crisp Message</b>`,
    `👤 ${escapeHtml(nickname)}`,
    `💬 ${escapeHtml(messageText)}`,
    `🔗 <a href="${crispInboxUrl}">Open in Crisp</a>`,
  ].join("\n")

  // 6. Send to Telegram with retry (1 retry on failure)
  let success = false
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramText,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        }
      )
      if (res.ok) {
        success = true
        break
      }
      console.error(
        `[crisp-webhook] Telegram API error (attempt ${attempt + 1}):`,
        res.status,
        await res.text()
      )
    } catch (err) {
      console.error(
        `[crisp-webhook] Telegram fetch error (attempt ${attempt + 1}):`,
        err
      )
    }
    // Wait 1s before retry
    if (attempt === 0) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  if (!success) {
    console.error("[crisp-webhook] Failed to send Telegram message after 2 attempts")
  }

  // Always return 200 to Crisp (avoid retry storm)
  return NextResponse.json({ status: "ok" })
}

// --- Types ---

interface CrispWebhookPayload {
  website_id: string
  event: string
  data: {
    session_id: string
    type: string
    content: string
    from: string
    origin: string
    timestamp: number
    user?: {
      nickname?: string
      user_id?: string
    }
  }
  timestamp: number
}

// --- Helpers ---

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

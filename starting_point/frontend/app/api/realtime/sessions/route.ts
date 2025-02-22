import OpenAI from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET(request: Request) {
  const r = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-realtime-preview-2024-12-17',
      voice: 'verse'
    })
  })
  const data = await r.json()
  return new Response(JSON.stringify(data))
}

import { tools } from '@/lib/tools'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'] // This is the default and can be omitted
})

export async function POST(request: Request) {
  const { messages } = await request.json()

  try {
    const chatCompletion = await client.chat.completions.create({
      messages: messages,
      tools: tools,
      model: 'gpt-4o-mini'
    })
    const message = chatCompletion.choices[0].message

    return new Response(JSON.stringify(message))
  } catch (error: any) {
    console.error('Error in POST handler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    })
  }
}

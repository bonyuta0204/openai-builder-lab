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

    if (message.tool_calls) {
      const toolCall = message.tool_calls[0]

      const response = {
        type: 'function_call',
        id: toolCall.id,
        name: toolCall.function.name,
        arguments: toolCall.function.arguments,
        parsedArguments: JSON.parse(toolCall.function.arguments),
        output: null
      }

      return new Response(JSON.stringify(response))
    } else {
      return new Response(JSON.stringify(message))
    }
  } catch (error: any) {
    console.error('Error in POST handler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    })
  }
}

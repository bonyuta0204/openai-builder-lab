import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { ITINERARY_PLANNING_PROMPT } from '@/lib/constants'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { destinations, duration, travelers, preferences } =
      await request.json()

    const response = await openai.chat.completions.create({
      model: 'o1-mini',
      messages: [
        {
          role: 'user',
          content: `${ITINERARY_PLANNING_PROMPT} \n\n\n ### instructions \nPlan a ${duration}-day trip for ${travelers} travelers to ${destinations.join(
            ', '
          )}. 
Travel pace: ${preferences.pace}
Interests: ${preferences.interests.join(', ')}`
        }
      ]
    })

    const itinerary = response.choices[0].message.content
    return NextResponse.json({ itinerary })
  } catch (error) {
    console.error('Error in itinerary planning:', error)
    return NextResponse.json(
      { error: 'Failed to generate itinerary' },
      { status: 500 }
    )
  }
}

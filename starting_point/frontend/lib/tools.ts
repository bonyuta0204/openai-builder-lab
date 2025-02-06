import type { ChatCompletionTool } from 'openai/resources/index.mjs'

export const handleTool = async (toolName: string, parameters: any) => {
  switch (toolName) {
    case 'location_search':
      return locationSearch(parameters)
    case 'itinerary_planning':
      return itineraryPlanning(parameters)
  }
}

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'location_search',
      description: 'Search hotels and landmarks based on specified location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The location to search'
          },
          query: {
            type: 'string',
            description: 'The search query'
          }
        },
        required: ['location', 'query'],
        additionalProperties: false
      },
      strict: true
    }
  },
  {
    type: 'function',
    function: {
      name: 'itinerary_planning',
      description: 'Plan a detailed travel itinerary for multiple destinations',
      parameters: {
        type: 'object',
        properties: {
          destinations: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'List of destinations to visit'
          },
          duration: {
            type: 'integer',
            description: 'Total duration of the trip in days'
          },
          travelers: {
            type: 'integer',
            description: 'Number of travelers'
          },
          preferences: {
            type: 'object',
            properties: {
              pace: {
                type: 'string',
                enum: ['relaxed', 'moderate', 'active'],
                description: 'Preferred pace of travel'
              },
              interests: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description:
                  'List of travel interests (e.g., culture, nature, food)'
              }
            },
            required: ['pace', 'interests'],
            additionalProperties: false
          }
        },
        required: ['destinations', 'duration', 'travelers', 'preferences'],
        additionalProperties: false
      },
      strict: true
    }
  }
]

const locationSearch = async ({
  location,
  query
}: {
  location: string
  query: string
}) => {
  try {
    const response = await fetch('/api/location_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ location, query })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }

    const results = await response.json()
    return results
  } catch (error) {
    console.error('Error in locationSearch:', error)
    return []
  }
}

const itineraryPlanning = async ({
  destinations,
  duration,
  travelers,
  preferences
}: {
  destinations: string[]
  duration: number
  travelers: number
  preferences: {
    pace: 'relaxed' | 'moderate' | 'active'
    interests: string[]
  }
}) => {
  try {
    const response = await fetch('/api/itinerary_planning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ destinations, duration, travelers, preferences })
    })

    if (!response.ok) {
      throw new Error('Failed to plan itinerary')
    }

    return await response.json()
  } catch (error) {
    console.error('Error planning itinerary:', error)
    throw error
  }
}

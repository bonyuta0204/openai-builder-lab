import type { ChatCompletionTool } from 'openai/resources/index.mjs'

export const handleTool = async (toolName: string, parameters: any) => {
  switch (toolName) {
    case 'location_search':
      return locationSearch(parameters)
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

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
  return [
    {
      name: 'Waikiki Beach Marriott Resort & Spa',
      location: 'Honolulu, Oahu',
      rating: 4.5,
      price: '$350/night',
      features: ['Ocean view', 'Spa', '3 restaurants'],
      image: 'https://example.com/waikiki-marriott.jpg'
    },
    {
      name: 'Grand Hyatt Kauai Resort & Spa',
      location: 'Koloa, Kauai',
      rating: 4.7,
      price: '$450/night',
      features: ['Water park', 'Golf course', '5 restaurants'],
      image: 'https://example.com/grand-hyatt-kauai.jpg'
    },
    {
      name: 'Four Seasons Resort Maui at Wailea',
      location: 'Wailea, Maui',
      rating: 4.8,
      price: '$650/night',
      features: ['Private beach', 'Luxury spa', 'Michelin-starred dining'],
      image: 'https://example.com/four-seasons-maui.jpg'
    }
  ]
}

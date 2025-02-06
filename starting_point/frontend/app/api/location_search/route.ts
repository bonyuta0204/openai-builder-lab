import { NextResponse } from 'next/server'
import { getJson } from 'serpapi'

export async function POST(request: Request) {
  try {
    const { location, query } = await request.json()

    if (!location || !query) {
      return NextResponse.json(
        { error: 'Location and query are required' },
        { status: 400 }
      )
    }

    const searchResult = await getJson({
      engine: 'google_maps',
      api_key: process.env['SERP_API_KEY'],
      q: query,
      location
    })

    // Transform the results into a more usable format
    const transformedResults =
      searchResult.local_results?.map((item: any) => ({
        name: item.title,
        location: item.address,
        rating: item.rating,
        reviews: item.reviews,
        type: item.type,
        thumbnail: item.thumbnail,
        hours: item.hours,
        phone: item.phone,
        website: item.website,
        description: item.description
      })) || []

    return NextResponse.json(transformedResults)
  } catch (error: any) {
    console.error('Location search error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search location' },
      { status: 500 }
    )
  }
}

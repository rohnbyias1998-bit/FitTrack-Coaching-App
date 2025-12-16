// Supabase Edge Function for searching USDA FoodData Central
// https://fdc.nal.usda.gov/api-guide.html

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const USDA_API_KEY = Deno.env.get('USDA_API_KEY')
const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1'

interface SearchParams {
  query: string
  pageSize?: number
  pageNumber?: number
  dataType?: string[]
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Validate API key
    if (!USDA_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'USDA_API_KEY not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Parse request body
    const { query, pageSize = 25, pageNumber = 1, dataType }: SearchParams = await req.json()

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Build search request
    const searchUrl = `${USDA_API_BASE}/foods/search`
    const params = new URLSearchParams({
      api_key: USDA_API_KEY,
      query: query.trim(),
      pageSize: String(pageSize),
      pageNumber: String(pageNumber),
    })

    // Add dataType filter if provided
    if (dataType && dataType.length > 0) {
      dataType.forEach(type => params.append('dataType', type))
    }

    // Make request to USDA API
    const response = await fetch(`${searchUrl}?${params.toString()}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('USDA API Error:', response.status, errorText)
      return new Response(
        JSON.stringify({
          error: 'USDA API request failed',
          status: response.status,
          details: errorText
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    const data = await response.json()

    // Return the search results
    return new Response(
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})

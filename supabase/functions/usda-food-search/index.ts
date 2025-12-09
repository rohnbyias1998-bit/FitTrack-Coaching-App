// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const USDA_API_KEY = Deno.env.get('USDA_API_KEY') || ''
const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, pageSize = 10, pageNumber = 1 } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Call USDA FoodData Central API
    const url = new URL(USDA_API_URL)
    url.searchParams.append('query', query)
    url.searchParams.append('pageSize', pageSize.toString())
    url.searchParams.append('pageNumber', pageNumber.toString())
    url.searchParams.append('api_key', USDA_API_KEY)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.statusText}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/usda-food-search' \
//   --header 'Authorization: Bearer YOUR_ANON_KEY' \
//   --header 'Content-Type: application/json' \
//   --data '{"query":"apple"}'

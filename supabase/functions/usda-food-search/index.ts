import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface USDASearchParams {
  query: string;
  pageSize?: number;
  pageNumber?: number;
  dataType?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, pageSize = 25, pageNumber = 1, dataType = ['Foundation', 'SR Legacy'] } = await req.json() as USDASearchParams;

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get USDA API key from environment
    const usdaApiKey = Deno.env.get('USDA_API_KEY');
    if (!usdaApiKey) {
      return new Response(
        JSON.stringify({ error: 'USDA API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Build query parameters
    const params = new URLSearchParams({
      api_key: usdaApiKey,
      query: query,
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString(),
    });

    // Add dataType filters
    dataType.forEach(type => params.append('dataType', type));

    // Call USDA API
    const response = await fetch(`${USDA_API_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('USDA API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from USDA API', details: errorText }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();

    // Transform the response to include relevant nutritional data
    const transformedData = {
      totalHits: data.totalHits,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      foods: data.foods?.map((food: any) => ({
        fdcId: food.fdcId,
        description: food.description,
        dataType: food.dataType,
        brandOwner: food.brandOwner,
        ingredients: food.ingredients,
        nutrients: food.foodNutrients?.map((nutrient: any) => ({
          nutrientId: nutrient.nutrientId,
          nutrientName: nutrient.nutrientName,
          nutrientNumber: nutrient.nutrientNumber,
          unitName: nutrient.unitName,
          value: nutrient.value,
        })),
        servingSize: food.servingSize,
        servingSizeUnit: food.servingSizeUnit,
        householdServingFullText: food.householdServingFullText,
      })) || [],
    };

    return new Response(
      JSON.stringify(transformedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in usda-food-search function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

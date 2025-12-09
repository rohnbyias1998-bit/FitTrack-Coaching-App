# Supabase Edge Functions

This directory contains Supabase Edge Functions for the FitTrack Coaching App.

## Available Functions

### usda-food-search

Searches the USDA FoodData Central API for nutritional information.

## Deployment

### Prerequisites

1. Install the Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

You can find your project ref in your Supabase dashboard URL:
`https://app.supabase.com/project/YOUR_PROJECT_REF`

### Deploy the Function

Deploy the usda-food-search function:

```bash
supabase functions deploy usda-food-search
```

### Set Environment Variables

You need to set the USDA API key as a secret:

```bash
supabase secrets set USDA_API_KEY=your_usda_api_key_here
```

To get a USDA API key:
1. Visit https://fdc.nal.usda.gov/api-key-signup.html
2. Sign up for a free API key
3. Use the key in the command above

### Verify Deployment

Test the function:

```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/usda-food-search' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"query":"apple"}'
```

## CORS Configuration

The Edge Function is configured with the following CORS headers to allow requests from any origin:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type`

This allows your app to make requests from any domain, including Tempo build previews.

## Local Development

To run the function locally:

1. Start Supabase locally:
```bash
supabase start
```

2. Serve the function:
```bash
supabase functions serve usda-food-search
```

3. Test locally:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/usda-food-search' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"query":"apple"}'
```

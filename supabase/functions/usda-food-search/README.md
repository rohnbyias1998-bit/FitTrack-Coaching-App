# USDA Food Search Edge Function

This Supabase Edge Function provides a proxy to the USDA FoodData Central API for searching food nutrition data.

## API Endpoint

Once deployed, the function will be available at:
```
https://irmddewvhqbjuwtfsrkg.supabase.co/functions/v1/usda-food-search
```

## Request Format

**Method:** POST

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <SUPABASE_ANON_KEY>` (optional, depends on your auth settings)

**Body:**
```json
{
  "query": "apple",
  "pageSize": 25,
  "pageNumber": 1,
  "dataType": ["Foundation", "SR Legacy"]
}
```

**Parameters:**
- `query` (required): Search term for food items
- `pageSize` (optional): Number of results per page (default: 25)
- `pageNumber` (optional): Page number for pagination (default: 1)
- `dataType` (optional): Array of data types to filter by

## Example Usage

```javascript
const response = await fetch('https://irmddewvhqbjuwtfsrkg.supabase.co/functions/v1/usda-food-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'chicken breast',
    pageSize: 10
  })
})

const data = await response.json()
console.log(data)
```

## Deployment

### Prerequisites

1. **Get a USDA API Key:**
   - Visit: https://fdc.nal.usda.gov/api-key-signup.html
   - Sign up for a free API key
   - Save the key for deployment

### Option 1: Deploy via Supabase CLI (Recommended)

If you have network access and can install the CLI:

```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref irmddewvhqbjuwtfsrkg

# Set the USDA API key as a secret
npx supabase secrets set USDA_API_KEY=your_actual_api_key_here

# Deploy the function
npx supabase functions deploy usda-food-search
```

### Option 2: Deploy via Supabase Dashboard (If CLI has issues)

1. **Go to your Supabase project:**
   https://supabase.com/dashboard/project/irmddewvhqbjuwtfsrkg

2. **Navigate to Edge Functions:**
   - Click on "Edge Functions" in the left sidebar
   - Click "Create a new function"
   - Name it: `usda-food-search`

3. **Upload the function code:**
   - Copy the contents of `supabase/functions/usda-food-search/index.ts`
   - Paste into the editor
   - Click "Deploy"

4. **Set the environment variable:**
   - Go to "Settings" → "Edge Functions" → "Secrets"
   - Add a new secret:
     - Name: `USDA_API_KEY`
     - Value: Your USDA API key
   - Click "Save"

## Testing

After deployment, test the function:

```bash
curl -X POST 'https://irmddewvhqbjuwtfsrkg.supabase.co/functions/v1/usda-food-search' \
  -H 'Content-Type: application/json' \
  -d '{"query": "apple"}'
```

## USDA API Documentation

- API Guide: https://fdc.nal.usda.gov/api-guide.html
- FoodData Central: https://fdc.nal.usda.gov/

# USDA Edge Function Deployment Instructions

## Prerequisites
- Supabase CLI installed locally ([Installation Guide](https://supabase.com/docs/guides/cli/getting-started))
- Supabase account and project

## Steps to Deploy

### 1. Login to Supabase
```bash
supabase login
```

### 2. Link to Your Project
```bash
supabase link --project-ref irmddewvhqbjuwtfsrkg
```

### 3. Set the USDA API Key as a Secret
```bash
supabase secrets set USDA_API_KEY=OC5NFN82KhlN4todWvICCtVXFQwjXKVnKcaFkCmZ
```

### 4. Deploy the Edge Function
```bash
supabase functions deploy usda-food-search
```

### 5. Verify Deployment
Check that the function is deployed:
```bash
supabase functions list
```

## Testing the Function

You can test the function directly using curl:

```bash
curl -X POST 'https://irmddewvhqbjuwtfsrkg.supabase.co/functions/v1/usda-food-search' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"query": "apple"}'
```

Or use the test component created in the app (see `src/components/FoodSearchTest.tsx`).

## Function Details

- **Endpoint**: `/functions/v1/usda-food-search`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "query": "search term",
    "pageSize": 25,  // optional, default: 25
    "pageNumber": 1,  // optional, default: 1
    "dataType": ["Foundation", "SR Legacy"]  // optional
  }
  ```
- **Response**:
  ```json
  {
    "totalHits": 100,
    "currentPage": 1,
    "totalPages": 4,
    "foods": [
      {
        "fdcId": 123456,
        "description": "Apple, raw",
        "dataType": "Foundation",
        "nutrients": [...],
        "servingSize": 100,
        "servingSizeUnit": "g"
      }
    ]
  }
  ```

## Troubleshooting

- If deployment fails, check that you're logged in and linked to the correct project
- Verify the secret was set correctly: `supabase secrets list`
- Check function logs: `supabase functions logs usda-food-search`

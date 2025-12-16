# Edge Function Deployment Guide

This guide will help you deploy the USDA Food Search Edge Function to your Supabase project.

## 🎯 Quick Start

### Prerequisites
1. **Get a USDA API Key** (FREE):
   - Visit: https://fdc.nal.usda.gov/api-key-signup.html
   - Fill out the signup form
   - You'll receive your API key via email immediately
   - Save this key - you'll need it for deployment

### Option 1: Automated Deployment (CLI) ⚡

If you have network access, use the deployment script:

```bash
# Run the deployment script with your USDA API key
./deploy-edge-function.sh YOUR_USDA_API_KEY_HERE
```

This will:
- ✅ Login to Supabase
- ✅ Link your project
- ✅ Set the API key as a secret
- ✅ Deploy the function

### Option 2: Manual CLI Deployment 🔧

If you prefer step-by-step control:

```bash
# 1. Login
npx supabase login

# 2. Link project
npx supabase link --project-ref irmddewvhqbjuwtfsrkg

# 3. Set secret
npx supabase secrets set USDA_API_KEY=your_api_key_here

# 4. Deploy
npx supabase functions deploy usda-food-search
```

### Option 3: Dashboard Deployment (No CLI needed) 🌐

If the CLI isn't working due to network issues:

1. **Get your USDA API key** from https://fdc.nal.usda.gov/api-key-signup.html

2. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/irmddewvhqbjuwtfsrkg
   - Login with your Supabase credentials

3. **Create the Edge Function:**
   - Click "Edge Functions" in left sidebar
   - Click "Create a new function"
   - Name: `usda-food-search`
   - Copy the contents from `supabase/functions/usda-food-search/index.ts`
   - Paste into the code editor
   - Click "Deploy"

4. **Set the Secret:**
   - Go to "Settings" → "Edge Functions" → "Secrets"
   - Click "Add new secret"
   - Name: `USDA_API_KEY`
   - Value: Your USDA API key
   - Click "Save"

## 🧪 Testing Your Deployment

Once deployed, test with curl:

```bash
curl -X POST 'https://irmddewvhqbjuwtfsrkg.supabase.co/functions/v1/usda-food-search' \
  -H 'Content-Type: application/json' \
  -d '{"query": "apple", "pageSize": 5}'
```

Or test with JavaScript:

```javascript
const response = await fetch(
  'https://irmddewvhqbjuwtfsrkg.supabase.co/functions/v1/usda-food-search',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'chicken breast',
      pageSize: 10
    })
  }
)

const data = await response.json()
console.log(data)
```

## 📊 Expected Response

```json
{
  "totalHits": 1234,
  "currentPage": 1,
  "totalPages": 124,
  "foods": [
    {
      "fdcId": 171705,
      "description": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
      "dataType": "SR Legacy",
      "foodNutrients": [...]
    }
  ]
}
```

## ❌ Troubleshooting

### CLI Installation Issues
If `npx supabase` fails with network errors:
- Use **Option 3** (Dashboard Deployment) instead
- Or check your internet connection and firewall settings
- The npm package needs to download binaries from GitHub

### "command not found" Error
- Use `npx supabase` instead of just `supabase`
- `npx` automatically downloads and runs the package

### API Key Not Working
- Make sure you've set the secret in Supabase (either via CLI or Dashboard)
- Wait a few minutes after setting secrets for them to propagate
- Restart the Edge Function if needed

### CORS Errors
The function includes CORS headers, but if you have issues:
- The function allows all origins (`*`)
- Make sure you're sending the correct `Content-Type: application/json` header

## 📚 Additional Resources

- **Edge Function Code:** `supabase/functions/usda-food-search/index.ts`
- **Detailed README:** `supabase/functions/usda-food-search/README.md`
- **USDA API Docs:** https://fdc.nal.usda.gov/api-guide.html
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions

## 🔐 Security Notes

- Never commit your USDA_API_KEY to git
- The API key is stored as a Supabase secret (encrypted)
- The Edge Function acts as a proxy to keep your API key server-side
- Users call your Edge Function, which then calls USDA with your key

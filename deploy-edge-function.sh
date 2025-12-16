#!/bin/bash

# Deployment script for USDA Food Search Edge Function
# This script helps deploy the function using Supabase CLI

set -e  # Exit on error

echo "🚀 USDA Food Search Edge Function Deployment"
echo "=============================================="
echo ""

# Check if USDA_API_KEY is provided
if [ -z "$1" ]; then
    echo "❌ Error: USDA_API_KEY not provided"
    echo ""
    echo "Usage: ./deploy-edge-function.sh YOUR_USDA_API_KEY"
    echo ""
    echo "📝 To get a USDA API key:"
    echo "   Visit: https://fdc.nal.usda.gov/api-key-signup.html"
    echo ""
    exit 1
fi

USDA_API_KEY="$1"
PROJECT_REF="irmddewvhqbjuwtfsrkg"

echo "Step 1/4: Logging in to Supabase..."
npx supabase login

echo ""
echo "Step 2/4: Linking project..."
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "Step 3/4: Setting USDA_API_KEY secret..."
npx supabase secrets set USDA_API_KEY="$USDA_API_KEY"

echo ""
echo "Step 4/4: Deploying function..."
npx supabase functions deploy usda-food-search

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Your function is available at:"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/usda-food-search"
echo ""
echo "📖 Test it with:"
echo "   curl -X POST 'https://$PROJECT_REF.supabase.co/functions/v1/usda-food-search' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"query\": \"apple\"}'"
echo ""

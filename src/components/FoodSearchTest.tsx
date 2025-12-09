import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Food {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner?: string;
  nutrients?: Array<{
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
  servingSize?: number;
  servingSizeUnit?: string;
}

interface SearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: Food[];
}

export const FoodSearchTest: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);

  const searchFood = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('usda-food-search', {
        body: {
          query: query.trim(),
          pageSize: 10,
        },
      });

      if (functionError) {
        throw functionError;
      }

      setResults(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search foods');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchFood();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">USDA Food Search Test</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a food (e.g., apple, chicken, rice)..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={searchFood}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {results && (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Found {results.totalHits} results (showing page {results.currentPage} of {results.totalPages})
            </div>

            {results.foods.length === 0 ? (
              <p className="text-gray-500">No foods found for "{query}"</p>
            ) : (
              <div className="space-y-4">
                {results.foods.map((food) => (
                  <div key={food.fdcId} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{food.description}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {food.dataType}
                      </span>
                    </div>

                    {food.brandOwner && (
                      <p className="text-sm text-gray-600 mb-2">Brand: {food.brandOwner}</p>
                    )}

                    {food.servingSize && (
                      <p className="text-sm text-gray-600 mb-2">
                        Serving: {food.servingSize} {food.servingSizeUnit}
                      </p>
                    )}

                    {food.nutrients && food.nutrients.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-2">Key Nutrients:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {food.nutrients.slice(0, 6).map((nutrient, idx) => (
                            <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                              <span className="font-medium">{nutrient.nutrientName}:</span>{' '}
                              {nutrient.value.toFixed(2)} {nutrient.unitName}
                            </div>
                          ))}
                        </div>
                        {food.nutrients.length > 6 && (
                          <p className="text-xs text-gray-500 mt-2">
                            +{food.nutrients.length - 6} more nutrients
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodSearchTest;

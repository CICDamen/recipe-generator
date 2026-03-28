import { useState, useRef } from "react";
import RecipeForm from "@/components/RecipeForm";
import RecipeCard from "@/components/RecipeCard";
import { Recipe, RecipeFormData, RecipeResponse } from "@/types/recipe";
import { useTranslation } from 'react-i18next';

// Configuration for n8n endpoint using environment variables
const N8N_CONFIG = {
  endpoint: import.meta.env.VITE_N8N_ENDPOINT,
  username: import.meta.env.VITE_N8N_USERNAME,
  password: import.meta.env.VITE_N8N_PASSWORD
};

const MAX_HISTORY = 10;

const loadHistory = (): Recipe[] => {
  try {
    const stored = localStorage.getItem('recipeHistory');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load recipe history from localStorage:', error);
    return [];
  }
};

const saveHistory = (recipes: Recipe[]) => {
  localStorage.setItem('recipeHistory', JSON.stringify(recipes));
};

const Index = () => {
  const [recipeHistory, setRecipeHistory] = useState<Recipe[]>(loadHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const recipeCardRef = useRef<HTMLDivElement>(null);

  const currentRecipe = recipeHistory[0] ?? null;

  const handleGenerateRecipe = async (formData: RecipeFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!N8N_CONFIG.endpoint || N8N_CONFIG.endpoint === "" || N8N_CONFIG.endpoint === "YOUR_N8N_WEBHOOK_URL_HERE") {
        throw new Error("n8n endpoint is not configured. Please set the VITE_N8N_ENDPOINT environment variable.");
      }
      if (!N8N_CONFIG.username || !N8N_CONFIG.password) {
        throw new Error("n8n basic auth credentials are not configured. Please set the VITE_N8N_USERNAME and VITE_N8N_PASSWORD environment variables.");
      }

      const response = await fetch(N8N_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${N8N_CONFIG.username}:${N8N_CONFIG.password}`)}`
        },
        body: JSON.stringify({ ...formData, language: i18n.language })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RecipeResponse = await response.json();
      // Expecting data to be an object with recipe, success, and timestamp fields
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from API');
      }
      if (!data.success) {
        throw new Error('Recipe generation failed');
      }
      if (!data.recipe) {
        throw new Error('No recipe data received from API');
      }

      const newHistory = [data.recipe, ...recipeHistory].slice(0, MAX_HISTORY);
      setRecipeHistory(newHistory);
      saveHistory(newHistory);

      // Scroll to RecipeCard on mobile
      setTimeout(() => {
        if (window.innerWidth < 1024 && recipeCardRef.current) {
          recipeCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('recipeGeneratorTitle', 'Recipe Generator')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('recipeGeneratorDesc', 'Create delicious recipes tailored to your ingredients, preferences, and dietary needs')}
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-800 text-sm">
              ❌ <strong>{t('error')}:</strong> {error}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <RecipeForm onSubmit={handleGenerateRecipe} isLoading={isLoading} language={i18n.language} />
          </div>
          
          <div className="order-1 lg:order-2" ref={recipeCardRef}>
            <RecipeCard recipe={currentRecipe} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

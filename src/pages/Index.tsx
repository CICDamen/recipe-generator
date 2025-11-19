import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RecipeForm from "@/components/RecipeForm";
import RecipeCard from "@/components/RecipeCard";
import { Recipe, RecipeFormData, RecipeResponse } from "@/types/recipe";
import { useRecipeStorage } from "@/hooks/use-recipe-storage";
import { Button } from "@/components/ui/button";
import { BookOpen, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

// Configuration for n8n endpoint using environment variables
const N8N_CONFIG = {
  endpoint: import.meta.env.VITE_N8N_ENDPOINT,
  username: import.meta.env.VITE_N8N_USERNAME,
  password: import.meta.env.VITE_N8N_PASSWORD
};

const Index = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { saveRecipe } = useRecipeStorage();
  const { toast } = useToast();
  const recipeCardRef = useRef<HTMLDivElement>(null);

  const handleGenerateRecipe = async (formData: RecipeFormData) => {
    setIsLoading(true);
    setRecipe(null);
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

      const data = await response.json();
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
      setRecipe(data.recipe);
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

  const handleSaveRecipe = () => {
    if (recipe) {
      saveRecipe(recipe, 'generated');
      toast({
        title: t('recipeSaved', 'Recipe Saved!'),
        description: t('recipeSavedDesc', 'Recipe has been added to your library'),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('recipeGeneratorTitle', 'Recipe Generator')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('recipeGeneratorDesc', 'Create delicious recipes tailored to your ingredients, preferences, and dietary needs')}
            </p>
          </div>
          <Button
            onClick={() => navigate('/library')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {t('myRecipes', 'My Recipes')}
          </Button>
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
            <div className="space-y-4">
              {recipe && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveRecipe}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {t('saveToLibrary', 'Save to Library')}
                  </Button>
                </div>
              )}
              <RecipeCard recipe={recipe} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

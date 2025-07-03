
import { useState } from "react";
import RecipeForm from "@/components/RecipeForm";
import RecipeCard from "@/components/RecipeCard";
import { Recipe, RecipeFormData } from "@/types/recipe";

const Index = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRecipe = async (formData: RecipeFormData) => {
    setIsLoading(true);
    setRecipe(null);

    try {
      // Simulate API call for now - replace with actual backend integration
      console.log("Recipe request data:", JSON.stringify(formData, null, 2));
      
      // Mock response - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecipe: Recipe = {
        title: "Mediterranean Pasta Salad",
        description: "A fresh and flavorful pasta salad perfect for any occasion",
        ingredients: [
          "1 lb penne pasta",
          "2 cups cherry tomatoes, halved",
          "1 cucumber, diced",
          "1/2 red onion, thinly sliced",
          "1/2 cup kalamata olives",
          "1/2 cup feta cheese, crumbled",
          "1/4 cup olive oil",
          "2 tbsp lemon juice",
          "2 cloves garlic, minced",
          "1 tsp dried oregano",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Cook pasta according to package directions. Drain and rinse with cold water.",
          "In a large bowl, combine pasta, tomatoes, cucumber, red onion, and olives.",
          "In a small bowl, whisk together olive oil, lemon juice, garlic, and oregano.",
          "Pour dressing over pasta mixture and toss to combine.",
          "Add feta cheese and gently fold in.",
          "Season with salt and pepper. Chill for at least 30 minutes before serving."
        ],
        prepTime: "15 minutes",
        cookTime: "15 minutes",
        servings: 6,
        cuisine: formData.cuisine_type,
        dietaryInfo: formData.dietary_restrictions
      };
      
      setRecipe(mockRecipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Recipe Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create delicious recipes tailored to your ingredients, preferences, and dietary needs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <RecipeForm onSubmit={handleGenerateRecipe} isLoading={isLoading} />
          </div>
          
          <div className="order-1 lg:order-2">
            <RecipeCard recipe={recipe} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

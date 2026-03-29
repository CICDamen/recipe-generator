import { Recipe } from "@/types/recipe";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChefHat, Clock, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const loadHistory = (): Recipe[] => {
  try {
    const stored = localStorage.getItem("recipeHistory");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const Recipes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const recipes = loadHistory();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('recentRecipes', 'Recent Recipes')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('recentRecipesDesc', 'Browse your last generated recipes and view them in full detail')}
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ChefHat className="h-20 w-20 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              {t('noRecipesYet', 'No recipes yet')}
            </h2>
            <p className="text-gray-500">
              {t('noRecipesYetDesc', 'Generate a recipe on the home page to see it here')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {recipes.map((recipe, index) => (
              <Card
                key={`${recipe.name}-${index}`}
                className="cursor-pointer bg-white/80 backdrop-blur-sm shadow-md border-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                onClick={() => navigate("/", { state: { recipeIndex: index } })}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-800 leading-tight">
                    {recipe.name}
                  </CardTitle>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                    {recipe.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                      {recipe.cuisine}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {recipe.totalTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {recipe.servings}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5" />
                      {recipe.nutrition?.calories}
                    </span>
                  </div>
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {recipe.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;

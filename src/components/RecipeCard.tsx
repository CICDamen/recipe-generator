
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, ChefHat } from "lucide-react";
import { Recipe } from "@/types/recipe";
import LoadingSpinner from "./LoadingSpinner";

interface RecipeCardProps {
  recipe: Recipe | null;
  isLoading: boolean;
}

const RecipeCard = ({ recipe, isLoading }: RecipeCardProps) => {
  if (isLoading) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
        <CardContent className="p-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (!recipe) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <ChefHat className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Your Recipe Will Appear Here
          </h3>
          <p className="text-gray-500">
            Fill out the form to generate a personalized recipe based on your preferences
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          {recipe.title}
        </CardTitle>
        <p className="text-gray-600">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {recipe.cuisine}
          </Badge>
          {recipe.dietaryInfo.map((info) => (
            <Badge key={info} variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {info}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Prep: {recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Cook: {recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Serves {recipe.servings}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-3">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span className="text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-3">Instructions</h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;

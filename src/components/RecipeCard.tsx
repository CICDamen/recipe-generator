import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, ChefHat, Star, Lightbulb, Activity, Timer } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface RecipeCardProps {
  recipe: Recipe | null;
  isLoading: boolean;
}

const RecipeCard = ({ recipe, isLoading }: RecipeCardProps) => {
  const { t } = useTranslation();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const handleCheck = (index: number) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <ChefHat className="mx-auto h-16 w-16 text-orange-400 animate-bounce mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {t('loading')}
          </h3>
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
            {t('recipeCardPlaceholderTitle', 'Your Recipe Will Appear Here')}
          </h3>
          <p className="text-gray-500">
            {t('recipeCardPlaceholderDesc', 'Fill out the form to generate a personalized recipe based on your preferences')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
          {recipe.name}
        </CardTitle>
        <p className="text-gray-600 text-lg leading-relaxed">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {recipe.cuisine}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {recipe.difficulty}
          </Badge>
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            <span>{t('prep', 'Prep')}: {recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{t('cook', 'Cook')}: {recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>{t('total', 'Total')}: {recipe.totalTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{t('serves', 'Serves')} {recipe.servings}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Ingredients Section */}
        <div>
          <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-500" />
            {t('ingredients', 'Ingredients')}
          </h3>
          <div className="grid gap-3">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={checkedIngredients.has(index)}
                  onChange={() => handleCheck(index)}
                  className="mt-1 accent-orange-500 h-5 w-5"
                  aria-label={`Check ${ingredient.item}`}
                />
                <div className={`flex-1 ${checkedIngredients.has(index) ? 'line-through text-gray-400' : ''}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-gray-800">{ingredient.item}</span>
                    <span className="text-orange-600 font-semibold">{ingredient.amount}</span>
                  </div>
                  {ingredient.notes && (
                    <p className="text-sm text-gray-600 mt-1 italic">{ingredient.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Instructions Section */}
        <div>
          <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-500" />
            {t('instructions', 'Instructions')}
          </h3>
          <div className="space-y-4">
            {recipe.instructions.map((instruction) => (
              <div key={instruction.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {instruction.step}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed mb-2">{instruction.instruction}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {instruction.time}
                    </span>
                    {instruction.temperature && (
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {instruction.temperature}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Nutrition Section */}
        <div>
          <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            {t('nutrition', 'Nutrition')}
          </h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-lg font-semibold text-green-800 mb-3">
              {recipe.nutrition.calories}
            </p>
            <ul className="space-y-1">
              {recipe.nutrition.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Tips Section */}
        <div>
          <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            {t('tips', "Chef's Tips")}
          </h3>
          <div className="space-y-3">
            {recipe.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;

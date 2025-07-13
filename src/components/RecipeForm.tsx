import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ChefHat } from "lucide-react";
import { RecipeFormData } from "@/types/recipe";
import { useTranslation } from 'react-i18next';

interface RecipeFormProps {
  onSubmit: (data: RecipeFormData) => void;
  isLoading: boolean;
  language: string;
}

const RecipeForm = ({ onSubmit, isLoading, language }: RecipeFormProps) => {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState("");
  const [mealType, setMealType] = useState("");
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [remarks, setRemarks] = useState("");

  const cuisineOptions = [
    t('italian', 'Italian'), t('mexican', 'Mexican'), t('dutch', 'Dutch'), t('asian', 'Asian'), t('mediterranean', 'Mediterranean'), t('american', 'American'), t('indian', 'Indian'),
    t('french', 'French'), t('thai', 'Thai'), t('japanese', 'Japanese'), t('chinese', 'Chinese'), t('greek', 'Greek'), t('spanish', 'Spanish'), t('middleEastern', 'Middle Eastern')
  ];

  const dietaryOptions = [
    t('vegetarian', 'Vegetarian'), t('vegan', 'Vegan'), t('glutenFree', 'Gluten-Free'), t('dairyFree', 'Dairy-Free'), t('keto', 'Keto'), t('paleo', 'Paleo'),
    t('lowCarb', 'Low-Carb'), t('highProtein', 'High-Protein'), t('nutFree', 'Nut-Free'), t('diabeticFriendly', 'Diabetic-Friendly')
  ];

  const cookingTimeOptions = [
    t('under15', 'Under 15 minutes'), t('15to30', '15-30 minutes'), t('30to45', '30-45 minutes'), t('45to60', '45-60 minutes'), t('over1h', 'Over 1 hour')
  ];

  const mealTypeOptions = [
    t('breakfast', 'Breakfast'), t('lunch', 'Lunch'), t('dinner', 'Dinner'), t('snack', 'Snack'), t('dessert', 'Dessert'), t('appetizer', 'Appetizer'), t('brunch', 'Brunch')
  ];

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleDietaryChange = (restriction: string, checked: boolean) => {
    if (checked) {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    } else {
      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ingredients.length === 0 || !cuisineType || !cookingTime || !mealType) {
      return;
    }

    const formData: RecipeFormData = {
      ingredients: ingredients.join(", "),
      cuisineType: cuisineType,
      dietaryRestrictions: dietaryRestrictions.join(", ") || "none",
      cookingTime: cookingTime,
      mealType: mealType,
      numberOfPersons: numberOfPersons,
      remarks: remarks,
    };

    onSubmit(formData);
  };

  const handleIngredientKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <ChefHat className="text-orange-500" />
          {t('generate')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredients */}
          <div className="space-y-3">
            <Label htmlFor="ingredients" className="text-sm font-semibold text-gray-700">
              {t('recipePlaceholder')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="ingredients"
                placeholder={t('recipePlaceholder')}
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleIngredientKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addIngredient}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                >
                  {ingredient}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-1 h-4 w-4 p-0 hover:bg-orange-300"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Cuisine Type */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">{t('cuisineType', 'Cuisine Type')}</Label>
            <Select value={cuisineType} onValueChange={setCuisineType}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectCuisineType', 'Select cuisine type')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {cuisineOptions.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">{t('dietaryRestrictions', 'Dietary Restrictions')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={dietaryRestrictions.includes(option)}
                    onCheckedChange={(checked) => handleDietaryChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option} className="text-sm text-gray-600">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">{t('cookingTime', 'Cooking Time')}</Label>
            <Select value={cookingTime} onValueChange={setCookingTime}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectCookingTime', 'Select cooking time')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {cookingTimeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meal Type */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">{t('mealType', 'Meal Type')}</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectMealType', 'Select meal type')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {mealTypeOptions.map((meal) => (
                  <SelectItem key={meal} value={meal}>
                    {meal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Persons */}
          <div className="space-y-2">
            <Label htmlFor="numberOfPersons" className="text-sm font-semibold text-gray-700">{t('numberOfPersons', 'Number of Persons')}</Label>
            <Input
              id="numberOfPersons"
              type="number"
              min={1}
              max={20}
              value={numberOfPersons}
              onChange={e => setNumberOfPersons(Number(e.target.value))}
              className="w-32"
            />
          </div>

          {/* Additional Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="text-sm font-semibold text-gray-700">{t('remarks', 'Additional Remarks')}</Label>
            <textarea
              id="remarks"
              maxLength={200 * 6} // ~200 words (assuming avg 6 chars/word)
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full min-h-[80px] p-2 border border-gray-300 rounded-md"
              placeholder={t('remarksPlaceholder', 'Any extra info, allergies, preferences, etc. (max 200 words)')}
            />
            <div className="text-xs text-gray-500 text-right">{remarks.trim().split(/\s+/).filter(Boolean).length} / 200 {t('words', 'words')}</div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02]"
            disabled={isLoading || ingredients.length === 0 || !cuisineType || !cookingTime || !mealType}
          >
            {isLoading ? t('loading') : t('generate')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;

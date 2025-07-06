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

interface RecipeFormProps {
  onSubmit: (data: RecipeFormData) => void;
  isLoading: boolean;
}

const RecipeForm = ({ onSubmit, isLoading }: RecipeFormProps) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState("");
  const [mealType, setMealType] = useState("");

  const cuisineOptions = [
    "Italian", "Mexican", "Asian", "Mediterranean", "American", "Indian", 
    "French", "Thai", "Japanese", "Chinese", "Greek", "Spanish", "Middle Eastern"
  ];

  const dietaryOptions = [
    "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", 
    "Low-Carb", "High-Protein", "Nut-Free", "Diabetic-Friendly"
  ];

  const cookingTimeOptions = [
    "Under 15 minutes", "15-30 minutes", "30-45 minutes", "45-60 minutes", "Over 1 hour"
  ];

  const mealTypeOptions = [
    "Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Appetizer", "Brunch"
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
      mealType: mealType
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
          Recipe Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredients */}
          <div className="space-y-3">
            <Label htmlFor="ingredients" className="text-sm font-semibold text-gray-700">
              Ingredients
            </Label>
            <div className="flex gap-2">
              <Input
                id="ingredients"
                placeholder="Enter an ingredient..."
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
            <Label className="text-sm font-semibold text-gray-700">Cuisine Type</Label>
            <Select value={cuisineType} onValueChange={setCuisineType}>
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine type" />
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
            <Label className="text-sm font-semibold text-gray-700">Dietary Restrictions</Label>
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
            <Label className="text-sm font-semibold text-gray-700">Cooking Time</Label>
            <Select value={cookingTime} onValueChange={setCookingTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select cooking time" />
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
            <Label className="text-sm font-semibold text-gray-700">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
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

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02]"
            disabled={isLoading || ingredients.length === 0 || !cuisineType || !cookingTime || !mealType}
          >
            {isLoading ? "Generating Recipe..." : "Generate Recipe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;

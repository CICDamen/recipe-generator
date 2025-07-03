
export interface RecipeFormData {
  ingredients: string[];
  cuisine_type: string;
  dietary_restrictions: string[];
  cooking_time: string;
  meal_type: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  cuisine: string;
  dietaryInfo: string[];
}

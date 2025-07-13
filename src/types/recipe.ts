export interface RecipeFormData {
  ingredients: string;
  cuisineType: string;
  dietaryRestrictions: string;
  cookingTime: string;
  mealType: string;
  numberOfPersons: number;
  remarks: string;
}

export interface Ingredient {
  item: string;
  amount: string;
  notes?: string;
}

export interface Instruction {
  step: number;
  instruction: string;
  time: string;
  temperature?: string;
}

export interface Nutrition {
  calories: string;
  highlights: string[];
}

export interface Recipe {
  name: string;
  description: string;
  cuisine: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutrition: Nutrition;
  tips: string[];
  tags: string[];
}

export interface RecipeResponse {
  recipe: Recipe;
  success: boolean;
  timestamp: string;
}

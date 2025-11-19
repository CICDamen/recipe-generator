import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';

export interface SavedRecipe extends Recipe {
  id: string;
  savedAt: string;
  source: 'generated' | 'manual';
}

const STORAGE_KEY = 'saved-recipes';

export const useRecipeStorage = () => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecipes(parsed);
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  const saveRecipe = (recipe: Recipe, source: 'generated' | 'manual' = 'generated'): SavedRecipe => {
    const savedRecipe: SavedRecipe = {
      ...recipe,
      id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString(),
      source,
    };

    const updated = [savedRecipe, ...recipes];
    setRecipes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return savedRecipe;
  };

  const deleteRecipe = (id: string) => {
    const updated = recipes.filter(r => r.id !== id);
    setRecipes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateRecipe = (id: string, updatedRecipe: Recipe) => {
    const updated = recipes.map(r => 
      r.id === id 
        ? { ...updatedRecipe, id: r.id, savedAt: r.savedAt, source: r.source }
        : r
    );
    setRecipes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getRecipe = (id: string): SavedRecipe | undefined => {
    return recipes.find(r => r.id === id);
  };

  return {
    recipes,
    saveRecipe,
    deleteRecipe,
    updateRecipe,
    getRecipe,
    loadRecipes,
  };
};

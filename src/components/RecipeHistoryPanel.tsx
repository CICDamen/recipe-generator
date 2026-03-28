import { Recipe } from "@/types/recipe";
import { useTranslation } from 'react-i18next';
import { ChefHat, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeHistoryPanelProps {
  recipes: Recipe[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onNewRecipe: () => void;
}

const RecipeHistoryPanel = ({ recipes, selectedIndex, onSelect, onNewRecipe }: RecipeHistoryPanelProps) => {
  const { t } = useTranslation();

  if (recipes.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 flex items-center gap-1">
          <ChefHat className="h-4 w-4" />
          {t('recentRecipes', 'Recent Recipes')}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onNewRecipe}
          className="text-orange-600 border-orange-300 hover:bg-orange-50"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          {t('newRecipe', 'New Recipe')}
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {recipes.map((recipe, index) => (
          <button
            key={`${recipe.name}-${recipe.cuisine}`}
            onClick={() => onSelect(index)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-left text-sm border transition-all ${
              index === selectedIndex
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            <div className="font-medium truncate max-w-[120px]">{recipe.name}</div>
            <div className={`text-xs truncate max-w-[120px] ${index === selectedIndex ? 'text-orange-100' : 'text-gray-500'}`}>
              {recipe.cuisine}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipeHistoryPanel;

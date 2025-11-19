import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { Recipe, Ingredient, Instruction } from "@/types/recipe";
import { useTranslation } from 'react-i18next';

interface ManualRecipeFormProps {
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const ManualRecipeForm = ({ onSave, onCancel }: ManualRecipeFormProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [servings, setServings] = useState(4);
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState({ item: "", amount: "", notes: "" });
  
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState({ instruction: "", time: "", temperature: "" });
  
  const [nutritionCalories, setNutritionCalories] = useState("");
  const [nutritionHighlights, setNutritionHighlights] = useState<string[]>([]);
  const [currentHighlight, setCurrentHighlight] = useState("");
  
  const [tips, setTips] = useState<string[]>([]);
  const [currentTip, setCurrentTip] = useState("");
  
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const cuisineOptions = [
    'Italian', 'Mexican', 'Dutch', 'Asian', 'Mediterranean', 'American', 'Indian',
    'French', 'Thai', 'Japanese', 'Chinese', 'Greek', 'Spanish', 'Middle Eastern'
  ];

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const addIngredient = () => {
    if (currentIngredient.item && currentIngredient.amount) {
      setIngredients([...ingredients, { ...currentIngredient }]);
      setCurrentIngredient({ item: "", amount: "", notes: "" });
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    if (currentInstruction.instruction) {
      setInstructions([
        ...instructions, 
        { 
          step: instructions.length + 1, 
          ...currentInstruction 
        }
      ]);
      setCurrentInstruction({ instruction: "", time: "", temperature: "" });
    }
  };

  const removeInstruction = (index: number) => {
    const updated = instructions.filter((_, i) => i !== index);
    // Renumber steps
    const renumbered = updated.map((inst, i) => ({ ...inst, step: i + 1 }));
    setInstructions(renumbered);
  };

  const addHighlight = () => {
    if (currentHighlight.trim()) {
      setNutritionHighlights([...nutritionHighlights, currentHighlight.trim()]);
      setCurrentHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setNutritionHighlights(nutritionHighlights.filter((_, i) => i !== index));
  };

  const addTip = () => {
    if (currentTip.trim()) {
      setTips([...tips, currentTip.trim()]);
      setCurrentTip("");
    }
  };

  const removeTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !cuisine || !difficulty || ingredients.length === 0 || instructions.length === 0) {
      alert(t('fillRequiredFields', 'Please fill all required fields'));
      return;
    }

    const recipe: Recipe = {
      name,
      description,
      cuisine,
      difficulty,
      prepTime: prepTime || "0 minutes",
      cookTime: cookTime || "0 minutes",
      totalTime: totalTime || "0 minutes",
      servings,
      ingredients,
      instructions,
      nutrition: {
        calories: nutritionCalories || "Not specified",
        highlights: nutritionHighlights,
      },
      tips,
      tags,
    };

    onSave(recipe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">{t('recipeName', 'Recipe Name')} *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('recipeNamePlaceholder', 'Enter recipe name')}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">{t('description', 'Description')}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('descriptionPlaceholder', 'Brief description of the recipe')}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cuisine">{t('cuisine', 'Cuisine')} *</Label>
            <Select value={cuisine} onValueChange={setCuisine} required>
              <SelectTrigger>
                <SelectValue placeholder={t('selectCuisine', 'Select cuisine')} />
              </SelectTrigger>
              <SelectContent>
                {cuisineOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">{t('difficulty', 'Difficulty')} *</Label>
            <Select value={difficulty} onValueChange={setDifficulty} required>
              <SelectTrigger>
                <SelectValue placeholder={t('selectDifficulty', 'Select difficulty')} />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label htmlFor="prepTime">{t('prepTime', 'Prep Time')}</Label>
            <Input
              id="prepTime"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="15 min"
            />
          </div>
          <div>
            <Label htmlFor="cookTime">{t('cookTime', 'Cook Time')}</Label>
            <Input
              id="cookTime"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              placeholder="30 min"
            />
          </div>
          <div>
            <Label htmlFor="totalTime">{t('totalTime', 'Total Time')}</Label>
            <Input
              id="totalTime"
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
              placeholder="45 min"
            />
          </div>
          <div>
            <Label htmlFor="servings">{t('servings', 'Servings')}</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">{t('ingredients', 'Ingredients')} *</Label>
        <div className="grid grid-cols-12 gap-2">
          <Input
            className="col-span-5"
            value={currentIngredient.item}
            onChange={(e) => setCurrentIngredient({ ...currentIngredient, item: e.target.value })}
            placeholder={t('ingredientItem', 'Item (e.g., flour)')}
          />
          <Input
            className="col-span-3"
            value={currentIngredient.amount}
            onChange={(e) => setCurrentIngredient({ ...currentIngredient, amount: e.target.value })}
            placeholder={t('amount', 'Amount')}
          />
          <Input
            className="col-span-3"
            value={currentIngredient.notes}
            onChange={(e) => setCurrentIngredient({ ...currentIngredient, notes: e.target.value })}
            placeholder={t('notes', 'Notes (optional)')}
          />
          <Button type="button" onClick={addIngredient} className="col-span-1">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {ingredients.map((ing, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">
                <strong>{ing.item}</strong> - {ing.amount}
                {ing.notes && <em className="text-gray-600 ml-2">({ing.notes})</em>}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeIngredient(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">{t('instructions', 'Instructions')} *</Label>
        <div className="space-y-2">
          <Textarea
            value={currentInstruction.instruction}
            onChange={(e) => setCurrentInstruction({ ...currentInstruction, instruction: e.target.value })}
            placeholder={t('instructionText', 'Instruction text')}
            rows={2}
          />
          <div className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-5"
              value={currentInstruction.time}
              onChange={(e) => setCurrentInstruction({ ...currentInstruction, time: e.target.value })}
              placeholder={t('time', 'Time (e.g., 5 min)')}
            />
            <Input
              className="col-span-5"
              value={currentInstruction.temperature}
              onChange={(e) => setCurrentInstruction({ ...currentInstruction, temperature: e.target.value })}
              placeholder={t('temperature', 'Temperature (optional)')}
            />
            <Button type="button" onClick={addInstruction} className="col-span-2">
              <Plus className="h-4 w-4 mr-1" /> {t('add', 'Add')}
            </Button>
          </div>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {instructions.map((inst, index) => (
            <div key={index} className="flex items-start justify-between bg-gray-50 p-3 rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-orange-600">Step {inst.step}</span>
                  <span className="text-xs text-gray-500">{inst.time}</span>
                  {inst.temperature && <span className="text-xs text-gray-500">• {inst.temperature}</span>}
                </div>
                <p className="text-sm">{inst.instruction}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeInstruction(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">{t('nutrition', 'Nutrition')}</Label>
        <Input
          value={nutritionCalories}
          onChange={(e) => setNutritionCalories(e.target.value)}
          placeholder={t('caloriesPlaceholder', 'Calories (e.g., 450 per serving)')}
        />
        <div className="grid grid-cols-12 gap-2">
          <Input
            className="col-span-10"
            value={currentHighlight}
            onChange={(e) => setCurrentHighlight(e.target.value)}
            placeholder={t('nutritionHighlight', 'Nutrition highlight')}
          />
          <Button type="button" onClick={addHighlight} className="col-span-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {nutritionHighlights.map((highlight, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">{highlight}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeHighlight(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">{t('tips', "Chef's Tips")}</Label>
        <div className="grid grid-cols-12 gap-2">
          <Input
            className="col-span-10"
            value={currentTip}
            onChange={(e) => setCurrentTip(e.target.value)}
            placeholder={t('tipPlaceholder', 'Add a cooking tip')}
          />
          <Button type="button" onClick={addTip} className="col-span-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">{tip}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTip(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">{t('tags', 'Tags')}</Label>
        <div className="grid grid-cols-12 gap-2">
          <Input
            className="col-span-10"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder={t('tagPlaceholder', 'Add a tag (e.g., quick, healthy)')}
          />
          <Button type="button" onClick={addTag} className="col-span-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-green-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          {t('saveRecipe', 'Save Recipe')}
        </Button>
      </div>
    </form>
  );
};

export default ManualRecipeForm;

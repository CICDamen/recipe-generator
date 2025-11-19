import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipeStorage, SavedRecipe } from "@/hooks/use-recipe-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChefHat, Plus, Search, Trash2, Eye, ArrowLeft, Clock, Users } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import ManualRecipeForm from "@/components/ManualRecipeForm";
import { useTranslation } from 'react-i18next';

const RecipeLibrary = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recipes, saveRecipe, deleteRecipe } = useRecipeStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [viewRecipeDialogOpen, setViewRecipeDialogOpen] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const searchLower = searchTerm.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(searchLower) ||
      recipe.description.toLowerCase().includes(searchLower) ||
      recipe.cuisine.toLowerCase().includes(searchLower) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleManualRecipeSave = (recipe: any) => {
    saveRecipe(recipe, 'manual');
    setIsManualFormOpen(false);
  };

  const handleViewRecipe = (recipe: SavedRecipe) => {
    setSelectedRecipe(recipe);
    setViewRecipeDialogOpen(true);
  };

  const handleDeleteRecipe = (id: string) => {
    deleteRecipe(id);
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null);
      setViewRecipeDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToGenerator', 'Back to Generator')}
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                {t('recipeLibrary', 'Recipe Library')}
              </h1>
              <p className="text-gray-600 mt-2">
                {t('recipeLibraryDesc', 'Your saved recipes collection')}
              </p>
            </div>
          </div>

          <Dialog open={isManualFormOpen} onOpenChange={setIsManualFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4" />
                {t('addManualRecipe', 'Add Recipe Manually')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <ChefHat className="text-orange-500" />
                  {t('addNewRecipe', 'Add New Recipe')}
                </DialogTitle>
              </DialogHeader>
              <ManualRecipeForm onSave={handleManualRecipeSave} onCancel={() => setIsManualFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('searchRecipes', 'Search recipes by name, cuisine, or tags...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Recipe Count */}
        <div className="mb-4 text-gray-600">
          {t('totalRecipes', 'Total recipes')}: <strong>{filteredRecipes.length}</strong>
          {searchTerm && ` (${t('filtered', 'filtered from')} ${recipes.length})`}
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-12 text-center">
              <ChefHat className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm 
                  ? t('noRecipesFound', 'No recipes found') 
                  : t('noSavedRecipes', 'No saved recipes yet')}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? t('tryDifferentSearch', 'Try a different search term') 
                  : t('startAddingRecipes', 'Start by generating a recipe or adding one manually')}
              </p>
              {!searchTerm && (
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600">
                    {t('generateRecipe', 'Generate Recipe')}
                  </Button>
                  <Button onClick={() => setIsManualFormOpen(true)} variant="outline">
                    {t('addManually', 'Add Manually')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2">
                    {recipe.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {recipe.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {recipe.cuisine}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {recipe.difficulty}
                    </Badge>
                    {recipe.source === 'manual' && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {t('manual', 'Manual')}
                      </Badge>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.totalTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleViewRecipe(recipe)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t('view', 'View')}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('deleteRecipe', 'Delete Recipe?')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('deleteRecipeConfirm', 'Are you sure you want to delete this recipe? This action cannot be undone.')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel', 'Cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteRecipe(recipe.id)}>
                            {t('delete', 'Delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Saved Date */}
                  <p className="text-xs text-gray-400 mt-2">
                    {t('saved', 'Saved')}: {new Date(recipe.savedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View Recipe Dialog */}
        <Dialog open={viewRecipeDialogOpen} onOpenChange={setViewRecipeDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="sr-only">{t('recipeDetails', 'Recipe Details')}</DialogTitle>
            </DialogHeader>
            {selectedRecipe && <RecipeCard recipe={selectedRecipe} isLoading={false} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RecipeLibrary;

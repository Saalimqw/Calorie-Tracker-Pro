'use client';

import { useState, useEffect } from 'react';
import { MealEntry, DailyLog } from '@/types/calorie-tracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Utensils, Trash2, Search, X, Sparkles, Globe, AlertCircle, Star, Save } from 'lucide-react';
import { format } from 'date-fns';
import { searchFoods, getFoodCategories, getCuisines, FoodItem, getCustomFoods, saveCustomFood, deleteCustomFood } from '@/lib/food-database';

interface CalorieTrackerProps {
  selectedDate: string;
  onDataUpdate?: () => void;
}

export default function CalorieTracker({ selectedDate, onDataUpdate }: CalorieTrackerProps) {
  const [profileComplete, setProfileComplete] = useState(false);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [showSearch, setShowSearch] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [saveAsCustom, setSaveAsCustom] = useState(false);
  const [newMeal, setNewMeal] = useState({
    mealType: 'breakfast' as MealEntry['mealType'],
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '1',
    servingUnit: 'serving',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const isValid = !!(
          profile &&
          profile.age > 0 &&
          profile.weight > 0 &&
          profile.height > 0 &&
          profile.gender &&
          profile.activityLevel &&
          profile.goalType
        );
        setProfileComplete(isValid);
      }
      
      // Load custom foods
      if (typeof window !== 'undefined') {
        setCustomFoods(getCustomFoods());
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [mounted]);

  useEffect(() => {
    if (profileComplete && mounted) {
      loadMeals();
    }
  }, [selectedDate, profileComplete, mounted]);

  useEffect(() => {
    if (showAddMeal && showSearch && profileComplete && mounted) {
      const results = searchFoods(searchQuery, selectedCategory, selectedCuisine);
      setSearchResults(results);
    }
  }, [searchQuery, selectedCategory, selectedCuisine, showAddMeal, showSearch, profileComplete, mounted, customFoods]);

  // Refresh custom foods and search when dialog opens
  useEffect(() => {
    if (showAddMeal && profileComplete && mounted) {
      const latestCustomFoods = getCustomFoods();
      setCustomFoods(latestCustomFoods);
      const results = searchFoods(searchQuery, selectedCategory, selectedCuisine);
      setSearchResults(results);
    }
  }, [showAddMeal, profileComplete, mounted]);

  if (!mounted) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profileComplete) {
    return (
      <Card className="w-full shadow-lg border-2 border-red-100 dark:border-red-900/30">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Profile Required</h3>
            <p className="text-muted-foreground">
              Please complete your user profile to access the Meal Logger.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const loadMeals = () => {
    if (typeof window === 'undefined') return;

    try {
      const logs = JSON.parse(localStorage.getItem('calorieTrackerLogs') || '{}');
      const dailyLog: DailyLog = logs[selectedDate] || { date: selectedDate, meals: [], waterIntake: 0, totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
      setMeals(dailyLog.meals);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const saveMeals = (updatedMeals: MealEntry[]) => {
    if (typeof window === 'undefined') return;

    try {
      const logs = JSON.parse(localStorage.getItem('calorieTrackerLogs') || '{}');
      
      const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = updatedMeals.reduce((sum, meal) => sum + meal.protein, 0);
      const totalCarbs = updatedMeals.reduce((sum, meal) => sum + meal.carbs, 0);
      const totalFat = updatedMeals.reduce((sum, meal) => sum + meal.fat, 0);
      
      logs[selectedDate] = {
        date: selectedDate,
        meals: updatedMeals,
        waterIntake: logs[selectedDate]?.waterIntake || 0,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      };
      
      localStorage.setItem('calorieTrackerLogs', JSON.stringify(logs));
      setMeals(updatedMeals);
      onDataUpdate?.();
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  };

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories) return;

    // Save as custom food if checkbox is checked
    if (saveAsCustom && newMeal.name && newMeal.calories) {
      try {
        saveCustomFood({
          name: newMeal.name,
          category: 'Custom Foods',
          calories: parseFloat(newMeal.calories),
          protein: parseFloat(newMeal.protein || '0'),
          carbs: parseFloat(newMeal.carbs || '0'),
          fat: parseFloat(newMeal.fat || '0'),
          servingSize: `${newMeal.servingSize} ${newMeal.servingUnit}`,
        });
        // Refresh custom foods state immediately
        const updatedCustomFoods = getCustomFoods();
        setCustomFoods(updatedCustomFoods);
        // Force search refresh with updated custom foods
        const results = searchFoods(searchQuery, selectedCategory, selectedCuisine);
        setSearchResults(results);
      } catch (error) {
        console.error('Error saving custom food:', error);
      }
    }

    const meal: MealEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      mealType: newMeal.mealType,
      name: newMeal.name,
      calories: parseFloat(newMeal.calories),
      protein: parseFloat(newMeal.protein || '0'),
      carbs: parseFloat(newMeal.carbs || '0'),
      fat: parseFloat(newMeal.fat || '0'),
      timestamp: Date.now(),
    };

    const updatedMeals = [...meals, meal];
    saveMeals(updatedMeals);
    
    setNewMeal({
      mealType: 'breakfast',
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      servingSize: '1',
      servingUnit: 'serving',
    });
    setSaveAsCustom(false);
    setShowAddMeal(false);
    setShowSearch(true);
    setSearchQuery('');
  };

  const deleteMeal = (id: string) => {
    const updatedMeals = meals.filter(meal => meal.id !== id);
    saveMeals(updatedMeals);
  };
  
  const handleDeleteCustomFood = (foodId: string) => {
    if (confirm('Delete this food from your personal database?')) {
      deleteCustomFood(foodId);
      const updatedCustomFoods = getCustomFoods();
      setCustomFoods(updatedCustomFoods);
      // Refresh search results
      const results = searchFoods(searchQuery, selectedCategory, selectedCuisine);
      setSearchResults(results);
    }
  };

  const getMealsByType = (type: MealEntry['mealType']) => {
    return meals.filter(meal => meal.mealType === type);
  };

  const getTotalCalories = () => {
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const selectFood = (food: FoodItem) => {
    setNewMeal({
      ...newMeal,
      name: food.name + (food.brand ? ` (${food.brand})` : ''),
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString(),
    });
    setShowSearch(false);
  };

  const mealTypes: Array<{ value: MealEntry['mealType']; label: string; icon: string }> = [
    { value: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { value: 'lunch', label: 'Lunch', icon: '🍱' },
    { value: 'dinner', label: 'Dinner', icon: '🍽️' },
    { value: 'snacks', label: 'Snacks', icon: '🍿' },
  ];

  const categories = ['all', ...getFoodCategories()];
  const cuisines = ['all', ...getCuisines()];

  return (
    <Card className="w-full shadow-lg border-2 border-purple-100/50 dark:border-purple-900/30">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
        <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
          <Utensils className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Meal Logger
        </CardTitle>
        <CardDescription>
          Log your meals for {formatDate(selectedDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Calories */}
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="text-sm font-medium opacity-90">Total Calories Today</div>
          <div className="text-4xl font-bold mt-1">{getTotalCalories()} kcal</div>
          <div className="mt-2 flex items-center gap-1 text-sm opacity-80">
            <Sparkles className="h-3 w-3" />
            Track your nutrition journey
          </div>
        </div>

        {/* Meal Sections */}
        <div className="space-y-4">
          {mealTypes.map(({ value, label, icon }) => (
            <div key={value} className="border-2 border-purple-100 dark:border-purple-900/30 rounded-xl p-4 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-900 dark:text-purple-100">
                <span className="text-2xl">{icon}</span>
                {label}
              </h3>
              <div className="space-y-2">
                {getMealsByType(value).map(meal => (
                  <div key={meal.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-purple-100/50 dark:border-purple-900/30">
                    <div>
                      <div className="font-medium text-purple-900 dark:text-purple-100">{meal.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">{meal.calories} kcal</span> • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMeal(meal.id)}
                      className="hover:bg-red-100 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {getMealsByType(value).length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-2">No meals logged</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Meal Button */}
        {!showAddMeal && (
          <Button 
            onClick={(e) => {
              e.preventDefault();
              setShowAddMeal(true);
            }} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Meal
          </Button>
        )}

        {/* Add Meal Form */}
        {showAddMeal && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
            className="border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 space-y-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">Add New Meal</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAddMeal(false);
                  setShowSearch(true);
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCuisine('all');
                  setSaveAsCustom(false);
                  setNewMeal({
                    mealType: 'breakfast',
                    name: '',
                    calories: '',
                    protein: '',
                    carbs: '',
                    fat: '',
                    servingSize: '1',
                    servingUnit: 'serving',
                  });
                }}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select value={newMeal.mealType} onValueChange={(value) => setNewMeal({ ...newMeal, mealType: value as MealEntry['mealType'] })}>
                <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
                  <SelectItem value="lunch">🍱 Lunch</SelectItem>
                  <SelectItem value="dinner">🍽️ Dinner</SelectItem>
                  <SelectItem value="snacks">🍿 Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Food Database Search */}
            {showSearch && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-purple-900 dark:text-purple-100">Search 2000+ Foods + Your Custom Foods</Label>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Search foods (e.g., biryani, sushi, tacos, pasta)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className="w-full bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
                        <SelectValue placeholder="Cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">🌍 All Cuisines</SelectItem>
                        {cuisines.filter(c => c !== 'all').map(cuisine => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine === 'Indian' && '🇮🇳 '}
                            {cuisine === 'Chinese' && '🇨🇳 '}
                            {cuisine === 'Mexican' && '🇲🇽 '}
                            {cuisine === 'Spanish' && '🇪🇸 '}
                            {cuisine === 'Japanese' && '🇯🇵 '}
                            {cuisine === 'Thai' && '🇹🇭 '}
                            {cuisine === 'Italian' && '🇮🇹 '}
                            {cuisine === 'Korean' && '🇰🇷 '}
                            {cuisine === 'Vietnamese' && '🇻🇳 '}
                            {cuisine === 'Middle Eastern' && '🌍 '}
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.filter(c => c !== 'all').map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Results */}
                <div className="max-h-64 overflow-y-auto space-y-1 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-2">
                  {searchResults.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No foods found. Try a different search.</p>
                  )}
                  {searchResults.map(food => (
                    <div key={food.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          selectFood(food);
                        }}
                        className="flex-1 text-left p-3 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors border border-transparent hover:border-purple-300 dark:hover:border-purple-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-purple-900 dark:text-purple-100">
                            {food.isCustom && <Star className="inline h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />}
                            {food.name} {food.brand && <span className="text-xs text-muted-foreground">({food.brand})</span>}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {food.isCustom && <span className="font-medium text-yellow-600 dark:text-yellow-400">Your Food • </span>}
                          {food.cuisine && <span className="font-medium text-purple-600 dark:text-purple-400">{food.cuisine} • </span>}
                          {food.category} • {food.servingSize}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-semibold text-purple-600 dark:text-purple-400">{food.calories} kcal</span>
                          <span className="text-muted-foreground"> • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g</span>
                        </div>
                      </button>
                      {food.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteCustomFood(food.id);
                          }}
                          className="hover:bg-red-100 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSearch(false);
                  }}
                  className="w-full border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                >
                  Or Enter Manually
                </Button>
              </div>
            )}

            {/* Manual Entry Form */}
            {!showSearch && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Manual Entry</Label>
                  <Button
                    variant="link"
                    size="sm"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSearch(true);
                    }}
                    className="text-purple-600 dark:text-purple-400"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Search Database
                  </Button>
                </div>

                {/* Save to Personal Database Checkbox */}
                <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                  <input
                    type="checkbox"
                    id="saveAsCustom"
                    checked={saveAsCustom}
                    onChange={(e) => setSaveAsCustom(e.target.checked)}
                    className="h-4 w-4 rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <label htmlFor="saveAsCustom" className="text-sm font-medium text-yellow-900 dark:text-yellow-100 cursor-pointer flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    Save to My Personal Foods (will appear in future searches)
                  </label>
                </div>

                <div className="space-y-2">
                  <Label>Food Name</Label>
                  <Input
                    placeholder="e.g., Grilled Chicken"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800"
                  />
                </div>

                {/* Serving Size Section */}
                <div className="space-y-2">
                  <Label>Serving Size</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="1"
                      value={newMeal.servingSize}
                      onChange={(e) => setNewMeal({ ...newMeal, servingSize: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800"
                      min="0"
                      step="0.1"
                    />
                    <Select value={newMeal.servingUnit} onValueChange={(value) => setNewMeal({ ...newMeal, servingUnit: value })}>
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">piece</SelectItem>
                        <SelectItem value="bowl">bowl</SelectItem>
                        <SelectItem value="serving">serving</SelectItem>
                        <SelectItem value="cup">cup</SelectItem>
                        <SelectItem value="glass">glass</SelectItem>
                        <SelectItem value="100g">100g</SelectItem>
                        <SelectItem value="100ml">100ml</SelectItem>
                        <SelectItem value="scoop">scoop</SelectItem>
                        <SelectItem value="slice">slice</SelectItem>
                        <SelectItem value="bar">bar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Calories (kcal) *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fat (g)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newMeal.fat}
                      onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addMeal();
                }} 
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                type="button"
              >
                Add Meal
              </Button>
              <Button 
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAddMeal(false);
                  setShowSearch(true);
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCuisine('all');
                  setSaveAsCustom(false);
                }} 
                className="flex-1 border-purple-300 dark:border-purple-700"
                type="button"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
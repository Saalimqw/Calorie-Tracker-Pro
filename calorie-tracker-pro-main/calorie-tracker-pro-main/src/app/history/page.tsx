'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MealEntry, DailyLog } from '@/types/calorie-tracker';
import { format } from 'date-fns';
import { Calendar, Search, Trash2, ArrowLeft, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function HistoryPage() {
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMealType, setFilterMealType] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const storedLogs = JSON.parse(localStorage.getItem('calorieTrackerLogs') || '{}');
    setLogs(storedLogs);
  };

  const deleteMeal = (date: string, mealId: string) => {
    const updatedLogs = { ...logs };
    const dayLog = updatedLogs[date];
    
    if (dayLog) {
      dayLog.meals = dayLog.meals.filter(meal => meal.id !== mealId);
      
      // Recalculate totals
      dayLog.totalCalories = dayLog.meals.reduce((sum, meal) => sum + meal.calories, 0);
      dayLog.totalProtein = dayLog.meals.reduce((sum, meal) => sum + meal.protein, 0);
      dayLog.totalCarbs = dayLog.meals.reduce((sum, meal) => sum + meal.carbs, 0);
      dayLog.totalFat = dayLog.meals.reduce((sum, meal) => sum + meal.fat, 0);
      
      if (dayLog.meals.length === 0) {
        delete updatedLogs[date];
      }
      
      localStorage.setItem('calorieTrackerLogs', JSON.stringify(updatedLogs));
      setLogs(updatedLogs);
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to delete all meal history? This action cannot be undone.')) {
      localStorage.removeItem('calorieTrackerLogs');
      setLogs({});
    }
  };

  // Get all meals from all dates
  const allMeals: Array<MealEntry & { date: string }> = Object.entries(logs).flatMap(([date, log]) =>
    log.meals.map(meal => ({ ...meal, date }))
  );

  // Filter meals
  const filteredMeals = allMeals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMealType === 'all' || meal.mealType === filterMealType;
    return matchesSearch && matchesFilter;
  });

  // Sort by timestamp (newest first)
  const sortedMeals = [...filteredMeals].sort((a, b) => b.timestamp - a.timestamp);

  // Group by date
  const groupedMeals = sortedMeals.reduce((acc, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {} as Record<string, Array<MealEntry & { date: string }>>);

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🍱';
      case 'dinner': return '🍽️';
      case 'snacks': return '🍿';
      default: return '🍴';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-2">Meal History</h1>
            <p className="text-muted-foreground">View and manage your past meal entries</p>
          </div>
          {Object.keys(logs).length > 0 && (
            <Button variant="destructive" onClick={clearAllData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search meals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterMealType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterMealType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterMealType === 'breakfast' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterMealType('breakfast')}
                >
                  🍳 Breakfast
                </Button>
                <Button
                  variant={filterMealType === 'lunch' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterMealType('lunch')}
                >
                  🍱 Lunch
                </Button>
                <Button
                  variant={filterMealType === 'dinner' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterMealType('dinner')}
                >
                  🍽️ Dinner
                </Button>
                <Button
                  variant={filterMealType === 'snacks' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterMealType('snacks')}
                >
                  🍿 Snacks
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal History */}
        {Object.keys(groupedMeals).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No meals found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterMealType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start logging meals to see your history here'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMeals).map(([date, meals]) => {
              const dayLog = logs[date];
              return (
                <Card key={date}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{format(new Date(date), 'EEEE, MMMM d, yyyy')}</CardTitle>
                        <CardDescription>
                          {dayLog.totalCalories} kcal total • {meals.length} meal{meals.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Macros</div>
                        <div className="flex gap-2 text-sm">
                          <Badge variant="secondary">P: {dayLog.totalProtein}g</Badge>
                          <Badge variant="secondary">C: {dayLog.totalCarbs}g</Badge>
                          <Badge variant="secondary">F: {dayLog.totalFat}g</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {meals.map(meal => (
                        <div
                          key={meal.id}
                          className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-2xl">{getMealTypeIcon(meal.mealType)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{meal.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {meal.mealType}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {meal.calories} kcal • Protein: {meal.protein}g • Carbs: {meal.carbs}g • Fat: {meal.fat}g
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMeal(date, meal.id)}
                            className="hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {Object.keys(logs).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
              <CardDescription>Overall tracking statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Object.keys(logs).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Days Tracked</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {allMeals.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Meals</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(
                      Object.values(logs).reduce((sum, log) => sum + log.totalCalories, 0) /
                        Object.keys(logs).length
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Daily Calories</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(
                      Object.values(logs).reduce((sum, log) => sum + log.totalProtein, 0) /
                        Object.keys(logs).length
                    )}g
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Daily Protein</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

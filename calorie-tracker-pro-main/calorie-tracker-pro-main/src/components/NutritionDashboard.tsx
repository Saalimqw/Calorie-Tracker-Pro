'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import dynamic from 'next/dynamic';
import { DailyLog } from '@/types/calorie-tracker';
import { format, subDays, isValid as isValidDate, parseISO } from 'date-fns';
import { TrendingUp, Target, Flame, Apple, AlertCircle } from 'lucide-react';

// Dynamically import charts with no SSR
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });

interface NutritionDashboardProps {
  selectedDate: string;
  calorieGoal: number;
  refreshTrigger?: number;
}

export default function NutritionDashboard({ selectedDate, calorieGoal, refreshTrigger }: NutritionDashboardProps) {
  const [profileComplete, setProfileComplete] = useState(false);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [mounted]);

  useEffect(() => {
    if (profileComplete && mounted) {
      loadData();
    }
  }, [selectedDate, refreshTrigger, profileComplete, mounted]);

  if (!mounted) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading dashboard...</p>
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
              Please complete your user profile to access the Dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const loadData = () => {
    if (typeof window === 'undefined') return;

    let validDate: Date;
    try {
      const parsedDate = parseISO(selectedDate);
      if (isValidDate(parsedDate)) {
        validDate = parsedDate;
      } else {
        validDate = new Date();
      }
    } catch (error) {
      validDate = new Date();
    }

    try {
      const logs = JSON.parse(localStorage.getItem('calorieTrackerLogs') || '{}');
      const currentLog: DailyLog = logs[selectedDate] || {
        date: selectedDate,
        meals: [],
        waterIntake: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      };
      setDailyLog(currentLog);

      const weekly = [];
      for (let i = 6; i >= 0; i--) {
        try {
          const pastDate = subDays(validDate, i);
          const dateKey = format(pastDate, 'yyyy-MM-dd');
          const log = logs[dateKey];
          weekly.push({
            date: format(pastDate, 'EEE'),
            calories: log?.totalCalories || 0,
            protein: log?.totalProtein || 0,
            carbs: log?.totalCarbs || 0,
            fat: log?.totalFat || 0,
            goal: calorieGoal,
          });
        } catch (error) {
          console.error('Error processing date:', error);
        }
      }
      setWeeklyData(weekly);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  if (!dailyLog) return null;

  const calorieProgress = (dailyLog.totalCalories / calorieGoal) * 100;
  const macroData = [
    { name: 'Protein', value: dailyLog.totalProtein, color: '#3b82f6' },
    { name: 'Carbs', value: dailyLog.totalCarbs, color: '#10b981' },
    { name: 'Fat', value: dailyLog.totalFat, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Calorie Goal Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Daily Calorie Goal
          </CardTitle>
          <CardDescription>Track your progress towards your daily goal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold">{dailyLog.totalCalories}</div>
              <div className="text-sm text-muted-foreground">of {calorieGoal} kcal</div>
            </div>
            <div className={`text-lg font-semibold ${calorieProgress > 100 ? 'text-red-600' : 'text-green-600'}`}>
              {calorieProgress > 100 ? '+' : ''}{Math.round(dailyLog.totalCalories - calorieGoal)} kcal
            </div>
          </div>
          <Progress value={Math.min(calorieProgress, 100)} className="h-3" />
          <div className="text-sm text-muted-foreground">
            {calorieProgress < 100 ? `${Math.round(calorieGoal - dailyLog.totalCalories)} kcal remaining` : `${Math.round(dailyLog.totalCalories - calorieGoal)} kcal over goal`}
          </div>
        </CardContent>
      </Card>

      {/* Macro Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            Macronutrient Breakdown
          </CardTitle>
          <CardDescription>Today's protein, carbs, and fats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}g`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="font-medium">Protein</span>
                </div>
                <span className="font-bold">{dailyLog.totalProtein}g</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="font-medium">Carbs</span>
                </div>
                <span className="font-bold">{dailyLog.totalCarbs}g</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span className="font-medium">Fat</span>
                </div>
                <span className="font-bold">{dailyLog.totalFat}g</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
          <CardDescription>Last 7 days calorie intake</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calories" stroke="#8b5cf6" strokeWidth={2} name="Calories" />
                <Line type="monotone" dataKey="goal" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Goal" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Macros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Weekly Macronutrients
          </CardTitle>
          <CardDescription>Protein, carbs, and fat distribution over the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="protein" fill="#3b82f6" name="Protein (g)" />
                <Bar dataKey="carbs" fill="#10b981" name="Carbs (g)" />
                <Bar dataKey="fat" fill="#f59e0b" name="Fat (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
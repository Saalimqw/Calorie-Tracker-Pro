'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserProfile, HealthMetrics } from '@/types/calorie-tracker';
import { calculateHealthMetrics, getBMICategory, getBMIColor } from '@/lib/calorie-utils';
import { Heart, Droplets, TrendingUp, Activity, CheckCircle2, AlertCircle, Lightbulb, Minus } from 'lucide-react';

interface HealthGuidanceProps {
  profile: UserProfile;
  selectedDate: string;
  refreshTrigger?: number;
}

export default function HealthGuidance({ profile, selectedDate, refreshTrigger }: HealthGuidanceProps) {
  const [profileComplete, setProfileComplete] = useState(false);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        const isValid = !!(
          profileData &&
          profileData.age > 0 &&
          profileData.weight > 0 &&
          profileData.height > 0 &&
          profileData.gender &&
          profileData.activityLevel &&
          profileData.goalType
        );
        setProfileComplete(isValid);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (profileComplete && profile.age && profile.weight && profile.height) {
      const healthMetrics = calculateHealthMetrics(profile);
      setMetrics(healthMetrics);
    }
    if (profileComplete) {
      loadTodayData();
    }
  }, [profile, selectedDate, refreshTrigger, profileComplete, mounted]);

  if (!mounted) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading health guidance...</p>
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
              Please complete your user profile to access Health Guidance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const loadTodayData = () => {
    if (typeof window === 'undefined') return;

    try {
      const logs = JSON.parse(localStorage.getItem('calorieTrackerLogs') || '{}');
      const todayLog = logs[selectedDate];
      setTodayCalories(todayLog?.totalCalories || 0);
      setWaterIntake(todayLog?.waterIntake || 0);
    } catch (error) {
      console.error('Error loading today data:', error);
    }
  };

  const addWater = (amount: number) => {
    if (typeof window === 'undefined') return;

    try {
      const logs = JSON.parse(localStorage.getItem('calorieTrackerLogs') || '{}');
      const todayLog = logs[selectedDate] || { date: selectedDate, meals: [], waterIntake: 0, totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
      todayLog.waterIntake = (todayLog.waterIntake || 0) + amount;
      logs[selectedDate] = todayLog;
      localStorage.setItem('calorieTrackerLogs', JSON.stringify(logs));
      setWaterIntake(todayLog.waterIntake);
    } catch (error) {
      console.error('Error adding water:', error);
    }
  };

  const removeWater = (amount: number) => {
    if (typeof window === 'undefined') return;

    try {
      const logs = JSON.parse(localStorage.getItem('calorieTrackerLogs') || '{}');
      const todayLog = logs[selectedDate] || { date: selectedDate, meals: [], waterIntake: 0, totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
      todayLog.waterIntake = Math.max(0, (todayLog.waterIntake || 0) - amount);
      logs[selectedDate] = todayLog;
      localStorage.setItem('calorieTrackerLogs', JSON.stringify(logs));
      setWaterIntake(todayLog.waterIntake);
    } catch (error) {
      console.error('Error removing water:', error);
    }
  };

  const waterGoal = 2500;
  const waterProgress = (waterIntake / waterGoal) * 100;

  const getHealthTips = () => {
    const tips = [];
    
    if (metrics) {
      const calorieDiff = todayCalories - metrics.recommendedCalories;
      
      if (calorieDiff > 500) {
        tips.push({
          type: 'warning',
          title: 'High Calorie Intake',
          message: `You're ${Math.abs(calorieDiff)} kcal over your goal. Consider lighter meals tomorrow.`,
        });
      } else if (calorieDiff < -500) {
        tips.push({
          type: 'warning',
          title: 'Low Calorie Intake',
          message: `You're ${Math.abs(calorieDiff)} kcal under your goal. Make sure you're eating enough.`,
        });
      } else {
        tips.push({
          type: 'success',
          title: 'Great Balance!',
          message: 'Your calorie intake is well-aligned with your goals.',
        });
      }

      if (metrics.bmi < 18.5) {
        tips.push({
          type: 'info',
          title: 'BMI Status',
          message: 'Your BMI indicates underweight. Consider consulting a healthcare professional.',
        });
      } else if (metrics.bmi > 25) {
        tips.push({
          type: 'info',
          title: 'BMI Status',
          message: 'Your BMI indicates overweight. Regular exercise and balanced diet can help.',
        });
      }
    }

    if (waterIntake < waterGoal * 0.5) {
      tips.push({
        type: 'warning',
        title: 'Hydration Alert',
        message: 'You need to drink more water today. Aim for at least 2.5 liters daily.',
      });
    }

    tips.push({
      type: 'success',
      title: 'Pro Tip',
      message: 'Eating protein with every meal helps maintain muscle mass and keeps you fuller longer.',
    });

    tips.push({
      type: 'success',
      title: 'Exercise Reminder',
      message: 'Aim for at least 30 minutes of moderate exercise most days of the week.',
    });

    return tips;
  };

  if (!metrics) return null;

  const healthTips = getHealthTips();

  return (
    <div className="space-y-6">
      {/* BMI Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Body Mass Index (BMI)
          </CardTitle>
          <CardDescription>Your current health metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className={`text-4xl font-bold ${getBMIColor(metrics.bmi)}`}>
                {metrics.bmi}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {getBMICategory(metrics.bmi)}
              </div>
            </div>
            <Badge variant={metrics.bmi >= 18.5 && metrics.bmi < 25 ? 'default' : 'secondary'}>
              {metrics.bmi >= 18.5 && metrics.bmi < 25 ? 'Healthy Range' : 'Outside Range'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground">BMR</div>
              <div className="text-xl font-semibold">{Math.round(metrics.bmr)} kcal</div>
              <div className="text-xs text-muted-foreground">Base metabolism</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">TDEE</div>
              <div className="text-xl font-semibold">{Math.round(metrics.tdee)} kcal</div>
              <div className="text-xs text-muted-foreground">Daily expenditure</div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-1">Recommended Daily Intake</div>
            <div className="text-2xl font-bold text-primary">{metrics.recommendedCalories} kcal</div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on your {profile.goalType === 'lose' ? 'weight loss' : profile.goalType === 'gain' ? 'weight gain' : 'maintenance'} goal
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hydration Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Hydration Tracker
          </CardTitle>
          <CardDescription>Track your daily water intake</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{waterIntake} ml</div>
              <div className="text-sm text-muted-foreground">of {waterGoal} ml goal</div>
            </div>
            <div className="text-lg font-semibold">
              {Math.round(waterProgress)}%
            </div>
          </div>
          <Progress value={Math.min(waterProgress, 100)} className="h-3" />
          
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Add Water</div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => addWater(250)} size="sm" variant="outline" className="flex-1 min-w-[80px]">
                +250ml
              </Button>
              <Button onClick={() => addWater(500)} size="sm" variant="outline" className="flex-1 min-w-[80px]">
                +500ml
              </Button>
              <Button onClick={() => addWater(1000)} size="sm" variant="outline" className="flex-1 min-w-[80px]">
                +1L
              </Button>
            </div>
            
            <div className="text-xs font-semibold text-muted-foreground uppercase pt-2">Remove Water</div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => removeWater(250)} 
                size="sm" 
                variant="outline" 
                className="flex-1 min-w-[80px] border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                disabled={waterIntake === 0}
              >
                <Minus className="h-3 w-3 mr-1" />
                250ml
              </Button>
              <Button 
                onClick={() => removeWater(500)} 
                size="sm" 
                variant="outline" 
                className="flex-1 min-w-[80px] border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                disabled={waterIntake === 0}
              >
                <Minus className="h-3 w-3 mr-1" />
                500ml
              </Button>
              <Button 
                onClick={() => removeWater(1000)} 
                size="sm" 
                variant="outline" 
                className="flex-1 min-w-[80px] border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                disabled={waterIntake === 0}
              >
                <Minus className="h-3 w-3 mr-1" />
                1L
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground pt-2 border-t">
            💧 Tip: Drink a glass of water before each meal to stay hydrated and aid digestion.
          </div>
        </CardContent>
      </Card>

      {/* Health Tips & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personalized Health Guidance
          </CardTitle>
          <CardDescription>Recommendations based on your progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {healthTips.map((tip, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                tip.type === 'success'
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  : tip.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
                  : 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {tip.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : tip.type === 'warning' ? (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-semibold mb-1">{tip.title}</div>
                  <div className="text-sm text-muted-foreground">{tip.message}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Apple, Salad, Coffee, TrendingUp, Heart, AlertCircle, Lightbulb, Calendar } from 'lucide-react';
import { UserProfile } from '@/types/calorie-tracker';
import { format } from 'date-fns';

// Food database with international foods
const foodDatabase: { [key: string]: { protein: number; carbs: number; fat: number; calories: number; serving: string } } = {
  'roti': { protein: 3, carbs: 15, fat: 1, calories: 80, serving: '1 piece (30g)' },
  'chapati': { protein: 3, carbs: 15, fat: 1, calories: 80, serving: '1 piece (30g)' },
  'naan': { protein: 5, carbs: 30, fat: 4, calories: 170, serving: '1 piece (60g)' },
  'paratha': { protein: 4, carbs: 20, fat: 8, calories: 160, serving: '1 piece (50g)' },
  'rice': { protein: 2.7, carbs: 28, fat: 0.3, calories: 130, serving: '100g cooked' },
  'brown rice': { protein: 2.6, carbs: 23, fat: 0.9, calories: 111, serving: '100g cooked' },
  'dal': { protein: 9, carbs: 20, fat: 0.4, calories: 116, serving: '100g cooked' },
  'lentils': { protein: 9, carbs: 20, fat: 0.4, calories: 116, serving: '100g cooked' },
  'chicken breast': { protein: 31, carbs: 0, fat: 3.6, calories: 165, serving: '100g' },
  'salmon': { protein: 25, carbs: 0, fat: 13, calories: 208, serving: '100g' },
  'egg': { protein: 6.5, carbs: 0.6, fat: 5, calories: 78, serving: '1 large egg' },
  'greek yogurt': { protein: 10, carbs: 3.6, fat: 0.4, calories: 59, serving: '100g' },
  'banana': { protein: 1.3, carbs: 27, fat: 0.4, calories: 105, serving: '1 medium' },
  'apple': { protein: 0.5, carbs: 25, fat: 0.3, calories: 95, serving: '1 medium' },
  'almonds': { protein: 21, carbs: 22, fat: 49, calories: 579, serving: '100g' },
  'paneer': { protein: 18, carbs: 1.2, fat: 20, calories: 265, serving: '100g' },
  'tofu': { protein: 8, carbs: 2, fat: 4, calories: 76, serving: '100g' },
  'chickpeas': { protein: 8.9, carbs: 27, fat: 2.6, calories: 164, serving: '100g cooked' },
  'quinoa': { protein: 4.4, carbs: 21, fat: 1.9, calories: 120, serving: '100g cooked' },
  'oats': { protein: 2.5, carbs: 12, fat: 1.4, calories: 68, serving: '100g cooked' },
  'sweet potato': { protein: 2, carbs: 20, fat: 0.1, calories: 86, serving: '100g' },
  'broccoli': { protein: 2.8, carbs: 7, fat: 0.4, calories: 34, serving: '100g' },
  'spinach': { protein: 2.9, carbs: 3.6, fat: 0.4, calories: 23, serving: '100g' },
  'milk': { protein: 3.4, carbs: 5, fat: 1, calories: 42, serving: '100ml (low-fat)' },
  'bread': { protein: 9, carbs: 49, fat: 3.2, calories: 265, serving: '100g' },
  'pasta': { protein: 5, carbs: 31, fat: 0.9, calories: 131, serving: '100g cooked' },
  'potato': { protein: 2, carbs: 17, fat: 0.1, calories: 77, serving: '100g' },
  'tomato': { protein: 0.9, carbs: 3.9, fat: 0.2, calories: 18, serving: '100g' },
  'cucumber': { protein: 0.7, carbs: 3.6, fat: 0.1, calories: 16, serving: '100g' },
  'idli': { protein: 2, carbs: 12, fat: 0.2, calories: 58, serving: '1 piece (40g)' },
  'dosa': { protein: 2, carbs: 14, fat: 1, calories: 75, serving: '1 piece (50g)' },
  'biryani': { protein: 8, carbs: 45, fat: 12, calories: 320, serving: '1 cup (200g)' },
  'samosa': { protein: 4, carbs: 30, fat: 10, calories: 230, serving: '1 piece (100g)' },
  'curry': { protein: 6, carbs: 10, fat: 8, calories: 140, serving: '1 cup (240g)' }
};

interface NutritionAssistantProps {
  profile: UserProfile;
  selectedDate: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'meal' | 'tip' | 'exercise' | 'hydration';
}

export default function NutritionAssistant({ profile, selectedDate }: NutritionAssistantProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        message: `Hi ${profile.name || 'there'}! 👋 I'm your Nutrition Assistant. I can help you with meal planning, nutrition advice, and healthy lifestyle tips. What would you like to know today?`,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading assistant...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Meal Ideas',
      description: 'Get personalized meal suggestions based on your goals',
      icon: Salad,
      category: 'meal'
    },
    {
      id: '2',
      title: 'Nutrition Tips',
      description: 'Learn about balanced nutrition and healthy eating',
      icon: Lightbulb,
      category: 'tip'
    },
    {
      id: '3',
      title: 'Exercise Advice',
      description: 'Complement your diet with fitness recommendations',
      icon: TrendingUp,
      category: 'exercise'
    },
    {
      id: '4',
      title: 'Hydration Guide',
      description: 'Stay hydrated with personalized water intake goals',
      icon: Coffee,
      category: 'hydration'
    }
  ];

  const findFoodInQuery = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    for (const food in foodDatabase) {
      if (lowerQuery.includes(food)) {
        return food;
      }
    }
    return null;
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const { goalType, activityLevel, dailyCalorieGoal } = profile;

    // PRIORITY 1: Check if asking about specific food (MUST BE FIRST)
    const foodName = findFoodInQuery(input);
    if (foodName) {
      const food = foodDatabase[foodName];
      return `📊 **${foodName.charAt(0).toUpperCase() + foodName.slice(1)}** Nutrition Information:\n\nServing size: ${food.serving}\n🔹 Calories: ${food.calories} kcal\n🔹 Protein: ${food.protein}g\n🔹 Carbohydrates: ${food.carbs}g\n🔹 Fat: ${food.fat}g\n\nThis is a ${food.calories < 100 ? 'low' : food.calories < 200 ? 'moderate' : 'high'} calorie food. ${food.protein > 10 ? 'Great protein source!' : food.protein > 5 ? 'Good protein content.' : 'Consider pairing with protein-rich foods.'}\n\nTip: Track this in your meal logger for accurate daily tracking!`;
    }

    // PRIORITY 2: General protein guidance (only if no specific food mentioned)
    if (input.includes('protein') && (input.includes('need') || input.includes('should') || input.includes('goal') || input.includes('daily') || input.includes('how much'))) {
      const proteinGoal = Math.round((dailyCalorieGoal || 2000) * 0.3 / 4);
      return `Your daily protein goal is approximately ${proteinGoal}g based on your calorie target. Great protein sources include:\n\n🍗 Chicken breast (31g per 100g)\n🐟 Salmon (25g per 100g)\n🥚 Eggs (6.5g per egg)\n🥛 Greek yogurt (10g per 100g)\n🌰 Almonds (21g per 100g)\n🫘 Lentils/Dal (9g per 100g cooked)\n🍞 Roti/Chapati (3g per piece)\n🧀 Paneer (18g per 100g)\n\nTry to spread protein intake across all meals for optimal muscle maintenance and satiety!`;
    }

    // Meal suggestions
    if (input.includes('meal') || input.includes('food') || input.includes('eat') || input.includes('breakfast') || input.includes('lunch') || input.includes('dinner')) {
      const mealSuggestions = {
        lose: [
          '🥗 Grilled chicken salad with quinoa and mixed vegetables (350 cal)',
          '🥙 Whole grain wrap with turkey, avocado, and hummus (380 cal)',
          '🍲 Vegetable stir-fry with tofu and brown rice (400 cal)',
          '🥚 Greek yogurt parfait with berries and almonds (250 cal)',
          '🐟 Baked salmon with steamed broccoli and sweet potato (420 cal)'
        ],
        maintain: [
          '🍝 Whole wheat pasta with grilled chicken and marinara sauce (480 cal)',
          '🥙 Chickpea Buddha bowl with tahini dressing (520 cal)',
          '🍗 Grilled chicken breast with roasted vegetables and quinoa (550 cal)',
          '🥗 Tuna salad sandwich on whole grain bread with side salad (500 cal)',
          '🍲 Lentil soup with whole grain bread and side salad (480 cal)'
        ],
        gain: [
          '🍳 Scrambled eggs with whole grain toast, avocado, and cheese (650 cal)',
          '🥪 Peanut butter banana sandwich with protein shake (700 cal)',
          '🍝 Chicken Alfredo with garlic bread (750 cal)',
          '🥙 Beef burrito bowl with rice, beans, cheese, and guacamole (800 cal)',
          '🍔 Turkey burger with sweet potato fries (720 cal)'
        ]
      };

      const suggestions = mealSuggestions[goalType] || mealSuggestions.maintain;
      return `Based on your ${goalType === 'lose' ? 'weight loss' : goalType === 'gain' ? 'muscle gain' : 'maintenance'} goal (${dailyCalorieGoal} cal/day), here are some meal suggestions:\n\n${suggestions.join('\n')}\n\nRemember to balance your meals throughout the day and include variety in your diet!`;
    }

    // Carbs guidance
    if (input.includes('carb') || input.includes('carbohydrate')) {
      const carbGoal = Math.round((dailyCalorieGoal || 2000) * 0.45 / 4);
      return `Your daily carbohydrate goal is approximately ${carbGoal}g. Focus on complex carbs:\n\n🍠 Sweet potatoes\n🌾 Quinoa and brown rice\n🍞 Whole grain bread\n🥣 Oatmeal\n🍎 Fruits (apples, berries, bananas)\n🥦 Vegetables\n\nComplex carbs provide sustained energy and are rich in fiber!`;
    }

    // Fat guidance
    if (input.includes('fat') || input.includes('healthy fat')) {
      const fatGoal = Math.round((dailyCalorieGoal || 2000) * 0.25 / 9);
      return `Your daily fat goal is approximately ${fatGoal}g. Focus on healthy fats:\n\n🥑 Avocados\n🌰 Nuts (almonds, walnuts, cashews)\n🐟 Fatty fish (salmon, mackerel)\n🫒 Olive oil\n🥜 Nut butters\n🌻 Seeds (chia, flax, pumpkin)\n\nHealthy fats support brain function and hormone production!`;
    }

    // Hydration
    if (input.includes('water') || input.includes('hydrat') || input.includes('drink')) {
      const waterGoal = activityLevel === 'veryActive' || activityLevel === 'active' ? 3.5 : 2.5;
      return `💧 Stay hydrated! Aim for ${waterGoal}L (${Math.round(waterGoal * 33.8)}oz) of water per day based on your ${activityLevel} activity level.\n\nTips:\n• Drink a glass of water when you wake up\n• Carry a reusable water bottle\n• Drink before, during, and after exercise\n• Eat water-rich foods (cucumbers, watermelon, oranges)\n• Set hourly reminders to drink water`;
    }

    // Exercise
    if (input.includes('exercis') || input.includes('workout') || input.includes('fitness')) {
      const exerciseAdvice = {
        lose: 'For weight loss, combine cardio (30-45 min, 5x/week) with strength training (3x/week). Try walking, jogging, cycling, or swimming. High-intensity interval training (HIIT) is also very effective!',
        maintain: 'For maintenance, aim for 150 minutes of moderate cardio per week and 2-3 strength training sessions. Mix it up with activities you enjoy - dancing, sports, hiking, or gym workouts!',
        gain: 'For muscle gain, focus on progressive strength training 4-5x/week with compound exercises (squats, deadlifts, bench press). Limit cardio to 2-3 light sessions per week to preserve muscle mass.'
      };
      return `🏋️ Exercise Recommendations:\n\n${exerciseAdvice[goalType] || exerciseAdvice.maintain}\n\nRemember: Exercise and nutrition work together. Fuel your workouts properly and get adequate rest for recovery!`;
    }

    // Weight loss tips
    if (input.includes('lose weight') || input.includes('weight loss')) {
      return `🎯 Weight Loss Tips:\n\n1. Create a moderate calorie deficit (500 cal/day for 1lb/week loss)\n2. Eat protein with every meal to stay full longer\n3. Fill half your plate with vegetables\n4. Drink water before meals\n5. Get 7-9 hours of sleep\n6. Track your food intake consistently\n7. Move more throughout the day\n8. Be patient - sustainable weight loss takes time!\n\nYour current goal: ${dailyCalorieGoal} cal/day`;
    }

    // Muscle gain tips
    if (input.includes('gain weight') || input.includes('muscle') || input.includes('bulk')) {
      return `💪 Muscle Gain Tips:\n\n1. Eat in a calorie surplus (300-500 cal above maintenance)\n2. Consume 1.6-2.2g protein per kg body weight\n3. Eat protein within 2 hours post-workout\n4. Focus on progressive overload in training\n5. Get adequate sleep (8-9 hours)\n6. Eat carbs around workout times\n7. Don't skip meals - eat 4-6 times per day\n8. Be consistent with training and nutrition!\n\nYour current goal: ${dailyCalorieGoal} cal/day`;
    }

    // Healthy snacks
    if (input.includes('snack')) {
      return `🍎 Healthy Snack Ideas:\n\n• Greek yogurt with berries (150 cal)\n• Apple slices with almond butter (180 cal)\n• Handful of mixed nuts (160 cal)\n• Hummus with carrot sticks (120 cal)\n• Protein smoothie (200 cal)\n• Hard-boiled eggs (140 cal for 2)\n• Rice cakes with avocado (150 cal)\n• Cottage cheese with cucumber (100 cal)\n\nAim for snacks between 100-200 calories!`;
    }

    // Vitamins and minerals
    if (input.includes('vitamin') || input.includes('mineral') || input.includes('supplement')) {
      return `🌟 Essential Nutrients:\n\n• Vitamin D: Sunlight, fortified milk, fatty fish\n• Iron: Red meat, spinach, lentils, tofu\n• Calcium: Dairy, leafy greens, fortified foods\n• Vitamin B12: Meat, eggs, dairy, fortified cereals\n• Omega-3: Fatty fish, walnuts, flaxseeds\n• Magnesium: Nuts, seeds, whole grains, leafy greens\n\nEat a varied, colorful diet to get all nutrients naturally. Consult a doctor before taking supplements!`;
    }

    // Meal timing
    if (input.includes('when') || input.includes('timing') || input.includes('schedule')) {
      return `⏰ Meal Timing Tips:\n\n• Eat breakfast within 1-2 hours of waking\n• Space meals 3-4 hours apart\n• Have your largest meal when you're most active\n• Eat protein and carbs before workouts\n• Consume protein within 2 hours post-workout\n• Avoid heavy meals 2-3 hours before bed\n• Stay consistent with meal times\n\nListen to your body's hunger cues and adjust as needed!`;
    }

    // Cheat meals
    if (input.includes('cheat') || input.includes('treat')) {
      return `🍰 About Treats:\n\nIt's okay to enjoy your favorite foods! Here's how:\n\n• Follow the 80/20 rule (80% nutritious, 20% flexible)\n• Plan treats rather than impulse eating\n• Practice portion control\n• Don't label foods as "good" or "bad"\n• Enjoy without guilt\n• Get back on track the next meal\n\nBalance and moderation are key to sustainable healthy eating!`;
    }

    // General nutrition
    return `I can help you with:\n\n🍽️ Meal planning and suggestions\n🥗 Nutrition basics (protein, carbs, fats)\n💧 Hydration guidelines\n🏋️ Exercise recommendations\n🎯 Weight management strategies\n⏰ Meal timing advice\n🍎 Healthy snack ideas\n📊 Specific food nutrition info (ask: "How much protein in roti?")\n\nWhat specific question do you have? Feel free to ask about meals, nutrients, exercise, or any specific food!`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(inputMessage);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        message: response,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Nutrition Assistant
          </CardTitle>
          <CardDescription className="text-base">
            Get personalized nutrition advice, meal suggestions, and healthy lifestyle tips. Ask about specific foods!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <Button
                  key={suggestion.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-700"
                  onClick={() => handleQuickAction(suggestion.title)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold">{suggestion.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    {suggestion.description}
                  </p>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Chat with Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {format(msg.timestamp, 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about nutrition, meals, or specific foods..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-2 border-purple-300 dark:border-purple-700 focus:ring-purple-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggested Questions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try asking:</span>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
              onClick={() => handleQuickAction('How much protein in roti?')}
            >
              Protein in roti
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
              onClick={() => handleQuickAction('Calories in biryani?')}
            >
              Biryani calories
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
              onClick={() => handleQuickAction('Nutrition in paneer?')}
            >
              Paneer nutrition
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
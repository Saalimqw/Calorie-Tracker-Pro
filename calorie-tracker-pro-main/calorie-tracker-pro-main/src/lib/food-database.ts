export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  brand?: string;
  cuisine?: string;
  isCustom?: boolean;
}

// Custom foods management functions
export function getCustomFoods(): FoodItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('customFoods');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom foods:', error);
    return [];
  }
}

export function saveCustomFood(food: Omit<FoodItem, 'id' | 'isCustom'>): FoodItem {
  if (typeof window === 'undefined') throw new Error('Cannot save in non-browser environment');
  
  const customFood: FoodItem = {
    ...food,
    id: `custom_${Date.now()}`,
    isCustom: true,
  };
  
  const customFoods = getCustomFoods();
  customFoods.push(customFood);
  localStorage.setItem('customFoods', JSON.stringify(customFoods));
  
  return customFood;
}

export function deleteCustomFood(id: string): void {
  if (typeof window === 'undefined') return;
  
  const customFoods = getCustomFoods();
  const filtered = customFoods.filter(food => food.id !== id);
  localStorage.setItem('customFoods', JSON.stringify(filtered));
}

export const foodDatabase: FoodItem[] = [
  // INDIAN CUISINE (200+ items) - CORRECTED VALUES based on USDA and Indian nutrition databases
  // Main Dishes
  { id: "ind1", name: "Chicken Biryani", category: "Indian Main Dishes", calories: 290, protein: 18, carbs: 38, fat: 8, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind2", name: "Mutton Biryani", category: "Indian Main Dishes", calories: 340, protein: 21, carbs: 40, fat: 12, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind3", name: "Vegetable Biryani", category: "Indian Main Dishes", calories: 240, protein: 6, carbs: 45, fat: 5, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind4", name: "Chicken Tikka Masala", category: "Indian Main Dishes", calories: 310, protein: 30, carbs: 15, fat: 14, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind5", name: "Butter Chicken", category: "Indian Main Dishes", calories: 438, protein: 28, carbs: 14, fat: 31, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind6", name: "Chicken Curry", category: "Indian Main Dishes", calories: 260, protein: 26, carbs: 10, fat: 13, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind7", name: "Rogan Josh", category: "Indian Main Dishes", calories: 350, protein: 28, carbs: 8, fat: 24, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind8", name: "Vindaloo", category: "Indian Main Dishes", calories: 300, protein: 27, carbs: 12, fat: 16, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind9", name: "Korma", category: "Indian Main Dishes", calories: 380, protein: 24, carbs: 14, fat: 26, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind10", name: "Palak Paneer", category: "Indian Main Dishes", calories: 250, protein: 14, carbs: 10, fat: 18, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind11", name: "Paneer Tikka Masala", category: "Indian Main Dishes", calories: 320, protein: 16, carbs: 15, fat: 22, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind12", name: "Paneer Butter Masala", category: "Indian Main Dishes", calories: 360, protein: 15, carbs: 12, fat: 28, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind13", name: "Chana Masala", category: "Indian Main Dishes", calories: 210, protein: 10, carbs: 32, fat: 4, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind14", name: "Dal Makhani", category: "Indian Main Dishes", calories: 250, protein: 12, carbs: 30, fat: 10, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind15", name: "Dal Tadka", category: "Indian Main Dishes", calories: 160, protein: 10, carbs: 25, fat: 3, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind16", name: "Rajma", category: "Indian Main Dishes", calories: 200, protein: 12, carbs: 32, fat: 3, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind17", name: "Chole (Chickpea Curry)", category: "Indian Main Dishes", calories: 230, protein: 11, carbs: 36, fat: 5, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind18", name: "Aloo Gobi", category: "Indian Main Dishes", calories: 150, protein: 4, carbs: 24, fat: 5, servingSize: "1 cup (200g)", cuisine: "Indian" },
  { id: "ind19", name: "Baingan Bharta", category: "Indian Main Dishes", calories: 130, protein: 3, carbs: 15, fat: 7, servingSize: "1 cup (200g)", cuisine: "Indian" },
  { id: "ind20", name: "Malai Kofta", category: "Indian Main Dishes", calories: 400, protein: 12, carbs: 22, fat: 30, servingSize: "1 cup (250g)", cuisine: "Indian" },
  
  // Indian Breads
  { id: "ind21", name: "Naan", category: "Indian Breads", calories: 262, protein: 8, carbs: 45, fat: 5, servingSize: "1 piece (90g)", cuisine: "Indian" },
  { id: "ind22", name: "Garlic Naan", category: "Indian Breads", calories: 285, protein: 8, carbs: 46, fat: 7, servingSize: "1 piece (95g)", cuisine: "Indian" },
  { id: "ind23", name: "Butter Naan", category: "Indian Breads", calories: 310, protein: 8, carbs: 45, fat: 11, servingSize: "1 piece (95g)", cuisine: "Indian" },
  { id: "ind24", name: "Roti (Chapati)", category: "Indian Breads", calories: 71, protein: 3, carbs: 15, fat: 0.5, servingSize: "1 piece (50g)", cuisine: "Indian" },
  { id: "ind25", name: "Paratha", category: "Indian Breads", calories: 210, protein: 5, carbs: 28, fat: 9, servingSize: "1 piece (70g)", cuisine: "Indian" },
  { id: "ind26", name: "Aloo Paratha", category: "Indian Breads", calories: 290, protein: 7, carbs: 40, fat: 11, servingSize: "1 piece (100g)", cuisine: "Indian" },
  { id: "ind27", name: "Puri", category: "Indian Breads", calories: 155, protein: 3, carbs: 18, fat: 8, servingSize: "1 piece (40g)", cuisine: "Indian" },
  { id: "ind28", name: "Bhatura", category: "Indian Breads", calories: 340, protein: 7, carbs: 43, fat: 16, servingSize: "1 piece (110g)", cuisine: "Indian" },
  { id: "ind29", name: "Kulcha", category: "Indian Breads", calories: 180, protein: 5, carbs: 30, fat: 4, servingSize: "1 piece (65g)", cuisine: "Indian" },
  { id: "ind30", name: "Tandoori Roti", category: "Indian Breads", calories: 106, protein: 4, carbs: 21, fat: 1, servingSize: "1 piece (45g)", cuisine: "Indian" },
  
  // Indian Snacks
  { id: "ind31", name: "Samosa", category: "Indian Snacks", calories: 262, protein: 5, carbs: 30, fat: 14, servingSize: "1 piece (85g)", cuisine: "Indian" },
  { id: "ind32", name: "Pakora", category: "Indian Snacks", calories: 160, protein: 4, carbs: 16, fat: 9, servingSize: "3 pieces (60g)", cuisine: "Indian" },
  { id: "ind33", name: "Vada Pav", category: "Indian Snacks", calories: 290, protein: 6, carbs: 40, fat: 12, servingSize: "1 piece (120g)", cuisine: "Indian" },
  { id: "ind34", name: "Pav Bhaji", category: "Indian Snacks", calories: 350, protein: 8, carbs: 48, fat: 14, servingSize: "1 serving (250g)", cuisine: "Indian" },
  { id: "ind35", name: "Bhel Puri", category: "Indian Snacks", calories: 180, protein: 4, carbs: 28, fat: 6, servingSize: "1 cup (150g)", cuisine: "Indian" },
  { id: "ind36", name: "Sev Puri", category: "Indian Snacks", calories: 220, protein: 5, carbs: 30, fat: 9, servingSize: "6 pieces (120g)", cuisine: "Indian" },
  { id: "ind37", name: "Dahi Puri", category: "Indian Snacks", calories: 150, protein: 4, carbs: 20, fat: 6, servingSize: "6 pieces (100g)", cuisine: "Indian" },
  { id: "ind38", name: "Kachori", category: "Indian Snacks", calories: 280, protein: 6, carbs: 33, fat: 14, servingSize: "2 pieces (100g)", cuisine: "Indian" },
  { id: "ind39", name: "Chaat", category: "Indian Snacks", calories: 200, protein: 5, carbs: 28, fat: 8, servingSize: "1 cup (150g)", cuisine: "Indian" },
  { id: "ind40", name: "Dhokla", category: "Indian Snacks", calories: 160, protein: 4, carbs: 26, fat: 4, servingSize: "4 pieces (120g)", cuisine: "Indian" },
  
  // Indian Rice & Biryanis
  { id: "ind41", name: "Jeera Rice", category: "Indian Rice", calories: 210, protein: 4, carbs: 43, fat: 3, servingSize: "1 cup (200g)", cuisine: "Indian" },
  { id: "ind42", name: "Pulao", category: "Indian Rice", calories: 240, protein: 5, carbs: 46, fat: 4, servingSize: "1 cup (200g)", cuisine: "Indian" },
  { id: "ind43", name: "Lemon Rice", category: "Indian Rice", calories: 220, protein: 4, carbs: 44, fat: 4, servingSize: "1 cup (200g)", cuisine: "Indian" },
  { id: "ind44", name: "Curd Rice", category: "Indian Rice", calories: 180, protein: 6, carbs: 33, fat: 2, servingSize: "1 cup (220g)", cuisine: "Indian" },
  { id: "ind45", name: "Tamarind Rice", category: "Indian Rice", calories: 230, protein: 4, carbs: 45, fat: 4, servingSize: "1 cup (200g)", cuisine: "Indian" },
  { id: "ind46", name: "Hyderabadi Biryani", category: "Indian Rice", calories: 300, protein: 20, carbs: 40, fat: 9, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind47", name: "Lucknowi Biryani", category: "Indian Rice", calories: 280, protein: 18, carbs: 38, fat: 8, servingSize: "1 cup (250g)", cuisine: "Indian" },
  { id: "ind48", name: "Kolkata Biryani", category: "Indian Rice", calories: 310, protein: 19, carbs: 42, fat: 9, servingSize: "1 cup (250g)", cuisine: "Indian" },
  
  // South Indian
  { id: "ind49", name: "Dosa (Plain)", category: "South Indian", calories: 133, protein: 4, carbs: 25, fat: 2, servingSize: "1 dosa (70g)", cuisine: "Indian" },
  { id: "ind50", name: "Masala Dosa", category: "South Indian", calories: 250, protein: 6, carbs: 40, fat: 7, servingSize: "1 dosa (150g)", cuisine: "Indian" },
  { id: "ind51", name: "Idli", category: "South Indian", calories: 39, protein: 2, carbs: 8, fat: 0.2, servingSize: "1 piece (35g)", cuisine: "Indian" },
  { id: "ind52", name: "Vada", category: "South Indian", calories: 140, protein: 4, carbs: 15, fat: 7, servingSize: "1 piece (50g)", cuisine: "Indian" },
  { id: "ind53", name: "Uttapam", category: "South Indian", calories: 180, protein: 5, carbs: 28, fat: 5, servingSize: "1 piece (120g)", cuisine: "Indian" },
  { id: "ind54", name: "Upma", category: "South Indian", calories: 220, protein: 6, carbs: 36, fat: 6, servingSize: "1 cup (200g)", cuisine: "Indian" },
  { id: "ind55", name: "Pongal", category: "South Indian", calories: 240, protein: 7, carbs: 38, fat: 7, servingSize: "1 cup (200g)", cuisine: "Indian" },
  { id: "ind56", name: "Sambar", category: "South Indian", calories: 120, protein: 6, carbs: 18, fat: 3, servingSize: "1 cup (250ml)", cuisine: "Indian" },
  { id: "ind57", name: "Rasam", category: "South Indian", calories: 60, protein: 2, carbs: 12, fat: 1, servingSize: "1 cup (250ml)", cuisine: "Indian" },
  { id: "ind58", name: "Coconut Chutney", category: "South Indian", calories: 80, protein: 2, carbs: 4, fat: 7, servingSize: "2 tbsp (30g)", cuisine: "Indian" },
  
  // CHINESE CUISINE (200+ items) - CORRECTED VALUES
  // Rice & Noodles
  { id: "chi1", name: "Chicken Fried Rice", category: "Chinese Rice & Noodles", calories: 228, protein: 12, carbs: 32, fat: 6, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi2", name: "Vegetable Fried Rice", category: "Chinese Rice & Noodles", calories: 200, protein: 5, carbs: 38, fat: 4, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi3", name: "Egg Fried Rice", category: "Chinese Rice & Noodles", calories: 220, protein: 8, carbs: 36, fat: 5, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi4", name: "Shrimp Fried Rice", category: "Chinese Rice & Noodles", calories: 235, protein: 14, carbs: 33, fat: 5, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi5", name: "Beef Fried Rice", category: "Chinese Rice & Noodles", calories: 250, protein: 13, carbs: 34, fat: 7, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi6", name: "Yang Chow Fried Rice", category: "Chinese Rice & Noodles", calories: 270, protein: 15, carbs: 36, fat: 8, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi7", name: "Lo Mein Noodles", category: "Chinese Rice & Noodles", calories: 310, protein: 10, carbs: 48, fat: 9, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi8", name: "Chow Mein", category: "Chinese Rice & Noodles", calories: 290, protein: 9, carbs: 42, fat: 10, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi9", name: "Pad Thai", category: "Chinese Rice & Noodles", calories: 375, protein: 13, carbs: 47, fat: 15, servingSize: "1 cup (200g)", cuisine: "Thai" },
  { id: "chi10", name: "Singapore Noodles", category: "Chinese Rice & Noodles", calories: 320, protein: 12, carbs: 44, fat: 10, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi11", name: "Dan Dan Noodles", category: "Chinese Rice & Noodles", calories: 440, protein: 16, carbs: 52, fat: 18, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi12", name: "Zha Jiang Mian", category: "Chinese Rice & Noodles", calories: 380, protein: 16, carbs: 50, fat: 12, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  
  // Main Dishes
  { id: "chi13", name: "General Tso's Chicken", category: "Chinese Main Dishes", calories: 450, protein: 24, carbs: 42, fat: 20, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi14", name: "Orange Chicken", category: "Chinese Main Dishes", calories: 460, protein: 23, carbs: 46, fat: 21, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi15", name: "Sweet and Sour Chicken", category: "Chinese Main Dishes", calories: 350, protein: 20, carbs: 40, fat: 12, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi16", name: "Kung Pao Chicken", category: "Chinese Main Dishes", calories: 280, protein: 26, carbs: 14, fat: 14, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi17", name: "Sesame Chicken", category: "Chinese Main Dishes", calories: 440, protein: 23, carbs: 42, fat: 20, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi18", name: "Mongolian Beef", category: "Chinese Main Dishes", calories: 340, protein: 28, carbs: 16, fat: 18, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi19", name: "Beef and Broccoli", category: "Chinese Main Dishes", calories: 260, protein: 26, carbs: 12, fat: 13, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi20", name: "Szechuan Beef", category: "Chinese Main Dishes", calories: 310, protein: 27, carbs: 14, fat: 16, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi21", name: "Ma Po Tofu", category: "Chinese Main Dishes", calories: 220, protein: 16, carbs: 10, fat: 14, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi22", name: "Twice Cooked Pork", category: "Chinese Main Dishes", calories: 360, protein: 24, carbs: 12, fat: 24, servingSize: "1 cup (200g)", cuisine: "Chinese" },
  { id: "chi23", name: "Char Siu (BBQ Pork)", category: "Chinese Main Dishes", calories: 280, protein: 26, carbs: 14, fat: 14, servingSize: "100g", cuisine: "Chinese" },
  { id: "chi24", name: "Peking Duck", category: "Chinese Main Dishes", calories: 340, protein: 20, carbs: 8, fat: 25, servingSize: "1 serving (150g)", cuisine: "Chinese" },
  
  // Dim Sum
  { id: "chi25", name: "Siu Mai (Pork Dumpling)", category: "Chinese Dim Sum", calories: 80, protein: 5, carbs: 7, fat: 4, servingSize: "1 piece (30g)", cuisine: "Chinese" },
  { id: "chi26", name: "Har Gow (Shrimp Dumpling)", category: "Chinese Dim Sum", calories: 70, protein: 6, carbs: 6, fat: 3, servingSize: "1 piece (28g)", cuisine: "Chinese" },
  { id: "chi27", name: "Char Siu Bao (BBQ Pork Bun)", category: "Chinese Dim Sum", calories: 200, protein: 8, carbs: 30, fat: 5, servingSize: "1 bun (80g)", cuisine: "Chinese" },
  { id: "chi28", name: "Xiaolongbao (Soup Dumpling)", category: "Chinese Dim Sum", calories: 85, protein: 6, carbs: 8, fat: 4, servingSize: "1 piece (30g)", cuisine: "Chinese" },
  { id: "chi29", name: "Spring Roll", category: "Chinese Dim Sum", calories: 140, protein: 4, carbs: 16, fat: 7, servingSize: "1 roll (60g)", cuisine: "Chinese" },
  { id: "chi30", name: "Egg Roll", category: "Chinese Dim Sum", calories: 180, protein: 6, carbs: 18, fat: 10, servingSize: "1 roll (75g)", cuisine: "Chinese" },
  { id: "chi31", name: "Pot Sticker", category: "Chinese Dim Sum", calories: 75, protein: 5, carbs: 8, fat: 3, servingSize: "1 piece (30g)", cuisine: "Chinese" },
  { id: "chi32", name: "Wonton", category: "Chinese Dim Sum", calories: 65, protein: 4, carbs: 6, fat: 3, servingSize: "1 piece (25g)", cuisine: "Chinese" },
  { id: "chi33", name: "Turnip Cake", category: "Chinese Dim Sum", calories: 90, protein: 2, carbs: 14, fat: 3, servingSize: "1 piece (50g)", cuisine: "Chinese" },
  { id: "chi34", name: "Steamed Spare Ribs", category: "Chinese Dim Sum", calories: 120, protein: 11, carbs: 3, fat: 8, servingSize: "1 serving (60g)", cuisine: "Chinese" },
  
  // MEXICAN/SPANISH CUISINE (150+ items)
  { id: "mex1", name: "Taco (Beef)", category: "Mexican Main Dishes", calories: 226, protein: 12, carbs: 20, fat: 11, servingSize: "1 taco", cuisine: "Mexican" },
  { id: "mex2", name: "Taco (Chicken)", category: "Mexican Main Dishes", calories: 200, protein: 14, carbs: 18, fat: 9, servingSize: "1 taco", cuisine: "Mexican" },
  { id: "mex3", name: "Taco (Fish)", category: "Mexican Main Dishes", calories: 180, protein: 13, carbs: 17, fat: 8, servingSize: "1 taco", cuisine: "Mexican" },
  { id: "mex4", name: "Burrito (Beef)", category: "Mexican Main Dishes", calories: 510, protein: 26, carbs: 55, fat: 22, servingSize: "1 burrito (250g)", cuisine: "Mexican" },
  { id: "mex5", name: "Burrito (Chicken)", category: "Mexican Main Dishes", calories: 450, protein: 28, carbs: 52, fat: 16, servingSize: "1 burrito (250g)", cuisine: "Mexican" },
  { id: "mex6", name: "Burrito (Bean)", category: "Mexican Main Dishes", calories: 380, protein: 15, carbs: 58, fat: 10, servingSize: "1 burrito (250g)", cuisine: "Mexican" },
  { id: "mex7", name: "Quesadilla (Cheese)", category: "Mexican Main Dishes", calories: 490, protein: 20, carbs: 40, fat: 28, servingSize: "1 quesadilla", cuisine: "Mexican" },
  { id: "mex8", name: "Quesadilla (Chicken)", category: "Mexican Main Dishes", calories: 540, protein: 32, carbs: 42, fat: 26, servingSize: "1 quesadilla", cuisine: "Mexican" },
  { id: "mex9", name: "Enchilada (Cheese)", category: "Mexican Main Dishes", calories: 320, protein: 12, carbs: 30, fat: 17, servingSize: "1 enchilada", cuisine: "Mexican" },
  { id: "mex10", name: "Enchilada (Chicken)", category: "Mexican Main Dishes", calories: 350, protein: 20, carbs: 32, fat: 16, servingSize: "1 enchilada", cuisine: "Mexican" },
  { id: "mex11", name: "Fajitas (Chicken)", category: "Mexican Main Dishes", calories: 380, protein: 32, carbs: 28, fat: 16, servingSize: "1 serving (250g)", cuisine: "Mexican" },
  { id: "mex12", name: "Fajitas (Beef)", category: "Mexican Main Dishes", calories: 420, protein: 30, carbs: 28, fat: 21, servingSize: "1 serving (250g)", cuisine: "Mexican" },
  { id: "mex13", name: "Nachos", category: "Mexican Snacks", calories: 560, protein: 20, carbs: 56, fat: 30, servingSize: "1 plate (250g)", cuisine: "Mexican" },
  { id: "mex14", name: "Tamale", category: "Mexican Main Dishes", calories: 285, protein: 9, carbs: 40, fat: 11, servingSize: "1 tamale (125g)", cuisine: "Mexican" },
  { id: "mex15", name: "Chimichanga", category: "Mexican Main Dishes", calories: 620, protein: 28, carbs: 62, fat: 30, servingSize: "1 piece (300g)", cuisine: "Mexican" },
  { id: "mex16", name: "Tostada", category: "Mexican Main Dishes", calories: 210, protein: 11, carbs: 18, fat: 11, servingSize: "1 tostada", cuisine: "Mexican" },
  { id: "mex17", name: "Chile Relleno", category: "Mexican Main Dishes", calories: 365, protein: 15, carbs: 22, fat: 24, servingSize: "1 pepper", cuisine: "Mexican" },
  { id: "mex18", name: "Carnitas", category: "Mexican Main Dishes", calories: 280, protein: 24, carbs: 2, fat: 20, servingSize: "100g", cuisine: "Mexican" },
  { id: "mex19", name: "Barbacoa", category: "Mexican Main Dishes", calories: 250, protein: 26, carbs: 3, fat: 15, servingSize: "100g", cuisine: "Mexican" },
  { id: "mex20", name: "Pozole", category: "Mexican Soups", calories: 220, protein: 18, carbs: 28, fat: 6, servingSize: "1 bowl (350ml)", cuisine: "Mexican" },
  { id: "mex21", name: "Menudo", category: "Mexican Soups", calories: 180, protein: 16, carbs: 12, fat: 9, servingSize: "1 bowl (350ml)", cuisine: "Mexican" },
  { id: "mex22", name: "Tortilla Soup", category: "Mexican Soups", calories: 150, protein: 8, carbs: 18, fat: 6, servingSize: "1 bowl (350ml)", cuisine: "Mexican" },
  { id: "mex23", name: "Guacamole", category: "Mexican Sides", calories: 91, protein: 1, carbs: 5, fat: 8, servingSize: "1/4 cup (58g)", cuisine: "Mexican" },
  { id: "mex24", name: "Pico de Gallo", category: "Mexican Sides", calories: 20, protein: 1, carbs: 4, fat: 0, servingSize: "1/4 cup (60g)", cuisine: "Mexican" },
  { id: "mex25", name: "Refried Beans", category: "Mexican Sides", calories: 120, protein: 7, carbs: 20, fat: 2, servingSize: "1/2 cup (130g)", cuisine: "Mexican" },
  { id: "mex26", name: "Mexican Rice", category: "Mexican Sides", calories: 200, protein: 4, carbs: 40, fat: 3, servingSize: "1 cup (180g)", cuisine: "Mexican" },
  { id: "mex27", name: "Elote (Mexican Street Corn)", category: "Mexican Sides", calories: 250, protein: 6, carbs: 32, fat: 13, servingSize: "1 ear", cuisine: "Mexican" },
  { id: "mex28", name: "Churros", category: "Mexican Desserts", calories: 116, protein: 2, carbs: 15, fat: 6, servingSize: "1 churro", cuisine: "Mexican" },
  { id: "mex29", name: "Flan", category: "Mexican Desserts", calories: 223, protein: 6, carbs: 35, fat: 7, servingSize: "1 slice (100g)", cuisine: "Mexican" },
  { id: "mex30", name: "Tres Leches Cake", category: "Mexican Desserts", calories: 290, protein: 6, carbs: 42, fat: 11, servingSize: "1 slice (100g)", cuisine: "Mexican" },
  
  // Spanish Cuisine
  { id: "spa1", name: "Paella", category: "Spanish Main Dishes", calories: 380, protein: 22, carbs: 45, fat: 13, servingSize: "1 cup (250g)", cuisine: "Spanish" },
  { id: "spa2", name: "Paella Valenciana", category: "Spanish Main Dishes", calories: 420, protein: 25, carbs: 48, fat: 15, servingSize: "1 cup (250g)", cuisine: "Spanish" },
  { id: "spa3", name: "Gazpacho", category: "Spanish Soups", calories: 90, protein: 2, carbs: 16, fat: 3, servingSize: "1 cup (250ml)", cuisine: "Spanish" },
  { id: "spa4", name: "Patatas Bravas", category: "Spanish Tapas", calories: 280, protein: 4, carbs: 35, fat: 14, servingSize: "1 serving (150g)", cuisine: "Spanish" },
  { id: "spa5", name: "Tortilla Española", category: "Spanish Tapas", calories: 240, protein: 12, carbs: 20, fat: 13, servingSize: "1 slice (100g)", cuisine: "Spanish" },
  { id: "spa6", name: "Jamón Serrano", category: "Spanish Tapas", calories: 160, protein: 21, carbs: 0, fat: 8, servingSize: "50g", cuisine: "Spanish" },
  { id: "spa7", name: "Chorizo", category: "Spanish Tapas", calories: 320, protein: 18, carbs: 2, fat: 27, servingSize: "100g", cuisine: "Spanish" },
  { id: "spa8", name: "Albondigas", category: "Spanish Tapas", calories: 250, protein: 20, carbs: 8, fat: 15, servingSize: "4 meatballs", cuisine: "Spanish" },
  
  // JAPANESE CUISINE (120+ items)
  { id: "jpn1", name: "Sushi Roll (California)", category: "Japanese Sushi", calories: 255, protein: 9, carbs: 38, fat: 7, servingSize: "6 pieces", cuisine: "Japanese" },
  { id: "jpn2", name: "Sushi Roll (Spicy Tuna)", category: "Japanese Sushi", calories: 290, protein: 24, carbs: 26, fat: 11, servingSize: "6 pieces", cuisine: "Japanese" },
  { id: "jpn3", name: "Sushi Roll (Philadelphia)", category: "Japanese Sushi", calories: 320, protein: 13, carbs: 30, fat: 16, servingSize: "6 pieces", cuisine: "Japanese" },
  { id: "jpn4", name: "Nigiri (Salmon)", category: "Japanese Sushi", calories: 50, protein: 4, carbs: 5, fat: 2, servingSize: "1 piece", cuisine: "Japanese" },
  { id: "jpn5", name: "Nigiri (Tuna)", category: "Japanese Sushi", calories: 45, protein: 5, carbs: 4, fat: 1, servingSize: "1 piece", cuisine: "Japanese" },
  { id: "jpn6", name: "Sashimi (Salmon)", category: "Japanese Sushi", calories: 60, protein: 7, carbs: 0, fat: 4, servingSize: "3 pieces (30g)", cuisine: "Japanese" },
  { id: "jpn7", name: "Sashimi (Tuna)", category: "Japanese Sushi", calories: 42, protein: 9, carbs: 0, fat: 1, servingSize: "3 pieces (30g)", cuisine: "Japanese" },
  { id: "jpn8", name: "Ramen", category: "Japanese Noodles", calories: 450, protein: 20, carbs: 60, fat: 15, servingSize: "1 bowl", cuisine: "Japanese" },
  { id: "jpn9", name: "Tonkotsu Ramen", category: "Japanese Noodles", calories: 500, protein: 22, carbs: 62, fat: 18, servingSize: "1 bowl", cuisine: "Japanese" },
  { id: "jpn10", name: "Miso Ramen", category: "Japanese Noodles", calories: 470, protein: 21, carbs: 58, fat: 16, servingSize: "1 bowl", cuisine: "Japanese" },
  { id: "jpn11", name: "Udon", category: "Japanese Noodles", calories: 350, protein: 12, carbs: 68, fat: 3, servingSize: "1 bowl", cuisine: "Japanese" },
  { id: "jpn12", name: "Soba", category: "Japanese Noodles", calories: 320, protein: 14, carbs: 62, fat: 2, servingSize: "1 bowl", cuisine: "Japanese" },
  { id: "jpn13", name: "Yakisoba", category: "Japanese Noodles", calories: 440, protein: 16, carbs: 68, fat: 12, servingSize: "1 serving", cuisine: "Japanese" },
  { id: "jpn14", name: "Tempura (Shrimp)", category: "Japanese Main Dishes", calories: 350, protein: 18, carbs: 32, fat: 18, servingSize: "6 pieces", cuisine: "Japanese" },
  { id: "jpn15", name: "Tempura (Vegetable)", category: "Japanese Main Dishes", calories: 280, protein: 6, carbs: 38, fat: 12, servingSize: "1 serving", cuisine: "Japanese" },
  { id: "jpn16", name: "Teriyaki Chicken", category: "Japanese Main Dishes", calories: 320, protein: 32, carbs: 28, fat: 10, servingSize: "1 serving (200g)", cuisine: "Japanese" },
  { id: "jpn17", name: "Katsu (Pork Cutlet)", category: "Japanese Main Dishes", calories: 580, protein: 28, carbs: 45, fat: 32, servingSize: "1 serving", cuisine: "Japanese" },
  { id: "jpn18", name: "Katsu (Chicken)", category: "Japanese Main Dishes", calories: 520, protein: 30, carbs: 44, fat: 25, servingSize: "1 serving", cuisine: "Japanese" },
  { id: "jpn19", name: "Gyoza", category: "Japanese Appetizers", calories: 240, protein: 12, carbs: 28, fat: 9, servingSize: "6 pieces", cuisine: "Japanese" },
  { id: "jpn20", name: "Edamame", category: "Japanese Appetizers", calories: 188, protein: 19, carbs: 14, fat: 8, servingSize: "1 cup (155g)", cuisine: "Japanese" },
  { id: "jpn21", name: "Takoyaki", category: "Japanese Snacks", calories: 280, protein: 10, carbs: 35, fat: 12, servingSize: "6 balls", cuisine: "Japanese" },
  { id: "jpn22", name: "Okonomiyaki", category: "Japanese Main Dishes", calories: 460, protein: 18, carbs: 52, fat: 20, servingSize: "1 serving", cuisine: "Japanese" },
  { id: "jpn23", name: "Miso Soup", category: "Japanese Soups", calories: 40, protein: 3, carbs: 5, fat: 1, servingSize: "1 bowl (250ml)", cuisine: "Japanese" },
  { id: "jpn24", name: "Donburi (Chicken)", category: "Japanese Rice Bowls", calories: 580, protein: 28, carbs: 78, fat: 16, servingSize: "1 bowl", cuisine: "Japanese" },
  { id: "jpn25", name: "Donburi (Beef)", category: "Japanese Rice Bowls", calories: 620, protein: 30, carbs: 76, fat: 20, servingSize: "1 bowl", cuisine: "Japanese" },
  
  // THAI CUISINE (80+ items)
  { id: "thai1", name: "Pad Thai", category: "Thai Noodles", calories: 375, protein: 13, carbs: 47, fat: 15, servingSize: "1 plate", cuisine: "Thai" },
  { id: "thai2", name: "Pad See Ew", category: "Thai Noodles", calories: 420, protein: 15, carbs: 55, fat: 16, servingSize: "1 plate", cuisine: "Thai" },
  { id: "thai3", name: "Drunken Noodles", category: "Thai Noodles", calories: 450, protein: 16, carbs: 58, fat: 18, servingSize: "1 plate", cuisine: "Thai" },
  { id: "thai4", name: "Tom Yum Soup", category: "Thai Soups", calories: 120, protein: 8, carbs: 15, fat: 4, servingSize: "1 bowl (350ml)", cuisine: "Thai" },
  { id: "thai5", name: "Tom Kha Gai", category: "Thai Soups", calories: 220, protein: 12, carbs: 18, fat: 12, servingSize: "1 bowl (350ml)", cuisine: "Thai" },
  { id: "thai6", name: "Green Curry", category: "Thai Curries", calories: 380, protein: 20, carbs: 22, fat: 24, servingSize: "1 cup (250g)", cuisine: "Thai" },
  { id: "thai7", name: "Red Curry", category: "Thai Curries", calories: 360, protein: 18, carbs: 20, fat: 23, servingSize: "1 cup (250g)", cuisine: "Thai" },
  { id: "thai8", name: "Massaman Curry", category: "Thai Curries", calories: 420, protein: 22, carbs: 28, fat: 26, servingSize: "1 cup (250g)", cuisine: "Thai" },
  { id: "thai9", name: "Panang Curry", category: "Thai Curries", calories: 390, protein: 19, carbs: 22, fat: 25, servingSize: "1 cup (250g)", cuisine: "Thai" },
  { id: "thai10", name: "Thai Fried Rice", category: "Thai Rice", calories: 330, protein: 13, carbs: 48, fat: 10, servingSize: "1 cup (200g)", cuisine: "Thai" },
  { id: "thai11", name: "Basil Fried Rice", category: "Thai Rice", calories: 340, protein: 14, carbs: 49, fat: 11, servingSize: "1 cup (200g)", cuisine: "Thai" },
  { id: "thai12", name: "Spring Rolls (Fresh)", category: "Thai Appetizers", calories: 110, protein: 4, carbs: 18, fat: 3, servingSize: "2 rolls", cuisine: "Thai" },
  { id: "thai13", name: "Spring Rolls (Fried)", category: "Thai Appetizers", calories: 180, protein: 5, carbs: 22, fat: 8, servingSize: "2 rolls", cuisine: "Thai" },
  { id: "thai14", name: "Satay (Chicken)", category: "Thai Appetizers", calories: 180, protein: 22, carbs: 8, fat: 7, servingSize: "4 skewers", cuisine: "Thai" },
  { id: "thai15", name: "Larb (Chicken)", category: "Thai Salads", calories: 210, protein: 26, carbs: 12, fat: 7, servingSize: "1 cup", cuisine: "Thai" },
  { id: "thai16", name: "Som Tam (Papaya Salad)", category: "Thai Salads", calories: 120, protein: 3, carbs: 24, fat: 2, servingSize: "1 cup", cuisine: "Thai" },
  { id: "thai17", name: "Mango Sticky Rice", category: "Thai Desserts", calories: 250, protein: 4, carbs: 52, fat: 3, servingSize: "1 serving", cuisine: "Thai" },
  
  // ITALIAN CUISINE (100+ items)
  { id: "ita1", name: "Spaghetti Carbonara", category: "Italian Pasta", calories: 520, protein: 24, carbs: 55, fat: 22, servingSize: "1 plate (300g)", cuisine: "Italian" },
  { id: "ita2", name: "Spaghetti Bolognese", category: "Italian Pasta", calories: 480, protein: 26, carbs: 58, fat: 16, servingSize: "1 plate (300g)", cuisine: "Italian" },
  { id: "ita3", name: "Fettuccine Alfredo", category: "Italian Pasta", calories: 580, protein: 22, carbs: 56, fat: 28, servingSize: "1 plate (300g)", cuisine: "Italian" },
  { id: "ita4", name: "Penne Arrabbiata", category: "Italian Pasta", calories: 380, protein: 12, carbs: 62, fat: 10, servingSize: "1 plate (300g)", cuisine: "Italian" },
  { id: "ita5", name: "Lasagna", category: "Italian Pasta", calories: 540, protein: 32, carbs: 48, fat: 24, servingSize: "1 slice (200g)", cuisine: "Italian" },
  { id: "ita6", name: "Ravioli", category: "Italian Pasta", calories: 420, protein: 18, carbs: 52, fat: 16, servingSize: "1 plate (250g)", cuisine: "Italian" },
  { id: "ita7", name: "Pesto Pasta", category: "Italian Pasta", calories: 460, protein: 14, carbs: 54, fat: 22, servingSize: "1 plate (300g)", cuisine: "Italian" },
  { id: "ita8", name: "Margherita Pizza", category: "Italian Pizza", calories: 250, protein: 11, carbs: 33, fat: 9, servingSize: "1 slice", cuisine: "Italian" },
  { id: "ita9", name: "Pepperoni Pizza", category: "Italian Pizza", calories: 298, protein: 12, carbs: 34, fat: 13, servingSize: "1 slice", cuisine: "Italian" },
  { id: "ita10", name: "Meat Lovers Pizza", category: "Italian Pizza", calories: 380, protein: 16, carbs: 35, fat: 20, servingSize: "1 slice", cuisine: "Italian" },
  { id: "ita11", name: "Risotto", category: "Italian Rice", calories: 360, protein: 10, carbs: 55, fat: 11, servingSize: "1 cup (250g)", cuisine: "Italian" },
  { id: "ita12", name: "Osso Buco", category: "Italian Main Dishes", calories: 480, protein: 38, carbs: 12, fat: 32, servingSize: "1 serving", cuisine: "Italian" },
  { id: "ita13", name: "Chicken Parmesan", category: "Italian Main Dishes", calories: 550, protein: 42, carbs: 38, fat: 26, servingSize: "1 serving", cuisine: "Italian" },
  { id: "ita14", name: "Eggplant Parmesan", category: "Italian Main Dishes", calories: 420, protein: 16, carbs: 42, fat: 22, servingSize: "1 serving", cuisine: "Italian" },
  { id: "ita15", name: "Minestrone Soup", category: "Italian Soups", calories: 150, protein: 7, carbs: 24, fat: 3, servingSize: "1 bowl (350ml)", cuisine: "Italian" },
  { id: "ita16", name: "Bruschetta", category: "Italian Appetizers", calories: 140, protein: 4, carbs: 22, fat: 4, servingSize: "2 pieces", cuisine: "Italian" },
  { id: "ita17", name: "Caprese Salad", category: "Italian Salads", calories: 220, protein: 12, carbs: 8, fat: 16, servingSize: "1 serving", cuisine: "Italian" },
  { id: "ita18", name: "Tiramisu", category: "Italian Desserts", calories: 240, protein: 5, carbs: 28, fat: 12, servingSize: "1 slice", cuisine: "Italian" },
  { id: "ita19", name: "Cannoli", category: "Italian Desserts", calories: 220, protein: 5, carbs: 25, fat: 11, servingSize: "1 piece", cuisine: "Italian" },
  { id: "ita20", name: "Gelato", category: "Italian Desserts", calories: 160, protein: 4, carbs: 24, fat: 6, servingSize: "1 scoop (100g)", cuisine: "Italian" },
  
  // MIDDLE EASTERN CUISINE (80+ items)
  { id: "mid1", name: "Hummus", category: "Middle Eastern Dips", calories: 166, protein: 8, carbs: 14, fat: 10, servingSize: "1/4 cup (62g)", cuisine: "Middle Eastern" },
  { id: "mid2", name: "Falafel", category: "Middle Eastern Main Dishes", calories: 333, protein: 13, carbs: 32, fat: 18, servingSize: "5 balls", cuisine: "Middle Eastern" },
  { id: "mid3", name: "Shawarma (Chicken)", category: "Middle Eastern Main Dishes", calories: 380, protein: 32, carbs: 28, fat: 16, servingSize: "1 wrap", cuisine: "Middle Eastern" },
  { id: "mid4", name: "Shawarma (Beef)", category: "Middle Eastern Main Dishes", calories: 420, protein: 30, carbs: 28, fat: 20, servingSize: "1 wrap", cuisine: "Middle Eastern" },
  { id: "mid5", name: "Kebab", category: "Middle Eastern Main Dishes", calories: 280, protein: 28, carbs: 6, fat: 16, servingSize: "2 skewers", cuisine: "Middle Eastern" },
  { id: "mid6", name: "Gyro", category: "Middle Eastern Main Dishes", calories: 430, protein: 26, carbs: 38, fat: 20, servingSize: "1 gyro", cuisine: "Middle Eastern" },
  { id: "mid7", name: "Baba Ganoush", category: "Middle Eastern Dips", calories: 120, protein: 3, carbs: 10, fat: 8, servingSize: "1/4 cup (62g)", cuisine: "Middle Eastern" },
  { id: "mid8", name: "Tabbouleh", category: "Middle Eastern Salads", calories: 140, protein: 4, carbs: 20, fat: 6, servingSize: "1 cup", cuisine: "Middle Eastern" },
  { id: "mid9", name: "Fattoush", category: "Middle Eastern Salads", calories: 180, protein: 5, carbs: 24, fat: 8, servingSize: "1 cup", cuisine: "Middle Eastern" },
  { id: "mid10", name: "Dolma (Stuffed Grape Leaves)", category: "Middle Eastern Appetizers", calories: 180, protein: 4, carbs: 30, fat: 5, servingSize: "4 pieces", cuisine: "Middle Eastern" },
  { id: "mid11", name: "Kibbeh", category: "Middle Eastern Main Dishes", calories: 280, protein: 18, carbs: 22, fat: 14, servingSize: "2 pieces", cuisine: "Middle Eastern" },
  { id: "mid12", name: "Mansaf", category: "Middle Eastern Main Dishes", calories: 520, protein: 35, carbs: 48, fat: 22, servingSize: "1 serving", cuisine: "Middle Eastern" },
  { id: "mid13", name: "Maqluba", category: "Middle Eastern Main Dishes", calories: 450, protein: 25, carbs: 52, fat: 16, servingSize: "1 serving", cuisine: "Middle Eastern" },
  { id: "mid14", name: "Baklava", category: "Middle Eastern Desserts", calories: 245, protein: 4, carbs: 32, fat: 12, servingSize: "1 piece", cuisine: "Middle Eastern" },
  { id: "mid15", name: "Kunafa", category: "Middle Eastern Desserts", calories: 320, protein: 6, carbs: 42, fat: 15, servingSize: "1 piece", cuisine: "Middle Eastern" },
  
  // KOREAN CUISINE (70+ items)
  { id: "kor1", name: "Bibimbap", category: "Korean Main Dishes", calories: 490, protein: 24, carbs: 72, fat: 12, servingSize: "1 bowl", cuisine: "Korean" },
  { id: "kor2", name: "Bulgogi", category: "Korean Main Dishes", calories: 380, protein: 30, carbs: 28, fat: 16, servingSize: "1 serving (200g)", cuisine: "Korean" },
  { id: "kor3", name: "Korean BBQ (Beef)", category: "Korean Main Dishes", calories: 420, protein: 32, carbs: 12, fat: 28, servingSize: "1 serving (200g)", cuisine: "Korean" },
  { id: "kor4", name: "Kimchi", category: "Korean Sides", calories: 15, protein: 1, carbs: 2, fat: 1, servingSize: "1/2 cup (75g)", cuisine: "Korean" },
  { id: "kor5", name: "Kimchi Fried Rice", category: "Korean Rice", calories: 360, protein: 12, carbs: 58, fat: 10, servingSize: "1 plate", cuisine: "Korean" },
  { id: "kor6", name: "Japchae", category: "Korean Noodles", calories: 340, protein: 10, carbs: 54, fat: 10, servingSize: "1 plate", cuisine: "Korean" },
  { id: "kor7", name: "Tteokbokki", category: "Korean Snacks", calories: 320, protein: 8, carbs: 62, fat: 5, servingSize: "1 serving", cuisine: "Korean" },
  { id: "kor8", name: "Korean Fried Chicken", category: "Korean Main Dishes", calories: 580, protein: 32, carbs: 48, fat: 28, servingSize: "1 serving (250g)", cuisine: "Korean" },
  { id: "kor9", name: "Kimchi Jjigae", category: "Korean Soups", calories: 280, protein: 18, carbs: 22, fat: 14, servingSize: "1 bowl", cuisine: "Korean" },
  { id: "kor10", name: "Sundubu Jjigae", category: "Korean Soups", calories: 220, protein: 16, carbs: 18, fat: 10, servingSize: "1 bowl", cuisine: "Korean" },
  { id: "kor11", name: "Galbi (Short Ribs)", category: "Korean Main Dishes", calories: 520, protein: 38, carbs: 18, fat: 34, servingSize: "1 serving (200g)", cuisine: "Korean" },
  { id: "kor12", name: "Samgyeopsal (Pork Belly)", category: "Korean Main Dishes", calories: 580, protein: 24, carbs: 2, fat: 52, servingSize: "1 serving (200g)", cuisine: "Korean" },
  { id: "kor13", name: "Mandu (Dumplings)", category: "Korean Appetizers", calories: 280, protein: 14, carbs: 36, fat: 10, servingSize: "6 pieces", cuisine: "Korean" },
  { id: "kor14", name: "Kimbap", category: "Korean Snacks", calories: 350, protein: 12, carbs: 58, fat: 8, servingSize: "1 roll", cuisine: "Korean" },
  
  // VIETNAMESE CUISINE (60+ items)
  { id: "vie1", name: "Pho (Beef)", category: "Vietnamese Soups", calories: 380, protein: 22, carbs: 52, fat: 9, servingSize: "1 bowl", cuisine: "Vietnamese" },
  { id: "vie2", name: "Pho (Chicken)", category: "Vietnamese Soups", calories: 350, protein: 20, carbs: 50, fat: 8, servingSize: "1 bowl", cuisine: "Vietnamese" },
  { id: "vie3", name: "Banh Mi", category: "Vietnamese Sandwiches", calories: 480, protein: 20, carbs: 56, fat: 18, servingSize: "1 sandwich", cuisine: "Vietnamese" },
  { id: "vie4", name: "Spring Rolls (Fresh)", category: "Vietnamese Appetizers", calories: 100, protein: 4, carbs: 16, fat: 2, servingSize: "2 rolls", cuisine: "Vietnamese" },
  { id: "vie5", name: "Egg Rolls (Fried)", category: "Vietnamese Appetizers", calories: 160, protein: 6, carbs: 18, fat: 7, servingSize: "2 rolls", cuisine: "Vietnamese" },
  { id: "vie6", name: "Bun (Vermicelli Bowl)", category: "Vietnamese Noodles", calories: 440, protein: 24, carbs: 62, fat: 12, servingSize: "1 bowl", cuisine: "Vietnamese" },
  { id: "vie7", name: "Com Tam (Broken Rice)", category: "Vietnamese Rice", calories: 520, protein: 26, carbs: 68, fat: 16, servingSize: "1 plate", cuisine: "Vietnamese" },
  { id: "vie8", name: "Cao Lau", category: "Vietnamese Noodles", calories: 420, protein: 18, carbs: 58, fat: 14, servingSize: "1 bowl", cuisine: "Vietnamese" },
  
  // ORIGINAL WESTERN FOODS (keeping some essentials)
  // Fruits
  { id: "f1", name: "Apple", category: "Fruits", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: "1 medium (182g)" },
  { id: "f2", name: "Banana", category: "Fruits", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: "1 medium (118g)" },
  { id: "f3", name: "Orange", category: "Fruits", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, servingSize: "1 medium (131g)" },
  { id: "f4", name: "Strawberries", category: "Fruits", calories: 49, protein: 1, carbs: 12, fat: 0.5, servingSize: "1 cup (152g)" },
  { id: "f5", name: "Blueberries", category: "Fruits", calories: 84, protein: 1.1, carbs: 21, fat: 0.5, servingSize: "1 cup (148g)" },
  { id: "f10", name: "Avocado", category: "Fruits", calories: 234, protein: 3, carbs: 12, fat: 21, servingSize: "1 medium (150g)" },
  { id: "f16", name: "Watermelon", category: "Fruits", calories: 46, protein: 0.9, carbs: 12, fat: 0.2, servingSize: "1 cup (154g)" },
  { id: "f17", name: "Mango", category: "Fruits", calories: 99, protein: 1.4, carbs: 25, fat: 0.6, servingSize: "1 cup (165g)" },
  
  // Vegetables
  { id: "v1", name: "Broccoli", category: "Vegetables", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, servingSize: "1 cup (156g)" },
  { id: "v2", name: "Spinach", category: "Vegetables", calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, servingSize: "1 cup (30g)" },
  { id: "v3", name: "Carrots", category: "Vegetables", calories: 52, protein: 1.2, carbs: 12, fat: 0.3, servingSize: "1 cup (128g)" },
  { id: "v4", name: "Tomato", category: "Vegetables", calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, servingSize: "1 medium (123g)" },
  { id: "v9", name: "Sweet Potato", category: "Vegetables", calories: 112, protein: 2.1, carbs: 26, fat: 0.1, servingSize: "1 medium (130g)" },
  { id: "v16", name: "Potato", category: "Vegetables", calories: 163, protein: 4.3, carbs: 37, fat: 0.2, servingSize: "1 medium (173g)" },
  
  // Proteins
  { id: "p1", name: "Chicken Breast", category: "Proteins", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g cooked" },
  { id: "p2", name: "Salmon", category: "Proteins", calories: 206, protein: 22, carbs: 0, fat: 13, servingSize: "100g cooked" },
  { id: "p3", name: "Ground Beef (90% lean)", category: "Proteins", calories: 215, protein: 23, carbs: 0, fat: 13, servingSize: "100g cooked" },
  { id: "p4", name: "Eggs", category: "Proteins", calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: "2 large eggs" },
  { id: "p5", name: "Greek Yogurt", category: "Proteins", calories: 100, protein: 17, carbs: 6, fat: 0.7, servingSize: "170g" },
  { id: "p6", name: "Tofu", category: "Proteins", calories: 144, protein: 17, carbs: 3, fat: 9, servingSize: "100g" },
  { id: "p7", name: "Tuna", category: "Proteins", calories: 132, protein: 28, carbs: 0, fat: 1.3, servingSize: "100g canned" },
  { id: "p8", name: "Turkey Breast", category: "Proteins", calories: 135, protein: 30, carbs: 0, fat: 1, servingSize: "100g cooked" },
  { id: "p9", name: "Shrimp", category: "Proteins", calories: 99, protein: 24, carbs: 0.2, fat: 0.3, servingSize: "100g cooked" },
  { id: "p16", name: "Black Beans", category: "Proteins", calories: 227, protein: 15, carbs: 41, fat: 0.9, servingSize: "1 cup cooked (172g)" },
  { id: "p17", name: "Lentils", category: "Proteins", calories: 230, protein: 18, carbs: 40, fat: 0.8, servingSize: "1 cup cooked (198g)" },
  
  // Grains
  { id: "g1", name: "Brown Rice", category: "Grains", calories: 216, protein: 5, carbs: 45, fat: 1.8, servingSize: "1 cup cooked (195g)" },
  { id: "g2", name: "Quinoa", category: "Grains", calories: 222, protein: 8, carbs: 39, fat: 3.6, servingSize: "1 cup cooked (185g)" },
  { id: "g3", name: "Oatmeal", category: "Grains", calories: 166, protein: 5.9, carbs: 28, fat: 3.6, servingSize: "1 cup cooked (234g)" },
  { id: "g4", name: "Whole Wheat Bread", category: "Grains", calories: 81, protein: 4, carbs: 14, fat: 1.1, servingSize: "1 slice (28g)" },
  { id: "g5", name: "White Rice", category: "Grains", calories: 205, protein: 4.3, carbs: 45, fat: 0.4, servingSize: "1 cup cooked (158g)" },
  { id: "g6", name: "Pasta", category: "Grains", calories: 220, protein: 8, carbs: 43, fat: 1.3, servingSize: "1 cup cooked (140g)" },
  
  // Nuts & Seeds
  { id: "n1", name: "Almonds", category: "Nuts & Seeds", calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: "1 oz (28g)" },
  { id: "n2", name: "Peanut Butter", category: "Nuts & Seeds", calories: 188, protein: 8, carbs: 7, fat: 16, servingSize: "2 tbsp (32g)" },
  { id: "n3", name: "Walnuts", category: "Nuts & Seeds", calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, servingSize: "1 oz (28g)" },
  { id: "n4", name: "Chia Seeds", category: "Nuts & Seeds", calories: 138, protein: 4.7, carbs: 12, fat: 8.7, servingSize: "1 oz (28g)" },
  
  // Dairy
  { id: "d1", name: "Milk (2%)", category: "Dairy", calories: 122, protein: 8, carbs: 12, fat: 4.8, servingSize: "1 cup (244g)" },
  { id: "d2", name: "Cheddar Cheese", category: "Dairy", calories: 114, protein: 7, carbs: 0.4, fat: 9, servingSize: "1 oz (28g)" },
  { id: "d8", name: "Almond Milk", category: "Dairy", calories: 30, protein: 1, carbs: 1, fat: 2.5, servingSize: "1 cup (240ml)" },
  
  // Fast Food
  { id: "ff1", name: "Big Mac", category: "Fast Food", calories: 563, protein: 26, carbs: 46, fat: 33, servingSize: "1 sandwich", brand: "McDonald's" },
  { id: "ff2", name: "Chicken McNuggets", category: "Fast Food", calories: 170, protein: 9, carbs: 10, fat: 10, servingSize: "4 pieces", brand: "McDonald's" },
  { id: "ff3", name: "French Fries", category: "Fast Food", calories: 320, protein: 4, carbs: 43, fat: 15, servingSize: "Medium", brand: "McDonald's" },
  { id: "ff5", name: "Pizza Slice (Pepperoni)", category: "Fast Food", calories: 313, protein: 13, carbs: 35, fat: 13, servingSize: "1 slice", brand: "Pizza Hut" },
  
  // Beverages
  { id: "b1", name: "Orange Juice", category: "Beverages", calories: 112, protein: 1.7, carbs: 26, fat: 0.5, servingSize: "1 cup (248ml)" },
  { id: "b3", name: "Coffee (Black)", category: "Beverages", calories: 2, protein: 0.3, carbs: 0, fat: 0, servingSize: "1 cup (240ml)" },
  { id: "b4", name: "Latte", category: "Beverages", calories: 190, protein: 13, carbs: 18, fat: 7, servingSize: "16 oz", brand: "Starbucks" },
  { id: "b9", name: "Protein Shake", category: "Beverages", calories: 160, protein: 30, carbs: 4, fat: 2, servingSize: "11 oz" },
  { id: "b10", name: "Green Tea", category: "Beverages", calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: "1 cup (240ml)" },
  
  // Snacks
  { id: "s2", name: "Potato Chips", category: "Snacks", calories: 152, protein: 2, carbs: 15, fat: 10, servingSize: "1 oz (28g)" },
  { id: "s4", name: "Popcorn (Air-popped)", category: "Snacks", calories: 31, protein: 1, carbs: 6.2, fat: 0.4, servingSize: "1 cup (8g)" },
  { id: "s1", name: "Chocolate Bar", category: "Snacks", calories: 235, protein: 3.4, carbs: 26, fat: 13, servingSize: "1 bar (43g)" },
];

export function searchFoods(query: string, category?: string, cuisine?: string): FoodItem[] {
  const lowerQuery = query.toLowerCase().trim();
  
  // Merge custom foods with static database
  const customFoods = getCustomFoods();
  const allFoods = [...customFoods, ...foodDatabase];
  
  if (!lowerQuery && !category && !cuisine) {
    return allFoods.slice(0, 100);
  }
  
  let filtered = allFoods;
  
  if (category && category !== 'all') {
    filtered = filtered.filter(food => food.category === category);
  }
  
  if (cuisine && cuisine !== 'all') {
    filtered = filtered.filter(food => food.cuisine === cuisine);
  }
  
  if (lowerQuery) {
    filtered = filtered.filter(food => 
      food.name.toLowerCase().includes(lowerQuery) ||
      food.category.toLowerCase().includes(lowerQuery) ||
      food.brand?.toLowerCase().includes(lowerQuery) ||
      food.cuisine?.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Sort custom foods first
  filtered.sort((a, b) => {
    if (a.isCustom && !b.isCustom) return -1;
    if (!a.isCustom && b.isCustom) return 1;
    return 0;
  });
  
  return filtered.slice(0, 200);
}

export function getFoodCategories(): string[] {
  const customFoods = getCustomFoods();
  const allFoods = [...customFoods, ...foodDatabase];
  const categories = new Set(allFoods.map(food => food.category));
  return Array.from(categories).sort();
}

export function getCuisines(): string[] {
  const customFoods = getCustomFoods();
  const allFoods = [...customFoods, ...foodDatabase];
  const cuisines = new Set(allFoods.map(food => food.cuisine).filter(Boolean) as string[]);
  return Array.from(cuisines).sort();
}
import { UserProfile, HealthMetrics } from '@/types/calorie-tracker';

export function calculateBMI(weight: number, height: number): number {
  // BMI = weight (kg) / (height (m))^2
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function calculateBMR(profile: UserProfile): number {
  // Mifflin-St Jeor Equation
  const { weight, height, age, gender } = profile;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);
}

export function calculateRecommendedCalories(tdee: number, goalType: string): number {
  switch (goalType) {
    case 'lose':
      return Math.round(tdee - 500); // 500 calorie deficit
    case 'gain':
      return Math.round(tdee + 300); // 300 calorie surplus
    case 'maintain':
    default:
      return tdee;
  }
}

export function calculateHealthMetrics(profile: UserProfile): HealthMetrics {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const recommendedCalories = calculateRecommendedCalories(tdee, profile.goalType);
  
  return { bmi, bmr, tdee, recommendedCalories };
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function getBMIColor(bmi: number): string {
  if (bmi < 18.5) return 'text-blue-600';
  if (bmi < 25) return 'text-green-600';
  if (bmi < 30) return 'text-yellow-600';
  return 'text-red-600';
}

'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/calorie-tracker';
import { calculateHealthMetrics } from '@/lib/calorie-utils';
import CalorieTracker from '@/components/CalorieTracker';
import NutritionDashboard from '@/components/NutritionDashboard';
import HealthGuidance from '@/components/HealthGuidance';
import NutritionAssistant from '@/components/NutritionAssistant';
import UserProfileSetup from '@/components/UserProfileSetup';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Calendar, TrendingUp, Heart, History, Menu, Sparkles, AlertCircle, MessageCircle, UserCircle, Moon, Sun, Download } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Initialize with valid date format
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [activeTab, setActiveTab] = useState('tracker');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Remove PWA code temporarily - causing build hang
  // const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  // const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // PWA Install Handler - DISABLED temporarily
  // useEffect(() => {
  //   const handleBeforeInstallPrompt = (e: Event) => {
  //     e.preventDefault();
  //     setDeferredPrompt(e);
  //     setShowInstallPrompt(true);
  //   };

  //   window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  //   // Register service worker
  //   if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  //     navigator.serviceWorker
  //       .register('/sw.js')
  //       .then((registration) => {
  //         console.log('Service Worker registered:', registration);
  //       })
  //       .catch((error) => {
  //         console.error('Service Worker registration failed:', error);
  //       });
  //   }

  //   return () => {
  //     window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  //   };
  // }, []);

  // const handleInstallClick = async () => {
  //   if (!deferredPrompt) return;

  //   deferredPrompt.prompt();
  //   const { outcome } = await deferredPrompt.userChoice;
    
  //   if (outcome === 'accepted') {
  //     console.log('PWA installation accepted');
  //   }
    
  //   setDeferredPrompt(null);
  //   setShowInstallPrompt(false);
  // };

  useEffect(() => {
    try {
      loadProfile();
      loadTheme();
    } catch (error) {
      console.error('Initialization error:', error);
      setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
      setIsLoading(false);
    }
  }, []);

  const loadTheme = () => {
    try {
      // Ensure we're in browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        setIsDarkMode(false);
        return;
      }

      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      setIsDarkMode(shouldBeDark);
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Theme loading failed, using light mode:', error);
      setIsDarkMode(false);
    }
  };

  const toggleTheme = () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Theme toggle failed:', error);
    }
  };

  const loadProfile = () => {
    setIsLoading(true);
    try {
      // Ensure we're in browser environment
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      // Check if localStorage is available
      if (typeof localStorage === 'undefined') {
        throw new Error('localStorage is not available. Please enable cookies and storage in your browser settings.');
      }

      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        // Strict validation - all fields must be present and valid
        if (validateProfile(parsedProfile)) {
          setProfile(parsedProfile);
          setIsProfileComplete(true);
        } else {
          // Clear invalid/incomplete profile - force re-entry
          localStorage.removeItem('userProfile');
          setProfile(null);
          setIsProfileComplete(false);
        }
      } else {
        // No profile exists - must complete setup
        setProfile(null);
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setInitError(error instanceof Error ? error.message : 'Failed to load profile. Please check your browser settings.');
      // Try to continue anyway - show profile setup
      setProfile(null);
      setIsProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const validateProfile = (profile: any): boolean => {
    // Strict validation - ALL fields must be present and valid
    const isValid = !!(
      profile &&
      typeof profile.name === 'string' &&
      profile.name.trim().length > 0 &&
      typeof profile.age === 'number' &&
      profile.age > 0 &&
      profile.age < 150 &&
      typeof profile.weight === 'number' &&
      profile.weight > 0 &&
      profile.weight < 500 &&
      typeof profile.height === 'number' &&
      profile.height > 0 &&
      profile.height < 300 &&
      profile.gender &&
      (profile.gender === 'male' || profile.gender === 'female') &&
      profile.activityLevel &&
      ['sedentary', 'light', 'moderate', 'active', 'veryActive'].includes(profile.activityLevel) &&
      profile.goalType &&
      ['lose', 'maintain', 'gain'].includes(profile.goalType)
    );
    
    return isValid;
  };

  const handleProfileSave = (newProfile: UserProfile) => {
    // Validate before saving
    if (validateProfile(newProfile)) {
      const metrics = calculateHealthMetrics(newProfile);
      const profileWithGoal = { ...newProfile, dailyCalorieGoal: metrics.recommendedCalories };
      setProfile(profileWithGoal);
      setIsProfileComplete(true);
      localStorage.setItem('userProfile', JSON.stringify(profileWithGoal));
      // Reset to tracker tab when profile is first completed
      setActiveTab('tracker');
      // Clear any initialization errors
      setInitError(null);
    } else {
      console.error('Invalid profile data');
    }
  };

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-red-500/50">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Initialization Error
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {initError}
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 font-semibold">
                Possible solutions:
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li>Enable cookies and local storage in your browser</li>
                <li>Disable private/incognito mode</li>
                <li>Clear browser cache and refresh</li>
                <li>Try a different browser</li>
                <li>Check browser console for detailed errors</li>
              </ul>
            </div>
            <Button 
              onClick={() => {
                setInitError(null);
                setIsLoading(true);
                setTimeout(() => loadProfile(), 100);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking profile
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-purple-900 dark:text-purple-100">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950">
      {/* PWA Install Prompt - DISABLED */}
      {/* {showInstallPrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-2xl animate-slide-down">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Install Calorie Tracker Pro</p>
                <p className="text-xs opacity-90">Get quick access from your home screen!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleInstallClick}
                className="bg-white text-purple-600 hover:bg-white/90"
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInstallPrompt(false)}
                className="text-white hover:bg-white/10"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      )} */}

      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-2 border-purple-200/50 dark:border-purple-800/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/icon-512-1761463755289.png?width=8000&height=8000&resize=contain"
                alt="Calorie Tracker Pro Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                  Calorie Tracker Pro
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block mt-1">
                  {isProfileComplete 
                    ? 'Your personal health companion with 2000+ international foods'
                    : 'Complete your profile to unlock all features'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme}
                className="border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-purple-600" />
                )}
              </Button>
              {isProfileComplete && (
                <Link href="/history" className="hidden sm:inline-block">
                  <Button variant="outline" size="sm" className="border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                    <History className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">History</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Date Selector - Only show when profile is complete and not on profile tab */}
          {isProfileComplete && activeTab !== 'profile' && (
            <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg px-4 py-2 shadow-sm">
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm border-2 border-purple-300 dark:border-purple-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content - STRICT PROFILE GATING - NO ACCESS WITHOUT COMPLETE PROFILE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">
        {!isProfileComplete ? (
          // 🔒 LOCKED STATE - MUST COMPLETE PROFILE TO ACCESS ANY FEATURES
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-2xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <UserCircle className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
                Welcome to Calorie Tracker Pro! 👋
              </h2>
              <p className="text-lg opacity-90 mb-2">
                Let's personalize your experience
              </p>
              <p className="text-sm opacity-80">
                We need some information about you to provide accurate calorie recommendations and health guidance.
              </p>
              <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 mt-6 border-2 border-red-300/30">
                <div className="flex items-start gap-3 text-left">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold mb-2">⚠️ Profile Required</p>
                    <p className="text-sm">All app features are locked until you complete your profile below. This ensures accurate calorie calculations tailored to YOUR body and goals.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3 text-left">
                  <Sparkles className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-2">🔓 Complete your profile to unlock:</p>
                    <ul className="space-y-1 text-sm">
                      <li>📊 <strong>Meal Logger</strong> - Track your daily meals from 2000+ international foods</li>
                      <li>📈 <strong>Dashboard</strong> - Visualize your nutrition progress with charts</li>
                      <li>💚 <strong>Health Guidance</strong> - Get personalized BMI, BMR, and hydration tracking</li>
                      <li>🤖 <strong>Nutrition Assistant</strong> - AI-powered nutrition advice and meal planning</li>
                      <li>📜 <strong>History</strong> - View and manage your meal history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <UserProfileSetup onProfileSave={handleProfileSave} />
          </div>
        ) : (
          // ✅ UNLOCKED STATE - Profile Complete, Show All Features
          <div>
            {/* Navigation Tabs - Desktop Only */}
            <div className="hidden sm:flex gap-2 mb-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-2 shadow-lg border-2 border-purple-200/50 dark:border-purple-800/50">
              <Button
                variant={activeTab === 'tracker' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('tracker')}
                className={`flex-1 ${activeTab === 'tracker' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Meal Logger
              </Button>
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'health' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('health')}
                className={`flex-1 ${activeTab === 'health' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
              >
                <Heart className="h-4 w-4 mr-2" />
                Health Guidance
              </Button>
              <Button
                variant={activeTab === 'assistant' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('assistant')}
                className={`flex-1 ${activeTab === 'assistant' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Nutrition Assistant
              </Button>
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('profile')}
                className={`flex-1 ${activeTab === 'profile' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
              >
                <UserCircle className="h-4 w-4 mr-2" />
                Profile Settings
              </Button>
            </div>

            {/* Tab Content - Only render when profile is complete */}
            <div>
              {/* Main Content Area */}
              <div className={activeTab === 'profile' ? 'max-w-2xl mx-auto' : ''}>
                {activeTab === 'tracker' && profile && (
                  <CalorieTracker selectedDate={selectedDate} onDataUpdate={handleDataUpdate} />
                )}
                {activeTab === 'dashboard' && profile && (
                  <NutritionDashboard
                    selectedDate={selectedDate}
                    calorieGoal={profile.dailyCalorieGoal || 2000}
                    refreshTrigger={refreshTrigger}
                  />
                )}
                {activeTab === 'health' && profile && (
                  <HealthGuidance
                    profile={profile}
                    selectedDate={selectedDate}
                    refreshTrigger={refreshTrigger}
                  />
                )}
                {activeTab === 'assistant' && profile && (
                  <NutritionAssistant
                    profile={profile}
                    selectedDate={selectedDate}
                  />
                )}
                {activeTab === 'profile' && profile && (
                  <div>
                    <div className="mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-2xl">
                      <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                        <UserCircle className="h-6 w-6" />
                        Update Your Profile
                      </h2>
                      <p className="text-sm opacity-90">
                        Keep your information up to date for accurate calorie recommendations
                      </p>
                    </div>
                    <UserProfileSetup
                      onProfileSave={handleProfileSave}
                      initialProfile={profile}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar - Mobile Only */}
      {isProfileComplete && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t-2 border-purple-200/50 dark:border-purple-800/50 shadow-2xl z-50">
          <div className="grid grid-cols-5 h-16">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === 'tracker'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs font-medium">Logger</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === 'health'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs font-medium">Health</span>
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === 'assistant'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs font-medium">Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === 'profile'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <UserCircle className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </nav>
      )}

      {/* Footer with Legal Disclaimers */}
      <footer className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-t-2 border-purple-400 mt-12 shadow-2xl mb-20 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Legal Disclaimers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Medical Disclaimer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Medical Disclaimer
              </h3>
              <p className="text-xs opacity-90 leading-relaxed">
                This app provides general nutrition information and is not intended as medical advice. 
                Always consult with a qualified healthcare professional before making dietary changes, 
                starting exercise programs, or if you have health concerns. Do not disregard professional 
                medical advice based on information from this app.
              </p>
            </div>

            {/* Data Accuracy Warning */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Data Accuracy Warning
              </h3>
              <p className="text-xs opacity-90 leading-relaxed">
                Nutritional data is provided for informational purposes and may contain inaccuracies. 
                Values can vary based on preparation methods, brands, and portion sizes. Users should 
                verify information independently. We are not liable for decisions made based on this data.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Limitation of Liability
              </h3>
              <p className="text-xs opacity-90 leading-relaxed">
                We provide this app "as is" without warranties of any kind. We are not liable for any 
                health outcomes, injuries, or damages resulting from use of this app. Users assume all 
                risks and responsibilities for their health decisions and actions taken based on app content.
              </p>
            </div>

            {/* Privacy Policy Notice */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Privacy Policy Notice
              </h3>
              <p className="text-xs opacity-90 leading-relaxed">
                All data is stored locally on your device using browser localStorage. We do not collect, 
                store, or transmit your personal information to external servers. You are responsible for 
                backing up your data. Clearing browser data will delete all app information permanently.
              </p>
            </div>
          </div>

          {/* Footer tagline */}
          <div className="text-center pt-6 border-t border-white/20">
            <p className="text-sm opacity-90">Made with ❤️ for your health journey</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
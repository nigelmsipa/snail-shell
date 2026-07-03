import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BookOpen, Clock, Target, TrendingUp, ChevronRight, ChevronLeft } from "lucide-react";
import { books, BookKey, Difficulty } from "@/data/bible";
import { saveUserPreferences, updateUserStats } from "@/lib/userState";

const ONBOARDING_STEPS = [
  "welcome",
  "experience",
  "goals",
  "books", 
  "complete"
] as const;

type OnboardingStep = typeof ONBOARDING_STEPS[number];

export const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [preferences, setPreferences] = useState({
    preferredDifficulty: "beginner" as Difficulty,
    dailyGoalMinutes: 15,
    favoriteBooks: [] as BookKey[],
    experience: "new" as "new" | "some" | "experienced",
  });

  const stepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < ONBOARDING_STEPS.length) {
      setCurrentStep(ONBOARDING_STEPS[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(ONBOARDING_STEPS[prevIndex]);
    }
  };

  const handleComplete = () => {
    // Save preferences
    saveUserPreferences({
      preferredDifficulty: preferences.preferredDifficulty,
      dailyGoalMinutes: preferences.dailyGoalMinutes,
      favoriteBooks: preferences.favoriteBooks,
      skipOnboarding: true,
    });

    // Initialize user stats
    updateUserStats({
      joinDate: new Date().toISOString(),
    });

    navigate("/");
  };

  const handleSkip = () => {
    // Save minimal preferences with skip flag
    saveUserPreferences({
      skipOnboarding: true,
    });

    // Initialize user stats
    updateUserStats({
      joinDate: new Date().toISOString(),
    });

    navigate("/");
  };

  const handleExperienceSelect = (experience: "new" | "some" | "experienced") => {
    setPreferences(prev => {
      let difficulty: Difficulty = "beginner";
      let goalMinutes = 15;

      if (experience === "some") {
        difficulty = "intermediate";
        goalMinutes = 20;
      } else if (experience === "experienced") {
        difficulty = "advanced";
        goalMinutes = 30;
      }

      return {
        ...prev,
        experience,
        preferredDifficulty: difficulty,
        dailyGoalMinutes: goalMinutes,
      };
    });
  };

  const toggleBook = (bookKey: BookKey) => {
    setPreferences(prev => ({
      ...prev,
      favoriteBooks: prev.favoriteBooks.includes(bookKey)
        ? prev.favoriteBooks.filter(b => b !== bookKey)
        : [...prev.favoriteBooks, bookKey].slice(0, 5) // Max 5 books
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Scripture Type
              </h1>
              <p className="text-lg text-gray-600">
                Let's personalize your Bible verse memorization journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Smart Goals</h3>
                <p className="text-sm text-gray-600">Personalized daily targets</p>
              </div>
              <div className="text-center p-4">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-sm text-gray-600">See your improvement</p>
              </div>
              <div className="text-center p-4">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Rich Content</h3>
                <p className="text-sm text-gray-600">16 books available</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">This will only take 2 minutes</p>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                How familiar are you with typing practice?
              </h2>
              <p className="text-gray-600">
                This helps us customize your experience
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <Card 
                className={`cursor-pointer transition-all ${
                  preferences.experience === "new" 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleExperienceSelect("new")}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">New to typing practice</h3>
                  <p className="text-sm text-gray-600">
                    I'm just getting started with structured typing
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${
                  preferences.experience === "some" 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleExperienceSelect("some")}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">Some experience</h3>
                  <p className="text-sm text-gray-600">
                    I've done typing practice before, but want to improve
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${
                  preferences.experience === "experienced" 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleExperienceSelect("experienced")}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">Experienced typist</h3>
                  <p className="text-sm text-gray-600">
                    I'm confident with my typing and want a challenge
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "goals":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Set your daily goal
              </h2>
              <p className="text-gray-600">
                How many minutes would you like to practice each day?
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {preferences.dailyGoalMinutes} min
                </div>
                <Slider
                  value={[preferences.dailyGoalMinutes]}
                  onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, dailyGoalMinutes: value[0] }))
                  }
                  max={60}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>5 min</span>
                  <span>60 min</span>
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-800">
                  {preferences.dailyGoalMinutes < 15 
                    ? "Perfect for building a habit!"
                    : preferences.dailyGoalMinutes < 30
                    ? "Great for steady progress!"
                    : "Ambitious goal for serious growth!"
                  }
                </p>
              </div>
            </div>
          </div>
        );

      case "books":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose your favorite books
              </h2>
              <p className="text-gray-600">
                Select up to 5 books you'd like to focus on (optional)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
              {books.map((book) => {
                const isSelected = preferences.favoriteBooks.includes(book.key);
                const isDisabled = !isSelected && preferences.favoriteBooks.length >= 5;
                
                return (
                  <Card
                    key={book.key}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? "ring-2 ring-blue-500 bg-blue-50" 
                        : isDisabled 
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => !isDisabled && toggleBook(book.key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{book.label}</h3>
                          <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {book.testament === "old" ? "Old Testament" : "New Testament"}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                book.difficulty === "beginner" ? "border-green-300 text-green-700" :
                                book.difficulty === "intermediate" ? "border-yellow-300 text-yellow-700" :
                                "border-red-300 text-red-700"
                              }`}
                            >
                              {book.difficulty}
                            </Badge>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="ml-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center text-sm text-gray-500">
              {preferences.favoriteBooks.length > 0 
                ? `${preferences.favoriteBooks.length}/5 books selected`
                : "You can always change these later"
              }
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're all set! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your personalized Scripture typing experience is ready
            </p>
            
            <div className="max-w-md mx-auto space-y-4">
              <Card className="p-4 bg-blue-50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold">Difficulty Level</p>
                    <p className="text-sm text-gray-600 capitalize">{preferences.preferredDifficulty}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-green-50">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold">Daily Goal</p>
                    <p className="text-sm text-gray-600">{preferences.dailyGoalMinutes} minutes</p>
                  </div>
                </div>
              </Card>
              
              {preferences.favoriteBooks.length > 0 && (
                <Card className="p-4 bg-purple-50">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <div className="text-left">
                      <p className="font-semibold">Favorite Books</p>
                      <p className="text-sm text-gray-600">
                        {preferences.favoriteBooks.length} selected
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header with Skip Button */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <Button variant="ghost" onClick={handleSkip} className="text-gray-500 hover:text-gray-700">
            Skip Setup
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={stepIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep === "complete" ? (
            <Button onClick={handleComplete} className="flex items-center gap-2">
              Start Practicing
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === "experience" && !preferences.experience) ||
                (currentStep === "goals" && !preferences.dailyGoalMinutes)
              }
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
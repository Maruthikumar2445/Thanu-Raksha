import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Conditional import for LinearGradient with fallback
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradient = ({ children, colors, style, ...props }) => (
    <View style={[style, { backgroundColor: colors?.[0] || '#38A169' }]} {...props}>
      {children}
    </View>
  );
}

const { width } = Dimensions.get('window');

// Professional Header Component
const Header = ({ title, gradient, onBack }) => (
  <LinearGradient colors={gradient} style={styles.header}>
    <View style={styles.headerContent}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  </LinearGradient>
);

// Professional Loading Component
const LoadingComponent = ({ text }) => (
  <SafeAreaView style={styles.loadingContainer}>
    <LinearGradient colors={['#38A169', '#2F855A']} style={styles.loadingGradient}>
      <View style={styles.loadingContent}>
        <View style={styles.loadingSpinner}>
          <Ionicons name="nutrition" size={60} color="white" />
        </View>
        <Text style={styles.loadingText}>{text}</Text>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, { animationDelay: '0ms' }]} />
          <View style={[styles.dot, { animationDelay: '200ms' }]} />
          <View style={[styles.dot, { animationDelay: '400ms' }]} />
        </View>
      </View>
    </LinearGradient>
  </SafeAreaView>
);

const DailyDietNutritionPlanner = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState({
    personalInfo: {
      age: '',
      weight: '',
      height: '',
      gender: '',
      activityLevel: ''
    },
    healthGoals: {
      primaryGoal: '',
      targetWeight: '',
      timeFrame: ''
    },
    dietaryPreferences: {
      dietType: '',
      allergies: [],
      intolerances: [],
      restrictions: []
    },
    currentDiet: {
      meals: '',
      snacks: '',
      hydration: '',
      supplements: ''
    },
    lifestyle: {
      exerciseRoutine: '',
      sleepHours: '',
      stressLevel: '',
      cookingTime: ''
    }
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Desk job, minimal exercise', multiplier: 1.2 },
    { value: 'light', label: 'Light Activity', description: 'Light exercise 1-3 days/week', multiplier: 1.375 },
    { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
    { value: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week', multiplier: 1.725 },
    { value: 'extreme', label: 'Extreme', description: 'Very hard exercise, physical job', multiplier: 1.9 }
  ];

  const healthGoals = [
    { value: 'weight_loss', label: 'Weight Loss', icon: 'trending-down', color: '#E53E3E' },
    { value: 'weight_gain', label: 'Weight Gain', icon: 'trending-up', color: '#38A169' },
    { value: 'maintain', label: 'Maintain Weight', icon: 'remove', color: '#4299E1' },
    { value: 'muscle_gain', label: 'Muscle Building', icon: 'fitness', color: '#805AD5' },
    { value: 'health', label: 'General Health', icon: 'heart', color: '#D69E2E' },
    { value: 'energy', label: 'Increase Energy', icon: 'flash', color: '#DD6B20' }
  ];

  const dietTypes = [
    { value: 'omnivore', label: 'Omnivore', description: 'Balanced diet with all foods' },
    { value: 'vegetarian', label: 'Vegetarian', description: 'No meat, fish, or poultry' },
    { value: 'vegan', label: 'Vegan', description: 'No animal products' },
    { value: 'keto', label: 'Ketogenic', description: 'High-fat, low-carb diet' },
    { value: 'paleo', label: 'Paleo', description: 'Whole foods, no processed foods' },
    { value: 'mediterranean', label: 'Mediterranean', description: 'Fish, olive oil, vegetables' }
  ];

  const commonAllergies = [
    { id: 'nuts', name: 'Tree Nuts', icon: 'nutrition' },
    { id: 'peanuts', name: 'Peanuts', icon: 'ellipse' },
    { id: 'dairy', name: 'Dairy', icon: 'wine' },
    { id: 'eggs', name: 'Eggs', icon: 'ellipse' },
    { id: 'seafood', name: 'Seafood', icon: 'fish' },
    { id: 'soy', name: 'Soy', icon: 'leaf' },
    { id: 'wheat', name: 'Wheat/Gluten', icon: 'leaf' },
    { id: 'shellfish', name: 'Shellfish', icon: 'fish' }
  ];

  const mockNutritionPlan = {
    dailyCalories: 2200,
    macros: {
      carbohydrates: { grams: 275, percentage: 50, calories: 1100 },
      proteins: { grams: 165, percentage: 30, calories: 660 },
      fats: { grams: 49, percentage: 20, calories: 440 }
    },
    mealPlan: {
      breakfast: {
        calories: 550,
        items: [
          'Oatmeal with berries and almonds (1 cup)',
          'Greek yogurt (150g)',
          'Banana (1 medium)',
          'Green tea (1 cup)'
        ],
        macros: { carbs: 75, protein: 25, fat: 12 }
      },
      lunch: {
        calories: 660,
        items: [
          'Grilled chicken salad with quinoa (200g)',
          'Mixed vegetables (150g)',
          'Olive oil dressing (1 tbsp)',
          'Whole grain bread (1 slice)'
        ],
        macros: { carbs: 60, protein: 50, fat: 18 }
      },
      snack: {
        calories: 330,
        items: [
          'Apple with almond butter (1 tbsp)',
          'Mixed nuts (30g)',
          'Water (500ml)'
        ],
        macros: { carbs: 25, protein: 12, fat: 15 }
      },
      dinner: {
        calories: 660,
        items: [
          'Baked salmon with sweet potato (200g)',
          'Steamed broccoli (150g)',
          'Brown rice (100g)',
          'Herbal tea (1 cup)'
        ],
        macros: { carbs: 65, protein: 45, fat: 20 }
      }
    },
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'High Protein',
        specialMeals: ['Protein smoothie', 'Grilled chicken'],
        supplements: ['Omega-3', 'Vitamin D']
      },
      {
        day: 'Tuesday',
        focus: 'Balanced Nutrition',
        specialMeals: ['Quinoa bowl', 'Fish with vegetables'],
        supplements: ['Multivitamin', 'Probiotics']
      },
      {
        day: 'Wednesday',
        focus: 'Antioxidant Rich',
        specialMeals: ['Berry smoothie bowl', 'Colorful salad'],
        supplements: ['Vitamin C', 'Green tea extract']
      }
    ],
    nutritionTips: [
      'Drink at least 8-10 glasses of water daily',
      'Include colorful vegetables in every meal',
      'Choose lean proteins and complex carbohydrates',
      'Limit processed foods and added sugars',
      'Practice portion control using the plate method',
      'Plan and prep meals in advance for success'
    ],
    shoppingList: {
      proteins: ['Chicken breast', 'Salmon', 'Greek yogurt', 'Eggs', 'Almonds'],
      carbohydrates: ['Quinoa', 'Sweet potatoes', 'Brown rice', 'Oats', 'Whole grain bread'],
      vegetables: ['Broccoli', 'Spinach', 'Bell peppers', 'Carrots', 'Tomatoes'],
      fruits: ['Bananas', 'Berries', 'Apples', 'Oranges', 'Avocado'],
      dairy: ['Greek yogurt', 'Low-fat milk', 'Cheese (limited)'],
      pantry: ['Olive oil', 'Herbs & spices', 'Green tea', 'Nuts & seeds']
    }
  };

  const toggleAllergy = (allergyId) => {
    setNutritionData(prev => ({
      ...prev,
      dietaryPreferences: {
        ...prev.dietaryPreferences,
        allergies: prev.dietaryPreferences.allergies.includes(allergyId)
          ? prev.dietaryPreferences.allergies.filter(id => id !== allergyId)
          : [...prev.dietaryPreferences.allergies, allergyId]
      }
    }));
  };

  const handleAnalyze = () => {
    if (!nutritionData.personalInfo.age || !nutritionData.personalInfo.weight || !nutritionData.healthGoals.primaryGoal) {
      alert('Please fill in required information to continue.');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(mockNutritionPlan);
      setCurrentStep(3);
    }, 4000);
  };

  const resetAnalysis = () => {
    setCurrentStep(1);
    setNutritionData({
      personalInfo: { age: '', weight: '', height: '', gender: '', activityLevel: '' },
      healthGoals: { primaryGoal: '', targetWeight: '', timeFrame: '' },
      dietaryPreferences: { dietType: '', allergies: [], intolerances: [], restrictions: [] },
      currentDiet: { meals: '', snacks: '', hydration: '', supplements: '' },
      lifestyle: { exerciseRoutine: '', sleepHours: '', stressLevel: '', cookingTime: '' }
    });
    setAnalysisResult(null);
  };

  if (isAnalyzing) {
    return <LoadingComponent text="Creating your personalized nutrition plan with optimal meal combinations and calorie distribution..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Diet & Nutrition Planner" 
        gradient={['#38A169', '#2F855A']}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          // Step 1: Personal Information & Health Goals
          <View style={styles.assessmentSection}>
            <View style={styles.welcomeCard}>
              <Ionicons name="nutrition" size={32} color="#38A169" />
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeTitle}>Personalized Nutrition Planning</Text>
                <Text style={styles.welcomeText}>
                  Get a customized meal plan based on your goals, preferences, and lifestyle.
                </Text>
              </View>
            </View>

            <View style={styles.personalInfoCard}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <Text style={styles.cardSubtitle}>Basic details to calculate your nutritional needs</Text>
              
              <View style={styles.inputGrid}>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Age (years) *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="25"
                      value={nutritionData.personalInfo.age}
                      onChangeText={(text) => setNutritionData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, age: text }
                      }))}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Weight (kg) *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="70"
                      value={nutritionData.personalInfo.weight}
                      onChangeText={(text) => setNutritionData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, weight: text }
                      }))}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Height (cm)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="170"
                      value={nutritionData.personalInfo.height}
                      onChangeText={(text) => setNutritionData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, height: text }
                      }))}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Gender</Text>
                    <View style={styles.genderOptions}>
                      {['Male', 'Female'].map((gender) => (
                        <TouchableOpacity
                          key={gender}
                          style={[
                            styles.genderOption,
                            nutritionData.personalInfo.gender === gender && styles.genderOptionSelected
                          ]}
                          onPress={() => setNutritionData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, gender }
                          }))}
                        >
                          <Text style={[
                            styles.genderText,
                            nutritionData.personalInfo.gender === gender && styles.genderTextSelected
                          ]}>
                            {gender}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.activitySection}>
                  <Text style={styles.inputLabel}>Activity Level *</Text>
                  <View style={styles.activityOptions}>
                    {activityLevels.map((activity) => (
                      <TouchableOpacity
                        key={activity.value}
                        style={[
                          styles.activityOption,
                          nutritionData.personalInfo.activityLevel === activity.value && styles.activityOptionSelected
                        ]}
                        onPress={() => setNutritionData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, activityLevel: activity.value }
                        }))}
                      >
                        <Text style={[
                          styles.activityLabel,
                          nutritionData.personalInfo.activityLevel === activity.value && styles.activityLabelSelected
                        ]}>
                          {activity.label}
                        </Text>
                        <Text style={styles.activityDescription}>{activity.description}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.goalsCard}>
              <Text style={styles.cardTitle}>Health Goals</Text>
              <Text style={styles.cardSubtitle}>What do you want to achieve? *</Text>
              
              <View style={styles.goalsGrid}>
                {healthGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal.value}
                    style={[
                      styles.goalCard,
                      nutritionData.healthGoals.primaryGoal === goal.value && styles.goalCardSelected
                    ]}
                    onPress={() => setNutritionData(prev => ({
                      ...prev,
                      healthGoals: { ...prev.healthGoals, primaryGoal: goal.value }
                    }))}
                  >
                    <View style={[
                      styles.goalIcon,
                      { backgroundColor: nutritionData.healthGoals.primaryGoal === goal.value ? goal.color : '#F7FAFC' }
                    ]}>
                      <Ionicons 
                        name={goal.icon} 
                        size={20} 
                        color={nutritionData.healthGoals.primaryGoal === goal.value ? 'white' : '#718096'} 
                      />
                    </View>
                    <Text style={[
                      styles.goalName,
                      nutritionData.healthGoals.primaryGoal === goal.value && { color: goal.color }
                    ]}>
                      {goal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(nutritionData.healthGoals.primaryGoal === 'weight_loss' || nutritionData.healthGoals.primaryGoal === 'weight_gain') && (
                <View style={styles.targetWeightSection}>
                  <Text style={styles.inputLabel}>Target Weight (kg)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter target weight"
                    value={nutritionData.healthGoals.targetWeight}
                    onChangeText={(text) => setNutritionData(prev => ({
                      ...prev,
                      healthGoals: { ...prev.healthGoals, targetWeight: text }
                    }))}
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>

            <View style={styles.continueButton}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { 
                    opacity: (nutritionData.personalInfo.age && 
                             nutritionData.personalInfo.weight && 
                             nutritionData.personalInfo.activityLevel &&
                             nutritionData.healthGoals.primaryGoal) ? 1 : 0.5 
                  }
                ]}
                onPress={() => setCurrentStep(2)}
                disabled={!(nutritionData.personalInfo.age && 
                           nutritionData.personalInfo.weight && 
                           nutritionData.personalInfo.activityLevel &&
                           nutritionData.healthGoals.primaryGoal)}
              >
                <LinearGradient colors={['#38A169', '#2F855A']} style={styles.nextGradient}>
                  <Text style={styles.nextText}>Continue to Preferences</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          // Step 2: Dietary Preferences & Lifestyle
          <View style={styles.preferencesSection}>
            <View style={styles.dietTypeCard}>
              <Text style={styles.cardTitle}>Diet Type</Text>
              <Text style={styles.cardSubtitle}>Choose your preferred eating style</Text>
              
              <View style={styles.dietOptions}>
                {dietTypes.map((diet) => (
                  <TouchableOpacity
                    key={diet.value}
                    style={[
                      styles.dietOption,
                      nutritionData.dietaryPreferences.dietType === diet.value && styles.dietOptionSelected
                    ]}
                    onPress={() => setNutritionData(prev => ({
                      ...prev,
                      dietaryPreferences: { ...prev.dietaryPreferences, dietType: diet.value }
                    }))}
                  >
                    <Text style={[
                      styles.dietLabel,
                      nutritionData.dietaryPreferences.dietType === diet.value && styles.dietLabelSelected
                    ]}>
                      {diet.label}
                    </Text>
                    <Text style={styles.dietDescription}>{diet.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.allergiesCard}>
              <Text style={styles.cardTitle}>Food Allergies & Restrictions</Text>
              <Text style={styles.cardSubtitle}>Select any foods you need to avoid</Text>
              
              <View style={styles.allergiesGrid}>
                {commonAllergies.map((allergy) => (
                  <TouchableOpacity
                    key={allergy.id}
                    style={[
                      styles.allergyCard,
                      nutritionData.dietaryPreferences.allergies.includes(allergy.id) && styles.allergyCardSelected
                    ]}
                    onPress={() => toggleAllergy(allergy.id)}
                  >
                    <View style={[
                      styles.allergyIcon,
                      {
                        backgroundColor: nutritionData.dietaryPreferences.allergies.includes(allergy.id) 
                          ? '#E53E3E' 
                          : '#F7FAFC'
                      }
                    ]}>
                      <Ionicons 
                        name={allergy.icon} 
                        size={16} 
                        color={nutritionData.dietaryPreferences.allergies.includes(allergy.id) ? 'white' : '#718096'} 
                      />
                    </View>
                    <Text style={[
                      styles.allergyName,
                      nutritionData.dietaryPreferences.allergies.includes(allergy.id) && styles.allergyNameSelected
                    ]}>
                      {allergy.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.currentDietCard}>
              <Text style={styles.cardTitle}>Current Diet & Lifestyle</Text>
              <Text style={styles.cardSubtitle}>Help us understand your current habits</Text>
              
              <View style={styles.lifestyleInputs}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Daily Water Intake (glasses)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., 8 glasses"
                    value={nutritionData.currentDiet.hydration}
                    onChangeText={(text) => setNutritionData(prev => ({
                      ...prev,
                      currentDiet: { ...prev.currentDiet, hydration: text }
                    }))}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Sleep Hours per Night</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., 7-8 hours"
                    value={nutritionData.lifestyle.sleepHours}
                    onChangeText={(text) => setNutritionData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, sleepHours: text }
                    }))}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Time Available for Cooking (daily)</Text>
                  <View style={styles.cookingTimeOptions}>
                    {['<30 min', '30-60 min', '1-2 hours', '>2 hours'].map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.optionChip,
                          nutritionData.lifestyle.cookingTime === time && styles.optionChipSelected
                        ]}
                        onPress={() => setNutritionData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, cookingTime: time }
                        }))}
                      >
                        <Text style={[
                          styles.optionChipText,
                          nutritionData.lifestyle.cookingTime === time && styles.optionChipTextSelected
                        ]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Current Supplements (if any)</Text>
                  <TextInput
                    style={styles.multilineInput}
                    placeholder="e.g., Vitamin D, Omega-3, Protein powder..."
                    placeholderTextColor="#A0AEC0"
                    multiline
                    numberOfLines={3}
                    value={nutritionData.currentDiet.supplements}
                    onChangeText={(text) => setNutritionData(prev => ({
                      ...prev,
                      currentDiet: { ...prev.currentDiet, supplements: text }
                    }))}
                  />
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(1)}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
                <LinearGradient colors={['#38A169', '#2F855A']} style={styles.analyzeGradient}>
                  <Ionicons name="restaurant" size={20} color="white" />
                  <Text style={styles.analyzeText}>Create Plan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 3 && analysisResult && (
          // Step 3: Nutrition Plan Results
          <View style={styles.resultsSection}>
            <View style={styles.resultHeader}>
              <LinearGradient colors={['#38A169', '#2F855A']} style={styles.resultHeaderGradient}>
                <Ionicons name="restaurant" size={32} color="white" />
                <Text style={styles.resultHeaderTitle}>Your Nutrition Plan</Text>
                <Text style={styles.resultHeaderSubtitle}>Personalized for Your Goals</Text>
              </LinearGradient>
            </View>

            {/* Daily Calorie Overview */}
            <View style={styles.calorieOverviewCard}>
              <Text style={styles.calorieTitle}>Daily Calorie Target</Text>
              <View style={styles.calorieDisplay}>
                <Text style={styles.calorieNumber}>{analysisResult.dailyCalories}</Text>
                <Text style={styles.calorieUnit}>calories</Text>
              </View>
              
              <View style={styles.macroBreakdown}>
                <View style={styles.macroItem}>
                  <View style={[styles.macroColor, { backgroundColor: '#4299E1' }]} />
                  <Text style={styles.macroLabel}>Carbs</Text>
                  <Text style={styles.macroValue}>{analysisResult.macros.carbohydrates.grams}g</Text>
                  <Text style={styles.macroPercent}>({analysisResult.macros.carbohydrates.percentage}%)</Text>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroColor, { backgroundColor: '#38A169' }]} />
                  <Text style={styles.macroLabel}>Protein</Text>
                  <Text style={styles.macroValue}>{analysisResult.macros.proteins.grams}g</Text>
                  <Text style={styles.macroPercent}>({analysisResult.macros.proteins.percentage}%)</Text>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroColor, { backgroundColor: '#ED8936' }]} />
                  <Text style={styles.macroLabel}>Fat</Text>
                  <Text style={styles.macroValue}>{analysisResult.macros.fats.grams}g</Text>
                  <Text style={styles.macroPercent}>({analysisResult.macros.fats.percentage}%)</Text>
                </View>
              </View>
            </View>

            {/* Daily Meal Plan */}
            <View style={styles.mealPlanCard}>
              <Text style={styles.mealPlanTitle}>Today's Meal Plan</Text>
              
              {Object.entries(analysisResult.mealPlan).map(([mealType, meal]) => (
                <View key={mealType} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealName}>{mealType.toUpperCase()}</Text>
                    <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                  </View>
                  
                  <View style={styles.mealContent}>
                    {meal.items.map((item, index) => (
                      <Text key={index} style={styles.mealItem}>• {item}</Text>
                    ))}
                  </View>
                  
                  <View style={styles.mealMacros}>
                    <Text style={styles.mealMacroText}>C: {meal.macros.carbs}g</Text>
                    <Text style={styles.mealMacroText}>P: {meal.macros.protein}g</Text>
                    <Text style={styles.mealMacroText}>F: {meal.macros.fat}g</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Weekly Plan Preview */}
            <View style={styles.weeklyPlanCard}>
              <Text style={styles.weeklyPlanTitle}>Weekly Plan Preview</Text>
              
              {analysisResult.weeklyPlan.map((day, index) => (
                <View key={index} style={styles.dayCard}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayName}>{day.day}</Text>
                    <Text style={styles.dayFocus}>{day.focus}</Text>
                  </View>
                  <Text style={styles.dayMeals}>
                    Featured: {day.specialMeals.join(', ')}
                  </Text>
                  <Text style={styles.daySupplements}>
                    Supplements: {day.supplements.join(', ')}
                  </Text>
                </View>
              ))}
            </View>

            {/* Nutrition Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Nutrition Tips for Success</Text>
              
              {analysisResult.nutritionTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#38A169" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Shopping List */}
            <View style={styles.shoppingListCard}>
              <Text style={styles.shoppingListTitle}>🛒 Weekly Shopping List</Text>
              
              {Object.entries(analysisResult.shoppingList).map(([category, items]) => (
                <View key={category} style={styles.shoppingCategory}>
                  <Text style={styles.categoryTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  <View style={styles.categoryItems}>
                    {items.map((item, index) => (
                      <View key={index} style={styles.shoppingItem}>
                        <Ionicons name="checkbox-outline" size={16} color="#718096" />
                        <Text style={styles.shoppingItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.finalActions}>
              <TouchableOpacity style={styles.saveButton}>
                <LinearGradient colors={['#4299E1', '#3182CE']} style={styles.saveGradient}>
                  <Ionicons name="bookmark" size={20} color="white" />
                  <Text style={styles.saveText}>Save Plan</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton}>
                <LinearGradient colors={['#805AD5', '#6B46C1']} style={styles.shareGradient}>
                  <Ionicons name="share" size={20} color="white" />
                  <Text style={styles.shareText}>Share Plan</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.newPlanButton} onPress={resetAnalysis}>
                <LinearGradient colors={['#38A169', '#2F855A']} style={styles.newPlanGradient}>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.newPlanText}>New Plan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  assessmentSection: {
    marginTop: 20,
  },
  welcomeCard: {
    backgroundColor: '#E6FFFA',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#81E6D9',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 12,
    color: '#38A169',
    lineHeight: 18,
  },
  personalInfoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 20,
  },
  inputGrid: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2D3748',
    backgroundColor: '#F7FAFC',
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2D3748',
    backgroundColor: '#F7FAFC',
    textAlignVertical: 'top',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#E6FFFA',
    borderColor: '#38A169',
  },
  genderText: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#38A169',
  },
  activitySection: {
    marginTop: 4,
  },
  activityOptions: {
    gap: 8,
  },
  activityOption: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityOptionSelected: {
    backgroundColor: '#E6FFFA',
    borderColor: '#38A169',
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  activityLabelSelected: {
    color: '#38A169',
  },
  activityDescription: {
    fontSize: 12,
    color: '#718096',
  },
  goalsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  goalCard: {
    flexBasis: (width - 72) / 2,
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardSelected: {
    backgroundColor: '#E6FFFA',
    borderColor: '#38A169',
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 14,
  },
  targetWeightSection: {
    marginTop: 8,
  },
  continueButton: {
    marginTop: 10,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  preferencesSection: {
    marginTop: 20,
  },
  dietTypeCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dietOptions: {
    gap: 12,
  },
  dietOption: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dietOptionSelected: {
    backgroundColor: '#E6FFFA',
    borderColor: '#38A169',
  },
  dietLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  dietLabelSelected: {
    color: '#38A169',
  },
  dietDescription: {
    fontSize: 12,
    color: '#718096',
  },
  allergiesCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  allergiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  allergyCard: {
    flexBasis: (width - 72) / 2,
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  allergyCardSelected: {
    backgroundColor: '#FED7D7',
    borderColor: '#E53E3E',
  },
  allergyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  allergyName: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 14,
  },
  allergyNameSelected: {
    color: '#E53E3E',
  },
  currentDietCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lifestyleInputs: {
    gap: 16,
  },
  cookingTimeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionChipSelected: {
    backgroundColor: '#E6FFFA',
    borderColor: '#38A169',
  },
  optionChipText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  optionChipTextSelected: {
    color: '#38A169',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38A169',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38A169',
  },
  analyzeButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  analyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  analyzeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  resultsSection: {
    marginTop: 20,
  },
  resultHeader: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  resultHeaderGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  resultHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  resultHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  calorieOverviewCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  calorieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  calorieDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  calorieNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#38A169',
  },
  calorieUnit: {
    fontSize: 16,
    color: '#718096',
    marginLeft: 4,
  },
  macroBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  macroItem: {
    alignItems: 'center',
    gap: 4,
  },
  macroColor: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  macroLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  macroPercent: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  mealPlanCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mealPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#38A169',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  mealContent: {
    marginBottom: 8,
  },
  mealItem: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
    lineHeight: 16,
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 16,
  },
  mealMacroText: {
    fontSize: 10,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  weeklyPlanCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  weeklyPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  dayFocus: {
    fontSize: 12,
    color: '#38A169',
    fontWeight: '600',
  },
  dayMeals: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  daySupplements: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  tipsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#718096',
    flex: 1,
    lineHeight: 20,
  },
  shoppingListCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  shoppingListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  shoppingCategory: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38A169',
    marginBottom: 8,
  },
  categoryItems: {
    gap: 6,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shoppingItemText: {
    fontSize: 14,
    color: '#718096',
  },
  finalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  saveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  shareButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  shareText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  newPlanButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  newPlanGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  newPlanText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSpacing: {
    height: 24,
  },
  // Loading Component Styles
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    opacity: 0.3,
  },
});

export default DailyDietNutritionPlanner;
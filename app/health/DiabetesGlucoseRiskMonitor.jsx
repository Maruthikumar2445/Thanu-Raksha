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
    <View style={[style, { backgroundColor: colors?.[0] || '#E53E3E' }]} {...props}>
      {children}
    </View>
  );
}

const { width } = Dimensions.get('window');

const DiabetesGlucoseRiskMonitor = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthData, setHealthData] = useState({
    basicInfo: {
      age: '',
      weight: '',
      height: '',
      gender: ''
    },
    diabetesHistory: {
      familyHistory: '',
      personalHistory: '',
      previousDiagnosis: ''
    },
    lifestyle: {
      physicalActivity: '',
      diet: '',
      smokingStatus: '',
      alcoholConsumption: ''
    },
    symptoms: [],
    glucoseLevels: {
      fasting: '',
      postMeal: '',
      lastA1C: ''
    },
    medications: ''
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  const diabetesSymptoms = [
    { id: 'frequent_urination', name: 'Frequent Urination', icon: 'water' },
    { id: 'excessive_thirst', name: 'Excessive Thirst', icon: 'wine' },
    { id: 'unexplained_weight_loss', name: 'Weight Loss', icon: 'trending-down' },
    { id: 'increased_hunger', name: 'Increased Hunger', icon: 'restaurant' },
    { id: 'fatigue', name: 'Fatigue', icon: 'battery-dead' },
    { id: 'blurred_vision', name: 'Blurred Vision', icon: 'eye' },
    { id: 'slow_healing', name: 'Slow Healing', icon: 'bandage' },
    { id: 'tingling_hands', name: 'Tingling Hands', icon: 'hand-left' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise', color: '#E53E3E' },
    { value: 'light', label: 'Light Activity', description: '1-3 days per week', color: '#FF8A00' },
    { value: 'moderate', label: 'Moderate', description: '3-5 days per week', color: '#FFD600' },
    { value: 'active', label: 'Very Active', description: '6-7 days per week', color: '#38A169' }
  ];

  const dietQuality = [
    { value: 'poor', label: 'Poor', description: 'High sugar, processed foods' },
    { value: 'fair', label: 'Fair', description: 'Some healthy choices' },
    { value: 'good', label: 'Good', description: 'Mostly balanced diet' },
    { value: 'excellent', label: 'Excellent', description: 'Very healthy, low sugar' }
  ];

  const mockAnalysisResults = {
    riskLevel: 'Moderate Risk',
    riskScore: 67,
    estimatedA1C: '6.2%',
    riskFactors: [
      { factor: 'Family History', impact: 'High', status: 'Present' },
      { factor: 'BMI', impact: 'Medium', status: '28.5 (Overweight)' },
      { factor: 'Physical Activity', impact: 'Medium', status: 'Below Recommended' },
      { factor: 'Age', impact: 'Low', status: 'Within Normal Range' }
    ],
    recommendations: [
      'Increase physical activity to at least 150 minutes per week',
      'Adopt a low glycemic index diet with more fiber',
      'Schedule regular glucose monitoring',
      'Consider consultation with endocrinologist'
    ],
    lifestyle_changes: [
      {
        category: 'Diet',
        changes: [
          'Reduce refined carbohydrates and sugary drinks',
          'Increase vegetables and lean proteins',
          'Control portion sizes',
          'Eat meals at regular intervals'
        ]
      },
      {
        category: 'Exercise',
        changes: [
          'Start with 30 minutes walking daily',
          'Add resistance training 2-3 times per week',
          'Monitor blood sugar before and after exercise',
          'Gradually increase intensity'
        ]
      },
      {
        category: 'Monitoring',
        changes: [
          'Check fasting glucose weekly',
          'Track post-meal glucose levels',
          'Monitor weight regularly',
          'Keep a food and activity diary'
        ]
      }
    ],
    warningSignsToWatch: [
      'Fasting glucose consistently above 100 mg/dL',
      'Post-meal glucose above 140 mg/dL',
      'Persistent fatigue or excessive thirst',
      'Unexplained weight changes'
    ],
    nextSteps: {
      immediateActions: [
        'Schedule appointment with healthcare provider',
        'Start glucose monitoring log',
        'Begin lifestyle modifications'
      ],
      followUpTesting: [
        'HbA1c test in 3 months',
        'Comprehensive metabolic panel',
        'Lipid profile assessment'
      ]
    }
  };

  const toggleSymptom = (symptomId) => {
    setHealthData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(id => id !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  const handleAnalyze = () => {
    if (!healthData.basicInfo.age || !healthData.basicInfo.weight) {
      alert('Please fill in basic information to continue.');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(mockAnalysisResults);
      setCurrentStep(3);
    }, 4000);
  };

  const resetAnalysis = () => {
    setCurrentStep(1);
    setHealthData({
      basicInfo: { age: '', weight: '', height: '', gender: '' },
      diabetesHistory: { familyHistory: '', personalHistory: '', previousDiagnosis: '' },
      lifestyle: { physicalActivity: '', diet: '', smokingStatus: '', alcoholConsumption: '' },
      symptoms: [],
      glucoseLevels: { fasting: '', postMeal: '', lastA1C: '' },
      medications: ''
    });
    setAnalysisResult(null);
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.loadingGradient}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingSpinner}>
              <Ionicons name="medical" size={60} color="white" />
            </View>
            <Text style={styles.loadingText}>Analyzing diabetes risk factors and generating personalized recommendations...</Text>
            <View style={styles.loadingDots}>
              <View style={[styles.dot, { animationDelay: '0ms' }]} />
              <View style={[styles.dot, { animationDelay: '200ms' }]} />
              <View style={[styles.dot, { animationDelay: '400ms' }]} />
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Diabetes Risk Monitor</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          // Step 1: Basic Information & Health History
          <View style={styles.assessmentSection}>
            <View style={styles.disclaimerCard}>
              <Ionicons name="warning" size={24} color="#E53E3E" />
              <View style={styles.disclaimerContent}>
                <Text style={styles.disclaimerTitle}>Health Assessment Tool</Text>
                <Text style={styles.disclaimerText}>
                  This tool provides risk assessment only. It does not diagnose diabetes. 
                  Please consult healthcare professionals for proper medical evaluation.
                </Text>
              </View>
            </View>

            <View style={styles.basicInfoCard}>
              <Text style={styles.cardTitle}>Basic Information</Text>
              <Text style={styles.cardSubtitle}>Please provide your basic health details</Text>
              
              <View style={styles.inputGrid}>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Age (years)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter age"
                      value={healthData.basicInfo.age}
                      onChangeText={(text) => setHealthData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, age: text }
                      }))}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Weight (kg)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter weight"
                      value={healthData.basicInfo.weight}
                      onChangeText={(text) => setHealthData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, weight: text }
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
                      placeholder="Enter height"
                      value={healthData.basicInfo.height}
                      onChangeText={(text) => setHealthData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, height: text }
                      }))}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Gender</Text>
                    <View style={styles.genderOptions}>
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <TouchableOpacity
                          key={gender}
                          style={[
                            styles.genderOption,
                            healthData.basicInfo.gender === gender && styles.genderOptionSelected
                          ]}
                          onPress={() => setHealthData(prev => ({
                            ...prev,
                            basicInfo: { ...prev.basicInfo, gender }
                          }))}
                        >
                          <Text style={[
                            styles.genderText,
                            healthData.basicInfo.gender === gender && styles.genderTextSelected
                          ]}>
                            {gender}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.cardTitle}>Diabetes History</Text>
              <Text style={styles.cardSubtitle}>Family and personal diabetes history</Text>
              
              <View style={styles.historyQuestions}>
                <View style={styles.questionGroup}>
                  <Text style={styles.questionLabel}>Family History of Diabetes</Text>
                  <View style={styles.optionRow}>
                    {['None', 'Grandparents', 'Parents', 'Siblings'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionChip,
                          healthData.diabetesHistory.familyHistory === option && styles.optionChipSelected
                        ]}
                        onPress={() => setHealthData(prev => ({
                          ...prev,
                          diabetesHistory: { ...prev.diabetesHistory, familyHistory: option }
                        }))}
                      >
                        <Text style={[
                          styles.optionChipText,
                          healthData.diabetesHistory.familyHistory === option && styles.optionChipTextSelected
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.questionGroup}>
                  <Text style={styles.questionLabel}>Previous Diagnosis</Text>
                  <View style={styles.optionRow}>
                    {['None', 'Prediabetes', 'Gestational', 'Type 1', 'Type 2'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionChip,
                          healthData.diabetesHistory.previousDiagnosis === option && styles.optionChipSelected
                        ]}
                        onPress={() => setHealthData(prev => ({
                          ...prev,
                          diabetesHistory: { ...prev.diabetesHistory, previousDiagnosis: option }
                        }))}
                      >
                        <Text style={[
                          styles.optionChipText,
                          healthData.diabetesHistory.previousDiagnosis === option && styles.optionChipTextSelected
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.symptomsCard}>
              <Text style={styles.cardTitle}>Current Symptoms</Text>
              <Text style={styles.cardSubtitle}>Select any symptoms you are experiencing</Text>
              
              <View style={styles.symptomsGrid}>
                {diabetesSymptoms.map((symptom) => (
                  <TouchableOpacity
                    key={symptom.id}
                    style={[
                      styles.symptomCard,
                      healthData.symptoms.includes(symptom.id) && styles.symptomCardSelected
                    ]}
                    onPress={() => toggleSymptom(symptom.id)}
                  >
                    <View style={[
                      styles.symptomIcon,
                      {
                        backgroundColor: healthData.symptoms.includes(symptom.id) 
                          ? '#E53E3E' 
                          : '#F7FAFC'
                      }
                    ]}>
                      <Ionicons 
                        name={symptom.icon} 
                        size={18} 
                        color={healthData.symptoms.includes(symptom.id) ? 'white' : '#718096'} 
                      />
                    </View>
                    <Text style={[
                      styles.symptomName,
                      healthData.symptoms.includes(symptom.id) && styles.symptomNameSelected
                    ]}>
                      {symptom.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.continueButton}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { opacity: healthData.basicInfo.age && healthData.basicInfo.weight ? 1 : 0.5 }
                ]}
                onPress={() => setCurrentStep(2)}
                disabled={!healthData.basicInfo.age || !healthData.basicInfo.weight}
              >
                <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.nextGradient}>
                  <Text style={styles.nextText}>Continue Assessment</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          // Step 2: Lifestyle & Glucose Levels
          <View style={styles.lifestyleSection}>
            <View style={styles.lifestyleCard}>
              <Text style={styles.cardTitle}>Lifestyle Assessment</Text>
              <Text style={styles.cardSubtitle}>These factors significantly impact diabetes risk</Text>
              
              <View style={styles.lifestyleQuestions}>
                <View style={styles.questionGroup}>
                  <Text style={styles.questionLabel}>Physical Activity Level</Text>
                  <View style={styles.activityOptions}>
                    {activityLevels.map((activity) => (
                      <TouchableOpacity
                        key={activity.value}
                        style={[
                          styles.activityOption,
                          healthData.lifestyle.physicalActivity === activity.value && styles.activityOptionSelected
                        ]}
                        onPress={() => setHealthData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, physicalActivity: activity.value }
                        }))}
                      >
                        <View style={styles.activityHeader}>
                          <View style={[styles.activityIndicator, { backgroundColor: activity.color }]} />
                          <Text style={[
                            styles.activityLabel,
                            healthData.lifestyle.physicalActivity === activity.value && styles.activityLabelSelected
                          ]}>
                            {activity.label}
                          </Text>
                        </View>
                        <Text style={styles.activityDescription}>{activity.description}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.questionGroup}>
                  <Text style={styles.questionLabel}>Diet Quality</Text>
                  <View style={styles.optionRow}>
                    {dietQuality.map((diet) => (
                      <TouchableOpacity
                        key={diet.value}
                        style={[
                          styles.optionChip,
                          healthData.lifestyle.diet === diet.value && styles.optionChipSelected
                        ]}
                        onPress={() => setHealthData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, diet: diet.value }
                        }))}
                      >
                        <Text style={[
                          styles.optionChipText,
                          healthData.lifestyle.diet === diet.value && styles.optionChipTextSelected
                        ]}>
                          {diet.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.questionGroup}>
                  <Text style={styles.questionLabel}>Smoking Status</Text>
                  <View style={styles.optionRow}>
                    {['Never', 'Former', 'Current'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionChip,
                          healthData.lifestyle.smokingStatus === option && styles.optionChipSelected
                        ]}
                        onPress={() => setHealthData(prev => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, smokingStatus: option }
                        }))}
                      >
                        <Text style={[
                          styles.optionChipText,
                          healthData.lifestyle.smokingStatus === option && styles.optionChipTextSelected
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.glucoseCard}>
              <Text style={styles.cardTitle}>Glucose Levels (Optional)</Text>
              <Text style={styles.cardSubtitle}>Recent blood sugar measurements if available</Text>
              
              <View style={styles.glucoseInputs}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Fasting Glucose (mg/dL)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., 95"
                    value={healthData.glucoseLevels.fasting}
                    onChangeText={(text) => setHealthData(prev => ({
                      ...prev,
                      glucoseLevels: { ...prev.glucoseLevels, fasting: text }
                    }))}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Post-Meal Glucose (mg/dL)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., 140"
                    value={healthData.glucoseLevels.postMeal}
                    onChangeText={(text) => setHealthData(prev => ({
                      ...prev,
                      glucoseLevels: { ...prev.glucoseLevels, postMeal: text }
                    }))}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Last HbA1c (%)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., 5.7"
                    value={healthData.glucoseLevels.lastA1C}
                    onChangeText={(text) => setHealthData(prev => ({
                      ...prev,
                      glucoseLevels: { ...prev.glucoseLevels, lastA1C: text }
                    }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.glucoseReference}>
                <Text style={styles.referenceTitle}>Reference Ranges:</Text>
                <Text style={styles.referenceText}>• Normal Fasting: 70-99 mg/dL</Text>
                <Text style={styles.referenceText}>• Normal Post-Meal: &lt;140 mg/dL</Text>
                <Text style={styles.referenceText}>• Normal HbA1c: &lt;5.7%</Text>
              </View>
            </View>

            <View style={styles.medicationsCard}>
              <Text style={styles.cardTitle}>Current Medications</Text>
              <Text style={styles.cardSubtitle}>List any medications you are currently taking</Text>
              
              <TextInput
                style={styles.medicationsInput}
                placeholder="e.g., Metformin 500mg twice daily, Blood pressure medications..."
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={3}
                value={healthData.medications}
                onChangeText={(text) => setHealthData(prev => ({ ...prev, medications: text }))}
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(1)}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
                <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.analyzeGradient}>
                  <Ionicons name="analytics" size={20} color="white" />
                  <Text style={styles.analyzeText}>Analyze Risk</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 3 && analysisResult && (
          // Step 3: Risk Assessment Results
          <View style={styles.resultsSection}>
            <View style={styles.resultHeader}>
              <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.resultHeaderGradient}>
                <Ionicons name="analytics" size={32} color="white" />
                <Text style={styles.resultHeaderTitle}>Diabetes Risk Assessment</Text>
                <Text style={styles.resultHeaderSubtitle}>Comprehensive Analysis Complete</Text>
              </LinearGradient>
            </View>

            {/* Risk Score */}
            <View style={styles.riskScoreCard}>
              <View style={styles.scoreDisplay}>
                <View style={[
                  styles.scoreCircle,
                  {
                    backgroundColor: 
                      analysisResult.riskScore < 30 ? '#48BB78' :
                      analysisResult.riskScore < 70 ? '#ED8936' : '#E53E3E'
                  }
                ]}>
                  <Text style={styles.scoreNumber}>{analysisResult.riskScore}</Text>
                  <Text style={styles.scoreUnit}>%</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.riskLevelText}>{analysisResult.riskLevel}</Text>
                  <Text style={styles.riskDescription}>
                    Based on your health profile and risk factors
                  </Text>
                  <View style={styles.a1cBadge}>
                    <Text style={styles.a1cText}>Estimated HbA1c: {analysisResult.estimatedA1C}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Risk Factors */}
            <View style={styles.riskFactorsCard}>
              <Text style={styles.riskFactorsTitle}>Risk Factor Analysis</Text>
              {analysisResult.riskFactors.map((factor, index) => (
                <View key={index} style={styles.riskFactorItem}>
                  <View style={styles.factorHeader}>
                    <Text style={styles.factorName}>{factor.factor}</Text>
                    <View style={[
                      styles.impactBadge,
                      {
                        backgroundColor: 
                          factor.impact === 'High' ? '#FED7D7' :
                          factor.impact === 'Medium' ? '#FFF3CD' : '#D4EDDA'
                      }
                    ]}>
                      <Text style={[
                        styles.impactText,
                        {
                          color:
                            factor.impact === 'High' ? '#C53030' :
                            factor.impact === 'Medium' ? '#B7791F' : '#276749'
                        }
                      ]}>
                        {factor.impact} Impact
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.factorStatus}>{factor.status}</Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsCard}>
              <Text style={styles.recommendationsTitle}>Key Recommendations</Text>
              {analysisResult.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#48BB78" />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>

            {/* Lifestyle Changes */}
            <View style={styles.lifestyleChangesCard}>
              <Text style={styles.lifestyleChangesTitle}>Detailed Lifestyle Plan</Text>
              {analysisResult.lifestyle_changes.map((category, index) => (
                <View key={index} style={styles.lifestyleCategory}>
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                  {category.changes.map((change, changeIndex) => (
                    <View key={changeIndex} style={styles.changeItem}>
                      <Ionicons name="arrow-forward" size={14} color="#E53E3E" />
                      <Text style={styles.changeText}>{change}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            {/* Warning Signs */}
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>⚠️ Monitor These Warning Signs</Text>
              {analysisResult.warningSignsToWatch.map((warning, index) => (
                <View key={index} style={styles.warningItem}>
                  <Ionicons name="alert-circle" size={16} color="#E53E3E" />
                  <Text style={styles.warningText}>{warning}</Text>
                </View>
              ))}
            </View>

            {/* Next Steps */}
            <View style={styles.nextStepsCard}>
              <Text style={styles.nextStepsTitle}>Recommended Next Steps</Text>
              
              <View style={styles.nextStepsSection}>
                <Text style={styles.stepsSectionTitle}>Immediate Actions</Text>
                {analysisResult.nextSteps.immediateActions.map((action, index) => (
                  <View key={index} style={styles.stepItem}>
                    <Ionicons name="flash" size={16} color="#ED8936" />
                    <Text style={styles.stepText}>{action}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.nextStepsSection}>
                <Text style={styles.stepsSectionTitle}>Follow-up Testing</Text>
                {analysisResult.nextSteps.followUpTesting.map((test, index) => (
                  <View key={index} style={styles.stepItem}>
                    <Ionicons name="medical" size={16} color="#4299E1" />
                    <Text style={styles.stepText}>{test}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.finalActions}>
              <TouchableOpacity style={styles.saveButton}>
                <LinearGradient colors={['#48BB78', '#38A169']} style={styles.saveGradient}>
                  <Ionicons name="bookmark" size={20} color="white" />
                  <Text style={styles.saveText}>Save Report</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton}>
                <LinearGradient colors={['#4299E1', '#3182CE']} style={styles.shareGradient}>
                  <Ionicons name="share" size={20} color="white" />
                  <Text style={styles.shareText}>Share with Doctor</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.newAssessmentButton} onPress={resetAnalysis}>
                <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.newAssessmentGradient}>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.newAssessmentText}>New Assessment</Text>
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
  disclaimerCard: {
    backgroundColor: '#FED7D7',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  disclaimerContent: {
    flex: 1,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#9B2C2C',
    lineHeight: 16,
  },
  basicInfoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 16,
  },
  inputGrid: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#2D3748',
    backgroundColor: '#F7FAFC',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 6,
  },
  genderOption: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#FED7D7',
    borderColor: '#E53E3E',
  },
  genderText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#E53E3E',
  },
  historyCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  historyQuestions: {
    gap: 16,
  },
  questionGroup: {
    marginBottom: 4,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionChipSelected: {
    backgroundColor: '#FED7D7',
    borderColor: '#E53E3E',
  },
  optionChipText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
  },
  optionChipTextSelected: {
    color: '#E53E3E',
  },
  symptomsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomCard: {
    flexBasis: (width - 64) / 2,
    backgroundColor: '#F7FAFC',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  symptomCardSelected: {
    backgroundColor: '#FED7D7',
    borderColor: '#E53E3E',
  },
  symptomIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  symptomName: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 12,
  },
  symptomNameSelected: {
    color: '#E53E3E',
  },
  continueButton: {
    marginTop: 8,
  },
  nextButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  nextText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  lifestyleSection: {
    marginTop: 20,
  },
  lifestyleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  lifestyleQuestions: {
    gap: 16,
  },
  activityOptions: {
    gap: 8,
  },
  activityOption: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityOptionSelected: {
    backgroundColor: '#FED7D7',
    borderColor: '#E53E3E',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  activityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  activityLabelSelected: {
    color: '#E53E3E',
  },
  activityDescription: {
    fontSize: 11,
    color: '#718096',
  },
  glucoseCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  glucoseInputs: {
    gap: 12,
    marginBottom: 12,
  },
  glucoseReference: {
    backgroundColor: '#EDF2F7',
    padding: 12,
    borderRadius: 6,
  },
  referenceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 6,
  },
  referenceText: {
    fontSize: 11,
    color: '#718096',
    marginBottom: 2,
  },
  medicationsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  medicationsInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 10,
    fontSize: 12,
    color: '#2D3748',
    backgroundColor: '#F7FAFC',
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  backButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E53E3E',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53E3E',
  },
  analyzeButton: {
    flex: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  analyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  analyzeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  resultsSection: {
    marginTop: 20,
  },
  resultHeader: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  resultHeaderGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  resultHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  resultHeaderSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  riskScoreCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreUnit: {
    fontSize: 14,
    color: 'white',
    marginLeft: 2,
  },
  scoreInfo: {
    flex: 1,
  },
  riskLevelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
    marginBottom: 6,
  },
  a1cBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  a1cText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  riskFactorsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  riskFactorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  riskFactorItem: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  impactBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  impactText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  factorStatus: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
  },
  recommendationsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: '#718096',
    flex: 1,
    lineHeight: 16,
  },
  lifestyleChangesCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  lifestyleChangesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  lifestyleCategory: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53E3E',
    marginBottom: 8,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 6,
  },
  changeText: {
    fontSize: 12,
    color: '#718096',
    flex: 1,
    lineHeight: 16,
  },
  warningCard: {
    backgroundColor: '#FED7D7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEB2B2',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: 12,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#9B2C2C',
    flex: 1,
    lineHeight: 16,
  },
  nextStepsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  nextStepsSection: {
    marginBottom: 12,
  },
  stepsSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  stepText: {
    fontSize: 12,
    color: '#718096',
    flex: 1,
    lineHeight: 16,
  },
  finalActions: {
    flexDirection: 'row',
    gap: 6,
  },
  saveButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  saveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  shareButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  shareText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  newAssessmentButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  newAssessmentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  newAssessmentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSpacing: {
    height: 20,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    opacity: 0.3,
  },
});

export default DiabetesGlucoseRiskMonitor;
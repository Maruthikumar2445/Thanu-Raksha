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
    <View style={[style, { backgroundColor: colors?.[0] || '#667eea' }]} {...props}>
      {children}
    </View>
  );
}

const { width } = Dimensions.get('window');

const SmartSleepBedtimeCompanion = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sleepData, setSleepData] = useState({
    basicInfo: {
      age: '',
      workSchedule: '',
      bedtimeGoal: '',
      wakeTimeGoal: ''
    },
    sleepPattern: {
      currentBedtime: '',
      currentWakeTime: '',
      sleepQuality: '',
      timeToFallAsleep: '',
      nightWakeups: ''
    },
    lifestyle: {
      exerciseTime: '',
      caffeine: '',
      alcohol: '',
      screenTime: '',
      stress: ''
    },
    preferences: {
      roomTemp: '',
      lightLevel: '',
      noiseLevel: '',
      mattressComfort: ''
    }
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  const workSchedules = [
    { value: 'standard', label: 'Standard 9-5', description: 'Regular office hours' },
    { value: 'early', label: 'Early Bird', description: 'Start before 7 AM' },
    { value: 'night', label: 'Night Shift', description: 'Evening/night work' },
    { value: 'flexible', label: 'Flexible', description: 'Varying schedule' },
    { value: 'rotating', label: 'Rotating Shifts', description: 'Changing shifts' }
  ];

  const sleepQualityLevels = [
    { value: 'excellent', label: 'Excellent', icon: 'happy', color: '#48BB78' },
    { value: 'good', label: 'Good', icon: 'happy-outline', color: '#68D391' },
    { value: 'fair', label: 'Fair', icon: 'sad-outline', color: '#F6AD55' },
    { value: 'poor', label: 'Poor', icon: 'sad', color: '#FC8181' }
  ];

  const lifestyleFactors = [
    { key: 'exerciseTime', label: 'Exercise Time', options: ['Morning', 'Afternoon', 'Evening', 'None'] },
    { key: 'caffeine', label: 'Caffeine Intake', options: ['None', 'Morning only', 'Afternoon too', 'All day'] },
    { key: 'alcohol', label: 'Alcohol Consumption', options: ['None', 'Rarely', 'Occasionally', 'Regularly'] },
    { key: 'screenTime', label: 'Screen Time Before Bed', options: ['None', '<1 hour', '1-2 hours', '>2 hours'] }
  ];

  const mockSleepPlan = {
    sleepScore: 78,
    recommendedBedtime: '10:30 PM',
    recommendedWakeTime: '6:30 AM',
    totalSleepTime: '8 hours',
    sleepEfficiency: '85%',
    improvements: [
      { category: 'Bedtime Routine', score: 6, maxScore: 10 },
      { category: 'Sleep Environment', score: 8, maxScore: 10 },
      { category: 'Lifestyle Factors', score: 7, maxScore: 10 },
      { category: 'Sleep Consistency', score: 5, maxScore: 10 }
    ],
    weeklySchedule: [
      { day: 'Monday', bedtime: '10:30 PM', wakeTime: '6:30 AM', focus: 'Establish routine' },
      { day: 'Tuesday', bedtime: '10:30 PM', wakeTime: '6:30 AM', focus: 'Morning light exposure' },
      { day: 'Wednesday', bedtime: '10:30 PM', wakeTime: '6:30 AM', focus: 'Limit evening caffeine' },
      { day: 'Thursday', bedtime: '10:30 PM', wakeTime: '6:30 AM', focus: 'Relaxation techniques' },
      { day: 'Friday', bedtime: '10:30 PM', wakeTime: '6:30 AM', focus: 'Prepare for weekend' },
      { day: 'Saturday', bedtime: '10:45 PM', wakeTime: '7:00 AM', focus: 'Maintain consistency' },
      { day: 'Sunday', bedtime: '10:15 PM', wakeTime: '6:30 AM', focus: 'Prepare for week' }
    ],
    bedtimeRoutine: [
      { time: '9:00 PM', activity: 'Dim lights, reduce screen time', icon: 'bulb' },
      { time: '9:30 PM', activity: 'Light reading or meditation', icon: 'book' },
      { time: '10:00 PM', activity: 'Personal hygiene routine', icon: 'water' },
      { time: '10:15 PM', activity: 'Gratitude journaling', icon: 'heart' },
      { time: '10:30 PM', activity: 'Lights out, sleep time', icon: 'moon' }
    ],
    environmentTips: [
      'Keep bedroom temperature between 65-68°F (18-20°C)',
      'Use blackout curtains or eye mask for darkness',
      'Consider white noise machine for sound masking',
      'Ensure comfortable mattress and pillows',
      'Remove electronic devices from bedroom'
    ],
    lifestyleTips: [
      'Exercise regularly, but not within 3 hours of bedtime',
      'Limit caffeine after 2 PM',
      'Avoid large meals 2-3 hours before sleep',
      'Create a relaxing pre-sleep routine',
      'Maintain consistent sleep schedule, even on weekends'
    ]
  };

  const handleAnalyze = () => {
    if (!sleepData.basicInfo.age || !sleepData.sleepPattern.currentBedtime) {
      alert('Please fill in required information to continue.');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(mockSleepPlan);
      setCurrentStep(3);
    }, 4000);
  };

  const resetAnalysis = () => {
    setCurrentStep(1);
    setSleepData({
      basicInfo: { age: '', workSchedule: '', bedtimeGoal: '', wakeTimeGoal: '' },
      sleepPattern: { currentBedtime: '', currentWakeTime: '', sleepQuality: '', timeToFallAsleep: '', nightWakeups: '' },
      lifestyle: { exerciseTime: '', caffeine: '', alcohol: '', screenTime: '', stress: '' },
      preferences: { roomTemp: '', lightLevel: '', noiseLevel: '', mattressComfort: '' }
    });
    setAnalysisResult(null);
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.loadingGradient}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingSpinner}>
              <Ionicons name="moon" size={60} color="white" />
            </View>
            <Text style={styles.loadingText}>Analyzing your sleep patterns and creating personalized bedtime schedule...</Text>
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
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sleep Companion</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          // Step 1: Basic Info & Sleep Goals
          <View style={styles.assessmentSection}>
            <View style={styles.welcomeCard}>
              <Ionicons name="moon" size={32} color="#667eea" />
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeTitle}>Smart Sleep Optimization</Text>
                <Text style={styles.welcomeText}>
                  Get personalized sleep recommendations based on your lifestyle and goals.
                </Text>
              </View>
            </View>

            <View style={styles.basicInfoCard}>
              <Text style={styles.cardTitle}>Basic Information</Text>
              <Text style={styles.cardSubtitle}>Tell us about your current situation</Text>
              
              <View style={styles.inputGrid}>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Age *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="25"
                      value={sleepData.basicInfo.age}
                      onChangeText={(text) => setSleepData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, age: text }
                      }))}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Ideal Bedtime</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="10:30 PM"
                      value={sleepData.basicInfo.bedtimeGoal}
                      onChangeText={(text) => setSleepData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, bedtimeGoal: text }
                      }))}
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Ideal Wake Time</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="6:30 AM"
                      value={sleepData.basicInfo.wakeTimeGoal}
                      onChangeText={(text) => setSleepData(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, wakeTimeGoal: text }
                      }))}
                    />
                  </View>
                </View>

                <View style={styles.workScheduleSection}>
                  <Text style={styles.inputLabel}>Work Schedule *</Text>
                  <View style={styles.scheduleOptions}>
                    {workSchedules.map((schedule) => (
                      <TouchableOpacity
                        key={schedule.value}
                        style={[
                          styles.scheduleOption,
                          sleepData.basicInfo.workSchedule === schedule.value && styles.scheduleOptionSelected
                        ]}
                        onPress={() => setSleepData(prev => ({
                          ...prev,
                          basicInfo: { ...prev.basicInfo, workSchedule: schedule.value }
                        }))}
                      >
                        <Text style={[
                          styles.scheduleLabel,
                          sleepData.basicInfo.workSchedule === schedule.value && styles.scheduleLabelSelected
                        ]}>
                          {schedule.label}
                        </Text>
                        <Text style={styles.scheduleDescription}>{schedule.description}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.continueButton}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { opacity: sleepData.basicInfo.age && sleepData.basicInfo.workSchedule ? 1 : 0.5 }
                ]}
                onPress={() => setCurrentStep(2)}
                disabled={!sleepData.basicInfo.age || !sleepData.basicInfo.workSchedule}
              >
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.nextGradient}>
                  <Text style={styles.nextText}>Continue to Sleep Pattern</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          // Step 2: Sleep Pattern & Lifestyle
          <View style={styles.patternSection}>
            <View style={styles.sleepPatternCard}>
              <Text style={styles.cardTitle}>Current Sleep Pattern</Text>
              <Text style={styles.cardSubtitle}>Your current sleep habits and quality</Text>
              
              <View style={styles.patternInputs}>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Current Bedtime *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="11:00 PM"
                      value={sleepData.sleepPattern.currentBedtime}
                      onChangeText={(text) => setSleepData(prev => ({
                        ...prev,
                        sleepPattern: { ...prev.sleepPattern, currentBedtime: text }
                      }))}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Current Wake Time *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="7:00 AM"
                      value={sleepData.sleepPattern.currentWakeTime}
                      onChangeText={(text) => setSleepData(prev => ({
                        ...prev,
                        sleepPattern: { ...prev.sleepPattern, currentWakeTime: text }
                      }))}
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Time to Fall Asleep</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="15 minutes"
                      value={sleepData.sleepPattern.timeToFallAsleep}
                      onChangeText={(text) => setSleepData(prev => ({
                        ...prev,
                        sleepPattern: { ...prev.sleepPattern, timeToFallAsleep: text }
                      }))}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Night Wakeups</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="1-2 times"
                      value={sleepData.sleepPattern.nightWakeups}
                      onChangeText={(text) => setSleepData(prev => ({
                        ...prev,
                        sleepPattern: { ...prev.sleepPattern, nightWakeups: text }
                      }))}
                    />
                  </View>
                </View>

                <View style={styles.qualitySection}>
                  <Text style={styles.inputLabel}>Sleep Quality *</Text>
                  <View style={styles.qualityOptions}>
                    {sleepQualityLevels.map((quality) => (
                      <TouchableOpacity
                        key={quality.value}
                        style={[
                          styles.qualityCard,
                          sleepData.sleepPattern.sleepQuality === quality.value && styles.qualityCardSelected
                        ]}
                        onPress={() => setSleepData(prev => ({
                          ...prev,
                          sleepPattern: { ...prev.sleepPattern, sleepQuality: quality.value }
                        }))}
                      >
                        <View style={[
                          styles.qualityIcon,
                          { backgroundColor: sleepData.sleepPattern.sleepQuality === quality.value ? quality.color : '#F7FAFC' }
                        ]}>
                          <Ionicons 
                            name={quality.icon} 
                            size={20} 
                            color={sleepData.sleepPattern.sleepQuality === quality.value ? 'white' : '#718096'} 
                          />
                        </View>
                        <Text style={[
                          styles.qualityName,
                          sleepData.sleepPattern.sleepQuality === quality.value && { color: quality.color }
                        ]}>
                          {quality.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.lifestyleCard}>
              <Text style={styles.cardTitle}>Lifestyle Factors</Text>
              <Text style={styles.cardSubtitle}>These affect your sleep quality</Text>
              
              <View style={styles.lifestyleFactors}>
                {lifestyleFactors.map((factor) => (
                  <View key={factor.key} style={styles.factorGroup}>
                    <Text style={styles.inputLabel}>{factor.label}</Text>
                    <View style={styles.optionRow}>
                      {factor.options.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionChip,
                            sleepData.lifestyle[factor.key] === option && styles.optionChipSelected
                          ]}
                          onPress={() => setSleepData(prev => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, [factor.key]: option }
                          }))}
                        >
                          <Text style={[
                            styles.optionChipText,
                            sleepData.lifestyle[factor.key] === option && styles.optionChipTextSelected
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(1)}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.analyzeGradient}>
                  <Ionicons name="moon" size={20} color="white" />
                  <Text style={styles.analyzeText}>Create Sleep Plan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 3 && analysisResult && (
          // Step 3: Sleep Plan Results
          <View style={styles.resultsSection}>
            <View style={styles.resultHeader}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.resultHeaderGradient}>
                <Ionicons name="moon" size={32} color="white" />
                <Text style={styles.resultHeaderTitle}>Your Sleep Plan</Text>
                <Text style={styles.resultHeaderSubtitle}>Personalized for Better Sleep</Text>
              </LinearGradient>
            </View>

            {/* Sleep Score */}
            <View style={styles.sleepScoreCard}>
              <View style={styles.scoreDisplay}>
                <View style={[
                  styles.scoreCircle,
                  { backgroundColor: analysisResult.sleepScore >= 80 ? '#48BB78' : analysisResult.sleepScore >= 60 ? '#ED8936' : '#E53E3E' }
                ]}>
                  <Text style={styles.scoreNumber}>{analysisResult.sleepScore}</Text>
                  <Text style={styles.scoreUnit}>%</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.sleepScoreText}>Sleep Score</Text>
                  <Text style={styles.recommendedTimes}>
                    Bedtime: {analysisResult.recommendedBedtime}
                  </Text>
                  <Text style={styles.recommendedTimes}>
                    Wake: {analysisResult.recommendedWakeTime}
                  </Text>
                  <View style={styles.sleepTimeBadge}>
                    <Text style={styles.sleepTimeText}>{analysisResult.totalSleepTime} sleep</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Sleep Improvements */}
            <View style={styles.improvementsCard}>
              <Text style={styles.improvementsTitle}>Areas for Improvement</Text>
              {analysisResult.improvements.map((improvement, index) => (
                <View key={index} style={styles.improvementItem}>
                  <View style={styles.improvementHeader}>
                    <Text style={styles.improvementName}>{improvement.category}</Text>
                    <Text style={styles.improvementScore}>{improvement.score}/{improvement.maxScore}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${(improvement.score / improvement.maxScore) * 100}%`,
                          backgroundColor: improvement.score >= 8 ? '#48BB78' : improvement.score >= 6 ? '#ED8936' : '#E53E3E'
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Weekly Schedule */}
            <View style={styles.weeklyScheduleCard}>
              <Text style={styles.weeklyScheduleTitle}>Your Weekly Sleep Schedule</Text>
              
              {analysisResult.weeklySchedule.map((day, index) => (
                <View key={index} style={styles.dayScheduleCard}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayName}>{day.day}</Text>
                    <View style={styles.dayTimes}>
                      <Text style={styles.dayTime}>🌙 {day.bedtime}</Text>
                      <Text style={styles.dayTime}>☀️ {day.wakeTime}</Text>
                    </View>
                  </View>
                  <Text style={styles.dayFocus}>Focus: {day.focus}</Text>
                </View>
              ))}
            </View>

            {/* Bedtime Routine */}
            <View style={styles.routineCard}>
              <Text style={styles.routineTitle}>Recommended Bedtime Routine</Text>
              
              {analysisResult.bedtimeRoutine.map((step, index) => (
                <View key={index} style={styles.routineStep}>
                  <View style={styles.routineTime}>
                    <Text style={styles.routineTimeText}>{step.time}</Text>
                  </View>
                  <View style={styles.routineIcon}>
                    <Ionicons name={step.icon} size={20} color="#667eea" />
                  </View>
                  <Text style={styles.routineActivity}>{step.activity}</Text>
                </View>
              ))}
            </View>

            {/* Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Sleep Environment Tips</Text>
              
              {analysisResult.environmentTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#667eea" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>🌟 Lifestyle Tips</Text>
              
              {analysisResult.lifestyleTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="star" size={16} color="#667eea" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.finalActions}>
              <TouchableOpacity style={styles.saveButton}>
                <LinearGradient colors={['#48BB78', '#38A169']} style={styles.saveGradient}>
                  <Ionicons name="bookmark" size={20} color="white" />
                  <Text style={styles.saveText}>Save Plan</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton}>
                <LinearGradient colors={['#4299E1', '#3182CE']} style={styles.shareGradient}>
                  <Ionicons name="share" size={20} color="white" />
                  <Text style={styles.shareText}>Share Plan</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.newPlanButton} onPress={resetAnalysis}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.newPlanGradient}>
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
    backgroundColor: '#EDF2F7',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 12,
    color: '#4A5568',
    lineHeight: 16,
  },
  basicInfoCard: {
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
  workScheduleSection: {
    marginTop: 4,
  },
  scheduleOptions: {
    gap: 8,
  },
  scheduleOption: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  scheduleOptionSelected: {
    backgroundColor: '#EDF2F7',
    borderColor: '#667eea',
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  scheduleLabelSelected: {
    color: '#667eea',
  },
  scheduleDescription: {
    fontSize: 11,
    color: '#718096',
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
  patternSection: {
    marginTop: 20,
  },
  sleepPatternCard: {
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
  patternInputs: {
    gap: 12,
  },
  qualitySection: {
    marginTop: 4,
  },
  qualityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityCard: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  qualityCardSelected: {
    backgroundColor: '#EDF2F7',
    borderColor: '#667eea',
  },
  qualityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  qualityName: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '600',
  },
  lifestyleCard: {
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
  lifestyleFactors: {
    gap: 16,
  },
  factorGroup: {
    marginBottom: 4,
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
    backgroundColor: '#EDF2F7',
    borderColor: '#667eea',
  },
  optionChipText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
  },
  optionChipTextSelected: {
    color: '#667eea',
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
    borderColor: '#667eea',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
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
  sleepScoreCard: {
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
  sleepScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  recommendedTimes: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
  },
  sleepTimeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  sleepTimeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  improvementsCard: {
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
  improvementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  improvementItem: {
    marginBottom: 12,
  },
  improvementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  improvementName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  improvementScore: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  weeklyScheduleCard: {
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
  weeklyScheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  dayScheduleCard: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  dayTimes: {
    flexDirection: 'row',
    gap: 12,
  },
  dayTime: {
    fontSize: 11,
    color: '#4A5568',
    fontWeight: '600',
  },
  dayFocus: {
    fontSize: 11,
    color: '#667eea',
    fontStyle: 'italic',
  },
  routineCard: {
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
  routineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  routineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  routineTime: {
    width: 60,
  },
  routineTimeText: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: 'bold',
  },
  routineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineActivity: {
    flex: 1,
    fontSize: 12,
    color: '#2D3748',
    lineHeight: 16,
  },
  tipsCard: {
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
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#718096',
    flex: 1,
    lineHeight: 16,
  },
  finalActions: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
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
  newPlanButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  newPlanGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  newPlanText: {
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

export default SmartSleepBedtimeCompanion;
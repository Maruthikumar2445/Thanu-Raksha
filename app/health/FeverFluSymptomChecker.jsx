import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  TextInput,
  Alert
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

const FeverFluSymptomChecker = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [symptomData, setSymptomData] = useState({
    basicInfo: {
      age: '',
      temperature: '',
      symptomDuration: '',
      severity: ''
    },
    primarySymptoms: {
      fever: '',
      cough: '',
      soreThroat: '',
      runnyNose: '',
      bodyAches: '',
      headache: '',
      fatigue: '',
      chills: ''
    },
    additionalSymptoms: {
      nausea: '',
      vomiting: '',
      diarrhea: '',
      lossOfAppetite: '',
      difficultyBreathing: '',
      chestPain: '',
      dizziness: '',
      rash: ''
    },
    riskFactors: {
      chronicConditions: '',
      immuneCompromised: '',
      recentTravel: '',
      sickContacts: '',
      vaccination: ''
    }
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  const severityLevels = [
    { value: 'mild', label: 'Mild', color: '#48BB78', icon: 'happy' },
    { value: 'moderate', label: 'Moderate', color: '#ED8936', icon: 'sad-outline' },
    { value: 'severe', label: 'Severe', color: '#E53E3E', icon: 'sad' }
  ];

  const symptomIntensity = [
    { value: 'none', label: 'None', color: '#48BB78' },
    { value: 'mild', label: 'Mild', color: '#68D391' },
    { value: 'moderate', label: 'Moderate', color: '#ED8936' },
    { value: 'severe', label: 'Severe', color: '#E53E3E' }
  ];

  const durationOptions = [
    { value: '1', label: '1 day' },
    { value: '2-3', label: '2-3 days' },
    { value: '4-7', label: '4-7 days' },
    { value: '1-2weeks', label: '1-2 weeks' },
    { value: 'more', label: 'More than 2 weeks' }
  ];

  const yesNoOptions = [
    { value: 'yes', label: 'Yes', color: '#E53E3E' },
    { value: 'no', label: 'No', color: '#48BB78' },
    { value: 'unsure', label: 'Not Sure', color: '#ED8936' }
  ];

  const mockAnalysisResult = {
    likelyCondition: 'Viral Upper Respiratory Infection (Common Cold/Flu)',
    confidence: 87,
    severity: 'Moderate',
    urgencyLevel: 'Monitor at Home',
    symptomScore: 15,
    maxScore: 30,
    diagnosis: {
      primary: {
        condition: 'Viral Upper Respiratory Infection',
        probability: 87,
        description: 'Most likely a common cold or flu virus based on symptom pattern'
      },
      alternatives: [
        { condition: 'Bacterial Sinusitis', probability: 8 },
        { condition: 'Strep Throat', probability: 3 },
        { condition: 'COVID-19', probability: 2 }
      ]
    },
    symptomsAnalysis: {
      fever: { present: true, severity: 'moderate', concern: 'normal for viral infection' },
      cough: { present: true, severity: 'mild', concern: 'typical viral symptom' },
      fatigue: { present: true, severity: 'moderate', concern: 'expected with infection' },
      bodyAches: { present: true, severity: 'moderate', concern: 'common flu symptom' },
      soreThroat: { present: true, severity: 'mild', concern: 'viral irritation' }
    },
    redFlags: [
      { flag: 'High Fever (>103°F)', present: false, urgent: true },
      { flag: 'Difficulty Breathing', present: false, urgent: true },
      { flag: 'Chest Pain', present: false, urgent: true },
      { flag: 'Severe Dehydration', present: false, urgent: false },
      { flag: 'Persistent Vomiting', present: false, urgent: false }
    ],
    recommendations: {
      homecare: [
        'Get plenty of rest (8-10 hours of sleep)',
        'Stay well hydrated (8-10 glasses of water daily)',
        'Use a humidifier or breathe steam from hot shower',
        'Gargle with warm salt water for sore throat',
        'Take over-the-counter pain relievers as needed',
        'Eat light, nutritious foods when appetite returns'
      ],
      medications: [
        'Acetaminophen (Tylenol) 650mg every 6 hours for fever/aches',
        'Ibuprofen (Advil) 400mg every 6-8 hours for inflammation',
        'Throat lozenges or cough drops for throat comfort',
        'Decongestant if nasal congestion is severe',
        'Avoid antibiotics unless prescribed by doctor'
      ],
      monitoring: [
        'Monitor temperature every 4-6 hours',
        'Track symptoms daily for improvement',
        'Watch for worsening breathing difficulties',
        'Note any new or concerning symptoms',
        'Keep a symptom diary for doctor visit if needed'
      ]
    },
    whenToSeekCare: {
      urgent: [
        'Difficulty breathing or shortness of breath',
        'Chest pain or pressure',
        'High fever over 103°F (39.4°C)',
        'Severe dehydration (dizziness, no urination)',
        'Persistent vomiting preventing fluid intake'
      ],
      routine: [
        'Symptoms worsen after 7-10 days',
        'Fever returns after being gone for 24+ hours',
        'Development of ear pain or sinus pressure',
        'Cough becomes very productive or changes color',
        'No improvement after 2 weeks'
      ]
    },
    expectedRecovery: {
      timeline: '7-14 days',
      phases: [
        { phase: 'Days 1-3', description: 'Symptom onset and peak severity' },
        { phase: 'Days 4-7', description: 'Gradual improvement begins' },
        { phase: 'Days 8-14', description: 'Continued recovery, lingering fatigue normal' }
      ]
    },
    prevention: [
      'Wash hands frequently with soap and water',
      'Avoid touching face, especially eyes, nose, mouth',
      'Stay away from sick individuals when possible',
      'Get adequate sleep and manage stress',
      'Consider annual flu vaccination',
      'Maintain good nutrition and regular exercise'
    ]
  };

  const handleSymptomSelect = (category, symptom, value) => {
    setSymptomData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [symptom]: value
      }
    }));
  };

  const handleAnalysis = () => {
    if (!symptomData.basicInfo.age || !symptomData.basicInfo.symptomDuration) {
      Alert.alert('Missing Information', 'Please provide your age and symptom duration to continue.');
      return;
    }
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(mockAnalysisResult);
      setCurrentStep(3);
    }, 4000);
  };

  const resetAnalysis = () => {
    setCurrentStep(1);
    setSymptomData({
      basicInfo: { age: '', temperature: '', symptomDuration: '', severity: '' },
      primarySymptoms: { fever: '', cough: '', soreThroat: '', runnyNose: '', bodyAches: '', headache: '', fatigue: '', chills: '' },
      additionalSymptoms: { nausea: '', vomiting: '', diarrhea: '', lossOfAppetite: '', difficultyBreathing: '', chestPain: '', dizziness: '', rash: '' },
      riskFactors: { chronicConditions: '', immuneCompromised: '', recentTravel: '', sickContacts: '', vaccination: '' }
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
            <Text style={styles.loadingText}>Analyzing your symptoms...</Text>
            <Text style={styles.loadingSubtext}>Evaluating condition patterns and severity</Text>
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
          <Text style={styles.headerTitle}>Symptom Checker</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          // Step 1: Basic Info & Primary Symptoms
          <View style={styles.symptomSection}>
            <View style={styles.welcomeCard}>
              <Ionicons name="thermometer" size={32} color="#E53E3E" />
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeTitle}>Fever & Flu Symptom Checker</Text>
                <Text style={styles.welcomeText}>
                  Get personalized health recommendations based on your symptoms
                </Text>
              </View>
            </View>

            <View style={styles.emergencyCard}>
              <Ionicons name="warning" size={20} color="#E53E3E" />
              <Text style={styles.emergencyText}>
                If you're experiencing severe difficulty breathing, chest pain, or high fever (&gt;103°F), seek immediate medical attention.
              </Text>
            </View>

            {/* Basic Information */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputGrid}>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Age *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="25"
                      value={symptomData.basicInfo.age}
                      onChangeText={(text) => handleSymptomSelect('basicInfo', 'age', text)}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Temperature (°F)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="98.6"
                      value={symptomData.basicInfo.temperature}
                      onChangeText={(text) => handleSymptomSelect('basicInfo', 'temperature', text)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>How long have you had symptoms? *</Text>
                  <View style={styles.durationOptions}>
                    {durationOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.durationOption,
                          symptomData.basicInfo.symptomDuration === option.value && styles.durationOptionSelected
                        ]}
                        onPress={() => handleSymptomSelect('basicInfo', 'symptomDuration', option.value)}
                      >
                        <Text style={[
                          styles.durationText,
                          symptomData.basicInfo.symptomDuration === option.value && styles.durationTextSelected
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Overall Severity</Text>
                  <View style={styles.severityOptions}>
                    {severityLevels.map((level) => (
                      <TouchableOpacity
                        key={level.value}
                        style={[
                          styles.severityCard,
                          symptomData.basicInfo.severity === level.value && styles.severityCardSelected
                        ]}
                        onPress={() => handleSymptomSelect('basicInfo', 'severity', level.value)}
                      >
                        <View style={[
                          styles.severityIcon,
                          { backgroundColor: symptomData.basicInfo.severity === level.value ? level.color : '#F7FAFC' }
                        ]}>
                          <Ionicons 
                            name={level.icon} 
                            size={20} 
                            color={symptomData.basicInfo.severity === level.value ? 'white' : '#718096'} 
                          />
                        </View>
                        <Text style={[
                          styles.severityName,
                          symptomData.basicInfo.severity === level.value && { color: level.color }
                        ]}>
                          {level.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Primary Symptoms */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Primary Symptoms</Text>
              <Text style={styles.sectionSubtitle}>Rate the intensity of each symptom</Text>
              
              <View style={styles.symptomsGrid}>
                {Object.keys(symptomData.primarySymptoms).map((symptom) => (
                  <View key={symptom} style={styles.symptomGroup}>
                    <Text style={styles.symptomName}>
                      {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Text>
                    <View style={styles.intensityRow}>
                      {symptomIntensity.map((intensity) => (
                        <TouchableOpacity
                          key={intensity.value}
                          style={[
                            styles.intensityOption,
                            { borderColor: intensity.color },
                            symptomData.primarySymptoms[symptom] === intensity.value && { backgroundColor: intensity.color }
                          ]}
                          onPress={() => handleSymptomSelect('primarySymptoms', symptom, intensity.value)}
                        >
                          <Text style={[
                            styles.intensityText,
                            symptomData.primarySymptoms[symptom] === intensity.value && { color: 'white' }
                          ]}>
                            {intensity.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.continueButton}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { opacity: symptomData.basicInfo.age && symptomData.basicInfo.symptomDuration ? 1 : 0.5 }
                ]}
                onPress={() => setCurrentStep(2)}
                disabled={!symptomData.basicInfo.age || !symptomData.basicInfo.symptomDuration}
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
          // Step 2: Additional Symptoms & Risk Factors
          <View style={styles.additionalSection}>
            {/* Additional Symptoms */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Additional Symptoms</Text>
              <Text style={styles.sectionSubtitle}>Any other symptoms you're experiencing?</Text>
              
              <View style={styles.symptomsGrid}>
                {Object.keys(symptomData.additionalSymptoms).map((symptom) => (
                  <View key={symptom} style={styles.symptomGroup}>
                    <Text style={styles.symptomName}>
                      {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Text>
                    <View style={styles.intensityRow}>
                      {symptomIntensity.map((intensity) => (
                        <TouchableOpacity
                          key={intensity.value}
                          style={[
                            styles.intensityOption,
                            { borderColor: intensity.color },
                            symptomData.additionalSymptoms[symptom] === intensity.value && { backgroundColor: intensity.color }
                          ]}
                          onPress={() => handleSymptomSelect('additionalSymptoms', symptom, intensity.value)}
                        >
                          <Text style={[
                            styles.intensityText,
                            symptomData.additionalSymptoms[symptom] === intensity.value && { color: 'white' }
                          ]}>
                            {intensity.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Risk Factors */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Risk Factors</Text>
              <Text style={styles.sectionSubtitle}>Help us understand your health background</Text>
              
              <View style={styles.riskFactorsGrid}>
                <View style={styles.riskGroup}>
                  <Text style={styles.riskQuestion}>Do you have any chronic medical conditions?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          symptomData.riskFactors.chronicConditions === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleSymptomSelect('riskFactors', 'chronicConditions', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          symptomData.riskFactors.chronicConditions === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.riskGroup}>
                  <Text style={styles.riskQuestion}>Are you immunocompromised?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          symptomData.riskFactors.immuneCompromised === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleSymptomSelect('riskFactors', 'immuneCompromised', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          symptomData.riskFactors.immuneCompromised === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.riskGroup}>
                  <Text style={styles.riskQuestion}>Recent travel or sick contacts?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          symptomData.riskFactors.sickContacts === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleSymptomSelect('riskFactors', 'sickContacts', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          symptomData.riskFactors.sickContacts === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.riskGroup}>
                  <Text style={styles.riskQuestion}>Are you up to date with vaccinations?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          symptomData.riskFactors.vaccination === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleSymptomSelect('riskFactors', 'vaccination', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          symptomData.riskFactors.vaccination === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(1)}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalysis}>
                <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.analyzeGradient}>
                  <Ionicons name="medical" size={20} color="white" />
                  <Text style={styles.analyzeText}>Analyze Symptoms</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 3 && analysisResult && (
          // Step 3: Analysis Results
          <View style={styles.resultsSection}>
            <View style={styles.resultHeader}>
              <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.resultHeaderGradient}>
                <Ionicons name="medical" size={32} color="white" />
                <Text style={styles.resultHeaderTitle}>Symptom Analysis Results</Text>
                <Text style={styles.resultHeaderSubtitle}>AI-powered health assessment</Text>
              </LinearGradient>
            </View>

            {/* Diagnosis Summary */}
            <View style={styles.diagnosisCard}>
              <View style={styles.diagnosisHeader}>
                <Text style={styles.likelyCondition}>{analysisResult.likelyCondition}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{analysisResult.confidence}% confident</Text>
                </View>
              </View>
              
              <View style={styles.urgencyInfo}>
                <View style={[
                  styles.urgencyBadge,
                  { backgroundColor: analysisResult.urgencyLevel === 'Urgent' ? '#E53E3E' : 
                                   analysisResult.urgencyLevel === 'Soon' ? '#ED8936' : '#48BB78' }
                ]}>
                  <Ionicons 
                    name={analysisResult.urgencyLevel === 'Urgent' ? 'warning' : 
                          analysisResult.urgencyLevel === 'Soon' ? 'time' : 'home'} 
                    size={16} 
                    color="white" 
                  />
                  <Text style={styles.urgencyText}>{analysisResult.urgencyLevel}</Text>
                </View>
                
                <View style={styles.severityInfo}>
                  <Text style={styles.severityLabel}>Severity: {analysisResult.severity}</Text>
                  <Text style={styles.scoreText}>Score: {analysisResult.symptomScore}/{analysisResult.maxScore}</Text>
                </View>
              </View>
            </View>

            {/* Symptom Analysis */}
            <View style={styles.symptomsAnalysisCard}>
              <Text style={styles.symptomsAnalysisTitle}>Symptom Analysis</Text>
              
              {Object.entries(analysisResult.symptomsAnalysis).map(([symptom, data]) => (
                <View key={symptom} style={styles.symptomAnalysisItem}>
                  <View style={styles.symptomAnalysisHeader}>
                    <Text style={styles.symptomAnalysisName}>
                      {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Text>
                    <View style={styles.symptomSeverityBadge}>
                      <Text style={styles.symptomSeverityText}>{data.severity}</Text>
                    </View>
                  </View>
                  <Text style={styles.symptomConcern}>{data.concern}</Text>
                </View>
              ))}
            </View>

            {/* Red Flags Check */}
            <View style={styles.redFlagsCard}>
              <Text style={styles.redFlagsTitle}>🚨 Red Flag Assessment</Text>
              
              {analysisResult.redFlags.map((flag, index) => (
                <View key={index} style={styles.redFlagItem}>
                  <Ionicons 
                    name={flag.present ? 'checkmark-circle' : 'close-circle'} 
                    size={16} 
                    color={flag.present ? '#E53E3E' : '#48BB78'} 
                  />
                  <Text style={[
                    styles.redFlagText,
                    { color: flag.present ? '#E53E3E' : '#48BB78' }
                  ]}>
                    {flag.flag}
                  </Text>
                  {flag.urgent && flag.present && (
                    <View style={styles.urgentTag}>
                      <Text style={styles.urgentTagText}>URGENT</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Recommendations */}
            {Object.entries(analysisResult.recommendations).map(([category, items]) => (
              <View key={category} style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>
                  {category === 'homecare' ? '🏠 Home Care' : 
                   category === 'medications' ? '💊 Medications' : '📊 Monitoring'}
                </Text>
                
                {items.map((item, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#E53E3E" />
                    <Text style={styles.recommendationText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* When to Seek Care */}
            <View style={styles.seekCareCard}>
              <Text style={styles.seekCareTitle}>⚕️ When to Seek Medical Care</Text>
              
              <View style={styles.urgentCareSection}>
                <Text style={styles.urgentCareTitle}>Seek URGENT care if:</Text>
                {analysisResult.whenToSeekCare.urgent.map((item, index) => (
                  <View key={index} style={styles.urgentCareItem}>
                    <Ionicons name="warning" size={14} color="#E53E3E" />
                    <Text style={styles.urgentCareText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.routineCareSection}>
                <Text style={styles.routineCareTitle}>Schedule routine care if:</Text>
                {analysisResult.whenToSeekCare.routine.map((item, index) => (
                  <View key={index} style={styles.routineCareItem}>
                    <Ionicons name="time" size={14} color="#ED8936" />
                    <Text style={styles.routineCareText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Recovery Timeline */}
            <View style={styles.recoveryCard}>
              <Text style={styles.recoveryTitle}>🕐 Expected Recovery Timeline</Text>
              <Text style={styles.recoveryDuration}>Typical Duration: {analysisResult.expectedRecovery.timeline}</Text>
              
              {analysisResult.expectedRecovery.phases.map((phase, index) => (
                <View key={index} style={styles.recoveryPhase}>
                  <View style={styles.phaseIndicator}>
                    <Text style={styles.phaseNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.phaseContent}>
                    <Text style={styles.phaseTitle}>{phase.phase}</Text>
                    <Text style={styles.phaseDescription}>{phase.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Prevention Tips */}
            <View style={styles.preventionCard}>
              <Text style={styles.preventionTitle}>🛡️ Prevention Tips</Text>
              
              {analysisResult.prevention.map((tip, index) => (
                <View key={index} style={styles.preventionItem}>
                  <Ionicons name="shield-checkmark" size={14} color="#48BB78" />
                  <Text style={styles.preventionText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.finalActions}>
              <TouchableOpacity style={styles.saveButton}>
                <LinearGradient colors={['#48BB78', '#38A169']} style={styles.saveGradient}>
                  <Ionicons name="document-text" size={20} color="white" />
                  <Text style={styles.saveText}>Save Report</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton}>
                <LinearGradient colors={['#4299E1', '#3182CE']} style={styles.shareGradient}>
                  <Ionicons name="share" size={20} color="white" />
                  <Text style={styles.shareText}>Share</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.newCheckButton} onPress={resetAnalysis}>
                <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.newCheckGradient}>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.newCheckText}>New Check</Text>
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
  symptomSection: {
    marginTop: 20,
  },
  welcomeCard: {
    backgroundColor: 'rgba(254, 215, 215, 0.9)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53E3E',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 12,
    color: '#C53030',
    lineHeight: 16,
  },
  emergencyCard: {
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  emergencyText: {
    fontSize: 11,
    color: '#9A3412',
    flex: 1,
    lineHeight: 15,
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  sectionSubtitle: {
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
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  durationOptionSelected: {
    backgroundColor: '#FED7D7',
    borderColor: '#E53E3E',
  },
  durationText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
  },
  durationTextSelected: {
    color: '#E53E3E',
  },
  severityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  severityCard: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  severityCardSelected: {
    backgroundColor: '#FED7D7',
    borderColor: '#E53E3E',
  },
  severityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  severityName: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '600',
  },
  symptomsGrid: {
    gap: 12,
  },
  symptomGroup: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
  },
  symptomName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 6,
  },
  intensityOption: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  intensityText: {
    fontSize: 10,
    fontWeight: '600',
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
  additionalSection: {
    marginTop: 20,
  },
  riskFactorsGrid: {
    gap: 12,
  },
  riskGroup: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
  },
  riskQuestion: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 8,
    fontWeight: '600',
  },
  yesNoRow: {
    flexDirection: 'row',
    gap: 6,
  },
  yesNoOption: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  yesNoText: {
    fontSize: 10,
    fontWeight: '600',
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
  diagnosisCard: {
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
  diagnosisHeader: {
    marginBottom: 12,
  },
  likelyCondition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#48BB78',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  urgencyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
  severityInfo: {
    alignItems: 'flex-end',
  },
  severityLabel: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 10,
    color: '#718096',
  },
  symptomsAnalysisCard: {
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
  symptomsAnalysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  symptomAnalysisItem: {
    backgroundColor: '#F7FAFC',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  symptomAnalysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  symptomAnalysisName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  symptomSeverityBadge: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  symptomSeverityText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  symptomConcern: {
    fontSize: 10,
    color: '#718096',
  },
  redFlagsCard: {
    backgroundColor: '#FED7D7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  redFlagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: 12,
  },
  redFlagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  redFlagText: {
    fontSize: 12,
    flex: 1,
  },
  urgentTag: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentTagText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  recommendationCard: {
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
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: '#4A5568',
    flex: 1,
    lineHeight: 16,
  },
  seekCareCard: {
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
  seekCareTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  urgentCareSection: {
    marginBottom: 12,
  },
  urgentCareTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E53E3E',
    marginBottom: 8,
  },
  urgentCareItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 6,
  },
  urgentCareText: {
    fontSize: 11,
    color: '#E53E3E',
    flex: 1,
  },
  routineCareSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  routineCareTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ED8936',
    marginBottom: 8,
  },
  routineCareItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 6,
  },
  routineCareText: {
    fontSize: 11,
    color: '#ED8936',
    flex: 1,
  },
  recoveryCard: {
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
  recoveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6,
  },
  recoveryDuration: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 12,
    fontWeight: '600',
  },
  recoveryPhase: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  phaseIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  phaseNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  phaseContent: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  phaseDescription: {
    fontSize: 10,
    color: '#718096',
  },
  preventionCard: {
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
  preventionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  preventionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  preventionText: {
    fontSize: 12,
    color: '#4A5568',
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
  newCheckButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  newCheckGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  newCheckText: {
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
    marginBottom: 8,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
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

export default FeverFluSymptomChecker;
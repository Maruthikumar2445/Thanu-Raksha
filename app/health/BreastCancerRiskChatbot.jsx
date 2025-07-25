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
    <View style={[style, { backgroundColor: colors?.[0] || '#EC4899' }]} {...props}>
      {children}
    </View>
  );
}

const BreastCancerRiskChatbot = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAssessing, setIsAssessing] = useState(false);
  const [riskData, setRiskData] = useState({
    demographics: {
      age: '',
      ethnicity: '',
      familyHistory: '',
      geneticTesting: ''
    },
    medicalHistory: {
      previousCancer: '',
      breastBiopsies: '',
      hormoneTherapy: '',
      birthControl: '',
      pregnancies: '',
      firstPregnancyAge: '',
      breastfeedingDuration: ''
    },
    lifestyle: {
      physicalActivity: '',
      alcohol: '',
      smoking: '',
      bodyWeight: '',
      diet: ''
    },
    symptoms: {
      breastLumps: '',
      breastPain: '',
      nippleDischarge: '',
      skinChanges: '',
      breastAsymmetry: ''
    }
  });
  const [assessmentResult, setAssessmentResult] = useState(null);

  const ethnicityOptions = [
    { value: 'caucasian', label: 'Caucasian/White' },
    { value: 'african', label: 'African American/Black' },
    { value: 'hispanic', label: 'Hispanic/Latino' },
    { value: 'asian', label: 'Asian' },
    { value: 'native', label: 'Native American' },
    { value: 'other', label: 'Other/Mixed' }
  ];

  const yesNoOptions = [
    { value: 'yes', label: 'Yes', color: '#E53E3E' },
    { value: 'no', label: 'No', color: '#48BB78' },
    { value: 'unsure', label: 'Not Sure', color: '#ED8936' }
  ];

  const frequencyOptions = [
    { value: 'never', label: 'Never', color: '#48BB78' },
    { value: 'rarely', label: 'Rarely', color: '#68D391' },
    { value: 'sometimes', label: 'Sometimes', color: '#ED8936' },
    { value: 'often', label: 'Often', color: '#F56565' },
    { value: 'daily', label: 'Daily', color: '#E53E3E' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'low', label: 'Low Active', description: '1-2 times per week' },
    { value: 'moderate', label: 'Moderately Active', description: '3-4 times per week' },
    { value: 'high', label: 'Highly Active', description: '5+ times per week' },
    { value: 'athlete', label: 'Athletic', description: 'Daily intense training' }
  ];

  const mockAssessmentResult = {
    riskLevel: 'Moderate',
    riskPercentage: 12,
    lifetimeRisk: '1 in 8',
    riskFactors: [
      { factor: 'Age over 50', impact: 'High', status: 'present', description: 'Risk increases significantly with age' },
      { factor: 'Family History', impact: 'High', status: 'absent', description: 'No immediate family history reported' },
      { factor: 'Genetic Mutations', impact: 'Very High', status: 'unknown', description: 'No genetic testing done' },
      { factor: 'Hormone Exposure', impact: 'Moderate', status: 'present', description: 'Long-term hormone therapy use' },
      { factor: 'Lifestyle Factors', impact: 'Low', status: 'mixed', description: 'Some modifiable risk factors present' }
    ],
    recommendations: [
      {
        category: 'Screening',
        items: [
          'Annual mammography starting at age 40-50',
          'Clinical breast examination every 1-2 years',
          'Monthly self-breast examination',
          'Consider MRI screening if high genetic risk'
        ]
      },
      {
        category: 'Lifestyle',
        items: [
          'Maintain healthy body weight',
          'Limit alcohol consumption to 1 drink per day',
          'Engage in regular physical activity (150 min/week)',
          'Eat a balanced diet rich in fruits and vegetables'
        ]
      },
      {
        category: 'Medical',
        items: [
          'Discuss hormone therapy risks with doctor',
          'Consider genetic counseling if family history',
          'Regular follow-up with healthcare provider',
          'Stay informed about breast health'
        ]
      }
    ],
    warningSignsToWatch: [
      'New lump or mass in breast or underarm',
      'Change in size or shape of breast',
      'Dimpling or puckering of breast skin',
      'Nipple discharge (especially bloody)',
      'Nipple retraction or inversion',
      'Persistent breast or nipple pain',
      'Redness or thickening of breast skin'
    ],
    nextSteps: [
      'Schedule appointment with primary care physician',
      'Discuss family history with relatives',
      'Consider genetic counseling consultation',
      'Begin or maintain regular screening schedule',
      'Implement recommended lifestyle changes'
    ],
    disclaimer: 'This assessment is for educational purposes only and does not replace professional medical advice. Please consult with a healthcare provider for personalized risk assessment and screening recommendations.'
  };

  const handleOptionSelect = (category, subcategory, value) => {
    setRiskData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: value
      }
    }));
  };

  const handleAssessment = () => {
    if (!riskData.demographics.age || !riskData.demographics.ethnicity) {
      Alert.alert('Missing Information', 'Please provide your age and ethnicity to continue.');
      return;
    }
    
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
      setAssessmentResult(mockAssessmentResult);
      setCurrentStep(3);
    }, 4000);
  };

  const resetAssessment = () => {
    setCurrentStep(1);
    setRiskData({
      demographics: { age: '', ethnicity: '', familyHistory: '', geneticTesting: '' },
      medicalHistory: { previousCancer: '', breastBiopsies: '', hormoneTherapy: '', birthControl: '', pregnancies: '', firstPregnancyAge: '', breastfeedingDuration: '' },
      lifestyle: { physicalActivity: '', alcohol: '', smoking: '', bodyWeight: '', diet: '' },
      symptoms: { breastLumps: '', breastPain: '', nippleDischarge: '', skinChanges: '', breastAsymmetry: '' }
    });
    setAssessmentResult(null);
  };

  if (isAssessing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient colors={['#EC4899', '#BE185D']} style={styles.loadingGradient}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingSpinner}>
              <Ionicons name="medical" size={60} color="white" />
            </View>
            <Text style={styles.loadingText}>Analyzing your risk factors...</Text>
            <Text style={styles.loadingSubtext}>Processing medical and lifestyle information</Text>
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
      <LinearGradient colors={['#EC4899', '#BE185D']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Risk Assessment</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          // Step 1: Demographics & Medical History
          <View style={styles.assessmentSection}>
            <View style={styles.welcomeCard}>
              <Ionicons name="medical" size={32} color="#EC4899" />
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeTitle}>Breast Cancer Risk Assessment</Text>
                <Text style={styles.welcomeText}>
                  Comprehensive evaluation based on medical guidelines and risk factors
                </Text>
              </View>
            </View>

            <View style={styles.disclaimerCard}>
              <Ionicons name="information-circle" size={20} color="#EC4899" />
              <Text style={styles.disclaimerText}>
                This tool provides educational information only and should not replace professional medical advice.
              </Text>
            </View>

            {/* Demographics */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Demographics</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your age"
                  value={riskData.demographics.age}
                  onChangeText={(text) => handleOptionSelect('demographics', 'age', text)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ethnicity *</Text>
                <View style={styles.optionGrid}>
                  {ethnicityOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionCard,
                        riskData.demographics.ethnicity === option.value && styles.optionCardSelected
                      ]}
                      onPress={() => handleOptionSelect('demographics', 'ethnicity', option.value)}
                    >
                      <Text style={[
                        styles.optionText,
                        riskData.demographics.ethnicity === option.value && styles.optionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Family History of Breast/Ovarian Cancer</Text>
                <View style={styles.yesNoRow}>
                  {yesNoOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.yesNoOption,
                        { borderColor: option.color },
                        riskData.demographics.familyHistory === option.value && { backgroundColor: option.color }
                      ]}
                      onPress={() => handleOptionSelect('demographics', 'familyHistory', option.value)}
                    >
                      <Text style={[
                        styles.yesNoText,
                        riskData.demographics.familyHistory === option.value && { color: 'white' }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Genetic Testing (BRCA1/BRCA2)</Text>
                <View style={styles.yesNoRow}>
                  {yesNoOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.yesNoOption,
                        { borderColor: option.color },
                        riskData.demographics.geneticTesting === option.value && { backgroundColor: option.color }
                      ]}
                      onPress={() => handleOptionSelect('demographics', 'geneticTesting', option.value)}
                    >
                      <Text style={[
                        styles.yesNoText,
                        riskData.demographics.geneticTesting === option.value && { color: 'white' }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Medical History */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Medical History</Text>
              
              <View style={styles.medicalQuestions}>
                <View style={styles.questionGroup}>
                  <Text style={styles.questionText}>Previous breast cancer diagnosis?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          riskData.medicalHistory.previousCancer === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleOptionSelect('medicalHistory', 'previousCancer', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          riskData.medicalHistory.previousCancer === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.questionGroup}>
                  <Text style={styles.questionText}>Previous breast biopsies?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          riskData.medicalHistory.breastBiopsies === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleOptionSelect('medicalHistory', 'breastBiopsies', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          riskData.medicalHistory.breastBiopsies === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.questionGroup}>
                  <Text style={styles.questionText}>Hormone replacement therapy use?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          riskData.medicalHistory.hormoneTherapy === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleOptionSelect('medicalHistory', 'hormoneTherapy', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          riskData.medicalHistory.hormoneTherapy === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Number of Pregnancies</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0"
                    value={riskData.medicalHistory.pregnancies}
                    onChangeText={(text) => handleOptionSelect('medicalHistory', 'pregnancies', text)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Age at First Pregnancy</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="N/A"
                    value={riskData.medicalHistory.firstPregnancyAge}
                    onChangeText={(text) => handleOptionSelect('medicalHistory', 'firstPregnancyAge', text)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.continueButton}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { opacity: riskData.demographics.age && riskData.demographics.ethnicity ? 1 : 0.5 }
                ]}
                onPress={() => setCurrentStep(2)}
                disabled={!riskData.demographics.age || !riskData.demographics.ethnicity}
              >
                <LinearGradient colors={['#EC4899', '#BE185D']} style={styles.nextGradient}>
                  <Text style={styles.nextText}>Continue Assessment</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          // Step 2: Lifestyle & Symptoms
          <View style={styles.lifestyleSection}>
            {/* Lifestyle Factors */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Lifestyle Factors</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Physical Activity Level</Text>
                <View style={styles.activityOptions}>
                  {activityLevels.map((level) => (
                    <TouchableOpacity
                      key={level.value}
                      style={[
                        styles.activityCard,
                        riskData.lifestyle.physicalActivity === level.value && styles.activityCardSelected
                      ]}
                      onPress={() => handleOptionSelect('lifestyle', 'physicalActivity', level.value)}
                    >
                      <Text style={[
                        styles.activityLabel,
                        riskData.lifestyle.physicalActivity === level.value && styles.activityLabelSelected
                      ]}>
                        {level.label}
                      </Text>
                      <Text style={styles.activityDescription}>{level.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Alcohol Consumption</Text>
                <View style={styles.frequencyRow}>
                  {frequencyOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.frequencyOption,
                        { borderColor: option.color },
                        riskData.lifestyle.alcohol === option.value && { backgroundColor: option.color }
                      ]}
                      onPress={() => handleOptionSelect('lifestyle', 'alcohol', option.value)}
                    >
                      <Text style={[
                        styles.frequencyText,
                        riskData.lifestyle.alcohol === option.value && { color: 'white' }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Smoking History</Text>
                <View style={styles.frequencyRow}>
                  {frequencyOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.frequencyOption,
                        { borderColor: option.color },
                        riskData.lifestyle.smoking === option.value && { backgroundColor: option.color }
                      ]}
                      onPress={() => handleOptionSelect('lifestyle', 'smoking', option.value)}
                    >
                      <Text style={[
                        styles.frequencyText,
                        riskData.lifestyle.smoking === option.value && { color: 'white' }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Current Symptoms */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Current Symptoms</Text>
              <Text style={styles.sectionSubtitle}>Check any symptoms you're currently experiencing</Text>
              
              <View style={styles.symptomsGrid}>
                <View style={styles.symptomGroup}>
                  <Text style={styles.symptomQuestion}>Breast lumps or masses?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.slice(0, 2).map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          riskData.symptoms.breastLumps === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleOptionSelect('symptoms', 'breastLumps', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          riskData.symptoms.breastLumps === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.symptomGroup}>
                  <Text style={styles.symptomQuestion}>Persistent breast pain?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.slice(0, 2).map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          riskData.symptoms.breastPain === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleOptionSelect('symptoms', 'breastPain', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          riskData.symptoms.breastPain === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.symptomGroup}>
                  <Text style={styles.symptomQuestion}>Nipple discharge?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.slice(0, 2).map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          riskData.symptoms.nippleDischarge === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleOptionSelect('symptoms', 'nippleDischarge', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          riskData.symptoms.nippleDischarge === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.symptomGroup}>
                  <Text style={styles.symptomQuestion}>Skin changes on breast?</Text>
                  <View style={styles.yesNoRow}>
                    {yesNoOptions.slice(0, 2).map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.yesNoOption,
                          { borderColor: option.color },
                          riskData.symptoms.skinChanges === option.value && { backgroundColor: option.color }
                        ]}
                        onPress={() => handleOptionSelect('symptoms', 'skinChanges', option.value)}
                      >
                        <Text style={[
                          styles.yesNoText,
                          riskData.symptoms.skinChanges === option.value && { color: 'white' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {(riskData.symptoms.breastLumps === 'yes' || 
                riskData.symptoms.nippleDischarge === 'yes' || 
                riskData.symptoms.skinChanges === 'yes') && (
                <View style={styles.urgentNotice}>
                  <Ionicons name="warning" size={20} color="#E53E3E" />
                  <Text style={styles.urgentText}>
                    You've reported concerning symptoms. Please consult a healthcare provider immediately.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(1)}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.assessButton} onPress={handleAssessment}>
                <LinearGradient colors={['#EC4899', '#BE185D']} style={styles.assessGradient}>
                  <Ionicons name="analytics" size={20} color="white" />
                  <Text style={styles.assessText}>Get Risk Assessment</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 3 && assessmentResult && (
          // Step 3: Risk Assessment Results
          <View style={styles.resultsSection}>
            <View style={styles.resultHeader}>
              <LinearGradient colors={['#EC4899', '#BE185D']} style={styles.resultHeaderGradient}>
                <Ionicons name="shield-checkmark" size={32} color="white" />
                <Text style={styles.resultHeaderTitle}>Risk Assessment Results</Text>
                <Text style={styles.resultHeaderSubtitle}>Based on current medical guidelines</Text>
              </LinearGradient>
            </View>

            {/* Risk Level */}
            <View style={styles.riskLevelCard}>
              <View style={styles.riskDisplay}>
                <View style={[
                  styles.riskCircle,
                  { backgroundColor: assessmentResult.riskLevel === 'Low' ? '#48BB78' : 
                                    assessmentResult.riskLevel === 'Moderate' ? '#ED8936' : '#E53E3E' }
                ]}>
                  <Text style={styles.riskPercentage}>{assessmentResult.riskPercentage}%</Text>
                </View>
                <View style={styles.riskInfo}>
                  <Text style={styles.riskLevelText}>{assessmentResult.riskLevel} Risk</Text>
                  <Text style={styles.lifetimeRiskText}>Lifetime Risk: {assessmentResult.lifetimeRisk}</Text>
                  <Text style={styles.riskDescription}>
                    Based on your demographics, medical history, and lifestyle factors
                  </Text>
                </View>
              </View>
            </View>

            {/* Risk Factors Analysis */}
            <View style={styles.riskFactorsCard}>
              <Text style={styles.riskFactorsTitle}>Risk Factors Analysis</Text>
              
              {assessmentResult.riskFactors.map((factor, index) => (
                <View key={index} style={styles.factorItem}>
                  <View style={styles.factorHeader}>
                    <Text style={styles.factorName}>{factor.factor}</Text>
                    <View style={styles.factorStatus}>
                      <Ionicons 
                        name={factor.status === 'present' ? 'checkmark-circle' : 
                              factor.status === 'absent' ? 'close-circle' : 'help-circle'} 
                        size={16} 
                        color={factor.status === 'present' ? '#E53E3E' : 
                               factor.status === 'absent' ? '#48BB78' : '#ED8936'} 
                      />
                      <Text style={[
                        styles.factorStatusText,
                        { color: factor.status === 'present' ? '#E53E3E' : 
                                 factor.status === 'absent' ? '#48BB78' : '#ED8936' }
                      ]}>
                        {factor.status === 'present' ? 'Present' : 
                         factor.status === 'absent' ? 'Absent' : 'Unknown'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.factorImpact}>Impact: {factor.impact}</Text>
                  <Text style={styles.factorDescription}>{factor.description}</Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            {assessmentResult.recommendations.map((category, index) => (
              <View key={index} style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>
                  {category.category === 'Screening' ? '🔍 ' : 
                   category.category === 'Lifestyle' ? '🏃‍♀️ ' : '⚕️ '}
                  {category.category} Recommendations
                </Text>
                
                {category.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.recommendationItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#EC4899" />
                    <Text style={styles.recommendationText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Warning Signs */}
            <View style={styles.warningSignsCard}>
              <Text style={styles.warningSignsTitle}>⚠️ Warning Signs to Watch For</Text>
              <Text style={styles.warningSignsSubtitle}>Contact your doctor immediately if you notice:</Text>
              
              {assessmentResult.warningSignsToWatch.map((sign, index) => (
                <View key={index} style={styles.warningSignItem}>
                  <Ionicons name="alert-circle" size={14} color="#E53E3E" />
                  <Text style={styles.warningSignText}>{sign}</Text>
                </View>
              ))}
            </View>

            {/* Next Steps */}
            <View style={styles.nextStepsCard}>
              <Text style={styles.nextStepsTitle}>📋 Recommended Next Steps</Text>
              
              {assessmentResult.nextSteps.map((step, index) => (
                <View key={index} style={styles.nextStepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.nextStepText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerResultCard}>
              <Ionicons name="information-circle" size={20} color="#EC4899" />
              <Text style={styles.disclaimerResultText}>{assessmentResult.disclaimer}</Text>
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

              <TouchableOpacity style={styles.newAssessmentButton} onPress={resetAssessment}>
                <LinearGradient colors={['#EC4899', '#BE185D']} style={styles.newAssessmentGradient}>
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
  welcomeCard: {
    backgroundColor: '#FDF2F8',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F9A8D4',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 12,
    color: '#BE185D',
    lineHeight: 16,
  },
  disclaimerCard: {
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
  disclaimerText: {
    fontSize: 11,
    color: '#9A3412',
    flex: 1,
    lineHeight: 15,
  },
  sectionCard: {
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
  inputGroup: {
    marginBottom: 16,
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
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  optionCardSelected: {
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
  },
  optionText: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#EC4899',
  },
  yesNoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  yesNoOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  yesNoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  medicalQuestions: {
    gap: 12,
  },
  questionGroup: {
    marginBottom: 8,
  },
  questionText: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 6,
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
  lifestyleSection: {
    marginTop: 20,
  },
  activityOptions: {
    gap: 8,
  },
  activityCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityCardSelected: {
    backgroundColor: '#FDF2F8',
    borderColor: '#EC4899',
  },
  activityLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  activityLabelSelected: {
    color: '#EC4899',
  },
  activityDescription: {
    fontSize: 10,
    color: '#718096',
  },
  frequencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  frequencyOption: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 60,
  },
  frequencyText: {
    fontSize: 10,
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
  symptomQuestion: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 8,
    fontWeight: '600',
  },
  urgentNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FED7D7',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  urgentText: {
    fontSize: 12,
    color: '#C53030',
    flex: 1,
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
    borderColor: '#EC4899',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EC4899',
  },
  assessButton: {
    flex: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  assessGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  assessText: {
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
  riskLevelCard: {
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
  riskDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  riskCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  riskInfo: {
    flex: 1,
  },
  riskLevelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  lifetimeRiskText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 11,
    color: '#718096',
    lineHeight: 15,
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
  factorItem: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
  },
  factorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  factorStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  factorImpact: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 2,
    fontWeight: '600',
  },
  factorDescription: {
    fontSize: 10,
    color: '#718096',
    lineHeight: 13,
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
  warningSignsCard: {
    backgroundColor: '#FED7D7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  warningSignsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: 4,
  },
  warningSignsSubtitle: {
    fontSize: 12,
    color: '#C53030',
    marginBottom: 12,
  },
  warningSignItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 6,
  },
  warningSignText: {
    fontSize: 11,
    color: '#C53030',
    flex: 1,
  },
  nextStepsCard: {
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
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  nextStepText: {
    fontSize: 12,
    color: '#4A5568',
    flex: 1,
    lineHeight: 16,
  },
  disclaimerResultCard: {
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
  disclaimerResultText: {
    fontSize: 10,
    color: '#9A3412',
    flex: 1,
    lineHeight: 14,
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

export default BreastCancerRiskChatbot;
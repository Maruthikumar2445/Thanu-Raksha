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
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Conditional import for LinearGradient with fallback
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradient = ({ children, colors, style, ...props }) => (
    <View style={[style, { backgroundColor: colors?.[0] || '#FF6B6B' }]} {...props}>
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
    <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.loadingGradient}>
      <View style={styles.loadingContent}>
        <View style={styles.loadingSpinner}>
          <Ionicons name="medical" size={60} color="white" />
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

const SkinDiseaseDetector = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Analysis, 3: Results

  const skinConditions = [
    { name: 'Acne', confidence: 85, color: '#e74c3c', severity: 'Moderate' },
    { name: 'Eczema', confidence: 12, color: '#f39c12', severity: 'Mild' },
    { name: 'Melanoma Risk', confidence: 3, color: '#2ecc71', severity: 'Low' }
  ];

  const recommendations = [
    {
      category: 'Immediate Care',
      items: [
        'Keep the affected area clean and dry',
        'Avoid touching or picking at the skin',
        'Use gentle, fragrance-free skincare products'
      ]
    },
    {
      category: 'Treatment Options',
      items: [
        'Topical retinoids for acne treatment',
        'Gentle exfoliation 2-3 times per week',
        'Consider salicylic acid or benzoyl peroxide'
      ]
    },
    {
      category: 'When to See a Doctor',
      items: [
        'If condition worsens or doesn\'t improve in 2 weeks',
        'Signs of infection (pus, excessive redness, warmth)',
        'Any changes in moles or unusual skin growths'
      ]
    }
  ];

  const mockImagePicker = () => {
    // Simulate image picker
    Alert.alert(
      'Select Image Source',
      'Choose how you want to add the image',
      [
        { text: 'Camera', onPress: () => simulateImageSelection('camera') },
        { text: 'Gallery', onPress: () => simulateImageSelection('gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const simulateImageSelection = (source) => {
    // Simulate image selection
    setSelectedImage({
      uri: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Skin+Sample',
      source: source
    });
    setCurrentStep(2);
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        primaryCondition: skinConditions[0],
        confidence: 85,
        recommendations: recommendations,
        riskLevel: 'Moderate',
        accuracy: 92
      });
      setCurrentStep(3);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setCurrentStep(1);
  };

  if (isAnalyzing) {
    return <LoadingComponent text="Analyzing skin condition using AI..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Skin Disease Detector" 
        gradient={['#FF6B6B', '#FF8E8E']}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          // Step 1: Image Upload
          <View style={styles.uploadSection}>
            <View style={styles.instructionCard}>
              <Ionicons name="information-circle" size={32} color="#FF6B6B" />
              <Text style={styles.instructionTitle}>How to Get Best Results</Text>
              <View style={styles.instructionList}>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                  <Text style={styles.instructionText}>Take photo in good lighting</Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                  <Text style={styles.instructionText}>Keep camera steady and focused</Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                  <Text style={styles.instructionText}>Show the affected area clearly</Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                  <Text style={styles.instructionText}>Include surrounding healthy skin</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={mockImagePicker}>
              <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.uploadGradient}>
                <Ionicons name="camera" size={40} color="white" />
                <Text style={styles.uploadText}>Take Photo or Select Image</Text>
                <Text style={styles.uploadSubtext}>Tap to capture or choose from gallery</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.disclaimerCard}>
              <Ionicons name="shield-checkmark" size={24} color="#3498db" />
              <Text style={styles.disclaimerText}>
                This AI analysis is for informational purposes only and should not replace professional medical diagnosis.
              </Text>
            </View>
          </View>
        )}

        {currentStep === 2 && selectedImage && (
          // Step 2: Image Preview and Analysis
          <View style={styles.previewSection}>
            <View style={styles.imageCard}>
              <Text style={styles.imageCardTitle}>Selected Image</Text>
              <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image" size={60} color="#FF6B6B" />
                  <Text style={styles.imagePlaceholderText}>Skin Sample Image</Text>
                </View>
              </View>
              <View style={styles.imageInfo}>
                <View style={styles.imageInfoItem}>
                  <Ionicons name="camera" size={16} color="#7F8C8D" />
                  <Text style={styles.imageInfoText}>Source: {selectedImage.source}</Text>
                </View>
                <View style={styles.imageInfoItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                  <Text style={styles.imageInfoText}>Image quality: Good</Text>
                </View>
              </View>
            </View>

            <View style={styles.analysisInfo}>
              <Text style={styles.analysisTitle}>AI Analysis Process</Text>
              <View style={styles.analysisSteps}>
                <View style={styles.analysisStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>Image preprocessing and enhancement</Text>
                </View>
                <View style={styles.analysisStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>Feature extraction using CNN</Text>
                </View>
                <View style={styles.analysisStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>Pattern matching with database</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.retakeButton} onPress={resetAnalysis}>
                <Text style={styles.retakeText}>Retake Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
                <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.analyzeGradient}>
                  <Ionicons name="scan" size={20} color="white" />
                  <Text style={styles.analyzeText}>Analyze Image</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 3 && analysisResult && (
          // Step 3: Analysis Results
          <View style={styles.resultsSection}>
            <View style={styles.resultHeader}>
              <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.resultHeaderGradient}>
                <Ionicons name="analytics" size={32} color="white" />
                <Text style={styles.resultHeaderTitle}>Analysis Complete</Text>
                <Text style={styles.resultHeaderSubtitle}>AI Confidence: {analysisResult.accuracy}%</Text>
              </LinearGradient>
            </View>

            {/* Primary Diagnosis */}
            <View style={styles.diagnosisCard}>
              <Text style={styles.diagnosisTitle}>Primary Diagnosis</Text>
              <View style={styles.diagnosisMain}>
                <View style={styles.diagnosisIcon}>
                  <Ionicons name="medical" size={32} color={analysisResult.primaryCondition.color} />
                </View>
                <View style={styles.diagnosisInfo}>
                  <Text style={styles.conditionName}>{analysisResult.primaryCondition.name}</Text>
                  <Text style={styles.conditionSeverity}>Severity: {analysisResult.primaryCondition.severity}</Text>
                  <View style={styles.confidenceBar}>
                    <View style={styles.confidenceBarBg}>
                      <View 
                        style={[
                          styles.confidenceBarFill, 
                          { 
                            width: `${analysisResult.primaryCondition.confidence}%`,
                            backgroundColor: analysisResult.primaryCondition.color 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.confidenceText}>{analysisResult.primaryCondition.confidence}% confidence</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Other Possible Conditions */}
            <View style={styles.otherConditionsCard}>
              <Text style={styles.otherConditionsTitle}>Other Possible Conditions</Text>
              {skinConditions.slice(1).map((condition, index) => (
                <View key={index} style={styles.conditionItem}>
                  <View style={[styles.conditionDot, { backgroundColor: condition.color }]} />
                  <Text style={styles.conditionItemName}>{condition.name}</Text>
                  <Text style={styles.conditionItemConfidence}>{condition.confidence}%</Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsCard}>
              <Text style={styles.recommendationsTitle}>Professional Recommendations</Text>
              {recommendations.map((category, index) => (
                <View key={index} style={styles.recommendationCategory}>
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                  {category.items.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.recommendationItem}>
                      <Ionicons name="checkmark" size={16} color="#FF6B6B" />
                      <Text style={styles.recommendationText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            {/* Emergency Warning */}
            <View style={styles.warningCard}>
              <Ionicons name="warning" size={24} color="#e74c3c" />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Important Notice</Text>
                <Text style={styles.warningText}>
                  This AI analysis is a screening tool only. Please consult a dermatologist for proper diagnosis and treatment, especially for any concerning changes in your skin.
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.finalActions}>
              <TouchableOpacity style={styles.saveButton}>
                <LinearGradient colors={['#2ecc71', '#27ae60']} style={styles.saveGradient}>
                  <Ionicons name="bookmark" size={20} color="white" />
                  <Text style={styles.saveText}>Save Report</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.newAnalysisButton} onPress={resetAnalysis}>
                <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.newAnalysisGradient}>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.newAnalysisText}>New Analysis</Text>
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
    backgroundColor: '#F8FAFC',
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
  uploadSection: {
    marginTop: 20,
  },
  instructionCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
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
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 16,
  },
  instructionList: {
    width: '100%',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#7F8C8D',
    flex: 1,
  },
  uploadButton: {
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
  uploadGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  uploadSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  disclaimerCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
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
  disclaimerText: {
    fontSize: 12,
    color: '#7F8C8D',
    flex: 1,
    lineHeight: 18,
  },
  previewSection: {
    marginTop: 20,
  },
  imageCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
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
  imageCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E8F4FD',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  imageInfo: {
    gap: 8,
  },
  imageInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageInfoText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  analysisInfo: {
    backgroundColor: 'white',
    padding: 24,
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
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  analysisSteps: {
    gap: 12,
  },
  analysisStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepText: {
    fontSize: 14,
    color: '#7F8C8D',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  retakeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
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
  diagnosisCard: {
    backgroundColor: 'white',
    padding: 24,
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
  diagnosisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  diagnosisMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  diagnosisIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagnosisInfo: {
    flex: 1,
  },
  conditionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  conditionSeverity: {
    fontSize: 14,
    color: '#7F8C8D',
    marginVertical: 4,
  },
  confidenceBar: {
    marginTop: 8,
  },
  confidenceBarBg: {
    height: 6,
    backgroundColor: '#E8F4FD',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  otherConditionsCard: {
    backgroundColor: 'white',
    padding: 24,
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
  otherConditionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  conditionItemName: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
  },
  conditionItemConfidence: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  recommendationsCard: {
    backgroundColor: 'white',
    padding: 24,
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
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  recommendationCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#7F8C8D',
    flex: 1,
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: '#FFF5F5',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    marginBottom: 20,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  finalActions: {
    flexDirection: 'row',
    gap: 12,
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
    paddingVertical: 16,
    gap: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  newAnalysisButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  newAnalysisGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  newAnalysisText: {
    fontSize: 16,
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

export default SkinDiseaseDetector;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
  Image,
  Alert,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

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

const { width, height } = Dimensions.get('window');

const EyeConditionAnalyzer = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  // Animation refs - these were causing the error
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
      return false;
    }
    return true;
  };

  const pickImage = async (source) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaType.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaType.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResults(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an eye image first.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = {
        condition: 'Normal Eye',
        confidence: 94,
        details: [
          'Pupil appears normal in size and shape',
          'No visible signs of inflammation',
          'Clear cornea and lens',
          'Normal blood vessel pattern'
        ],
        recommendations: [
          'Continue regular eye check-ups',
          'Maintain good eye hygiene',
          'Use proper lighting when reading',
          'Take breaks from screen time'
        ],
        riskLevel: 'Low',
        consultDoctor: false
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const eyeConditions = [
    {
      name: 'Cataracts',
      description: 'Clouding of the eye lens',
      icon: 'eye',
      color: '#667eea'
    },
    {
      name: 'Glaucoma',
      description: 'Increased eye pressure',
      icon: 'eye-outline',
      color: '#43e97b'
    },
    {
      name: 'Macular Degeneration',
      description: 'Central vision loss',
      icon: 'scan',
      color: '#f093fb'
    },
    {
      name: 'Diabetic Retinopathy',
      description: 'Diabetes-related eye damage',
      icon: 'medical',
      color: '#4facfe'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Eye Condition Analyzer</Text>
            <View style={styles.aiIndicator}>
              <Ionicons name="sparkles" size={16} color="white" />
              <Text style={styles.aiText}>AI</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Animated.View 
          style={[
            styles.infoCard,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.infoHeader}>
            <Ionicons name="eye" size={40} color="#667eea" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>AI-Powered Eye Analysis</Text>
              <Text style={styles.infoDescription}>
                Upload a clear photo of your eye for AI-based condition screening
              </Text>
            </View>
          </View>
          <View style={styles.accuracyBadge}>
            <Text style={styles.accuracyText}>94% Accuracy</Text>
          </View>
        </Animated.View>

        {/* Image Upload Section */}
        <Animated.View 
          style={[
            styles.uploadSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Upload Eye Image</Text>
          
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <LinearGradient 
                colors={['#E8F4FD', '#F8F9FF']} 
                style={styles.uploadGradient}
              >
                <Ionicons name="eye" size={60} color="#667eea" />
                <Text style={styles.uploadText}>No image selected</Text>
                <Text style={styles.uploadSubtext}>Take a photo or choose from gallery</Text>
              </LinearGradient>
            </View>
          )}

          <View style={styles.uploadButtons}>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => pickImage('camera')}
            >
              <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.buttonGradient}>
                <Ionicons name="camera" size={20} color="white" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => pickImage('gallery')}
            >
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.buttonGradient}>
                <Ionicons name="images" size={20} color="white" />
                <Text style={styles.buttonText}>Gallery</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Analysis Button */}
        {selectedImage && (
          <Animated.View 
            style={[
              styles.analyzeSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <TouchableOpacity 
              style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
              onPress={analyzeImage}
              disabled={isAnalyzing}
            >
              <LinearGradient 
                colors={isAnalyzing ? ['#BDC3C7', '#95A5A6'] : ['#f093fb', '#f5576c']} 
                style={styles.analyzeGradient}
              >
                {isAnalyzing ? (
                  <View style={styles.analyzingContent}>
                    <Animated.View 
                      style={[
                        styles.loadingSpinner,
                        {
                          transform: [{
                            rotate: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg']
                            })
                          }]
                        }
                      ]}
                    >
                      <Ionicons name="refresh" size={24} color="white" />
                    </Animated.View>
                    <Text style={styles.analyzeText}>Analyzing...</Text>
                  </View>
                ) : (
                  <View style={styles.analyzeContent}>
                    <Ionicons name="sparkles" size={24} color="white" />
                    <Text style={styles.analyzeText}>Analyze Eye Condition</Text>
                    <Ionicons name="arrow-forward" size={24} color="white" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Results Section */}
        {analysisResults && (
          <Animated.View 
            style={[
              styles.resultsSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.sectionTitle}>Analysis Results</Text>
            
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.conditionInfo}>
                  <Text style={styles.conditionName}>{analysisResults.condition}</Text>
                  <View style={styles.confidenceContainer}>
                    <View style={[styles.riskBadge, 
                      analysisResults.riskLevel === 'Low' ? styles.lowRisk : 
                      analysisResults.riskLevel === 'Medium' ? styles.mediumRisk : styles.highRisk
                    ]}>
                      <Text style={styles.riskText}>{analysisResults.riskLevel} Risk</Text>
                    </View>
                    <Text style={styles.confidence}>{analysisResults.confidence}% confidence</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsTitle}>Analysis Details:</Text>
                {analysisResults.details.map((detail, index) => (
                  <View key={index} style={styles.detailItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#43e97b" />
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.recommendationsSection}>
                <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                {analysisResults.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="bulb" size={16} color="#667eea" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>

              {analysisResults.consultDoctor && (
                <View style={styles.consultSection}>
                  <LinearGradient colors={['#FF6B6B', '#FF5252']} style={styles.consultGradient}>
                    <Ionicons name="warning" size={20} color="white" />
                    <Text style={styles.consultText}>Consult a doctor immediately</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Common Eye Conditions */}
        <Animated.View 
          style={[
            styles.conditionsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Common Eye Conditions</Text>
          <View style={styles.conditionsGrid}>
            {eyeConditions.map((condition, index) => (
              <View key={index} style={styles.conditionCard}>
                <View style={[styles.conditionIcon, { backgroundColor: condition.color }]}>
                  <Ionicons name={condition.icon} size={24} color="white" />
                </View>
                <Text style={styles.conditionName}>{condition.name}</Text>
                <Text style={styles.conditionDescription}>{condition.description}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Disclaimer */}
        <Animated.View 
          style={[
            styles.disclaimer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Ionicons name="information-circle" size={20} color="#7F8C8D" />
          <Text style={styles.disclaimerText}>
            This tool provides preliminary screening only. Always consult with an eye care professional for proper diagnosis and treatment.
          </Text>
        </Animated.View>
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
    position: 'relative',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
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
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  infoDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  accuracyBadge: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  accuracyText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  uploadSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: width/2 - 110,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  uploadPlaceholder: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  uploadGradient: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8F4FD',
    borderStyle: 'dashed',
    borderRadius: 15,
  },
  uploadText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 10,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  analyzeSection: {
    marginBottom: 20,
  },
  analyzeButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeGradient: {
    paddingVertical: 18,
    paddingHorizontal: 25,
  },
  analyzeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    marginRight: 10,
  },
  analyzeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
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
  resultHeader: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  conditionInfo: {
    alignItems: 'center',
  },
  conditionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 15,
  },
  lowRisk: {
    backgroundColor: '#D4EDDA',
  },
  mediumRisk: {
    backgroundColor: '#FFF3CD',
  },
  highRisk: {
    backgroundColor: '#F8D7DA',
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  confidence: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  recommendationsSection: {
    marginBottom: 15,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  consultSection: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  consultGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  consultText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  conditionsSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
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
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  conditionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  conditionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
});

export default EyeConditionAnalyzer;


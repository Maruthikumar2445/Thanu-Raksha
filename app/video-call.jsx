import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  Animated,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradient = ({ children, colors, style, ...props }) => (
    <View style={[style, { backgroundColor: colors?.[0] || '#4F46E5' }]} {...props}>
      {children}
    </View>
  );
}

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Call state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [isConnected, setIsConnected] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Get call info from params or use defaults
  const callInfo = {
    doctorName: params?.doctorName || 'Dr. Sarah Johnson',
    doctorSpecialty: params?.doctorSpecialty || 'Cardiologist',
    patientName: params?.patientName || 'Patient',
    callType: params?.callType || 'consultation'
  };

  useEffect(() => {
    let timerInterval = null;
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Simulate connection process
    const connectionTimer = setTimeout(() => {
      setConnectionStatus('Connected');
      setIsConnected(true);
      
      // Start call timer
      timerInterval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }, 3000);

    // Pulse animation for end call button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      clearTimeout(connectionTimer);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      pulseAnimation.stop();
    };
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this consultation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              router.back();
            });
          }
        }
      ]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.doctorInfo}>
            <View style={styles.doctorAvatar}>
              <MaterialCommunityIcons name="doctor" size={24} color="#4F46E5" />
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>{callInfo.doctorName}</Text>
              <Text style={styles.doctorSpecialty}>{callInfo.doctorSpecialty}</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.callStatus}>
              <View style={[
                styles.statusDot, 
                isConnected ? styles.connectedDot : styles.connectingDot
              ]} />
              <Text style={styles.statusText}>{connectionStatus}</Text>
            </View>
            
            {isConnected && (
              <View style={styles.callDuration}>
                <Ionicons name="time-outline" size={14} color="#94a3b8" />
                <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Video Area */}
        <View style={styles.videoContainer}>
          {/* Doctor's Video */}
          <View style={styles.doctorVideo}>
            <LinearGradient
              colors={['#4F46E5', '#667eea']}
              style={styles.videoGradient}
            >
              <View style={styles.videoPlaceholder}>
                <MaterialCommunityIcons name="doctor" size={48} color="white" />
                <Text style={styles.videoLabel}>{callInfo.doctorName}</Text>
                <View style={styles.videoStatusBadge}>
                  <Ionicons name="videocam" size={12} color="white" />
                  <Text style={styles.videoStatusText}>HD</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Patient's Video (Picture in Picture) */}
          <View style={styles.patientVideo}>
            {isVideoOn ? (
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.patientVideoGradient}
              >
                <MaterialCommunityIcons name="account" size={20} color="white" />
                <Text style={styles.patientVideoText}>You</Text>
              </LinearGradient>
            ) : (
              <View style={styles.videoOff}>
                <Ionicons name="videocam-off" size={16} color="#6b7280" />
              </View>
            )}
          </View>

          {/* Connection Quality */}
          <View style={styles.qualityIndicator}>
            <View style={styles.signalBars}>
              <View style={[styles.signalBar, styles.bar1]} />
              <View style={[styles.signalBar, styles.bar2]} />
              <View style={[styles.signalBar, styles.bar3]} />
              <View style={[styles.signalBar, styles.bar4]} />
            </View>
            <Text style={styles.qualityText}>Excellent</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {/* Main Controls */}
          <View style={styles.mainControls}>
            <TouchableOpacity 
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              onPress={toggleMute}
            >
              <Ionicons 
                name={isMuted ? "mic-off" : "mic"} 
                size={20} 
                color={isMuted ? "#ef4444" : "#ffffff"} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlBtn, !isVideoOn && styles.controlBtnActive]}
              onPress={toggleVideo}
            >
              <Ionicons 
                name={isVideoOn ? "videocam" : "videocam-off"} 
                size={20} 
                color={!isVideoOn ? "#ef4444" : "#ffffff"} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlBtn, isSpeakerOn && styles.controlBtnActive]}
              onPress={toggleSpeaker}
            >
              <Ionicons 
                name={isSpeakerOn ? "volume-high" : "volume-low"} 
                size={20} 
                color={isSpeakerOn ? "#4F46E5" : "#ffffff"} 
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn}>
              <Ionicons name="camera-reverse" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* End Call Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={styles.endCallBtn}
              onPress={handleEndCall}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.endCallGradient}
              >
                <Ionicons name="call" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Additional Features */}
        <View style={styles.featuresRow}>
          <TouchableOpacity style={styles.featureBtn}>
            <Ionicons name="document-text" size={16} color="#94a3b8" />
            <Text style={styles.featureText}>Notes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureBtn}>
            <Ionicons name="chatbubble" size={16} color="#94a3b8" />
            <Text style={styles.featureText}>Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureBtn}>
            <Ionicons name="medical" size={16} color="#94a3b8" />
            <Text style={styles.featureText}>Records</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureBtn}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#94a3b8" />
            <Text style={styles.featureText}>More</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    paddingVertical: 10,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  doctorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: '#94a3b8',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  callStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  connectedDot: {
    backgroundColor: '#10b981',
  },
  connectingDot: {
    backgroundColor: '#f59e0b',
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  callDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // Video Container
  videoContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    position: 'relative',
  },
  doctorVideo: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  videoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
  },
  videoLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  videoStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  videoStatusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },

  // Patient Video (PiP)
  patientVideo: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 90,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  patientVideoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientVideoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  videoOff: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
  },

  // Quality Indicator
  qualityIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  signalBar: {
    width: 2,
    backgroundColor: '#10b981',
    borderRadius: 1,
  },
  bar1: { height: 4 },
  bar2: { height: 6 },
  bar3: { height: 8 },
  bar4: { height: 10 },
  qualityText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '600',
  },

  // Controls
  controlsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(239,68,68,0.3)',
    borderColor: '#ef4444',
  },
  endCallBtn: {
    borderRadius: 32,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  endCallGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Features
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  featureBtn: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  featureText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '500',
    marginTop: 3,
  },
});

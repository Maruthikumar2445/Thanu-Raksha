import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import

let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradient = ({ children, colors, style, ...props }) => (
    <View style={[style, { backgroundColor: colors?.[0] || '#4ECDC4' }]} {...props}>
      {children}
    </View>
  );
}

const DoctorDashboard = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      router.replace('/landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const doctorMenuItems = [
    { id: 1, title: 'My Patients', icon: 'people', color: '#4ECDC4' },
    { id: 2, title: 'Appointments', icon: 'calendar', color: '#44A08D' },
    { id: 3, title: 'Medical Records', icon: 'document-text', color: '#3C9D7A' },
    { id: 4, title: 'Prescription Pad', icon: 'clipboard', color: '#349068' },
    { id: 5, title: 'Consultation Tools', icon: 'videocam', color: '#2C8356' },
    { id: 6, title: 'Analytics', icon: 'analytics', color: '#247644' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.doctorInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="medical" size={30} color="white" />
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.doctorName}>Dr. John Smith</Text>
              <Text style={styles.specialization}>Cardiologist</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Doctor Dashboard</Text>
        
        <View style={styles.menuGrid}>
          {doctorMenuItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.menuItem, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={30} color="white" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Consultations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>New Patients</Text>
            </View>
          </View>
        </View>
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
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  doctorDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  specialization: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  logoutButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginVertical: 20,
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuItemText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
});

export default DoctorDashboard;
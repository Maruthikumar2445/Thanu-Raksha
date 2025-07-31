import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  RefreshControl,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const { width, height } = Dimensions.get('window');

const DoctorDashboard = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      router.replace('/landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Video Call Function - Updated to navigate to video call screen
  const startVideoCall = (patientInfo = null) => {
    // You can pass patient information to the video call screen
    const videoCallParams = {
      doctorName: 'Dr. John Smith',
      doctorSpecialty: 'Cardiologist',
      patientName: patientInfo?.name || 'Patient',
      callType: 'doctor-initiated'
    };
    
    // Navigate to video call screen with parameters
    router.push({
      pathname: '/video-call',
      params: videoCallParams
    });
  };

  // Sample data for different sections
  const patientsData = [
    { id: 1, name: 'Sarah Johnson', age: 28, condition: 'Hypertension', lastVisit: '2024-07-20', phone: '+1234567890', status: 'Active' },
    { id: 2, name: 'Mike Chen', age: 35, condition: 'Diabetes', lastVisit: '2024-07-18', phone: '+1234567891', status: 'Follow-up' },
    { id: 3, name: 'Emma Davis', age: 42, condition: 'Asthma', lastVisit: '2024-07-15', phone: '+1234567892', status: 'Active' },
    { id: 4, name: 'John Smith', age: 56, condition: 'Heart Disease', lastVisit: '2024-07-10', phone: '+1234567893', status: 'Critical' }
  ];

  const recordsData = [
    { id: 1, patientName: 'Sarah Johnson', type: 'Lab Report', date: '2024-07-20', status: 'Completed' },
    { id: 2, patientName: 'Mike Chen', type: 'X-Ray', date: '2024-07-18', status: 'Pending' },
    { id: 3, patientName: 'Emma Davis', type: 'Blood Test', date: '2024-07-15', status: 'Completed' },
    { id: 4, patientName: 'John Smith', type: 'ECG', date: '2024-07-10', status: 'Review Required' }
  ];

  const scheduleData = [
    { id: 1, time: '09:00 AM', patient: 'Sarah Johnson', type: 'Consultation', duration: '30 min' },
    { id: 2, time: '10:30 AM', patient: 'Mike Chen', type: 'Follow-up', duration: '20 min' },
    { id: 3, time: '11:15 AM', patient: 'Emma Davis', type: 'Check-up', duration: '25 min' },
    { id: 4, time: '02:00 PM', patient: 'John Smith', type: 'Emergency', duration: '45 min' },
    { id: 5, time: '03:30 PM', patient: 'Lisa Wilson', type: 'Consultation', duration: '30 min' }
  ];

  // Quick Actions with updated video call function
  const quickActions = [
    { 
      id: 1, 
      title: 'Patients',
      icon: 'people',
      iconType: 'ionicons',
      colors: ['#4ECDC4', '#44A08D'],
      action: () => openModal('patients')
    },
    { 
      id: 2, 
      title: 'Calendar',
      icon: 'calendar',
      iconType: 'ionicons',
      colors: ['#667eea', '#764ba2'],
      action: () => setActiveTab('Schedule')
    },
    { 
      id: 3, 
      title: 'Video Call',
      icon: 'videocam',
      iconType: 'ionicons',
      colors: ['#f093fb', '#f5576c'],
      action: () => startVideoCall() // Updated to use startVideoCall function
    },
    { 
      id: 4, 
      title: 'Records',
      icon: 'document-text',
      iconType: 'ionicons',
      colors: ['#4facfe', '#00f2fe'],
      action: () => openModal('records')
    }
  ];

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType('');
  };

  // Tab content handlers
  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'Patients') {
      openModal('patients');
    }
  };

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return renderDashboardContent();
      case 'Schedule':
        return renderScheduleContent();
      case 'Profile':
        return renderProfileContent();
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <>
      {/* Circular Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.circularActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.circularActionContainer}
              onPress={action.action}
            >
              <LinearGradient
                colors={action.colors}
                style={styles.circularAction}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={action.icon} size={24} color="white" />
              </LinearGradient>
              <Text style={styles.circularActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Compact Statistics Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.compactStatsGrid}>
          {todayStats.map((stat, index) => (
            <View key={index} style={styles.compactStatCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon} size={16} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => setActiveTab('Schedule')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.appointmentsContainer}>
          {upcomingAppointments.map((appointment) => (
            <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentInfo}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.avatarText}>{appointment.avatar}</Text>
                </View>
                <View style={styles.appointmentDetails}>
                  <Text style={styles.patientName}>{appointment.name}</Text>
                  <Text style={styles.appointmentType}>{appointment.type}</Text>
                </View>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity 
                  style={styles.appointmentVideoButton}
                  onPress={() => startVideoCall({ name: appointment.name, type: appointment.type })}
                >
                  <Ionicons name="videocam" size={16} color="#4ECDC4" />
                </TouchableOpacity>
                <View style={styles.appointmentTime}>
                  <Text style={styles.timeText}>{appointment.time}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Medical Tools Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Tools</Text>
        <View style={styles.toolsGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.toolCard}>
              <View style={[styles.toolIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.toolTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const renderScheduleContent = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Today's Schedule</Text>
      <View style={styles.scheduleContainer}>
        {scheduleData.map((appointment) => (
          <View key={appointment.id} style={styles.scheduleCard}>
            <View style={styles.scheduleTime}>
              <Text style={styles.scheduleTimeText}>{appointment.time}</Text>
              <Text style={styles.scheduleDuration}>{appointment.duration}</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.schedulePatient}>{appointment.patient}</Text>
              <Text style={styles.scheduleType}>{appointment.type}</Text>
            </View>
            <TouchableOpacity 
              style={styles.scheduleAction}
              onPress={() => startVideoCall({ name: appointment.patient, type: appointment.type })}
            >
              <Ionicons name="videocam" size={20} color="#4ECDC4" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderProfileContent = () => (
    <View style={styles.section}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <FontAwesome5 name="user-md" size={40} color="#4ECDC4" />
        </View>
        <Text style={styles.profileName}>Dr. John Smith</Text>
        <Text style={styles.profileSpecialty}>Cardiologist • MBBS, MD</Text>
        <View style={styles.profileStats}>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>156</Text>
            <Text style={styles.profileStatLabel}>Patients</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>4.9</Text>
            <Text style={styles.profileStatLabel}>Rating</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>8</Text>
            <Text style={styles.profileStatLabel}>Years Exp</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.profileMenu}>
        {[
          { icon: 'person-circle', title: 'Edit Profile', color: '#4ECDC4' },
          { icon: 'settings', title: 'Settings', color: '#667eea' },
          { icon: 'notifications', title: 'Notifications', color: '#f093fb' },
          { icon: 'help-circle', title: 'Help & Support', color: '#fbbf24' },
          { icon: 'log-out', title: 'Logout', color: '#ff6b6b' }
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.profileMenuItem} onPress={item.title === 'Logout' ? logout : undefined}>
            <View style={[styles.profileMenuIcon, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.profileMenuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Render modal content
  const renderModalContent = () => {
    if (modalType === 'patients') {
      return (
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>My Patients</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={patientsData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.patientCard}>
                <View style={styles.patientInfo}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientName}>{item.name}</Text>
                    <Text style={styles.patientCondition}>{item.condition} • Age {item.age}</Text>
                    <Text style={styles.patientLastVisit}>Last visit: {item.lastVisit}</Text>
                  </View>
                </View>
                <View style={styles.patientActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="call" size={16} color="#4ECDC4" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      closeModal();
                      startVideoCall(item);
                    }}
                  >
                    <Ionicons name="videocam" size={16} color="#f093fb" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      );
    }

    if (modalType === 'records') {
      return (
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Medical Records</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={recordsData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.recordCard}>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordPatient}>{item.patientName}</Text>
                  <Text style={styles.recordType}>{item.type}</Text>
                  <Text style={styles.recordDate}>{item.date}</Text>
                </View>
                <View style={[styles.recordStatus, 
                  { backgroundColor: item.status === 'Completed' ? '#10b98120' : 
                    item.status === 'Pending' ? '#f59e0b20' : '#ef444420' }
                ]}>
                  <Text style={[styles.recordStatusText,
                    { color: item.status === 'Completed' ? '#10b981' : 
                      item.status === 'Pending' ? '#f59e0b' : '#ef4444' }
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      );
    }

    return null;
  };

  // Data arrays (keeping existing ones)
  const menuItems = [
    { id: 1, title: 'Lab Reports', icon: 'flask', iconType: 'ionicons', color: '#667eea' },
    { id: 2, title: 'Prescriptions', icon: 'medical', iconType: 'ionicons', color: '#f093fb' },
    { id: 3, title: 'Analytics', icon: 'analytics', iconType: 'ionicons', color: '#4facfe' },
    { id: 4, title: 'Emergency', icon: 'warning', iconType: 'ionicons', color: '#ff6b6b' }
  ];

  const todayStats = [
    { label: 'Patients', value: '24', icon: 'people', color: '#4ECDC4' },
    { label: 'Appointments', value: '8', icon: 'calendar', color: '#667eea' },
    { label: 'Revenue', value: '₹12K', icon: 'wallet', color: '#f093fb' },
    { label: 'Rating', value: '4.9', icon: 'star', color: '#fbbf24' }
  ];

  const upcomingAppointments = [
    { id: 1, name: 'Sarah Johnson', time: '10:30 AM', type: 'Consultation', avatar: 'S' },
    { id: 2, name: 'Mike Chen', time: '11:15 AM', type: 'Follow-up', avatar: 'M' },
    { id: 3, name: 'Emma Davis', time: '2:00 PM', type: 'Check-up', avatar: 'E' }
  ];

  const bottomTabs = [
    { id: 'Dashboard', icon: 'grid', label: 'Dashboard' },
    { id: 'Patients', icon: 'people', label: 'Patients' },
    { id: 'Schedule', icon: 'calendar', label: 'Schedule' },
    { id: 'Profile', icon: 'person', label: 'Profile' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />
      
      {/* Compact Professional Header */}
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.doctorInfo}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.avatarGradient}
              >
                <FontAwesome5 name="user-md" size={20} color="white" />
              </LinearGradient>
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>Dr. John Smith</Text>
              <Text style={styles.specialization}>Cardiologist</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={18} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={logout}>
              <Ionicons name="log-out-outline" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderTabContent()}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal for Patients and Records */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {renderModalContent()}
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        {bottomTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.bottomNavItem, activeTab === tab.id && styles.activeNavItem]}
            onPress={() => handleTabPress(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? '#4ECDC4' : '#9CA3AF'} 
            />
            <Text style={[
              styles.bottomNavText,
              activeTab === tab.id && styles.activeNavText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Compact Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 5 : 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
    marginRight: 12,
  },
  avatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  specialization: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4757',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for bottom navigation
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },

  // Circular Quick Actions
  circularActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  circularActionContainer: {
    alignItems: 'center',
    width: 70,
  },
  circularAction: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  circularActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },

  // Compact Statistics
  compactStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactStatCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: (width - 48) / 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
  },

  // Appointments
  appointmentsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  appointmentDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 12,
    color: '#64748b',
  },
  appointmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appointmentVideoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4ECDC420',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentTime: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ECDC4',
  },

  // Tools Grid
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 48) / 2,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },

  // Schedule Content
  scheduleContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  scheduleTime: {
    width: 80,
    marginRight: 16,
  },
  scheduleTimeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scheduleDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  scheduleDetails: {
    flex: 1,
  },
  schedulePatient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  scheduleType: {
    fontSize: 12,
    color: '#64748b',
  },
  scheduleAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ECDC420',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile Content
  profileHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ECDC420',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileSpecialty: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  profileStatItem: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  profileMenu: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileMenuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileMenuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },

  // Patient Modal
  patientCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientDetails: {
    flex: 1,
    marginLeft: 12,
  },
  patientCondition: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  patientLastVisit: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  patientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // Records Modal
  recordCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordInfo: {
    flex: 1,
  },
  recordPatient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  recordType: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  recordDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  recordStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recordStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Bottom Navigation
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeNavItem: {
    // No additional styling needed
  },
  bottomNavText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#4ECDC4',
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default DoctorDashboard;
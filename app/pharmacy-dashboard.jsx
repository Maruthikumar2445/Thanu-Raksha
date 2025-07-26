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
    <View style={[style, { backgroundColor: colors?.[0] || '#f093fb' }]} {...props}>
      {children}
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const PharmacyDashboard = () => {
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

  // Circular Quick Actions
  const quickActions = [
    { 
      id: 1, 
      title: 'Inventory',
      icon: 'cube',
      iconType: 'ionicons',
      colors: ['#f093fb', '#f5576c'],
      action: () => openModal('inventory')
    },
    { 
      id: 2, 
      title: 'Orders',
      icon: 'bag',
      iconType: 'ionicons',
      colors: ['#667eea', '#764ba2'],
      action: () => openModal('orders')
    },
    { 
      id: 3, 
      title: 'Billing',
      icon: 'card',
      iconType: 'ionicons',
      colors: ['#4facfe', '#00f2fe'],
      action: () => openModal('billing')
    },
    { 
      id: 4, 
      title: 'Reports',
      icon: 'analytics',
      iconType: 'ionicons',
      colors: ['#43e97b', '#38f9d7'],
      action: () => openModal('reports')
    }
  ];

  const menuItems = [
    { 
      id: 1, 
      title: 'Prescriptions', 
      icon: 'document-text',
      iconType: 'ionicons',
      color: '#667eea'
    },
    { 
      id: 2, 
      title: 'Customers', 
      icon: 'people',
      iconType: 'ionicons',
      color: '#f093fb'
    },
    { 
      id: 3, 
      title: 'Suppliers', 
      icon: 'business',
      iconType: 'ionicons',
      color: '#4facfe'
    },
    { 
      id: 4, 
      title: 'Stock Alert', 
      icon: 'warning',
      iconType: 'ionicons',
      color: '#ff6b6b'
    }
  ];

  // Compact stats
  const todayStats = [
    { label: 'Sales', value: '₹15K', icon: 'trending-up', color: '#f093fb' },
    { label: 'Orders', value: '48', icon: 'bag', color: '#667eea' },
    { label: 'Stock', value: '1.2K', icon: 'cube', color: '#4facfe' },
    { label: 'Customers', value: '125', icon: 'people', color: '#43e97b' }
  ];

  const recentOrders = [
    { id: 1, customer: 'Rajesh Kumar', amount: '₹450', status: 'Pending', avatar: 'R' },
    { id: 2, customer: 'Priya Sharma', amount: '₹320', status: 'Completed', avatar: 'P' },
    { id: 3, customer: 'Amit Singh', amount: '₹680', status: 'Processing', avatar: 'A' }
  ];

  const lowStockItems = [
    { id: 1, name: 'Paracetamol 500mg', stock: 15, minStock: 50, category: 'Tablets' },
    { id: 2, name: 'Cough Syrup', stock: 8, minStock: 25, category: 'Syrup' },
    { id: 3, name: 'Vitamin D3', stock: 12, minStock: 30, category: 'Capsules' }
  ];

  // Bottom navigation tabs
  const bottomTabs = [
    { id: 'Dashboard', icon: 'grid', label: 'Dashboard' },
    { id: 'Inventory', icon: 'cube', label: 'Inventory' },
    { id: 'Orders', icon: 'bag', label: 'Orders' },
    { id: 'Profile', icon: 'person', label: 'Profile' }
  ];

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType('');
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'Inventory') {
      openModal('inventory');
    } else if (tabId === 'Orders') {
      openModal('orders');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return renderDashboardContent();
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

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => setActiveTab('Orders')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ordersContainer}>
          {recentOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <View style={styles.customerAvatar}>
                  <Text style={styles.avatarText}>{order.avatar}</Text>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.customerName}>{order.customer}</Text>
                  <Text style={styles.orderAmount}>{order.amount}</Text>
                </View>
              </View>
              <View style={[styles.orderStatus, 
                { backgroundColor: order.status === 'Completed' ? '#10b98120' : 
                  order.status === 'Processing' ? '#f59e0b20' : '#ef444420' }
              ]}>
                <Text style={[styles.orderStatusText,
                  { color: order.status === 'Completed' ? '#10b981' : 
                    order.status === 'Processing' ? '#f59e0b' : '#ef4444' }
                ]}>
                  {order.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pharmacy Tools Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pharmacy Tools</Text>
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

      {/* Low Stock Alert */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Low Stock Alert</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stockContainer}>
          {lowStockItems.map((item) => (
            <View key={item.id} style={styles.stockCard}>
              <View style={styles.stockInfo}>
                <Text style={styles.stockName}>{item.name}</Text>
                <Text style={styles.stockCategory}>{item.category}</Text>
              </View>
              <View style={styles.stockStatus}>
                <Text style={styles.stockNumber}>{item.stock} / {item.minStock}</Text>
                <View style={styles.stockBadge}>
                  <Ionicons name="warning" size={12} color="#ef4444" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderProfileContent = () => (
    <View style={styles.section}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <MaterialCommunityIcons name="store" size={40} color="#f093fb" />
        </View>
        <Text style={styles.profileName}>ABC Medical Store</Text>
        <Text style={styles.profileDetails}>Owner: John Doe • GST: 12ABCDE3456F7Z8</Text>
        <View style={styles.profileStats}>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>2.5K</Text>
            <Text style={styles.profileStatLabel}>Products</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>4.8</Text>
            <Text style={styles.profileStatLabel}>Rating</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>5</Text>
            <Text style={styles.profileStatLabel}>Years</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.profileMenu}>
        {[
          { icon: 'storefront', title: 'Store Settings', color: '#f093fb' },
          { icon: 'notifications', title: 'Notifications', color: '#667eea' },
          { icon: 'document-text', title: 'License & Certificates', color: '#4facfe' },
          { icon: 'help-circle', title: 'Help & Support', color: '#43e97b' },
          { icon: 'log-out', title: 'Logout', color: '#ef4444' }
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.profileMenuItem}
            onPress={item.title === 'Logout' ? logout : undefined}
          >
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

  const renderModalContent = () => {
    if (modalType === 'inventory') {
      return (
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Inventory Management</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <View style={styles.inventoryStats}>
            <View style={styles.inventoryStatCard}>
              <Text style={styles.inventoryStatNumber}>1,250</Text>
              <Text style={styles.inventoryStatLabel}>Total Products</Text>
            </View>
            <View style={styles.inventoryStatCard}>
              <Text style={styles.inventoryStatNumber}>₹2.5L</Text>
              <Text style={styles.inventoryStatLabel}>Stock Value</Text>
            </View>
          </View>
          <Text style={styles.modalSubtitle}>Low Stock Items ({lowStockItems.length})</Text>
          <FlatList
            data={lowStockItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.modalStockCard}>
                <View style={styles.modalStockInfo}>
                  <Text style={styles.modalStockName}>{item.name}</Text>
                  <Text style={styles.modalStockCategory}>{item.category}</Text>
                </View>
                <View style={styles.modalStockStatus}>
                  <Text style={styles.modalStockNumber}>{item.stock}</Text>
                  <Text style={styles.modalStockLabel}>remaining</Text>
                </View>
              </View>
            )}
          />
        </View>
      );
    }

    if (modalType === 'orders') {
      return (
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Management</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentOrders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.modalOrderCard}>
                <View style={styles.modalOrderInfo}>
                  <View style={styles.modalCustomerAvatar}>
                    <Text style={styles.modalAvatarText}>{item.avatar}</Text>
                  </View>
                  <View style={styles.modalOrderDetails}>
                    <Text style={styles.modalCustomerName}>{item.customer}</Text>
                    <Text style={styles.modalOrderAmount}>{item.amount}</Text>
                  </View>
                </View>
                <View style={[styles.modalOrderStatus, 
                  { backgroundColor: item.status === 'Completed' ? '#10b98120' : 
                    item.status === 'Processing' ? '#f59e0b20' : '#ef444420' }
                ]}>
                  <Text style={[styles.modalOrderStatusText,
                    { color: item.status === 'Completed' ? '#10b981' : 
                      item.status === 'Processing' ? '#f59e0b' : '#ef4444' }
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f093fb" />
      
      {/* Compact Professional Header */}
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.pharmacyInfo}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.avatarGradient}
              >
                <MaterialCommunityIcons name="store" size={20} color="white" />
              </LinearGradient>
            </View>
            <View style={styles.pharmacyDetails}>
              <Text style={styles.pharmacyName}>ABC Medical Store</Text>
              <Text style={styles.ownerName}>Owner: John Doe</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={18} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>5</Text>
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

      {/* Modal for Inventory and Orders */}
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
              color={activeTab === tab.id ? '#f093fb' : '#9CA3AF'} 
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
  pharmacyInfo: {
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
  pharmacyDetails: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  ownerName: {
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
    color: '#f093fb',
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

  // Orders
  ordersContainer: {
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
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f093fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  orderDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  orderAmount: {
    fontSize: 12,
    color: '#64748b',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '600',
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

  // Low Stock
  stockContainer: {
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
  stockCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  stockCategory: {
    fontSize: 12,
    color: '#64748b',
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  stockBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
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
    backgroundColor: '#f093fb20',
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
  profileDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
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
    color: '#f093fb',
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
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
  },

  // Inventory Modal
  inventoryStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  inventoryStatCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  inventoryStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f093fb',
    marginBottom: 4,
  },
  inventoryStatLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  modalStockCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  modalStockInfo: {
    flex: 1,
  },
  modalStockName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalStockCategory: {
    fontSize: 12,
    color: '#64748b',
  },
  modalStockStatus: {
    alignItems: 'flex-end',
  },
  modalStockNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  modalStockLabel: {
    fontSize: 10,
    color: '#64748b',
  },

  // Order Modal
  modalOrderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOrderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalCustomerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f093fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  modalOrderDetails: {
    flex: 1,
  },
  modalCustomerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalOrderAmount: {
    fontSize: 12,
    color: '#64748b',
  },
  modalOrderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalOrderStatusText: {
    fontSize: 10,
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
    color: '#f093fb',
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default PharmacyDashboard;
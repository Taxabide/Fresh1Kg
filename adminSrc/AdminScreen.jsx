import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../src/redux/actions/userActions';
import AdminNavbar from './AdminNavbar/Adminavbar';
import AdminSidebar from './AdminNavbar/AdminSidebar';

const { width } = Dimensions.get('window');

const AdminScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [stats, setStats] = useState({
    process: 0,
    approved: 0,
    rejected: 0,
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Sample data initialization
  useEffect(() => {
    // Initialize stats with sample data
    setStats({
      process: 12,
      approved: 45,
      rejected: 3,
    });

    // Initialize contacts with sample data
    setContacts([
      { id: 1, name: 'Alex Johnson', email: 'alex@gmail.com', subject: 'Product Inquiry', message: 'I want to know about organic vegetables', date: '2025-06-13' },
      { id: 2, name: 'Emma Brown', email: 'emma@gmail.com', subject: 'Delivery Issue', message: 'My order was delayed', date: '2025-06-12' },
      { id: 3, name: 'David Lee', email: 'david@gmail.com', subject: 'Bulk Order', message: 'I need bulk order for my restaurant', date: '2025-06-11' },
      { id: 4, name: 'Lisa Chen', email: 'lisa@gmail.com', subject: 'Quality Complaint', message: 'The fruits were not fresh', date: '2025-06-10' },
    ]);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignInScreen' }],
      })
    );
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle menu item selection
  const handleMenuSelect = (tab) => {
    setActiveTab(tab);
    setSidebarVisible(false); // Hide sidebar after selection on mobile
  };

  // Render different content based on active tab
  const renderDashboard = () => {
    // Sample data for monthly progress (value is for bar height, percentage is for display)
    const monthlyData = [
      { month: 'Jan', value: 3000, percentage: '19.2%', color: '#AEC6DF' },
      { month: 'Feb', value: 4000, percentage: '25.8%', color: '#AEC6DF' },
      { month: 'Mar', value: 5200, percentage: '33.3%', color: '#AEC6DF' },
      { month: 'Apr', value: 13000, percentage: '84.2%', color: '#629D23' }, // Green for April
      { month: 'May', value: 5200, percentage: '33.3%', color: '#AEC6DF' },
      { month: 'Jun', value: 4650, percentage: '30.0%', color: '#AEC6DF' },
      { month: 'Jul', value: 4130, percentage: '26.7%', color: '#AEC6DF' },
      { month: 'Aug', value: 3000, percentage: '19.2%', color: '#AEC6DF' },
      { month: 'Sep', value: 1800, percentage: '11.7%', color: '#AEC6DF' },
      { month: 'Oct', value: 1050, percentage: '6.7%', color: '#AEC6DF' },
      { month: 'Nov', value: 650, percentage: '4.2%', color: '#AEC6DF' },
      { month: 'Dec', value: 250, percentage: '1.7%', color: '#AEC6DF' },
    ];

    // Max value for scaling (e.g., $12k in the image)
    const maxValue = 12000;

    return (
      <>
        {/* Overview Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Process</Text>
              <View style={styles.iconContainer}>
                <MaterialIcons name="schedule" size={24} color="#999" />
              </View>
            </View>
            <Text style={styles.cardValue}>{stats.process}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Approved</Text>
              <View style={styles.iconContainer}>
                <MaterialIcons name="check" size={24} color="#629D23" />
              </View>
            </View>
            <Text style={styles.cardValue}>{stats.approved}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Rejected</Text>
              <View style={styles.iconContainer}>
                <MaterialIcons name="close" size={24} color="#999" />
              </View>
            </View>
            <Text style={styles.cardValue}>{stats.rejected}</Text>
          </View>
        </View>

        {/* Monthly Progress Bar */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly Progress Bar</Text>
          {/* Y-Axis Labels */}
          <View style={styles.yAxisLabels}>
            {[12, 10, 8, 6, 4, 2, 0].map((value) => (
              <Text key={value} style={styles.yAxisLabel}>${value}k</Text>
            ))}
          </View>
          <View style={styles.chartBarContainer}>
            {monthlyData.map((data, index) => (
              <View key={index} style={styles.barWrapper}>
                <Text style={styles.barPercentage}>{data.percentage}</Text>
                <View
                  style={[
                    styles.bar,
                    { height: (data.value / maxValue) * 150, backgroundColor: data.color }, // Scale height to max 150 (approx for chart area)
                  ]}
                />
                <Text style={styles.barMonth}>{data.month}</Text>
              </View>
            ))}
          </View>
          {/* Original legend for Vegetable, Fruit, Dry Fruit */}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#629D23' }]}></View>
              <Text>Vegetable</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]}></View>
              <Text>Fruit</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#8BC34A' }]}></View>
              <Text>Dry Fruit</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderTables = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Data Tables</Text>
      <View style={styles.tableContainer}>
        <Text style={styles.placeholderText}>Advanced table features coming soon...</Text>
        <Text style={styles.subText}>• Export data to CSV/Excel</Text>
        <Text style={styles.subText}>• Advanced filtering</Text>
        <Text style={styles.subText}>• Sorting capabilities</Text>
        <Text style={styles.subText}>• Pagination</Text>
      </View>
    </View>
  );

  const renderUsers = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>User Management</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.listItemInfo}>
              <Text style={styles.listItemName}>{item.name}</Text>
              <Text style={styles.listItemEmail}>{item.email}</Text>
              <Text style={styles.listItemPhone}>{item.phone}</Text>
              <Text style={styles.listItemAddress}>{item.address}</Text>
              <Text style={styles.listItemDate}>Joined: {item.joinDate}</Text>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="visibility" size={20} color="#629D23" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="edit" size={20} color="#2196F3" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="delete" size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderOrders = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Order Management</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.listItemInfo}>
              <Text style={styles.listItemName}>Order #{item.orderId}</Text>
              <Text style={styles.listItemEmail}>Customer: {item.customerName}</Text>
              <Text style={styles.listItemPhone}>Amount: {item.amount}</Text>
              <Text style={styles.listItemDate}>Date: {item.date}</Text>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity
                style={[
                  styles.statusBadge,
                  item.status === 'Delivered' ? styles.deliveredBadge :
                  item.status === 'Processing' ? styles.processingBadge :
                  item.status === 'Pending' ? styles.pendingBadge : styles.cancelledBadge
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="visibility" size={20} color="#629D23" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="edit" size={20} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderContacts = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Contact Management</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View style={styles.listItemInfo}>
              <Text style={styles.listItemName}>{item.name}</Text>
              <Text style={styles.listItemEmail}>{item.email}</Text>
              <Text style={styles.contactSubject}>Subject: {item.subject}</Text>
              <Text style={styles.contactMessage}>{item.message}</Text>
              <Text style={styles.listItemDate}>Date: {item.date}</Text>
            </View>
            <View style={styles.listItemActions}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="reply" size={20} color="#629D23" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="delete" size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'tables':
        return renderTables();
      case 'users':
        return renderUsers();
      case 'orders':
        return renderOrders();
      case 'contacts':
        return renderContacts();
      default:
        return renderDashboard();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Sidebar Overlay for mobile */}
        <AdminSidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          activeTab={activeTab}
          onMenuSelect={handleMenuSelect}
        />

        {/* Main Content */}
        <View style={styles.mainContainer}>
          {/* Header with Hamburger Menu and Profile */}
          <AdminNavbar
            title="Welcome Admin!"
            onMenuPress={toggleSidebar}
            showProfileDropdown={true}
          />

          <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
            {/* Dynamic Content */}
            {renderTabContent()}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  cardsContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  chartBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  barPercentage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  barMonth: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 55,
    bottom: 30,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    width: 40,
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7CB342',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#629D23',
    fontWeight: '600',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  activeBadge: {
    backgroundColor: '#e8f5e8',
  },
  inactiveBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  listItemEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  listItemPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  listItemAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  listItemDate: {
    fontSize: 12,
    color: '#999',
  },
  listItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  processingBadge: {
    backgroundColor: '#fff3cd',
  },
  deliveredBadge: {
    backgroundColor: '#d4edda',
  },
  pendingBadge: {
    backgroundColor: '#f8d7da',
  },
  cancelledBadge: {
    backgroundColor: '#e2e3e5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: width * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#7CB342',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default AdminScreen;
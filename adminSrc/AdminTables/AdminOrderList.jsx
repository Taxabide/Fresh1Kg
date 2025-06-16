import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Adminnavbar from '../AdminNavbar/Adminavbar';
import AdminSidebar from '../AdminNavbar/AdminSidebar';

const AdminOrderList = () => {
  const [searchText, setSearchText] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Sample order data - Replace with API call
  const sampleOrders = [
    {
      id: 1,
      orderId: 'ORD1749729518628',
      phoneNumber: '12346512325',
      orderItems: [
        {
          name: 'Product - 1',
          productName: 'Cashew',
          mrp: 950,
          quantity: 1,
          subTotal: 237.5
        }
      ],
      address: '1/4 First Floor, Omkar Road, Behind GPO, Near Clock Tower, Dehradun, Uttrakhand',
      currentAddress: 'd.dun',
      message: 'teeeet',
      addDate: 'Thursday 12-Jun-2025 11:58 AM',
      userName: 'amank',
      userEmail: 'aman@gmail.com',
      userNumber: '2225',
      status: 'PLACED',
      total: 237.5
    },
    {
      id: 2,
      orderId: 'ORD1749729518629',
      phoneNumber: '9876543210',
      orderItems: [
        {
          name: 'Product - 2',
          productName: 'Almonds',
          mrp: 1200,
          quantity: 2,
          subTotal: 400
        }
      ],
      address: '2/5 Second Floor, Main Street, Near City Mall, Dehradun, Uttrakhand',
      currentAddress: 'dehradun',
      message: 'Please deliver fast',
      addDate: 'Wednesday 11-Jun-2025 09:30 AM',
      userName: 'priya',
      userEmail: 'priya@gmail.com',
      userNumber: '1111',
      status: 'PROCESSING',
      total: 400
    },
    {
      id: 3,
      orderId: 'ORD1749729518630',
      phoneNumber: '8765432109',
      orderItems: [
        {
          name: 'Product - 3',
          productName: 'Walnuts',
          mrp: 800,
          quantity: 1,
          subTotal: 200
        }
      ],
      address: '3/6 Ground Floor, Gandhi Road, Near Hospital, Dehradun, Uttrakhand',
      currentAddress: 'gandhi road',
      message: 'Call before delivery',
      addDate: 'Tuesday 10-Jun-2025 02:15 PM',
      userName: 'rahul',
      userEmail: 'rahul@email.com',
      userNumber: '3333',
      status: 'SHIPPED',
      total: 200
    },
    {
      id: 4,
      orderId: 'ORD1749729518631',
      phoneNumber: '7654321098',
      orderItems: [
        {
          name: 'Product - 4',
          productName: 'Pistachios',
          mrp: 1500,
          quantity: 1,
          subTotal: 375
        }
      ],
      address: '4/7 Third Floor, Rajpur Road, Near Temple, Dehradun, Uttrakhand',
      currentAddress: 'rajpur',
      message: 'Handle with care',
      addDate: 'Monday 09-Jun-2025 11:20 AM',
      userName: 'sneha',
      userEmail: 'sneha@test.com',
      userNumber: '4444',
      status: 'DELIVERED',
      total: 375
    },
    {
      id: 5,
      orderId: 'ORD1749729518632',
      phoneNumber: '6543210987',
      orderItems: [
        {
          name: 'Product - 5',
          productName: 'Mixed Nuts',
          mrp: 2000,
          quantity: 3,
          subTotal: 1500
        }
      ],
      address: '5/8 First Floor, Chakrata Road, Near School, Dehradun, Uttrakhand',
      currentAddress: 'chakrata',
      message: 'Bulk order - corporate',
      addDate: 'Sunday 08-Jun-2025 04:45 PM',
      userName: 'vikash',
      userEmail: 'vikash@company.com',
      userNumber: '5555',
      status: 'PLACED',
      total: 1500
    },
    {
      id: 6,
      orderId: 'ORD1749729518633',
      phoneNumber: '5432109876',
      orderItems: [
        {
          name: 'Product - 6',
          productName: 'Dates',
          mrp: 600,
          quantity: 2,
          subTotal: 300
        }
      ],
      address: '6/9 Second Floor, Saharanpur Road, Near Market, Dehradun, Uttrakhand',
      currentAddress: 'saharanpur',
      message: 'Fresh quality needed',
      addDate: 'Saturday 07-Jun-2025 01:30 PM',
      userName: 'anita',
      userEmail: 'anita@sample.com',
      userNumber: '6666',
      status: 'PROCESSING',
      total: 300
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // API call here
      // const response = await fetch('YOUR_API_ENDPOINT/orders');
      // const data = await response.json();
      // setOrders(data);
      
      // For now using sample data
      setTimeout(() => {
        setOrders(sampleOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
    order.userName.toLowerCase().includes(searchText.toLowerCase()) ||
    order.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
    order.phoneNumber.includes(searchText) ||
    order.status.toLowerCase().includes(searchText.toLowerCase()) ||
    order.orderItems.some(item => 
      item.productName.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleExport = (format) => {
    console.log(`Exporting order data as ${format}`);
    // You can implement actual export logic here
    // For CSV: convert data to CSV format
    // For SQL: generate INSERT statements
    // For TXT: format as plain text
    // For JSON: JSON.stringify(filteredOrders)
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return { backgroundColor: '#28a745', color: 'white' };
      case 'processing':
        return { backgroundColor: '#ffc107', color: 'black' };
      case 'shipped':
        return { backgroundColor: '#17a2b8', color: 'white' };
      case 'delivered':
        return { backgroundColor: '#6f42c1', color: 'white' };
      case 'cancelled':
        return { backgroundColor: '#dc3545', color: 'white' };
      default:
        return { backgroundColor: '#6c757d', color: 'white' };
    }
  };

  const renderOrderItems = (items) => {
    return items.map((item, index) => (
      <Text key={index} style={styles.orderItemText}>
        {item.productName} - ₹{item.mrp} × {item.quantity}
      </Text>
    ));
  };

  const renderOrderRow = ({ item }) => (
    <View style={styles.tableRow} key={item.id}>
      <Text style={[styles.tableCell, styles.serialCell]}>{orders.indexOf(item) + 1}</Text>
      
      <View style={[styles.tableCell, styles.statusCell]}>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={[styles.statusText, { color: getStatusStyle(item.status).color }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>View Data</Text>
      </TouchableOpacity>

      <Text style={[styles.tableCell, styles.orderIdCell]}>{item.orderId}</Text>
      <Text style={[styles.tableCell, styles.phoneCell]}>{item.phoneNumber}</Text>
      
      <View style={[styles.tableCell, styles.orderItemsCell]}>
        {renderOrderItems(item.orderItems)}
        <View style={styles.orderSummary}>
          <Text style={styles.totalText}>Total ₹{item.total}</Text>
        </View>
      </View>

      <Text style={[styles.tableCell, styles.addressCell]} numberOfLines={3}>
        {item.address}
      </Text>
      <Text style={[styles.tableCell, styles.currentAddressCell]}>{item.currentAddress}</Text>
      <Text style={[styles.tableCell, styles.messageCell]}>{item.message}</Text>
      <Text style={[styles.tableCell, styles.dateCell]}>{item.addDate}</Text>
      <Text style={[styles.tableCell, styles.userNameCell]}>{item.userName}</Text>
      <Text style={[styles.tableCell, styles.userEmailCell]}>{item.userEmail}</Text>
      <Text style={[styles.tableCell, styles.userNumberCell]}>{item.userNumber}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.serialCell]}>S.no</Text>
      <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
      <Text style={[styles.headerCell, styles.actionCell]}>View Data</Text>
      <Text style={[styles.headerCell, styles.orderIdCell]}>Order Id</Text>
      <Text style={[styles.headerCell, styles.phoneCell]}>Phone Number</Text>
      <Text style={[styles.headerCell, styles.orderItemsCell]}>Order Items</Text>
      <Text style={[styles.headerCell, styles.addressCell]}>Address</Text>
      <Text style={[styles.headerCell, styles.currentAddressCell]}>Current Address</Text>
      <Text style={[styles.headerCell, styles.messageCell]}>Message</Text>
      <Text style={[styles.headerCell, styles.dateCell]}>Add Date</Text>
      <Text style={[styles.headerCell, styles.userNameCell]}>User Name</Text>
      <Text style={[styles.headerCell, styles.userEmailCell]}>User Email</Text>
      <Text style={[styles.headerCell, styles.userNumberCell]}>Use Number</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Admin Navbar - Fixed at top */}
        <View style={styles.navbarContainer}>
          <Adminnavbar onMenuPress={() => setSidebarVisible(true)} />
        </View>
        <AdminSidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          activeTab={'orders'}
          onMenuSelect={() => setSidebarVisible(false)}
        />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          <ScrollView style={styles.fullScreenScroll} showsVerticalScrollIndicator={false}>
            {/* Header with title */}
            <View style={styles.header}>
              <Text style={styles.title}>Order List</Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search orders..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{orders.length}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{filteredOrders.length}</Text>
                <Text style={styles.statLabel}>Filtered Results</Text>
              </View>
            </View>

            {/* Scrollable content area */}
            <ScrollView 
              style={styles.scrollContainer} 
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {/* Table with horizontal scroll */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableContainer}>
                <View style={styles.table}>
                  {renderHeader()}
                  
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#4CAF50" />
                      <Text style={styles.loadingText}>Loading orders...</Text>
                    </View>
                  ) : (
                    <View style={styles.tableBody}>
                      {filteredOrders.length === 0 ? (
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>No orders found</Text>
                        </View>
                      ) : (
                        filteredOrders.map((item) => (
                          <View key={item.id.toString()}>
                            {renderOrderRow({ item })}
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Footer section */}
              <View style={styles.bottomSection}>
                <View style={styles.entriesInfo}>
                  <Text style={styles.entriesText}>
                    Showing 1 to {Math.min(filteredOrders.length, 6)} of {filteredOrders.length} entries
                  </Text>
                </View>
                
                <View style={styles.exportButtonsContainer}>
                  <TouchableOpacity style={[styles.exportButton, styles.csvButton]} onPress={() => handleExport('CSV')}>
                    <Text style={styles.exportButtonText}>Export CSV</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.exportButton, styles.sqlButton]} onPress={() => handleExport('SQL')}>
                    <Text style={styles.exportButtonText}>Export SQL</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.exportButton, styles.txtButton]} onPress={() => handleExport('TXT')}>
                    <Text style={styles.exportButtonText}>Export TXT</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.exportButton, styles.jsonButton]} onPress={() => handleExport('JSON')}>
                    <Text style={styles.exportButtonText}>Export JSON</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.footerInfo}>
                  <Text style={styles.footerText}>
                    ©2025 FreshKg. Powered by - <Text style={styles.poweredBy}>Tulyarth DigiWeb</Text>
                  </Text>
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  navbarContainer: {
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 70, // Adjust this based on your navbar height
  },
  fullScreenScroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',marginTop:10
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  tableContainer: {
    marginBottom: 20,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableBody: {
    // Full height without restrictions
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    alignItems: 'flex-start',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  tableCell: {
    fontSize: 11,
    color: '#6c757d',
  },
  serialCell: {
    width: 60,
    textAlign: 'center',
  },
  statusCell: {
    width: 100,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionCell: {
    width: 80,
    textAlign: 'center',
  },
  orderIdCell: {
    width: 140,
    textAlign: 'left',
  },
  phoneCell: {
    width: 120,
    textAlign: 'center',
  },
  orderItemsCell: {
    width: 200,
    textAlign: 'left',
  },
  orderItemText: {
    fontSize: 10,
    color: '#28a745',
    marginBottom: 2,
  },
  orderSummary: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  addressCell: {
    width: 200,
    textAlign: 'left',
  },
  currentAddressCell: {
    width: 100,
    textAlign: 'left',
  },
  messageCell: {
    width: 120,
    textAlign: 'left',
  },
  dateCell: {
    width: 180,
    textAlign: 'left',
  },
  userNameCell: {
    width: 100,
    textAlign: 'left',
  },
  userEmailCell: {
    width: 150,
    textAlign: 'left',
  },
  userNumberCell: {
    width: 100,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    width: 70,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  bottomSection: {
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  entriesInfo: {
    marginBottom: 16,
  },
  exportButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  exportButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  csvButton: {
    backgroundColor: '#22C55E',
  },
  sqlButton: {
    backgroundColor: '#22C55E',
  },
  txtButton: {
    backgroundColor: '#22C55E',
  },
  jsonButton: {
    backgroundColor: '#22C55E',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footerInfo: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  poweredBy: {
    color: '#28a745',
    fontWeight: '600',
  },
});

export default AdminOrderList;
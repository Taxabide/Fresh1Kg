import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Adminnavbar from '../AdminNavbar/Adminavbar';
import AdminSidebar from '../AdminNavbar/AdminSidebar';
import AdminProfileScreen from '../AdminProfileScreen';

const AdminUserList = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Sample data - Replace with API call
  const sampleUsers = [
    {
      id: 1,
      name: 'Gaurav',
      email: 'ggaur281@gmail.com',
      number: '7457010522',
      addDate: '12-Jun-2025',
      address: '',
      pincode: '',
      profilePhoto: null
    },
    {
      id: 2,
      name: 'Test User',
      email: 'test@gmail.com',
      number: '123456789',
      addDate: '12-Jun-2025',
      address: '',
      pincode: '',
      profilePhoto: null
    },
    {
      id: 3,
      name: 'Gaurav Sharma',
      email: 'gaurav@gmail.com',
      number: '9927045632',
      addDate: '10-Jun-2025',
      address: '',
      pincode: '0',
      profilePhoto: null
    },
    {
      id: 4,
      name: 'Vivek',
      email: 'vivek@gmail.com',
      number: '9978678789',
      addDate: '10-Jun-2025',
      address: '',
      pincode: '2563989',
      profilePhoto: null
    },
    {
      id: 5,
      name: 'Ajay Chauhan',
      email: 'ajaychauhanuk07@gmail.com',
      number: '9193555830',
      addDate: '30-May-2025',
      address: '',
      pincode: '',
      profilePhoto: null
    },
    {
      id: 6,
      name: 'Aman',
      email: 'aman@gmail.com',
      number: '2222222222',
      addDate: '10-May-2025',
      address: 'dun',
      pincode: '248002',
      profilePhoto: null
    }
  ];

  useEffect(() => {
    // TODO: Replace with actual API call
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // API call here
      // const response = await fetch('YOUR_API_ENDPOINT/users');
      // const data = await response.json();
      // setUsers(data);
      
      // For now using sample data
      setTimeout(() => {
        setUsers(sampleUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.number.includes(searchText)
  );

  const handleExport = (format) => {
    // TODO: Implement export functionality based on format
    console.log(`Exporting data as ${format}`);
    // You can implement actual export logic here
    // For CSV: convert data to CSV format
    // For SQL: generate INSERT statements
    // For TXT: format as plain text
    // For JSON: JSON.stringify(filteredUsers)
  };

  const renderUserRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.nameCell]}>{item.name}</Text>
      <Text style={[styles.tableCell, styles.emailCell]}>{item.email}</Text>
      <Text style={[styles.tableCell, styles.numberCell]}>{item.number}</Text>
      <Text style={[styles.tableCell, styles.dateCell]}>{item.addDate}</Text>
      <Text style={[styles.tableCell, styles.addressCell]}>{item.address || '-'}</Text>
      <Text style={[styles.tableCell, styles.pincodeCell]}>{item.pincode || '-'}</Text>
      <View style={[styles.tableCell, styles.photoCell]}>
        {item.profilePhoto ? (
          <Image source={{ uri: item.profilePhoto }} style={styles.profileImage} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
      <Text style={[styles.headerCell, styles.emailCell]}>Email</Text>
      <Text style={[styles.headerCell, styles.numberCell]}>Number</Text>
      <Text style={[styles.headerCell, styles.dateCell]}>Add Date</Text>
      <Text style={[styles.headerCell, styles.addressCell]}>Address</Text>
      <Text style={[styles.headerCell, styles.pincodeCell]}>Pincode</Text>
      <Text style={[styles.headerCell, styles.photoCell]}>Photo</Text>
      <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
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
          activeTab={'users'}
          onMenuSelect={() => setSidebarVisible(false)}
        />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          <ScrollView style={styles.fullScreenScroll} showsVerticalScrollIndicator={false}>
            {/* Header with title */}
            <View style={styles.header}>
              <Text style={styles.title}>User List</Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{users.length}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{filteredUsers.length}</Text>
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
                      <Text style={styles.loadingText}>Loading users...</Text>
                    </View>
                  ) : (
                    <View style={styles.tableBody}>
                      {filteredUsers.length === 0 ? (
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>No users found</Text>
                        </View>
                      ) : (
                        filteredUsers.map((item) => (
                          <View key={item.id.toString()}>
                            {renderUserRow({ item })}
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
                    Showing 1 to {Math.min(filteredUsers.length, 6)} of {filteredUsers.length} entries
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
                    2025 FreshKg. Powered by - <Text style={styles.poweredBy}>Tulyarth DigiWeb</Text>
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
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop:10
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
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
    minWidth: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
    // Allow full scrolling
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    alignItems: 'center',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
  tableCell: {
    fontSize: 13,
    color: '#6c757d',
  },
  nameCell: {
    width: 140,
    textAlign: 'left',
  },
  emailCell: {
    width: 180,
    textAlign: 'left',
  },
  numberCell: {
    width: 120,
    textAlign: 'center',
  },
  dateCell: {
    width: 110,
    textAlign: 'center',
  },
  addressCell: {
    width: 120,
    textAlign: 'left',
  },
  pincodeCell: {
    width: 80,
    textAlign: 'center',
  },
  photoCell: {
    width: 80,
    alignItems: 'center',
  },
  actionCell: {
    width: 80,
    textAlign: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  noImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    width: 60,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
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
  entriesText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
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

export default AdminUserList;
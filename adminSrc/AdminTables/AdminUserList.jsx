import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../src/redux/actions/adminUserActions';
import Adminnavbar from '../AdminNavbar/Adminavbar';
import AdminSidebar from '../AdminNavbar/AdminSidebar';

const AdminUserList = () => {
  const [searchText, setSearchText] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
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
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  // Sort users alphabetically
  const sortedUsers = [...users].sort((a, b) => {
    const nameA = (a.u_name || '').toLowerCase();
    const nameB = (b.u_name || '').toLowerCase();
    return sortOrder === 'asc' 
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredUsers = sortedUsers.filter(user =>
    user.u_name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.u_email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.u_number.includes(searchText)
  );

  // Get current users for pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleExport = (format) => {
    // TODO: Implement export functionality based on format
    console.log(`Exporting data as ${format}`);
  };

  const renderUserRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.nameCell]}>{item.u_name}</Text>
      <Text style={[styles.tableCell, styles.emailCell]}>{item.u_email}</Text>
      <Text style={[styles.tableCell, styles.numberCell]}>{item.u_number}</Text>
      <Text style={[styles.tableCell, styles.dateCell]}>{item.u_add_date}</Text>
      <Text style={[styles.tableCell, styles.addressCell]}>{item.u_address || '-'}</Text>
      <Text style={[styles.tableCell, styles.pincodeCell]}>{item.u_pincode || '-'}</Text>
      <View style={[styles.tableCell, styles.photoCell]}>
        {item.u_profile_photo ? (
          <Image source={{ uri: item.u_profile_photo }} style={styles.profileImage} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <TouchableOpacity 
        style={[styles.headerCell, styles.nameCell, styles.sortableHeader]} 
        onPress={toggleSortOrder}
      >
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.sortIcon}>{sortOrder === 'asc' ? '↓' : '↑'}</Text>
      </TouchableOpacity>
      <Text style={[styles.headerCell, styles.emailCell]}>Email</Text>
      <Text style={[styles.headerCell, styles.numberCell]}>Number</Text>
      <Text style={[styles.headerCell, styles.dateCell]}>Add Date</Text>
      <Text style={[styles.headerCell, styles.addressCell]}>Address</Text>
      <Text style={[styles.headerCell, styles.pincodeCell]}>Pincode</Text>
      <Text style={[styles.headerCell, styles.photoCell]}>Photo</Text>
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
                  ) : error ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>{error}</Text>
                    </View>
                  ) : filteredUsers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No users found</Text>
                    </View>
                  ) : (
                    <View style={styles.tableBody}>
                      {filteredUsers.length > 0 ? 
                        filteredUsers.map((item) => (
                          <View key={item.u_id.toString()}>
                            {renderUserRow({ item })}
                          </View>
                        )) : 
                        currentUsers.map((item) => (
                          <View key={item.id.toString()}>
                            {renderUserRow({ item })}
                          </View>
                        ))
                      }
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Pagination Controls */}
              {filteredUsers.length > 0 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity 
                    style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]} 
                    onPress={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>Previous</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <TouchableOpacity
                        key={number}
                        style={[styles.pageNumberButton, currentPage === number && styles.pageNumberButtonActive]}
                        onPress={() => paginate(number)}
                      >
                        <Text style={[styles.pageNumberText, currentPage === number && styles.pageNumberTextActive]}>
                          {number}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity 
                    style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                    onPress={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>Next</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Footer section */}
              <View style={styles.bottomSection}>
                <View style={styles.entriesInfo}>
                  <Text style={styles.entriesText}>
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
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
    paddingTop: 120, // Increased padding top even more
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 5,
  },
  paginationButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  paginationButtonTextDisabled: {
    color: '#999',
  },
  pageNumberButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    minWidth: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pageNumberButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  pageNumberText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  pageNumberTextActive: {
    color: '#fff',
  },
});

export default AdminUserList;
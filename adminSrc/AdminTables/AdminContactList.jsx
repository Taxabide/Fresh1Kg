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
  Alert,
} from 'react-native';
import Adminnavbar from '../AdminNavbar/Adminavbar';
import AdminSidebar from '../AdminNavbar/AdminSidebar';

const CONTACT_LIST_API = 'https://fresh1kg.com/api/add-contact-list-api.php';

const AdminContactList = () => {
  const [searchText, setSearchText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(CONTACT_LIST_API);
      const responseText = await response.text();
      const data = await JSON.parse(responseText);
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Failed to fetch contacts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.contact_name.toLowerCase().includes(searchText.toLowerCase()) ||
    contact.contact_email.toLowerCase().includes(searchText.toLowerCase()) ||
    contact.contact_phone.includes(searchText) ||
    contact.contact_subject.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get current contacts for pagination
  const indexOfLastContact = currentPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleExport = (format) => {
    try {
      let exportData;
      switch (format) {
        case 'CSV':
          exportData = filteredContacts.map(contact => 
            `${contact.contact_name},${contact.contact_email},${contact.contact_phone},${contact.contact_subject},${contact.contact_message},${contact.contact_add_date}`
          ).join('\n');
          break;
        case 'JSON':
          exportData = JSON.stringify(filteredContacts, null, 2);
          break;
        case 'TXT':
          exportData = filteredContacts.map(contact =>
            `Name: ${contact.contact_name}\nEmail: ${contact.contact_email}\nPhone: ${contact.contact_phone}\nSubject: ${contact.contact_subject}\nMessage: ${contact.contact_message}\nDate: ${contact.contact_add_date}\n-------------------`
          ).join('\n');
          break;
        default:
          throw new Error('Unsupported export format');
      }
      console.log(`Exported ${format} data:`, exportData);
      Alert.alert('Success', `Data exported as ${format} successfully!`);
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      Alert.alert('Error', `Failed to export data as ${format}`);
    }
  };

  const renderContactRow = ({ item }) => (
    <View style={styles.tableRow} key={item.contact_id}>
      <Text style={[styles.tableCell, styles.nameCell]}>{item.contact_name}</Text>
      <Text style={[styles.tableCell, styles.emailCell]}>{item.contact_email}</Text>
      <Text style={[styles.tableCell, styles.phoneCell]}>{item.contact_phone}</Text>
      <Text style={[styles.tableCell, styles.subjectCell]}>{item.contact_subject}</Text>
      <Text style={[styles.tableCell, styles.messageCell]} numberOfLines={2}>{item.contact_message}</Text>
      <Text style={[styles.tableCell, styles.dateCell]}>{item.contact_add_date}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
      <Text style={[styles.headerCell, styles.emailCell]}>Email</Text>
      <Text style={[styles.headerCell, styles.phoneCell]}>Phone Number</Text>
      <Text style={[styles.headerCell, styles.subjectCell]}>Subject</Text>
      <Text style={[styles.headerCell, styles.messageCell]}>Message</Text>
      <Text style={[styles.headerCell, styles.dateCell]}>Add Date</Text>
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
          activeTab={'contacts'}
          onMenuSelect={() => setSidebarVisible(false)}
        />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          <ScrollView style={styles.fullScreenScroll} showsVerticalScrollIndicator={false}>
            {/* Header with title */}
            <View style={styles.header}>
              <Text style={styles.title}>Contact List</Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{contacts.length}</Text>
                <Text style={styles.statLabel}>Total Contacts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{filteredContacts.length}</Text>
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
                      <Text style={styles.loadingText}>Loading contacts...</Text>
                    </View>
                  ) : (
                    <View style={styles.tableBody}>
                      {filteredContacts.length === 0 ? (
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>No contacts found</Text>
                        </View>
                      ) : (
                        currentContacts.map((item) => (
                          renderContactRow({ item })
                        ))
                      )}
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Pagination Controls */}
              {filteredContacts.length > 0 && (
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
                    Showing {indexOfFirstContact + 1} to {Math.min(indexOfLastContact, filteredContacts.length)} of {filteredContacts.length} entries
                  </Text>
                </View>
                
                <View style={styles.exportButtonsContainer}>
                  <TouchableOpacity style={[styles.exportButton, styles.csvButton]} onPress={() => handleExport('CSV')}>
                    <Text style={styles.exportButtonText}>Export CSV</Text>
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
    // Full height without restrictions
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
    width: 150,
    textAlign: 'left',
  },
  emailCell: {
    width: 200,
    textAlign: 'left',
  },
  phoneCell: {
    width: 130,
    textAlign: 'center',
  },
  subjectCell: {
    width: 160,
    textAlign: 'left',
  },
  messageCell: {
    width: 200,
    textAlign: 'left',
  },
  dateCell: {
    width: 120,
    textAlign: 'center',
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

export default AdminContactList;
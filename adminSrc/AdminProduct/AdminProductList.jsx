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
import Adminnavbar from '../../adminSrc/AdminNavbar/Adminavbar';
import AdminSidebar from '../../adminSrc/AdminNavbar/AdminSidebar';

const AdminProductList = () => {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Sample data - Replace with API call
  const sampleProducts = [
    {
      id: 1,
      name: 'Pigeon Peas',
      category: 'vegetables',
      unit: 'g',
      description: '',
      price: 180,
      image: null,
      stock: 1,
      weight: 1000,
      priceRate: 'per kg',
      unique: ''
    },
    {
      id: 2,
      name: 'Ambazhanga (Mango For Pickle)',
      category: 'vegetables',
      unit: 'g',
      description: '',
      price: 160,
      image: null,
      stock: 1,
      weight: 1000,
      priceRate: 'per kg',
      unique: ''
    },
    {
      id: 3,
      name: 'Mangalore Okra',
      category: 'vegetables',
      unit: 'g',
      description: '',
      price: 320,
      image: null,
      stock: 1,
      weight: 1000,
      priceRate: 'per kg',
      unique: ''
    },
    {
      id: 4,
      name: 'Red Carrot',
      category: 'vegetables',
      unit: 'g',
      description: '',
      price: 98,
      image: null,
      stock: 1,
      weight: 1000,
      priceRate: 'per kg',
      unique: ''
    },
    {
      id: 5,
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      unit: 'kg',
      description: 'Fresh and juicy tomatoes',
      price: 45,
      image: null,
      stock: 25,
      weight: 1000,
      priceRate: 'per kg',
      unique: ''
    },
    {
      id: 6,
      name: 'Green Spinach',
      category: 'leafy vegetables',
      unit: 'bunch',
      description: 'Organic green spinach',
      price: 30,
      image: null,
      stock: 15,
      weight: 250,
      priceRate: 'per bunch',
      unique: ''
    }
  ];

  useEffect(() => {
    // TODO: Replace with actual API call
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // API call here
      // const response = await fetch('YOUR_API_ENDPOINT/products');
      // const data = await response.json();
      // setProducts(data);
      
      // For now using sample data
      setTimeout(() => {
        setProducts(sampleProducts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase()) ||
    product.unit.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleExport = (format) => {
    // TODO: Implement export functionality based on format
    console.log(`Exporting data as ${format}`);
    // You can implement actual export logic here
    // For CSV: convert data to CSV format
    // For SQL: generate INSERT statements
    // For TXT: format as plain text
    // For JSON: JSON.stringify(filteredProducts)
  };

  const handleAddProduct = () => {
    // TODO: Navigate to add product screen
    console.log('Add new product');
  };

  const handleEditProduct = (productId) => {
    // TODO: Navigate to edit product screen
    console.log('Edit product:', productId);
  };

  const renderProductRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.serialCell]}>{item.id}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => handleEditProduct(item.id)}>
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <Text style={[styles.tableCell, styles.nameCell]}>{item.name}</Text>
      <Text style={[styles.tableCell, styles.categoryCell]}>{item.category}</Text>
      <Text style={[styles.tableCell, styles.unitCell]}>{item.unit}</Text>
      <Text style={[styles.tableCell, styles.descriptionCell]}>{item.description || '-'}</Text>
      <Text style={[styles.tableCell, styles.priceCell]}>₹{item.price}</Text>
      <View style={[styles.tableCell, styles.imageCell]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
      </View>
      <Text style={[styles.tableCell, styles.stockCell]}>{item.stock}</Text>
      <Text style={[styles.tableCell, styles.weightCell]}>{item.weight}</Text>
      <Text style={[styles.tableCell, styles.rateCell]}>{item.priceRate}</Text>
      <Text style={[styles.tableCell, styles.uniqueCell]}>{item.unique || '-'}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.serialCell]}>S.no.</Text>
      <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
      <Text style={[styles.headerCell, styles.nameCell]}>Product Name</Text>
      <Text style={[styles.headerCell, styles.categoryCell]}>Product Category</Text>
      <Text style={[styles.headerCell, styles.unitCell]}>Product Unit</Text>
      <Text style={[styles.headerCell, styles.descriptionCell]}>Product Description</Text>
      <Text style={[styles.headerCell, styles.priceCell]}>Product Price</Text>
      <Text style={[styles.headerCell, styles.imageCell]}>Product Image</Text>
      <Text style={[styles.headerCell, styles.stockCell]}>Stock</Text>
      <Text style={[styles.headerCell, styles.weightCell]}>Product Weight</Text>
      <Text style={[styles.headerCell, styles.rateCell]}>Price Per Rate</Text>
      <Text style={[styles.headerCell, styles.uniqueCell]}>Product Unique</Text>
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
          activeTab={'productList'}
          onMenuSelect={() => setSidebarVisible(false)}
        />

        {/* Main ScrollView containing all content */}
        <ScrollView 
          style={styles.mainScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Header with title */}
          <View style={styles.header}>
            <Text style={styles.title}>Product List</Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{products.length}</Text>
              <Text style={styles.statLabel}>Total Products</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{filteredProducts.length}</Text>
              <Text style={styles.statLabel}>Filtered Results</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{products.reduce((sum, p) => sum + p.stock, 0)}</Text>
              <Text style={styles.statLabel}>Total Stock</Text>
            </View>
          </View>

          {/* Table with horizontal scroll */}
          <View style={styles.tableContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                {renderHeader()}
                
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Loading products...</Text>
                  </View>
                ) : (
                  <View style={styles.tableBody}>
                    {filteredProducts.length === 0 ? (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No products found</Text>
                      </View>
                    ) : (
                      filteredProducts.map((item) => (
                        <View key={item.id.toString()}>
                          {renderProductRow({ item })}
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          {/* Footer section */}
          <View style={styles.bottomSection}>
            <View style={styles.entriesInfo}>
              <Text style={styles.entriesText}>
                Showing 1 to {Math.min(filteredProducts.length, 6)} of {filteredProducts.length} entries
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
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 40, // Extra padding at bottom for better scroll experience
  },
  header: {
    marginBottom: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
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
    // Allow natural height for all content
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
  serialCell: {
    width: 60,
    textAlign: 'center',
  },
  actionCell: {
    width: 80,
    textAlign: 'center',
  },
  nameCell: {
    width: 200,
    textAlign: 'center',
  },
  categoryCell: {
    width: 140,
    textAlign: 'center',
  },
  unitCell: {
    width: 100,
    textAlign: 'center',
  },
  descriptionCell: {
    width: 180,
    textAlign: 'center',
  },
  priceCell: {
    width: 100,
    textAlign: 'center',
  },
  imageCell: {
    width: 100,
    alignItems: 'center',
  },
  stockCell: {
    width: 80,
    textAlign: 'center',
  },
  weightCell: {
    width: 100,
    textAlign: 'center',
  },
  rateCell: {
    width: 120,
    textAlign: 'center',
  },
  uniqueCell: {
    width: 120,
    textAlign: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  noImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  noImageText: {
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    width: 50,
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

export default AdminProductList;
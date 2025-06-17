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
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts } from '../../src/redux/actions/adminProductActions';
import Adminnavbar from '../AdminNavbar/Adminavbar';
import AdminSidebar from '../AdminNavbar/AdminSidebar'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminProductList = () => {
  const [searchText, setSearchText] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const [fullImageModal, setFullImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.adminProducts);

  // Add filtering logic
  const filteredProducts = React.useMemo(() => {
    if (!searchText.trim()) return products || [];
    
    const searchLower = searchText.toLowerCase();
    return (products || []).filter(product => 
      product.p_name?.toLowerCase().includes(searchLower) ||
      product.c_name?.toLowerCase().includes(searchLower) ||
      product.unit_name?.toLowerCase().includes(searchLower)
    );
  }, [products, searchText]);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Add data logging when products change
  useEffect(() => {
    if (products && products.length > 0) {
      console.log('First product data:', products[0]);
      console.log('Sample image path:', products[0].p_image);
    }
  }, [products]);

  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    try {
      // If it's already a full URL starting with https://fresh1kg.com, use it directly
      if (imagePath.startsWith('https://fresh1kg.com/')) {
        return imagePath; // Keep the original URL as is
      }
      
      // Clean the path
      const cleanPath = imagePath
        .split('?')[0]
        .trim()
        .replace(/^\/+/, '');
      
      // Construct the URL with the original domain
      return `https://fresh1kg.com/${cleanPath}`;
      
    } catch (error) {
      console.error('Error constructing image URL:', error);
      return null;
    }
  };

  // Add this effect to log product data when it's loaded
  useEffect(() => {
    if (products && products.length > 0) {
      console.log('Sample product data:', {
        firstProduct: products[0],
        imagePath: products[0].p_image,
        constructedUrl: constructImageUrl(products[0].p_image)
      });
    }
  }, [products]);

  const handleImageError = (productId, imageUrl) => {
    console.error(`Image failed to load for product ${productId}:`, imageUrl);
    setFailedImages(prev => new Set([...prev, productId]));
  };

  const renderProductImage = (item) => {
    if (!item.p_image) {
      return (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      );
    }

    const imageUrl = constructImageUrl(item.p_image);
    
    if (!imageUrl) {
      return (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: imageUrl,
            headers: {
              'Accept': '*/*',
              'Cache-Control': 'no-cache'
            }
          }} 
          style={styles.productImage}
          resizeMode="contain"
          onError={(error) => {
            console.log('Image load error:', {
              url: imageUrl,
              originalPath: item.p_image,
              productId: item.p_id,
              error: error.nativeEvent
            });
            // Show fallback UI on error
            error.target?.setNativeProps?.({
              style: { backgroundColor: '#f5f5f5' }
            });
          }}
        />
        <TouchableOpacity 
          style={styles.viewImageButton}
          onPress={() => viewFullImage(imageUrl)}
        >
          <MaterialIcons name="fullscreen" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const viewFullImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setFullImageModal(true);
  };

  const renderFullImageModal = () => (
    <Modal
      visible={fullImageModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setFullImageModal(false)}
    >
      <View style={styles.fullImageModalContainer}>
        <TouchableOpacity 
          style={styles.fullImageCloseButton}
          onPress={() => setFullImageModal(false)}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: selectedImage }}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );

  const handleExport = (format) => {
    // Add your export logic here
  };

  const handleEditProduct = (productId) => {
    // Add your edit logic here
  };

  const renderTableRow = ({ item }) => (
    <View style={styles.tableRow} key={item.p_id}>
      <Text style={[styles.tableCell, styles.serialCell]}>{item.p_id}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => handleEditProduct(item.p_id)}>
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <Text style={[styles.tableCell, styles.nameCell]} numberOfLines={2}>
        {item.p_name || 'N/A'}
      </Text>
      <Text style={[styles.tableCell, styles.categoryCell]} numberOfLines={1}>
        {item.c_name || 'N/A'}
      </Text>
      <Text style={[styles.tableCell, styles.unitCell]}>
        {item.unit_name || 'N/A'}
      </Text>
      <Text style={[styles.tableCell, styles.descriptionCell]} numberOfLines={3}>
        {item.p_description || '-'}
      </Text>
      <Text style={[styles.tableCell, styles.priceCell]}>
        ₹{item.p_price || '0'}
      </Text>
      <View style={[styles.tableCell, styles.imageCell]}>
        {renderProductImage(item)}
      </View>
      <Text style={[styles.tableCell, styles.stockCell]}>
        {item.p_stock || '0'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.serialCell]}>S.no.</Text>
      <Text style={[styles.headerCell, styles.actionCell]}>Action</Text>
      <Text style={[styles.headerCell, styles.nameCell]}>Product Name</Text>
      <Text style={[styles.headerCell, styles.categoryCell]}>Category</Text>
      <Text style={[styles.headerCell, styles.unitCell]}>Unit</Text>
      <Text style={[styles.headerCell, styles.descriptionCell]}>Description</Text>
      <Text style={[styles.headerCell, styles.priceCell]}>Price</Text>
      <Text style={[styles.headerCell, styles.imageCell]}>Image</Text>
      <Text style={[styles.headerCell, styles.stockCell]}>Stock</Text>
    </View>
  );

  // Safe array access
  const safeProducts = products || [];
  const safeFilteredProducts = filteredProducts || [];

  // Add this useEffect to log product data for debugging
  useEffect(() => {
    if (products && products.length > 0) {
      // Log the first few products' image paths to debug
      products.slice(0, 3).forEach(product => {
        console.log(`Product ${product.p_id} image path:`, {
          original: product.p_image,
          constructed: constructImageUrl(product.p_image)
        });
      });
    }
  }, [products]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.navbarContainer}>
          <Adminnavbar onMenuPress={() => setSidebarVisible(true)} />
        </View>
        
        <AdminSidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          activeTab={'productList'}
          onMenuSelect={() => setSidebarVisible(false)}
        />

        <ScrollView 
          style={styles.mainScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Product List</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{safeProducts.length}</Text>
              <Text style={styles.statLabel}>Total Products</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{safeFilteredProducts.length}</Text>
              <Text style={styles.statLabel}>Filtered Results</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {safeProducts.reduce((sum, p) => sum + parseInt(p.p_stock || 0), 0)}
              </Text>
              <Text style={styles.statLabel}>Total Stock</Text>
            </View>
          </View>

          <View style={styles.tableContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                {renderHeader()}
                
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Loading products...</Text>
                  </View>
                ) : error ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{error}</Text>
                    <TouchableOpacity 
                      style={styles.retryButton}
                      onPress={() => dispatch(fetchAdminProducts())}
                    >
                      <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : safeFilteredProducts.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {safeProducts.length === 0 ? 'No products available' : 'No products found matching your search'}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.tableBody}>
                    {safeFilteredProducts.map((item, index) => (
                      <View key={`${item.p_id}-${index}`}>
                        {renderTableRow({ item })}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.entriesInfo}>
              <Text style={styles.entriesText}>
                Showing 1 to {safeFilteredProducts.length} of {safeProducts.length} entries
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
      {renderFullImageModal()}
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
    paddingBottom: 40,
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
    minWidth: 1000, // Ensure table has minimum width
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
    minHeight: 80, // Ensure consistent row height
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 13,
    color: '#6c757d',
    textAlign: 'center',
  },
  serialCell: {
    width: 60,
  },
  actionCell: {
    width: 80,
  },
  nameCell: {
    width: 200,
    paddingHorizontal: 8,
  },
  categoryCell: {
    width: 140,
  },
  unitCell: {
    width: 100,
  },
  descriptionCell: {
    width: 180,
    paddingHorizontal: 8,
  },
  priceCell: {
    width: 100,
  },
  imageCell: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  stockCell: {
    width: 80,
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  noImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 5,
  },
  noImageText: {
    color: '#999',
    fontSize: 12,
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
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: '#3B82F6',
  },
  txtButton: {
    backgroundColor: '#F59E0B',
  },
  jsonButton: {
    backgroundColor: '#8B5CF6',
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
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 5,
  },
  viewImageButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    padding: 4,
  },
  fullImageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
  fullImageCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
});

export default AdminProductList;
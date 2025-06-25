import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../../../redux/actions/cartActions';

const { width, height } = Dimensions.get('window');

const MyOrders = ({ navigation, route }) => {
  const { userData } = route.params || {};
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  // Get user login status and cart items from Redux store
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const userId = useSelector(state => state.user.user ? state.user.user.u_id : null);
  const cartItems = useSelector(state => state.cart.items);

  // Updated dummy orders data with all requested fields
  const [orders, setOrders] = useState([
    {
      id: '1',
      serialNo: '001',
      orderId: 'ORD-2024-001',
      userName: 'Rahul Kumar',
      userEmail: 'rahul.kumar@email.com',
      userPhone: '+91 98765 43210',
      address: '123 Main Street, Andheri East, Mumbai, Maharashtra - 400069',
      currentAddress: '123 Main Street, Andheri East, Mumbai, Maharashtra - 400069',
      phoneNumber: '+91 98765 43210',
      addDate: '2024-01-15 14:30',
      status: 'Delivered',
      total: '345.50',
      items: ['Fresh Apples 1kg', 'Bananas 2kg', 'Almonds 500g'],
      itemCount: 3,
      category: 'Mixed',
      trackingId: 'TRK123456789',
      message: 'Please deliver at the security gate'
    },
    {
      id: '2',
      serialNo: '002',
      orderId: 'ORD-2024-002',
      userName: 'Priya Singh',
      userEmail: 'priya.singh@email.com',
      userPhone: '+91 87654 32109',
      address: '456 Park Avenue, Connaught Place, Delhi, New Delhi - 110001',
      currentAddress: '456 Park Avenue, Connaught Place, Delhi, New Delhi - 110001',
      phoneNumber: '+91 87654 32109',
      addDate: '2024-01-10 11:45',
      status: 'Out for Delivery',
      total: '225.00',
      items: ['Tomatoes 2kg', 'Onions 1kg'],
      itemCount: 2,
      category: 'Vegetables',
      trackingId: 'TRK987654321',
      message: 'Call before delivery'
    },
    {
      id: '3',
      serialNo: '003',
      orderId: 'ORD-2024-003',
      userName: 'Amit Patel',
      userEmail: 'amit.patel@email.com',
      userPhone: '+91 76543 21098',
      address: '789 Garden Road, Koramangala, Bangalore, Karnataka - 560034',
      currentAddress: '789 Garden Road, Koramangala, Bangalore, Karnataka - 560034',
      phoneNumber: '+91 76543 21098',
      addDate: '2024-01-05 09:15',
      status: 'Processing',
      total: '680.75',
      items: ['Cashews 500g', 'Dates 1kg', 'Walnuts 250g'],
      itemCount: 3,
      category: 'Dry Fruits',
      trackingId: 'TRK456789123',
      message: 'Leave at doorstep if not available'
    }
  ]);

  useEffect(() => {
    if (isLoggedIn && userId) {
      dispatch(fetchCart(userId));
    }
  }, [isLoggedIn, userId]);

  const handleCartPress = () => {
    if (!isLoggedIn || !userId) {
      Alert.alert('Login Required', 'Please log in to view your cart.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    navigation.navigate('CartMenu');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#28a745';
      case 'Out for Delivery':
        return '#17a2b8';
      case 'Processing':
        return '#ffc107';
      case 'Packed':
        return '#6f42c1';
      case 'Cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  // Filter orders based on search query - Move this outside of render
  const getFilteredOrders = React.useMemo(() => {
    return orders.filter(order => 
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  }, [searchQuery, orders]); // Only recompute when search query or orders change

  const renderEmptyState = React.useCallback(() => {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>
            {searchQuery ? 'No Orders Found' : 'No Orders Yet'}
          </Text>
          <Text style={styles.emptyStateText}>
            {searchQuery 
              ? `No orders match "${searchQuery}". Try searching with different keywords.`
              : "You haven't placed any orders yet. Start shopping for fresh produce!"
            }
          </Text>
          {!searchQuery && (
            <TouchableOpacity 
              style={styles.shopNowButton}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.8}
            >
              <Text style={styles.shopNowButtonText}>Shop Now</Text>
            </TouchableOpacity>
          )}
        </View>
      );
  }, [searchQuery, navigation]);

  const handleViewDetails = (order) => {
    navigation.navigate('ViewOrderDetails', { order });
  };

  const openLocation = (order) => {
    // Example coordinates - you would get these from your order data
    const latitude = order.latitude || 30.3165; // Default coordinates if not provided
    const longitude = order.longitude || 78.0322; // Default coordinates if not provided
    
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:'
    });
    
    const latLng = `${latitude},${longitude}`;
    const label = `Order ${order.orderId} Location`;
    const url = Platform.select({
      ios: `${scheme}${latLng}?q=${label}@${latLng}`,
      android: `${scheme}${latLng}?q=${latLng}(${label})`
    });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps web URL
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
        Linking.openURL(webUrl);
      }
    });
  };

  const renderOrderItem = React.useCallback(({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderTable}>
        {/* Row 1: S.No, Order ID */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>S.No:</Text>
            <Text style={styles.tableCellValue}>#{item.serialNo}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>Order ID:</Text>
            <Text style={styles.tableCellValue}>{item.orderId}</Text>
          </View>
        </View>

        {/* Row 2: User Name, User Email */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>User Name:</Text>
            <Text style={styles.tableCellValue}>{item.userName}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>User Email:</Text>
            <Text style={styles.tableCellValue}>{item.userEmail}</Text>
          </View>
        </View>

        {/* Row 3: Phone Number, Add Date */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>Phone Number:</Text>
            <Text style={styles.tableCellValue}>{item.phoneNumber}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>Add Date:</Text>
            <Text style={styles.tableCellValue}>{item.addDate}</Text>
          </View>
        </View>

        {/* Row 4: Address */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.fullWidthCell]}>
            <Text style={styles.tableCellLabel}>Address:</Text>
            <Text style={styles.tableCellValue} numberOfLines={2}>{item.address}</Text>
          </View>
        </View>

        {/* Row 5: Current Address */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.fullWidthCell]}>
            <Text style={styles.tableCellLabel}>Current Address:</Text>
            <Text style={styles.tableCellValue} numberOfLines={2}>{item.currentAddress}</Text>
          </View>
        </View>

        {/* Row 6: Message */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.fullWidthCell]}>
            <Text style={styles.tableCellLabel}>Message:</Text>
            <Text style={[styles.tableCellValue, styles.messageText]}>{item.message}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => handleViewDetails(item)}
          >
            <MaterialIcons name="visibility" size={16} color="#fff" />
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>

          {item.status !== 'Delivered' && (
            <TouchableOpacity 
              style={[styles.trackButton, { backgroundColor: '#FF9800' }]}
              onPress={() => openLocation(item)}
            >
              <MaterialIcons name="location-on" size={16} color="#fff" />
              <Text style={styles.buttonText}>Open Location</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  ), [handleViewDetails, openLocation]);

  // Calculate dynamic header height based on device
  const getHeaderHeight = () => {
    const baseHeight = 56; // Base header height
    const statusBarHeight = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;
    return baseHeight + statusBarHeight;
  };

  // Calculate dynamic padding based on device
  const getHeaderPadding = () => {
    return {
      paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
      paddingHorizontal: width * 0.04, // 4% of screen width
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header with dynamic height and padding */}
        <View style={[
          styles.header,
          {
            height: getHeaderHeight(),
            ...getHeaderPadding(),
          }
        ]}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Orders</Text>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={handleCartPress}
              activeOpacity={0.7}
            >
              <View>
                <MaterialIcons 
                  name="shopping-cart-checkout" 
                  size={24}
                  color="#000" 
                />
                {cartItems && cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
              placeholder="Search orders by ID, items or status"
            value={searchQuery}
            onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery !== '' && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Orders List */}
        <FlatList
          data={getFilteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={5}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: Math.min(16, width * 0.045), // Responsive font size
    color: '#000',
    fontWeight: '500',
  },
  cartButton: {
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ff6f00',
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    height: Math.max(40, height * 0.05), // Responsive height
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: Math.min(14, width * 0.035), // Responsive font size
    color: '#000',
    padding: 0,
  },
  clearButton: {
    padding: 8,
  },
  listContainer: {
    paddingTop: 20,
    paddingHorizontal: width * 0.04,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderTable: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: width * 0.03,
    paddingVertical: 2,
  },
  tableCell: {
    flex: 1,
  },
  fullWidthCell: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  tableCellLabel: {
    fontSize: Math.min(12, width * 0.03),
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  tableCellValue: {
    fontSize: Math.min(14, width * 0.035),
    color: '#000',
    fontWeight: '400',
  },
  messageText: {
    fontStyle: 'italic',
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: width * 0.03,
    marginTop: 16,
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  viewDetailsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  trackButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: '#fff',
    fontSize: Math.min(14, width * 0.035),
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
  },
  emptyStateTitle: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: Math.min(16, width * 0.04),
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  shopNowButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
  },
});

export default MyOrders;
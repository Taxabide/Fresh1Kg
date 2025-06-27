import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../../../redux/actions/cartActions';
import { fetchOrders } from '../../../redux/actions/orderActions';

const { width, height } = Dimensions.get('window');

const MyOrdersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const userId = useSelector(state => state.user.user ? state.user.user.u_id : null);
  const cartItems = useSelector(state => state.cart.items);
  
  const { orders, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    if (isLoggedIn && userId) {
      dispatch(fetchOrders(userId));
      dispatch(fetchCart(userId));
    }
  }, [isLoggedIn, userId, dispatch]);

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
    const statusLower = status ? status.toLowerCase() : '';
    switch (statusLower) {
      case 'delivered':
        return '#28a745';
      case 'out for delivery':
        return '#17a2b8';
      case 'processing':
        return '#ffc107';
      case 'packed':
        return '#6f42c1';
      case 'cancelled':
        return '#dc3545';
      case 'pending':
        return '#FF9800'; 
      default:
        return '#6c757d';
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(order => {
      const query = searchQuery.toLowerCase();
      return (
        order.o_order_id.toLowerCase().includes(query) ||
        (order.o_payment_status && order.o_payment_status.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, orders]);

  const renderEmptyState = useCallback(() => {
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
              onPress={() => navigation.navigate('HomeScreen')}
              activeOpacity={0.8}
            >
              <Text style={styles.shopNowButtonText}>Shop Now</Text>
            </TouchableOpacity>
          )}
        </View>
      );
  }, [searchQuery, navigation]);
  
  const handleViewDetails = (order) => {
    navigation.navigate('ViewOrderDetails', { 
      orderId: order.o_id,
      formattedOrderId: order.o_order_id 
    });
  };

  const openLocation = (order) => {
    const latitude = order.latitude;
    const longitude = order.longitude;

    if (!latitude || !longitude) {
        Alert.alert("Location not available", "This order does not have location data.");
        return;
    }
    
    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    const latLng = `${latitude},${longitude}`;
    const label = `Order ${order.o_order_id} Location`;
    const url = Platform.select({
      ios: `${scheme}${latLng}?q=${label}@${latLng}`,
      android: `${scheme}${latLng}?q=${latLng}(${label})`
    });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
        Linking.openURL(webUrl);
      }
    });
  };

  const renderOrderItem = useCallback(({ item, index }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderTable}>
        {/* Row 1: S.No, Order ID */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>S.No:</Text>
            <Text style={styles.tableCellValue}>#{index + 1}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>Order ID:</Text>
            <Text style={styles.tableCellValue}>{item.o_order_id}</Text>
          </View>
        </View>

        {/* Row 2: User Name, User Email */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>User Name:</Text>
            <Text style={styles.tableCellValue}>{item.u_name}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>User Email:</Text>
            <Text style={styles.tableCellValue}>{item.u_email}</Text>
          </View>
        </View>

        {/* Row 3: Phone Number, Add Date */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>Phone Number:</Text>
            <Text style={styles.tableCellValue}>{item.o_phone}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.tableCellLabel}>Add Date:</Text>
            <Text style={styles.tableCellValue}>{item.o_add_date}</Text>
          </View>
        </View>

        {/* Row 4: Address */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.fullWidthCell]}>
            <Text style={styles.tableCellLabel}>Address:</Text>
            <Text style={styles.tableCellValue} numberOfLines={2}>{item.o_address}</Text>
          </View>
        </View>

        {/* Row 5: Current Address */}
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.fullWidthCell]}>
            <Text style={styles.tableCellLabel}>Current Address:</Text>
            <Text style={styles.tableCellValue} numberOfLines={2}>{item.o_current_address}</Text>
          </View>
        </View>
        
        {/* Row 6: Status */}
        <View style={styles.tableRow}>
            <View style={[styles.tableCell, {flex: 0, marginRight: 8}]}>
                <Text style={styles.tableCellLabel}>Status:</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.o_payment_status) }]}>
                 <Text style={styles.statusBadgeText}>{item.o_payment_status || 'N/A'}</Text>
            </View>
        </View>

        {/* Row 7: Message */}
        {item.o_message ? (
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.fullWidthCell]}>
              <Text style={styles.tableCellLabel}>Message:</Text>
              <Text style={[styles.tableCellValue, styles.messageText]}>{item.o_message}</Text>
            </View>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => handleViewDetails(item)}
          >
            <MaterialIcons name="visibility" size={16} color="#fff" />
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>

          {(item.o_payment_status || '').toLowerCase() !== 'delivered' && (
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

  const getHeaderHeight = () => {
    const baseHeight = 56;
    const statusBarHeight = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;
    return baseHeight + statusBarHeight;
  };

  const getHeaderPadding = () => {
    return {
      paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
      paddingHorizontal: width * 0.04,
    };
  };
  
  if (loading) {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading Orders...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.centered}>
            <MaterialIcons name="error-outline" size={60} color="#D32F2F" />
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => dispatch(fetchOrders(userId))}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={[ styles.header, { height: getHeaderHeight(), ...getHeaderPadding() } ]}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
              <MaterialIcons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Orders</Text>
            <TouchableOpacity style={styles.cartButton} onPress={handleCartPress} activeOpacity={0.7} >
              <View>
                <MaterialIcons name="shopping-cart-checkout" size={24} color="#000" />
                {cartItems && cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
              placeholder="Search by Order ID or Status"
            value={searchQuery}
            onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton} >
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.o_id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
  },
  retryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
  },
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
    paddingHorizontal: width * 0.04,
    paddingVertical: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    borderRadius: 8,
    height: Math.max(44, height * 0.055), // Responsive height
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: Math.min(14, width * 0.035), // Responsive font size
    color: '#000',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderTable: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  tableCell: {
    flex: 1,
    minWidth: '45%',
  },
  fullWidthCell: {
    flex: 1,
    width: '100%',
    minWidth: '100%',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  tableCellLabel: {
    fontSize: Math.min(12, width * 0.03),
    color: '#666',
    marginBottom: 2,
    fontWeight: '600',
  },
  tableCellValue: {
    fontSize: Math.min(14, width * 0.035),
    color: '#000',
    fontWeight: '400',
  },
   statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  messageText: {
    fontStyle: 'italic',
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: width * 0.03,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  viewDetailsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
  },
  trackButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
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
    marginTop: height * 0.1,
  },
  emptyStateTitle: {
    fontSize: Math.min(22, width * 0.055),
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: Math.min(15, width * 0.038),
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
  },
});

export default MyOrdersScreen;
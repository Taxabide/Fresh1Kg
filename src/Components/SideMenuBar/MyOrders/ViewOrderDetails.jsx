import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetails } from '../../../redux/actions/orderActions';

const { width, height } = Dimensions.get('window');

const ViewOrderDetails = ({ route, navigation }) => {
  const { orderId, formattedOrderId } = route.params;
  const dispatch = useDispatch();
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const insets = useSafeAreaInsets();
  
  const { orderDetails, orderDetailsLoading, orderDetailsError } = useSelector(state => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);
  
  const order = orderDetails; // Use a shorthand

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

  const handleDownloadReceipt = () => {
    if (!order) return;
    const formattedOrder = {
      orderId: formattedOrderId || order.order_id,
      userName: order.user?.u_name,
      userEmail: order.user?.u_email,
      userPhone: order.user?.o_phone,
      address: order.user?.o_address,
      currentAddress: order.user?.o_current_address,
      addDate: order.purchase_date,
      items: order.items || [],
      total: order.total,
      invoiceNumber: `INV-${formattedOrderId || order.order_id}`,
      orderDate: order.purchase_date,
      paymentMethod: order.o_payment_method,
      paymentStatus: order.o_payment_status,
      shippingAddress: order.user?.o_address,
      billingAddress: order.user?.o_current_address,
      subtotal: order.total,
      tax: (order.total * 0.18).toFixed(2), // Example tax
      shippingCharges: 0
    };
    navigation.navigate('Receipt', { order: formattedOrder });
  };

  const handleCancelOrder = () => setShowCancelModal(true);

  const handleSubmitCancel = () => {
    if (!cancelReason.trim()) {
      Alert.alert('Error', 'Please enter a reason for cancellation');
      return;
    }
    console.log('Cancelling order:', order.order_id, 'Reason:', cancelReason);
    setShowCancelModal(false);
    setCancelReason('');
    Alert.alert('Success', 'Order cancelled successfully');
    navigation.goBack();
  };

  const handleTrackOrder = () => navigation.navigate('TrackMyOrder', { order });

  if (orderDetailsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Order Details...</Text>
      </View>
    );
  }

  if (orderDetailsError) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={60} color="#D32F2F" />
        <Text style={styles.errorText}>{orderDetailsError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchOrderDetails(orderId))}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!order) {
    return (
        <View style={styles.centered}>
            <Text>No order details found.</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={[ styles.header, { height: getHeaderHeight(), ...getHeaderPadding() } ]}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Details</Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={[styles.section, { marginHorizontal: width * 0.04 }]}>
            <Text style={styles.orderIdLabel}>ORDER ID:</Text>
            <Text style={styles.orderId}>{formattedOrderId || order?.order_id}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.downloadButton]} onPress={handleDownloadReceipt}>
              <MaterialIcons name="download" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Download{'\n'}Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.orderCancelButton]} onPress={handleCancelOrder}>
              <MaterialIcons name="cancel" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Cancel{'\n'}Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.trackButton]} onPress={handleTrackOrder}>
              <MaterialIcons name="location-on" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Track{'\n'}Order</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{order.user?.u_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{order.user?.u_email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Phone No.:</Text>
              <Text style={styles.value}>{order.user?.o_phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{order.user?.o_address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Current Address:</Text>
              <Text style={styles.value}>{order.user?.o_current_address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Purchase Date:</Text>
              <Text style={styles.value}>{order.purchase_date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{order.o_payment_method}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Payment Status:</Text>
              <Text style={styles.value}>{order.o_payment_status}</Text>
            </View>
          </View>

          <View style={styles.orderItemsContainer}>
            <Text style={styles.sectionTitle}>Order Items:</Text>
            {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                        <Text style={styles.itemName}>{item.product_name}</Text>
                        <View style={styles.itemDetails}>
                        <View style={styles.itemDetail}>
                            <Text style={styles.detailLabel}>Price:</Text>
                            <Text style={styles.detailValue}>₹{item.o_i_price}</Text>
                        </View>
                        <View style={styles.itemDetail}>
                            <Text style={styles.detailLabel}>Quantity:</Text>
                            <Text style={styles.detailValue}>{item.o_i_quantity}</Text>
                        </View>
                        <View style={styles.itemDetail}>
                            <Text style={styles.detailLabel}>Subtotal:</Text>
                            <Text style={styles.detailValue}>₹{item.o_i_subtotal}</Text>
                        </View>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.itemName}>No items found for this order.</Text>
            )}

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>₹{order.total}</Text>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showCancelModal} transparent={true} animationType="fade" onRequestClose={() => setShowCancelModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cancel Order</Text>
              <Text style={styles.modalSubtitle}>Enter reason for cancellation</Text>
              <TextInput style={styles.reasonInput} placeholder="Type reason here..." placeholderTextColor="#666" value={cancelReason} onChangeText={setCancelReason} multiline={false} maxLength={100} />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmitCancel}>
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={() => { setShowCancelModal(false); setCancelReason(''); }}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    fontSize: Math.min(16, width * 0.045),
    color: '#000',
    fontWeight: '500',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderIdLabel: {
    fontSize: 14,
    color: '#FF0000',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    color: '#FF0000',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    minWidth: 80,
  },
  downloadButton: {
    backgroundColor: '#00BCD4',
  },
  orderCancelButton: {
    backgroundColor: '#FF5252',
  },
  trackButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  detailsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    width: 120,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  orderItemsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  orderItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 12,
  },
  itemDetails: {
    marginTop: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#4CAF50'
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#333',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 180,
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#1976D2',
  },
  modalCancelButton: {
    backgroundColor: '#D32F2F',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ViewOrderDetails;
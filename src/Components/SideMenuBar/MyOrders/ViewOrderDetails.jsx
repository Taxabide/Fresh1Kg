import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const ViewOrderDetails = ({ route, navigation }) => {
  const { order } = route.params;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const insets = useSafeAreaInsets();

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

  const handleDownloadReceipt = () => {
    // Format the order data properly before navigation
    const formattedOrder = {
      serialNo: order.serialNo || '001',
      orderId: order.orderId,
      userName: order.userName,
      userEmail: order.userEmail,
      userPhone: order.userPhone,
      address: order.address,
      currentAddress: order.currentAddress,
      addDate: order.addDate,
      items: Array.isArray(order.items) ? order.items : [],
      total: order.total || 0,
      // Additional receipt data
      invoiceNumber: `INV-${order.orderId}`,
      orderDate: order.addDate,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      shippingAddress: order.address,
      billingAddress: order.currentAddress,
      subtotal: order.total || 0,
      tax: ((order.total || 0) * 0.18).toFixed(2),
      shippingCharges: 0
    };

    // Navigate with properly formatted data
    navigation.navigate('Receipt', { 
      order: formattedOrder
    });
  };

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const handleSubmitCancel = () => {
    if (!cancelReason.trim()) {
      Alert.alert('Error', 'Please enter a reason for cancellation');
      return;
    }
    // Here you would typically make an API call to cancel the order
    console.log('Cancelling order:', order.orderId, 'Reason:', cancelReason);
    setShowCancelModal(false);
    setCancelReason('');
    // After successful cancellation, you might want to:
    // 1. Show success message
    Alert.alert('Success', 'Order cancelled successfully');
    // 2. Update order status
    // 3. Navigate back or refresh the order details
    navigation.goBack();
  };

  const handleTrackOrder = () => {
    navigation.navigate('TrackMyOrder', { order });
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
            <Text style={styles.headerTitle}>Order Details</Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Order ID Section */}
          <View style={[styles.section, { marginHorizontal: width * 0.04 }]}>
            <Text style={styles.orderIdLabel}>ORDER ID:</Text>
            <Text style={styles.orderId}>{order.orderId}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.downloadButton]}
              onPress={handleDownloadReceipt}
            >
              <MaterialIcons name="download" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Download{'\n'}Receipt</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.orderCancelButton]}
              onPress={handleCancelOrder}
            >
              <MaterialIcons name="cancel" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Cancel{'\n'}Order</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.trackButton]}
              onPress={handleTrackOrder}
            >
              <MaterialIcons name="location-on" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Track{'\n'}Order</Text>
            </TouchableOpacity>
          </View>

          {/* Order Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{order.userName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{order.userEmail}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Phone No.:</Text>
              <Text style={styles.value}>{order.userPhone}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{order.address}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Current Address:</Text>
              <Text style={styles.value}>{order.currentAddress}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Purchase Date:</Text>
              <Text style={styles.value}>{order.addDate}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>COD</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Payment Status:</Text>
              <Text style={styles.value}>PENDING</Text>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.orderItemsContainer}>
            <Text style={styles.sectionTitle}>Order Items:</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <Text style={styles.productName}>Product Name:</Text>
                <Text style={styles.itemName}>{item}</Text>
                <View style={styles.itemDetails}>
                  <View style={styles.itemDetail}>
                    <Text style={styles.detailLabel}>MRP:</Text>
                    <Text style={styles.detailValue}>₹{order.total}</Text>
                  </View>
                  <View style={styles.itemDetail}>
                    <Text style={styles.detailLabel}>Weight:</Text>
                    <Text style={styles.detailValue}>1 kg</Text>
                  </View>
                  <View style={styles.itemDetail}>
                    <Text style={styles.detailLabel}>Quantity:</Text>
                    <Text style={styles.detailValue}>1</Text>
                  </View>
                  <View style={styles.itemDetail}>
                    <Text style={styles.detailLabel}>Subtotal:</Text>
                    <Text style={styles.detailValue}>₹{order.total}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Total */}
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>₹{order.total}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Cancel Order Modal */}
        <Modal
          visible={showCancelModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCancelModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cancel Order</Text>
              <Text style={styles.modalSubtitle}>Enter reason for cancellation</Text>
              
              <TextInput
                style={styles.reasonInput}
                placeholder="Type reason here..."
                placeholderTextColor="#666"
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline={false}
                maxLength={100}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitCancel}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }}
                >
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
  headerRight: {
    width: 40, // To balance the header layout
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
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  productName: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  itemDetails: {
    marginTop: 8,
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4CAF50',
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  // Modal Styles
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
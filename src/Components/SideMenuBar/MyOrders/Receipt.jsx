import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const Receipt = ({ route, navigation }) => {
  const { order } = route.params || {};
  const insets = useSafeAreaInsets();

  // Safely access order data with fallbacks
  const orderData = {
    invoiceNumber: order?.invoiceNumber || 'N/A',
    orderDate: order?.orderDate || 'N/A',
    userName: order?.userName || 'N/A',
    userPhone: order?.userPhone || 'N/A',
    userEmail: order?.userEmail || 'N/A',
    shippingAddress: order?.shippingAddress || 'N/A',
    items: Array.isArray(order?.items) ? order.items : [],
    subtotal: order?.subtotal || 0,
    tax: order?.tax || 0,
    shippingCharges: order?.shippingCharges || 0,
    total: order?.total || 0,
    paymentMethod: order?.paymentMethod || 'COD',
    paymentStatus: order?.paymentStatus || 'PENDING'
  };

  // Calculate dynamic header height based on device
  const getHeaderHeight = () => {
    const baseHeight = 56;
    const statusBarHeight = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0;
    return baseHeight + statusBarHeight;
  };

  // Calculate dynamic padding based on device
  const getHeaderPadding = () => {
    return {
      paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
      paddingHorizontal: width * 0.04,
    };
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Order Receipt\n\nInvoice: ${orderData.invoiceNumber}\nOrder Date: ${orderData.orderDate}\nTotal Amount: ₹${orderData.total}\n\nThank you for shopping with Fresh1Kg!`,
        title: 'Order Receipt',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, {
          height: getHeaderHeight(),
          ...getHeaderPadding(),
        }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Receipt</Text>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <MaterialIcons name="share" size={22} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Receipt Header */}
          <View style={styles.receiptHeader}>
            <Text style={styles.storeName}>Fresh1Kg</Text>
            <Text style={styles.storeAddress}>Your Trusted Grocery Partner</Text>
          </View>

          {/* Invoice Details */}
          <View style={styles.section}>
            <View style={styles.invoiceRow}>
              <Text style={styles.label}>Invoice Number:</Text>
              <Text style={styles.value}>{orderData.invoiceNumber}</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.label}>Order Date:</Text>
              <Text style={styles.value}>{orderData.orderDate}</Text>
            </View>
          </View>

          {/* Customer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{orderData.userName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{orderData.userPhone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{orderData.userEmail}</Text>
            </View>
          </View>

          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Text style={styles.address}>{orderData.shippingAddress}</Text>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {orderData.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{typeof item === 'string' ? item : item.name || 'N/A'}</Text>
                  <Text style={styles.itemMeta}>Weight: 1 kg</Text>
                </View>
                <View style={styles.itemPricing}>
                  <Text style={styles.itemQuantity}>Qty: 1</Text>
                  <Text style={styles.itemPrice}>₹{orderData.total}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Price Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>₹{orderData.subtotal}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST (18%)</Text>
              <Text style={styles.priceValue}>₹{orderData.tax}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={styles.priceValue}>₹{orderData.shippingCharges}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{orderData.total}</Text>
            </View>
          </View>

          {/* Payment Info */}
          <View style={styles.section}>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{orderData.paymentMethod}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.label}>Payment Status:</Text>
              <Text style={[styles.value, { color: orderData.paymentStatus === 'PAID' ? '#4CAF50' : '#FF9800' }]}>
                {orderData.paymentStatus}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Thank you for shopping with Fresh1Kg!</Text>
            <Text style={styles.footerNote}>This is a computer generated receipt and does not require a physical signature.</Text>
          </View>
        </ScrollView>
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
  shareButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: Math.min(16, width * 0.045),
    color: '#000',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  receiptHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#4CAF50',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 120,
    fontSize: 14,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  address: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#000',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 8,
  },
  footerNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default Receipt;

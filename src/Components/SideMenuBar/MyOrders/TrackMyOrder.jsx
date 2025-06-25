import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const TrackMyOrder = ({ route, navigation }) => {
  const { order } = route.params;
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

  // Helper function to determine if a step is completed
  const isStepCompleted = (stepIndex) => {
    const statusMap = {
      'Order Placed': 0,
      'Packed': 1,
      'Shipped': 2,
      'Delivered': 3,
      'Cancelled': -1
    };

    const currentStatusIndex = statusMap[order.status] || 0;
    return currentStatusIndex >= stepIndex;
  };

  // Helper function to get step color
  const getStepColor = (stepIndex) => {
    if (order.status === 'Cancelled') {
      return stepIndex === 0 ? '#FF0000' : '#ddd';
    }
    return isStepCompleted(stepIndex) ? '#4CAF50' : '#ddd';
  };

  const getStepIcon = (step) => {
    const icons = {
      'Order Placed': 'receipt',
      'Packed': 'inventory',
      'Shipped': 'local-shipping',
      'Delivered': 'home',
    };
    return icons[step] || 'circle';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
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
            <Text style={styles.headerTitle}>Order Tracking</Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Info */}
          <View style={[styles.orderInfo, { marginHorizontal: width * 0.04 }]}>
            <Text style={styles.orderId}>Order ID: {order.orderId}</Text>
            <Text style={styles.orderDate}>
              Placed on {formatDate(order.addDate)}
            </Text>
          </View>

          {/* Tracking Timeline */}
          <View style={[styles.timelineContainer, { marginHorizontal: width * 0.04 }]}>
            {order.status === 'Cancelled' ? (
              <>
                {/* Cancelled Order Status */}
                <View style={styles.cancelledContainer}>
                  <View style={styles.cancelledHeader}>
                    <MaterialIcons name="cancel" size={24} color="#FF0000" />
                    <Text style={styles.cancelledTitle}>Order Cancelled</Text>
                  </View>
                  <Text style={styles.cancelledReason}>
                    Reason: {order.message || 'No reason provided'}
                  </Text>
                  <Text style={styles.cancelledTime}>
                    Cancelled on {formatDate(order.addDate)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* Regular Order Timeline */}
                <View style={styles.timeline}>
                  {['Order Placed', 'Packed', 'Shipped', 'Delivered'].map((step, index) => (
                    <View key={step} style={styles.timelineStep}>
                      <View style={styles.stepIconContainer}>
                        <View 
                          style={[
                            styles.stepIcon, 
                            { backgroundColor: getStepColor(index) }
                          ]}
                        >
                          <MaterialIcons 
                            name={getStepIcon(step)} 
                            size={20} 
                            color="#fff" 
                          />
                        </View>
                        {index < 3 && (
                          <View 
                            style={[
                              styles.stepLine,
                              { backgroundColor: getStepColor(index + 1) }
                            ]} 
                          />
                        )}
                      </View>
                      <View style={styles.stepContent}>
                        <Text style={[
                          styles.stepTitle,
                          isStepCompleted(index) && styles.stepTitleCompleted
                        ]}>
                          {step}
                        </Text>
                        {isStepCompleted(index) && (
                          <Text style={styles.stepTime}>
                            {formatDate(order.addDate)}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* Delivery Details */}
          <View style={[styles.deliveryDetails, { marginHorizontal: width * 0.04 }]}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={20} color="#4CAF50" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Delivery Address</Text>
                <Text style={styles.detailText}>{order.currentAddress}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="phone" size={20} color="#4CAF50" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Contact Number</Text>
                <Text style={styles.detailText}>{order.phoneNumber}</Text>
              </View>
            </View>
          </View>

          {/* Expected Delivery */}
          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
            <View style={[styles.expectedDelivery, { marginHorizontal: width * 0.04 }]}>
              <MaterialCommunityIcons 
                name="truck-delivery-outline" 
                size={24} 
                color="#4CAF50" 
              />
              <Text style={styles.expectedDeliveryText}>
                Expected Delivery by{' '}
                <Text style={styles.expectedDeliveryDate}>
                  {formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))}
                </Text>
              </Text>
            </View>
          )}
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
  orderInfo: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginTop: 10,
    borderRadius: 8,
  },
  orderId: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: Math.min(14, width * 0.035),
    color: '#666',
  },
  timelineContainer: {
    padding: 16,
    marginTop: 10,
  },
  timeline: {
    marginTop: 20,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    top: 36,
    left: 17,
  },
  stepContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: Math.min(16, width * 0.04),
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  stepTitleCompleted: {
    color: '#000',
    fontWeight: '600',
  },
  stepTime: {
    fontSize: Math.min(12, width * 0.03),
    color: '#666',
  },
  cancelledContainer: {
    backgroundColor: '#FFF3F3',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  cancelledHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelledTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF0000',
    marginLeft: 8,
  },
  cancelledReason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cancelledTime: {
    fontSize: 12,
    color: '#666',
  },
  deliveryDetails: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: Math.min(14, width * 0.035),
    color: '#4CAF50',
    marginBottom: 4,
  },
  detailText: {
    fontSize: Math.min(14, width * 0.035),
    color: '#000',
  },
  expectedDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E8F5E9',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  expectedDeliveryText: {
    marginLeft: 12,
    fontSize: Math.min(14, width * 0.035),
    color: '#666',
  },
  expectedDeliveryDate: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default TrackMyOrder;

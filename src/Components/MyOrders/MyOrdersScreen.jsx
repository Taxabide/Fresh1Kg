// 1. Make sure you have the MyOrders screen created
// Create a new file: screens/MyOrders.js or wherever your screens are located

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MyOrders = ({ navigation, route }) => {
  const { userData } = route.params || {};
  
  // Sample orders data - replace with your actual data
  const [orders, setOrders] = React.useState([
    {
      id: '1',
      orderNumber: '#ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: '₹345.50',
      items: ['Fresh Apples 1kg', 'Bananas 2kg', 'Almonds 500g'],
      itemCount: 3,
      category: 'Mixed',
    },
    {
      id: '2',
      orderNumber: '#ORD-002',
      date: '2024-01-10',
      status: 'Out for Delivery',
      total: '₹225.00',
      items: ['Tomatoes 2kg', 'Onions 1kg'],
      itemCount: 2,
      category: 'Vegetables',
    },
    {
      id: '3',
      orderNumber: '#ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: '₹680.75',
      items: ['Cashews 500g', 'Dates 1kg', 'Walnuts 250g', 'Oranges 3kg', 'Spinach 1kg'],
      itemCount: 5,
      category: 'Mixed',
    },
  ]);

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

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.orderDetailRow}>
          <MaterialIcons name="date-range" size={16} color="#666" />
          <Text style={styles.orderDetailText}>Order Date: {item.date}</Text>
        </View>
        
        <View style={styles.orderDetailRow}>
          <MaterialIcons name="local-grocery-store" size={16} color="#666" />
          <Text style={styles.orderDetailText}>{item.itemCount} items ({item.category})</Text>
        </View>
        
        <View style={styles.orderDetailRow}>
          <MaterialIcons name="currency-rupee" size={16} color="#666" />
          <Text style={styles.orderDetailText}>Total: {item.total}</Text>
        </View>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsPreview}>
        <Text style={styles.itemsTitle}>Items:</Text>
        <Text style={styles.itemsList} numberOfLines={2}>
          {item.items.join(', ')}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.viewOrderButton}>
        <Text style={styles.viewOrderButtonText}>View Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* User Info */}
      {userData && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome back, {userData.name}!</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>
      )}

      {/* Orders List */}
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="local-grocery-store" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
          <Text style={styles.emptyStateText}>
            You haven't ordered any fresh vegetables, fruits, or dry fruits yet. Start shopping for fresh produce!
          </Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopNowButtonText}>Shop Fresh Produce</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  ordersList: {
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  itemsPreview: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemsList: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  viewOrderButton: {
    backgroundColor: '#7CB342',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  viewOrderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  shopNowButton: {
    backgroundColor: '#7CB342',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyOrders;
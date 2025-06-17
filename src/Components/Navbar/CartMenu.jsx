import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartItemQuantity, removeCartItem, fetchCart } from '../../redux/actions/cartActions';

const CartMenu = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user);
  const cartLoading = useSelector(state => state.cart.loading);
  const cartError = useSelector(state => state.cart.error);

  useEffect(() => {
    if (user && user.u_id) {
      dispatch(fetchCart(user.u_id));
    } else {
      // 
    }
  }, [dispatch, user]);

  const updateQuantity = (id, increment) => {
    const change = increment ? 1 : -1;
    dispatch(updateCartItemQuantity(id, change));
  };

  const removeItem = (id) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeCartItem(id))
        }
      ]
    );
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.p_price * item.quantity), 0);
  };

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => 
      total + ((item.original_price - item.p_price) * item.quantity), 0
    );
  };

  const CartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: `https://fresh1kg.com/assets/images/products-images/${String(item.p_image)}` }} 
        style={styles.productImage} 
        onError={(e) => {}}
      />
      
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>
          {String(item.p_name)}
        </Text>
        {item.p_weight && item.p_unit && <Text style={styles.productVariant}>{String(item.p_weight)} {String(item.p_unit)}</Text>}
        
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerText}>Sold by: Fresh1Kg</Text>
        </View>

        <View style={styles.offersContainer}>
          <View style={styles.offerTag}>
            <Text style={styles.offerText}>10% Off</Text>
          </View>
          <View style={styles.offerTag}>
            <Text style={styles.offerText}>No Delivery Charges</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{String(item.p_price)}</Text>
          {item.original_price && <Text style={styles.originalPrice}>₹{String(item.original_price)}</Text>}
          <Text style={styles.discount}>25% off</Text>
        </View>

        <Text style={styles.deliveryInfo}>
          <Icon name="local-shipping" size={14} color="#388e3c" />
          {' '}{`Delivery Today, 6 PM - 8 PM`}
        </Text>

        <View style={styles.actionButtons}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.cart_id, false)}
            >
              <Icon name="remove" size={16} color="#2874f0" />
            </TouchableOpacity>
            <View style={styles.quantityBox}>
              <Text style={styles.quantityText}>{String(item.quantity)}</Text>
            </View>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.cart_id, true)}
            >
              <Icon name="add" size={16} color="#2874f0" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.cart_id)}
          >
            <Text style={styles.removeText}>REMOVE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>SAVE FOR LATER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2874f0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({String(cartItems.length)})</Text>
      </View>

      {cartLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7CB342" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      ) : cartError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{String(cartError || 'An error occurred. Please try again.')}</Text>
        </View>
      ) : cartItems.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          {/* Delivery Address */}
          <View style={styles.deliverySection}>
            <View style={styles.deliveryHeader}>
              <Icon name="location-on" size={20} color="#2874f0" />
              <Text style={styles.deliveryTitle}>Deliver to</Text>
            </View>
            <Text style={styles.deliveryAddress}>Gaurav Sir, 248007</Text>
            <Text style={styles.deliverySubtext}>
              Home - Bhauwala Dehradun
            </Text>
            <TouchableOpacity>
              <Text style={styles.changeAddress}>CHANGE ADDRESS</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          {cartItems.map(item => (
            <CartItem key={String(item.cart_id)} item={item} />
          ))}

          {/* Offers Section */}
          <View style={styles.offersSection}>
            <TouchableOpacity style={styles.offersHeader}>
              <Icon name="local-offer" size={20} color="#ff6f00" />
              <Text style={styles.offersTitle}>Available Offers</Text>
              <Icon name="keyboard-arrow-right" size={20} color="#878787" />
            </TouchableOpacity>
          </View>

          {/* Price Details */}
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailsTitle}>PRICE DETAILS</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Price ({String(cartItems.reduce((sum, item) => sum + item.quantity, 0))} items)
              </Text>
              <Text style={styles.priceValue}>
                ₹{String(cartItems.reduce((total, item) => 
                  total + (item.original_price * item.quantity), 0
                ).toLocaleString())}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount</Text>
              <Text style={styles.discountValue}>
                −₹{String(getTotalSavings().toLocaleString())}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Charges</Text>
              <Text style={styles.freeDelivery}>FREE</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{String(getTotalAmount().toLocaleString())}</Text>
            </View>

            <Text style={styles.savings}>
              You will save ₹{String(getTotalSavings().toLocaleString())} on this order
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      )}

      {/* Bottom Action Bar */}
      {cartItems.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalSection}>
            <Text style={styles.bottomTotal}>₹{String(getTotalAmount().toLocaleString())}</Text>
            <Text style={styles.bottomSavings}>
              Total Savings ₹{String(getTotalSavings().toLocaleString())}
            </Text>
          </View>
          <TouchableOpacity style={styles.placeOrderButton}>
            <Text style={styles.placeOrderText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  scrollView: {
    flex: 1,
  },
  deliverySection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  deliveryAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 28,
  },
  deliverySubtext: {
    fontSize: 12,
    color: '#878787',
    marginLeft: 28,
    marginTop: 2,
  },
  changeAddress: {
    fontSize: 12,
    color: '#2874f0',
    fontWeight: '600',
    marginLeft: 28,
    marginTop: 8,
  },
  cartItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 12,
    color: '#878787',
    marginBottom: 4,
  },
  sellerInfo: {
    marginBottom: 8,
  },
  sellerText: {
    fontSize: 12,
    color: '#878787',
  },
  offersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  offerTag: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  offerText: {
    fontSize: 10,
    color: '#388e3c',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#878787',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discount: {
    fontSize: 12,
    color: '#388e3c',
    fontWeight: '600',
  },
  deliveryInfo: {
    fontSize: 12,
    color: '#388e3c',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#f8f8f8',
  },
  quantityBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  removeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  removeText: {
    fontSize: 12,
    color: '#878787',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveText: {
    fontSize: 12,
    color: '#878787',
    fontWeight: '600',
  },
  offersSection: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  offersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  offersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
    flex: 1,
  },
  priceDetails: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 80,
  },
  priceDetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#878787',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#212121',
  },
  priceValue: {
    fontSize: 14,
    color: '#212121',
  },
  discountValue: {
    fontSize: 14,
    color: '#388e3c',
  },
  freeDelivery: {
    fontSize: 14,
    color: '#388e3c',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  savings: {
    fontSize: 14,
    color: '#388e3c',
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  totalSection: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  bottomSavings: {
    fontSize: 12,
    color: '#388e3c',
  },
  placeOrderButton: {
    backgroundColor: '#ff6f00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    justifyContent: 'center',
  },
  placeOrderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default CartMenu;
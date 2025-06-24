import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { searchProducts } from '../../redux/actions/productActions';
import { addToCart, fetchCart } from '../../redux/actions/cartActions';
import { addToWishlist } from '../../redux/actions/wishlistActions';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const VegetablesScreen = () => {
  const navigation = useNavigation();
  const [quantities, setQuantities] = useState({});
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const user = useSelector(state => state.user.user);
  const { addToCartLoading, addToCartError, addToCartMessage } = useSelector(state => state.cart);
  const { addToWishlistLoading, addToWishlistError, addToWishlistMessage } = useSelector(state => state.wishlist);

  // console.log('VegetablesScreen - User object from Redux:', user);

  useEffect(() => {
    // Dispatch action to fetch vegetables (p_category_id = 2) only if data is not already loaded
    if (!products['2'] || products['2'].length === 0) {
      dispatch(searchProducts(2)); 
    }
    
    // Only fetch cart if user is logged in and cart fetch is supported
    if (user && user.u_id) {
      // Try to fetch cart but handle errors gracefully
      dispatch(fetchCart(user.u_id)).catch(error => {
        // console.warn('Failed to fetch cart on component mount:', error);
        // Don't show error to user unless it's critical
      });
    }
  }, [dispatch, products, user]);

  // Show success/error messages for add to cart
  // useEffect(() => {
  //   if (addToCartMessage) {
  //     Alert.alert('Success', addToCartMessage);
  //   }
  //   if (addToCartError && !addToCartError.includes('cart')) {
  //     // Only show cart-related errors if they're not about fetching cart
  //     Alert.alert('Error', addToCartError);
  //   }
  // }, [addToCartMessage, addToCartError]);

  // Limit to 6 items
  const vegetablesToDisplay = Array.isArray(products['2']) ? products['2'].slice(0, 6) : [];

<<<<<<< HEAD
  const scrollAmount = 220; // width of item + marginRight
=======
  // Calculate proper scroll amount based on item width + margin
  const itemWidth = width * 0.55; // 55% of screen width
  const itemMargin = 15;
  const scrollAmount = itemWidth + itemMargin;
>>>>>>> 4f54af9 (Initial commit)

  const updateQuantity = (itemId, operation) => {
    setQuantities((prev) => {
      const currentQty = prev[itemId] || 1;
      const newQty = operation === 'increment' ? currentQty + 1 : Math.max(1, currentQty - 1);
      return { ...prev, [itemId]: newQty };
    });
  };

  const addToCartHandler = async (item) => {
    if (!user || !user.u_id) {
      Alert.alert('Login Required', 'Please log in to add items to your cart.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    
    const quantity = quantities[item.p_id] || 1;
    // console.log(`Attempting to add ${quantity} x ${item.p_name} to cart for user ${user.u_id}`);
    
    try {
      await dispatch(addToCart(item.p_id, user.u_id, quantity));
      // Reset quantity after successful add
      setQuantities(prev => ({ ...prev, [item.p_id]: 1 }));
    } catch (error) {
      // console.error('Failed to add item to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    }
  };

  const addToWishlistHandler = async (item) => {
    if (!user || !user.u_id) {
      Alert.alert('Login Required', 'Please log in to add items to your wishlist.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    try {
      void await dispatch(addToWishlist(item.p_id, user.u_id));
    } catch (error) {
      // console.error('Failed to add item to wishlist:', error);
      Alert.alert('Error', 'Failed to add item to wishlist. Please try again.');
    }
  };

<<<<<<< HEAD
  const renderGroceryItem = (item) => (
=======
  const renderGroceryItem = (item, index) => (
>>>>>>> 4f54af9 (Initial commit)
    <View key={item.p_id} style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        {/* Wishlist Icon */}
        <TouchableOpacity 
          style={styles.wishlistIconContainer}
          onPress={() => addToWishlistHandler(item)}
          disabled={addToWishlistLoading}
        >
          <Icon 
            name="heart" 
            size={18} 
            color={addToWishlistLoading ? '#ccc' : '#ffffff'} 
          />
        </TouchableOpacity>
        <Image 
          source={{ uri: `https://fresh1kg.com/assets/images/products-images/${String(item.p_image)}` }} 
          style={styles.productImage} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {String(item.p_name)}
        </Text>
<<<<<<< HEAD
        <Text style={styles.productWeight}>Weight: {String(item.p_weight)} {String(item.p_unit)}</Text>
=======
        <Text style={styles.productWeight}>Weight: {String(item.formatted_weight)} </Text>
>>>>>>> 4f54af9 (Initial commit)

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{String(item.p_price)}</Text>
          {item.original_price && <Text style={styles.originalPrice}>₹{String(item.original_price)}</Text>}
        </View>

        <View style={styles.actionContainer}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.p_id, 'decrement')}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{String(quantities[item.p_id] || 1)}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.p_id, 'increment')}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.addButton, addToCartLoading && styles.addButtonDisabled]} 
            onPress={() => addToCartHandler(item)}
            disabled={addToCartLoading}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {addToCartLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.addButtonText}>Add </Text>
                  <Icon name="shopping-cart" size={14} color="#fff" />
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const onScroll = (event) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  const handleScrollButton = (direction) => {
    if (scrollRef.current) {
      let newX = direction === 'right' ? scrollX + scrollAmount : scrollX - scrollAmount;
      newX = Math.max(0, newX);
<<<<<<< HEAD
=======
      
      // Calculate max scroll position to prevent over-scrolling
      const maxScrollX = Math.max(0, (vegetablesToDisplay.length * scrollAmount) - width + 40);
      newX = Math.min(newX, maxScrollX);
      
>>>>>>> 4f54af9 (Initial commit)
      scrollRef.current.scrollTo({ x: newX, animated: true });
      setScrollX(newX);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fresh Vegetables</Text>
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.navButton} onPress={() => handleScrollButton('left')}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => handleScrollButton('right')}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#7CB342" style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {String(error)}</Text>
      ) : vegetablesToDisplay.length > 0 ? (
<<<<<<< HEAD
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {vegetablesToDisplay.map(renderGroceryItem)}
        </ScrollView>
=======
        <View style={styles.scrollViewContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            onScroll={onScroll}
            scrollEventThrottle={16}
            bounces={false}
            decelerationRate="fast"
            snapToInterval={scrollAmount}
            snapToAlignment="start"
          >
            {vegetablesToDisplay.map((item, index) => renderGroceryItem(item, index))}
          </ScrollView>
        </View>
>>>>>>> 4f54af9 (Initial commit)
      ) : (
        <Text style={styles.noDataText}>No vegetables found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    paddingBottom: 25,
    minHeight: 400,
=======
    backgroundColor: '#ffffff', // Changed to white for seamless look
    paddingVertical: 15,
    paddingBottom: 25,
    minHeight: 400,
    overflow: 'hidden', // Prevent content from going outside container
>>>>>>> 4f54af9 (Initial commit)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
<<<<<<< HEAD
=======
  scrollViewContainer: {
    flex: 1,
    overflow: 'hidden', // Ensure ScrollView content stays within bounds
  },
>>>>>>> 4f54af9 (Initial commit)
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15,
<<<<<<< HEAD
  },
  itemContainer: {
    width: 210,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 20,
    marginBottom: 10,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    backgroundColor: '#f8f9fa',
=======
    alignItems: 'flex-start', // Align items to prevent vertical overflow
  },
  itemContainer: {
    width: width * 0.55, // Responsive width - 55% of screen width
    maxWidth: 220, // Maximum width constraint
    minWidth: 180, // Minimum width constraint
    backgroundColor: '#ffffff', // Pure white background
    borderRadius: 12,
    marginRight: 15,
    marginBottom: 10,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Reduced shadow for seamless look
    shadowOpacity: 0.05, // Very light shadow
    shadowRadius: 4,
    elevation: 2, // Reduced elevation
    overflow: 'hidden', // Prevent content from overflowing item container
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#ffffff', // Pure white background
>>>>>>> 4f54af9 (Initial commit)
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
=======
    overflow: 'hidden',
>>>>>>> 4f54af9 (Initial commit)
  },
  wishlistIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  offText: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
  },
  productImage: {
<<<<<<< HEAD
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  productWeight: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
=======
    width: '90%', // Reduced width to ensure it fits
    height: 120,
    marginBottom: 0,
  },
  productInfo: {
    padding: 12, // Reduced padding
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 13, // Slightly smaller font
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
  productWeight: {
    fontSize: 11, // Smaller font
    color: '#666',
    marginBottom: 8,
>>>>>>> 4f54af9 (Initial commit)
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 15,
    gap: 8,
  },
  currentPrice: {
    fontSize: 16,
=======
    marginBottom: 12,
    gap: 6,
  },
  currentPrice: {
    fontSize: 15, // Slightly smaller
>>>>>>> 4f54af9 (Initial commit)
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  originalPrice: {
<<<<<<< HEAD
    fontSize: 12,
=======
    fontSize: 11,
>>>>>>> 4f54af9 (Initial commit)
    color: '#999',
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
<<<<<<< HEAD
    gap: 10,
=======
    gap: 8,
>>>>>>> 4f54af9 (Initial commit)
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
<<<<<<< HEAD
  },
  quantityButton: {
    width: 32,
    height: 32,
=======
    flex: 1,
    maxWidth: 90, // Limit width
  },
  quantityButton: {
    width: 28, // Smaller buttons
    height: 28,
>>>>>>> 4f54af9 (Initial commit)
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  quantityButtonText: {
<<<<<<< HEAD
    fontSize: 16,
=======
    fontSize: 14,
>>>>>>> 4f54af9 (Initial commit)
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
<<<<<<< HEAD
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
=======
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    maxWidth: 70, // Limit button width
    alignItems: 'center',
>>>>>>> 4f54af9 (Initial commit)
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
<<<<<<< HEAD
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
=======
    fontSize: 11,
    fontWeight: '600',
    marginRight: 2,
>>>>>>> 4f54af9 (Initial commit)
  },
  loadingIndicator: {
    marginTop: 20,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default VegetablesScreen;
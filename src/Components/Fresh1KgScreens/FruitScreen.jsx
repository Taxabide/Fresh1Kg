import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { searchProducts } from '../../redux/actions/productActions';
import { addToCart, fetchCart } from '../../redux/actions/cartActions';
import { addToWishlist } from '../../redux/actions/wishlistActions';
import { useNavigation } from '@react-navigation/native';

const FruitScreen = () => {
  const navigation = useNavigation();
  const [quantities, setQuantities] = useState({});

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const user = useSelector(state => state.user.user); // Get user data from Redux
  const { addToWishlistLoading, addToWishlistError, addToWishlistMessage } = useSelector(state => state.wishlist);

  useEffect(() => {
    // Dispatch action to fetch fruits (p_category_id = 1) only if data is not already loaded
    if (!products['1'] || products['1'].length === 0) {
      dispatch(searchProducts(1)); 
    }
    // Fetch cart items when the component mounts or user changes (if applicable)
    if (user && user.u_id) {
      dispatch(fetchCart(user.u_id));
    }
  }, [dispatch, products, user]);

  // Limit to 4 items with safety checks
  const fruitsToDisplay = Array.isArray(products['1']) ? products['1'].slice(0, 4) : [];
  
  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const getQuantity = (productId) => quantities[productId] || 1;

  const addToCartHandler = (product) => {
    if (!user || !user.u_id) {
      Alert.alert('Login Required', 'Please log in to add items to your cart.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    const quantity = getQuantity(product.p_id); // Use p_id for quantity tracking
    // Dispatch the Redux action to add to cart via API
    dispatch(addToCart(product.p_id, user.u_id, quantity));
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
      Alert.alert('Error', 'Failed to add item to wishlist. Please try again.');
    }
  };

  const ProductCard = ({ product }) => {
    // Add safety checks
    if (!product || !product.p_id) {
      return null;
    }
    
    return (
      <View key={product.p_id} style={styles.productCard}>
        <View style={styles.discountBadge}>
          {/* Discount badge is still dummy, integrate from API if available */}
          <Text style={styles.discountText}>25%</Text>
          <Text style={styles.offText}>Off</Text>
        </View>
        <TouchableOpacity 
          style={styles.wishlistIconContainer}
          onPress={() => addToWishlistHandler(product)}
          disabled={addToWishlistLoading}
        >
          <Icon 
            name="heart" 
            size={18} 
            color={addToWishlistLoading ? '#ccc' : '#e74c3c'} 
          />
        </TouchableOpacity>
        <Image 
          source={{ uri: `https://fresh1kg.com/assets/images/products-images/${product.p_image || 'placeholder.jpg'}` }} 
          style={styles.productImage} 
          resizeMode="contain" 
          onError={(e) => {
            // 
          }}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.p_name || 'Product Name Not Available'}
          </Text>
          <Text style={styles.productSize}>
            {product.p_weight || ''} {product.p_unit || ''}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ₹{product.p_price || '0'}
            </Text>
            {product.original_price && (
              <Text style={styles.originalPrice}>
                ₹{product.original_price}
              </Text>
            )}
          </View>
          <View style={styles.quantityAndAdd}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(product.p_id, -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {getQuantity(product.p_id)}
              </Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(product.p_id, 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addButton} 
              onPress={() => addToCartHandler(product)}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.addButtonText}>Add</Text>
                <Icon name="shopping-cart" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Fresh Fruits</Text>
        </View>
        <ActivityIndicator size="large" color="#7CB342" style={styles.loadingIndicator} />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Fresh Fruits</Text>
        </View>
        <Text style={styles.errorText}>
          Error: {typeof error === 'string' ? error : 'Something went wrong'}
        </Text>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fresh Fruits</Text>
      </View>
      {fruitsToDisplay.length > 0 ? (
        <ScrollView contentContainerStyle={styles.productsGrid} showsVerticalScrollIndicator={false}>
          {fruitsToDisplay.map((product) => (
            <ProductCard key={product.p_id} product={product} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>No fruits found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: -20, // Adjust as needed if SafeAreaView adds unwanted top padding
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  productsGrid: {
    flexDirection: 'column',
    gap: 12,
    padding: 16,
  },
  productCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFB800',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  wishlistIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  productSize: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  quantityAndAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#333',
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#068A4F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default FruitScreen;
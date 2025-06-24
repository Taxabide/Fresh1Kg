import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { searchProducts } from '../../redux/actions/productActions';
import { addToCart, fetchCart } from '../../redux/actions/cartActions';
import { addToWishlist } from '../../redux/actions/wishlistActions';
import { useNavigation } from '@react-navigation/native';

const DryFruitScreen = () => {
  const navigation = useNavigation();
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const user = useSelector(state => state.user.user); // Get user data from Redux
  const { addToWishlistLoading, addToWishlistError, addToWishlistMessage } = useSelector(state => state.wishlist);

  // console.log('DryFruitScreen - User object from Redux:', user);

  useEffect(() => {
    // Dispatch action to fetch dry fruits (p_category_id = 3) only if data is not already loaded
    if (!products['3'] || products['3'].length === 0) {
      dispatch(searchProducts(3));
    }
    // Fetch cart items when the component mounts or user changes (if applicable)
    if (user && user.u_id) {
      dispatch(fetchCart(user.u_id));
    }
  }, [dispatch, products, user]);

  // Filter and limit to dry fruits (assuming categoryId 3) and first 6 items
  const dryFruitsToDisplay = Array.isArray(products['3']) ? products['3'].slice(0, 6) : [];

  const getQuantity = (productId) => {
    return quantities[productId] || 1;
  };

  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const addToCartHandler = (product) => {
    if (!user || !user.u_id) {
      Alert.alert('Login Required', 'Please log in to add items to your cart.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    const quantity = getQuantity(product.p_id);
    // console.log(`Attempting to add ${quantity} x ${String(product.p_name)} to cart for user ${user.u_id}`);
    // console.log('Dispatching addToCart with product_id:', product.p_id, 'and user_id:', user.u_id, 'and quantity:', quantity);
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
      await dispatch(addToWishlist(item.p_id, user.u_id));
    } catch (error) {
      // console.error('Failed to add item to wishlist:', error);
      Alert.alert('Error', 'Failed to add item to wishlist. Please try again.');
    }
  };

  const renderProduct = ({ item }) => (
    <View key={String(item.p_id)} style={styles.productCard}>
      <View style={styles.discountBadge}>
        {/* Assuming discount is not directly from API, using a static 25% for now */}
        <Text style={styles.discountText}>25%</Text>
        <Text style={styles.offText}>Off</Text>
      </View>
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
        onError={(e) => { // 
         }}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{String(item.p_name)}</Text>
<<<<<<< HEAD
        <Text style={styles.productWeight}>{String(item.p_weight)} {String(item.p_unit)}</Text>
=======
        <Text style={styles.productWeight}>Weight: {String(item.formatted_weight)} </Text>
>>>>>>> 4f54af9 (Initial commit)
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{String(item.p_price)}</Text>
          {item.original_price && <Text style={styles.originalPrice}>₹{String(item.original_price)}</Text>}
        </View>
        <View style={styles.quantityContainer}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.p_id, -1)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{String(getQuantity(item.p_id))}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.p_id, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addToCartHandler(item)}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.addButtonText}>Add </Text>
              <Icon name="shopping-cart" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Best Selling Dry Fruits</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#7CB342" style={styles.loadingIndicator} />
        ) : error ? (
          <Text style={styles.errorText}>Error: {String(error)}</Text>
        ) : dryFruitsToDisplay.length > 0 ? (
          <FlatList
            key="horizontal-flatlist"
            data={dryFruitsToDisplay}
            renderItem={renderProduct}
            keyExtractor={(item) => String(item.p_id)}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        ) : (
          <Text style={styles.noDataText}>No dry fruits found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  productsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productCard: {
    width: 200,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    minHeight: 320,
    justifyContent: 'space-between',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFD54F',
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
  productImage: {
    width: '100%',
<<<<<<< HEAD
    height: 110,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'contain',
=======
    height: 150,
    marginBottom: 8,
>>>>>>> 4f54af9 (Initial commit)
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    lineHeight: 18,
  },
  productWeight: {
    fontSize: 12,
    color: '#888',
<<<<<<< HEAD
    marginBottom: 8,
=======
    marginBottom: 4,
    
>>>>>>> 4f54af9 (Initial commit)
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 12,
    marginTop: 8,
=======
    marginBottom: 10,
    
>>>>>>> 4f54af9 (Initial commit)
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#068A4F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
});

export default DryFruitScreen;
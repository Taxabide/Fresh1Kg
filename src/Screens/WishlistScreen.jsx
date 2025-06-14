import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../redux/actions/wishlistActions';
import { addToCart } from '../redux/actions/cartActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const WishlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector(state => state.wishlistData);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const userId = useSelector(state => state.user.user ? state.user.user.u_id : null);

  useEffect(() => {
    if (isLoggedIn && userId) {
      dispatch(fetchWishlist(userId));
    } else if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please log in to view your wishlist.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
    }
  }, [dispatch, isLoggedIn, userId, navigation]);

  const handleRemoveFromWishlist = (w_id) => {
    if (isLoggedIn && userId) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your wishlist?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => dispatch(removeFromWishlist(userId, w_id)) },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('Login Required', 'Please log in to remove items from your wishlist.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
    }
  };

  const handleAddToCart = (item) => {
    if (!isLoggedIn || !userId) {
      Alert.alert('Login Required', 'Please log in to add items to your cart.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    const cartItem = {
      user_id: userId,
      product_id: item.p_id,
      qty: 1,
      product_price: item.p_price,
    };
    dispatch(addToCart(item.p_id, userId, 1));
    // Alert.alert('Added to Cart', `${item.p_name} has been added to your cart.`);
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFromWishlist(item.w_id)}>
        <MaterialIcons name="cancel" size={24} color="#FF6347" />
      </TouchableOpacity>
      <Image source={{ uri: `https://fresh1kg.com/${item.product_image_url}` || 'https://via.placeholder.com/100' }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2}>{item.p_name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{item.p_price}</Text>
          {item.p_original_price && (
            <Text style={styles.originalPrice}>₹{item.p_original_price}</Text>
          )}
        </View>
        <Text style={styles.weightText}>{item.formatted_weight || `Weight: ${item.p_weight} ${item.unit_name}`}</Text>
        <Text style={styles.stockStatus}>{item.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}</Text>
        
        <TouchableOpacity 
          style={[styles.addToCartButton, item.stock_status === 'out_of_stock' && styles.addToCartButtonDisabled]}
          onPress={() => handleAddToCart(item)}
          disabled={item.stock_status === 'out_of_stock'}
        >
          <Text style={styles.addToCartButtonText}>Add To Cart</Text>
          <MaterialIcons name="shopping-cart" size={20} color="#fff" style={styles.cartIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#7CB342" />
        <Text style={styles.loadingText}>Loading wishlist...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <MaterialIcons name="error-outline" size={50} color="#FF6347" />
        <Text style={styles.errorText}>Error: {error instanceof Error ? error.message : error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => isLoggedIn && userId && dispatch(fetchWishlist(userId))}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <FontAwesome name="heart-o" size={50} color="#999" />
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
        <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.browseButtonText}>Start Browsing</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Wishlist</Text>
      <FlatList
        data={wishlistItems}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.w_id ? item.w_id.toString() : Math.random().toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF6347',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 5,
    flex: 1,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    width: (width / 2) - 15,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 5,
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'left',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  currentPrice: {
    fontSize: 16,
    color: '#7CB342',
    fontWeight: 'bold',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  weightText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  stockStatus: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 2,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#7CB342',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  cartIcon: {
    marginLeft: 5,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#7CB342',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  browseButton: {
    marginTop: 20,
    backgroundColor: '#7CB342',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WishlistScreen; 
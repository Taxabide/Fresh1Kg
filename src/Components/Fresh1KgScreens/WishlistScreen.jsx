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
  Alert,
  StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../redux/actions/wishlistActions';
import { addToCart } from '../../redux/actions/cartActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const WishlistScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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

  const handleRemoveFromWishlist = (productId) => {
    if (isLoggedIn && userId) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your wishlist?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => dispatch(removeFromWishlist(userId, productId)) },
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
    <View style={styles.productCard}>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFromWishlist(item.p_id)}>
        <MaterialIcons name="delete" size={24} color="#FF6347" />
      </TouchableOpacity>
      <Image source={{ uri: `https://fresh1kg.com/${item.product_image_url}` || 'https://via.placeholder.com/100' }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.p_name}</Text>
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
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#ffffff"
          translucent={true}
        />
        
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
          <View style={[styles.header, { marginTop: insets.top }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Wishlist</Text>
          </View>

          <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#7CB342" />
          </View>
      </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#ffffff"
          translucent={true}
        />
        
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
          <View style={[styles.header, { marginTop: insets.top }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Wishlist</Text>
          </View>

          <View style={styles.centerContent}>
        <MaterialIcons name="error-outline" size={50} color="#FF6347" />
        <Text style={styles.errorText}>Error: {error instanceof Error ? error.message : error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => isLoggedIn && userId && dispatch(fetchWishlist(userId))}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
          </View>
      </SafeAreaView>
      </View>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#ffffff"
          translucent={true}
        />
        
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
          <View style={[styles.header, { marginTop: insets.top }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Wishlist</Text>
          </View>

          <View style={styles.emptyStateContainer}>
            <MaterialIcons name="favorite-border" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>Your wishlist is empty</Text>
            <TouchableOpacity
              style={styles.shopNowButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
          </View>
      </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={true}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wishlist</Text>
        </View>

      <FlatList
        data={wishlistItems}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.p_id ? item.p_id.toString() : Math.random().toString()}
          contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
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
    backgroundColor: '#7CB342',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  addToCartText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: '#7CB342',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WishlistScreen; 
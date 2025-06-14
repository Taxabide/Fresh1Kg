import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { addToWishlist } from '../../redux/actions/wishlistActions';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SearchResultsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { query } = route.params;
  const { products: productsState, loading, error } = useSelector(state => state.products);
  const user = useSelector(state => state.user.user);
  const { addToWishlistLoading, addToWishlistError, addToWishlistMessage } = useSelector(state => state.wishlist);
  const dispatch = useDispatch();

  // Access the actual array of products based on how it's stored in the Redux state
  const searchResults = Array.isArray(productsState) ? productsState : (productsState.searchResults || []);

  useEffect(() => {
    // No need to dispatch searchProducts here as it's already dispatched from Navbar
    // If you want to re-fetch on screen focus or query change, you can add it here
  }, [query]);

  // Show success/error messages for add to wishlist
  useEffect(() => {
    if (addToWishlistMessage) {
      Alert.alert('Wishlist', addToWishlistMessage);
    }
    if (addToWishlistError) {
      Alert.alert('Wishlist Error', addToWishlistError);
    }
  }, [addToWishlistMessage, addToWishlistError]);

  const addToWishlistHandler = async (item) => {
    if (!user || !user.u_id) {
      Alert.alert('Login Required', 'Please log in to add items to your wishlist.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    try {
      void await dispatch(addToWishlist(item.p_id, user.u_id));
    } catch (e) {
      
    }
  };

  const renderProductItem = ({ item }) => {
    const imageUrl = `https://fresh1kg.com/${item.product_image_url}`;
    
    return (
    <View style={styles.productCard}>
      <TouchableOpacity 
        style={styles.wishlistIconContainer}
        onPress={() => addToWishlistHandler(item)}
        disabled={addToWishlistLoading}
      >
        <MaterialIcons 
          name="favorite" 
          size={20} 
          color={addToWishlistLoading ? '#ccc' : '#e74c3c'} 
        />
      </TouchableOpacity>
      <Image source={{ uri: imageUrl }} style={styles.productImage} onError={(e) => { /* */ }} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.p_name}</Text>
        <Text style={styles.productDescription}>{item.p_description}</Text>
        <Text style={styles.productPrice}>₹{item.p_price} {item.price_per_rate}</Text>
        <Text style={styles.productWeight}>{item.formatted_weight}</Text>
        <Text style={[styles.stockStatus, { color: item.stock_status === 'in_stock' ? 'green' : 'red' }]}>
          {item.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
        </Text>
      </View>
    </View>
  );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results for "{query}"</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#7CB342" style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.p_id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <MaterialIcons name="sentiment-dissatisfied" size={50} color="#ccc" />
          <Text style={styles.noResultsText}>No products found for "{query}".</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  productImage: {
    width: width * 0.3,
    height: 'auto',
    minHeight: 120,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7CB342',
    marginBottom: 4,
  },
  productWeight: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  stockStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  wishlistIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default SearchResultsScreen; 
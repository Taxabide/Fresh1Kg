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
import { addToCart } from '../../redux/actions/cartActions';

const BestSellingScreen = ({ navigation }) => {
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    // Dispatch action to fetch dry fruits (p_category_id = 3)
    dispatch(searchProducts(3));
  }, [dispatch]);

  // Filter and limit to dry fruits (assuming categoryId 3) and first 4 items
  const dryFruitsToDisplay = products[3] ? products[3].slice(0, 4) : [];

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
    dispatch(addToCart(product.p_id, user.u_id, quantity));
  };

  const renderProduct = ({ item }) => (
    <View key={String(item.p_id)} style={styles.productCard}>
      <View style={styles.discountBadge}>
        {/* Assuming discount is not directly from API, using a static 25% for now */}
        <Text style={styles.discountText}>25%</Text>
        <Text style={styles.offText}>Off</Text>
      </View>
      <Image 
        source={{ uri: `https://fresh1kg.com/assets/images/products-images/${String(item.p_image)}` }} 
        style={styles.productImage} 
        resizeMode="contain" 
        onError={(e) => { /* */ }}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{String(item.p_name)}</Text>
        <Text style={styles.productWeight}>{String(item.p_weight)} {String(item.p_unit)}</Text>
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
    borderRadius: 5,
    zIndex: 1,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  offText: {
    fontSize: 10,
    color: '#333',
  },
  productImage: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'contain',
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
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  quantityButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default BestSellingScreen; 
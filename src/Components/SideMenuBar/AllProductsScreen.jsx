import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {searchProducts} from '../../redux/actions/productActions';
import {addToCart, fetchCart} from '../../redux/actions/cartActions';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductsScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {products: allProducts, loading, error} = useSelector(state => state.products);
  const user = useSelector(state => state.user.user);
  const {categoryId, title} = route.params || {};

  // Get products for the specific categoryId
  const products = categoryId ? allProducts[categoryId] : [];

  useEffect(() => {
    if (categoryId) {
      dispatch(searchProducts(categoryId));
    }
    if (user && user.u_id) {
      dispatch(fetchCart(user.u_id));
    }
  }, [categoryId, dispatch, user]);

  const handleAddToCart = (product) => {
    if (!user || !user.u_id) {
      return;
    }
    const quantity = 1;
    dispatch(addToCart(product.p_id, user.u_id, quantity));
  };

  const renderProductsGrid = () => {
    const productsToDisplay = categoryId 
      ? products || []
      : Object.values(allProducts).flat();

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7CB342" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {String(error)}</Text>
        </View>
      );
    }

    if (productsToDisplay.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={productsToDisplay}
        keyExtractor={(item) => String(item.p_id)}
        numColumns={2}
        renderItem={({item: product}) => (
          <View style={styles.productCard}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: `https://fresh1kg.com/assets/images/products-images/${String(product.p_image)}`,
                }}
                style={styles.productImage}
              />
              <View style={styles.checkIcon}>
                <Text style={styles.checkIconText}>✓</Text>
              </View>
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{String(product.p_name)}</Text>
              <View style={styles.priceRow}>
                {product.original_price && <Text style={styles.originalPrice}>₹{String(product.original_price)}</Text>}
                <Text style={styles.perKg}>₹{String(product.p_price)}</Text>
              </View>
              <Text style={styles.weight}>
                Weight - {String(product.p_weight)} {String(product.p_unit)}
              </Text>
              <View style={styles.actualPriceRow}>
                <Text style={styles.actualPriceLabel}>Price - </Text>
                <Text style={styles.actualPrice}>
                  ₹{String(product.p_price)}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(product)}
              >
                <Text style={styles.addToCartText}>Add To Cart</Text>
                <View style={styles.cartIconContainer}>
                  <Icon name="shopping-cart" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.productsGrid}
        columnWrapperStyle={styles.row}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={true}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={[styles.navbarWrapper, { marginTop: insets.top }]}>
      <Navbar navigation={navigation} />
        </View>

      {title && <Text style={[styles.title, {color: '#7CB342'}]}>{title}</Text>}

      {renderProductsGrid()}

      <Footer />
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
  navbarWrapper: {
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  productsGrid: {
    justifyContent: 'space-between',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '48%',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(124, 179, 66, 0.9)',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetails: {
    width: '100%',
    paddingHorizontal: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 15,
    color: '#7CB342',
    fontWeight: 'bold',
  },
  perKg: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  weight: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  actualPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actualPriceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  actualPrice: {
    fontSize: 14,
    color: '#e53e3e',
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#068A4F',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  cartIconContainer: {
    backgroundColor: '#04693a',
    borderRadius: 5,
    padding: 5,
  },
});

export default ProductsScreen;

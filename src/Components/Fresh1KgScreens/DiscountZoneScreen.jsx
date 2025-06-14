import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/cartActions';

const ProductsWithDiscounts = ({ navigation }) => {
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

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
    const quantity = getQuantity(product.id);
    dispatch(addToCart(product.id, user.u_id, quantity));
  };

  const products = [
    {
      id: 1,
      name: 'Nestle Cerelac Mixed Fruits & Wheat with Milk',
      size: '500g Pack',
      price: 36.00,
      originalPrice: 36.00,
      discount: 25,
      image: require('../../assets/images/three.jpg'),
    },
    {
      id: 2,
      name: 'Nestle Cerelac Mixed Fruits & Wheat with Milk',
      size: '500g Pack',
      price: 36.00,
      originalPrice: 36.00,
      discount: 25,
      image: require('../../assets/images/four.jpg'),
    },
    {
      id: 3,
      name: 'Nestle Cerelac Mixed Fruits & Wheat with Milk',
      size: '500g Pack',
      price: 36.00,
      originalPrice: 36.00,
      discount: 25,
      image: require('../../assets/images/five.jpg'),
    },
    {
      id: 4,
      name: 'Nestle Cerelac Mixed Fruits & Wheat with Milk',
      size: '500g Pack',
      price: 36.00,
      originalPrice: 36.00,
      discount: 25,
      image: require('../../assets/images/six.jpg'),
    },
  ];

  const PromoCard = ({ title, subtitle, price, backgroundImage, textColor = '#fff' }) => (
    <ImageBackground source={backgroundImage} style={styles.promoCard} imageStyle={styles.promoBackgroundImage}>
      <View style={styles.promoOverlay}>
        <Text style={[styles.promoTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.promoSubtitle, { color: textColor }]}>{subtitle}</Text>
        <Text style={[styles.promoOnly, { color: textColor }]}>Only</Text>
        <Text style={[styles.promoPrice, { color: textColor }]}>₹{price}</Text>
      </View>
    </ImageBackground>
  );

  const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{product.discount}%</Text>
        <Text style={styles.offText}>Off</Text>
      </View>
      <Image source={product.image} style={styles.productImage} resizeMode="contain" />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productSize}>{product.size}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>₹{product.originalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.quantityAndAdd}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(product.id, -1)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{getQuantity(product.id)}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(product.id, 1)}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products With Discounts</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.promoSection}>
          <PromoCard 
            title="Alpro Organic Flavored"
            subtitle="Fresh Juice"
            price="15.00"
            backgroundImage={require('../../assets/images/dis1.jpg')}
          />
          <PromoCard 
            title="Alpro Organic Flavored"
            subtitle="Fresh Juice"
            price="15.00"
            backgroundImage={require('../../assets/images/dis2.jpg')}
          />
        </View>
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop:-20,
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  promoSection: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 16,
  },
  promoCard: {
    borderRadius: 12,
    minHeight: 120,
    overflow: 'hidden',
  },
  promoBackgroundImage: {
    borderRadius: 12,
  },
  promoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },

  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  promoOnly: {
    fontSize: 12,
    marginBottom: 4,
  },
  promoPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productsGrid: {
    flexDirection: 'column',
    gap: 12,
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

export default ProductsWithDiscounts;
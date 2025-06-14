import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const TrendingProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Pastine Mellin Filid',
      weight: '500g Pack',
      price: '₹36.00',
      originalPrice: '₹48.00',
      discount: '25%',
      image: require('../../assets/images/P12.jpg'),
    },
    {
      id: 2,
      name: 'Di Grano Tenero',
      weight: '500g Pack',
      price: '₹36.00',
      originalPrice: '₹48.00',
      discount: '25%',
      image: require('../../assets/images/P1.jpg'),
    },
    {
      id: 3,
      name: 'Mellin Grano Tenero',
      weight: '500g Pack',
      price: '₹36.00',
      originalPrice: '₹48.00',
      discount: '25%',
      image: require('../../assets/images/P9.jpg'),
    },
    {
      id: 4,
      name: 'Grano Tenero',
      weight: '500g Pack',
      price: '₹36.00',
      originalPrice: '₹48.00',
      discount: '25%',
      image: require('../../assets/images/P13.jpg'),
    },
    {
      id: 5,
      name: 'Jack Froot',
      weight: '500g Pack',
      price: '₹36.00',
      originalPrice: '₹48.00',
      discount: '25%',
      image: require('../../assets/images/P12.jpg'),
    },
    {
      id: 6,
      name: 'Fresh Mango',
      weight: '500g Pack',
      price: '₹36.00',
      originalPrice: '₹48.00',
      discount: '25%',
      image: require('../../assets/images/P12.jpg'),
    },
    {
      id: 7,
      name: 'Fresh Juice',
      weight: '500g Pack',
      price: '₹36.00',
      originalPrice: '₹48.00',
      discount: '25%',
      image: require('../../assets/images/P12.jpg'),
    },
    {
      id: 8,
      name: 'Pastine Mellin',
      weight: '500g Pack',
      price: '₹36.00',
      originalPrice: '₹48.00',
      discount: '25%',
      image: require('../../assets/images/P12.jpg'),
    },
  ];

  const renderProductCard = ({ item: product }) => (
    <TouchableOpacity style={styles.productCard} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.productImage} />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{product.discount}</Text>
          <Text style={styles.offText}>Off</Text>
        </View>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productWeight}>{product.weight}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{product.price}</Text>
          <Text style={styles.originalPrice}>{product.originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Trending Products</Text>
      
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
     paddingBottom: 16,
  },
  separator: {
    width: 12,
  },
  productCard: {
    width: 160,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#f39c12',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 18,
  },
  productWeight: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  originalPrice: {
    fontSize: 12,
    color: '#95a5a6',
    textDecorationLine: 'line-through',
  },
});

export default TrendingProducts;
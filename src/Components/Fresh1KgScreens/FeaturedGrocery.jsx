import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const FeaturedGrocery = () => {
  const [quantities, setQuantities] = useState({});
  const scrollRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);

  const scrollAmount = 220; // width of item + marginRight

  const groceryItems = [
    {
      id: 1,
      name: 'Nestle Cerelac Mixed Fruits & Wheat with Milk',
      weight: '500g Pack',
      price: 36.0,
      originalPrice: 38.0,
      discount: '25%',
      image: require('../../assets/images/first.jpg'),
    },
    {
      id: 2,
      name: 'Peysan Full Fat Fresh Cottage Cheese',
      weight: '500g Pack',
      price: 36.0,
      originalPrice: 38.0,
      discount: '25%',
      image: require('../../assets/images/second.jpg'),
    },
    {
      id: 3,
      name: 'Aptamil Gold+ ProNutra Biotik Stage...',
      weight: '500g Pack',
      price: 36.0,
      originalPrice: 38.0,
      discount: '25%',
      image: require('../../assets/images/three.jpg'),
    },
    {
      id: 4,
      name: 'Abbott Pediasure Chocolate Refill Pack',
      weight: '500g Pack',
      price: 36.0,
      originalPrice: 38.0,
      discount: '25%',
      image: require('../../assets/images/four.jpg'),
    },
    {
      id: 5,
      name: 'Pastine Mellie  Filid Angelo 100% Di Grano Tenero',
      weight: '500g Pack',
      price: 36.0,
      originalPrice: 38.0,
      discount: '25%',
      image: require('../../assets/images/five.jpg'),
    },
    {
      id: 6,
      name: 'Aussie Bubs Goat Milk Infant Formula Stage 1,',
      weight: '500g Pack',
      price: 36.0,
      originalPrice: 38.0,
      discount: '25%',
      image: require('../../assets/images/six.jpg'),
    },
  ];

  const updateQuantity = (itemId, operation) => {
    setQuantities((prev) => {
      const currentQty = prev[itemId] || 1;
      const newQty = operation === 'increment' ? currentQty + 1 : Math.max(1, currentQty - 1);
      return { ...prev, [itemId]: newQty };
    });
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    console.log(`Added ${quantity} x ${item.name} to cart`);
    // Implement your add to cart logic here
  };

  const renderGroceryItem = (item) => (
    <View key={item.id} style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
          <Text style={styles.offText}>Off</Text>
        </View>
        <Image source={item.image} style={styles.productImage} resizeMode="contain" />
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productWeight}>{item.weight}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{item.price.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>₹{item.originalPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.actionContainer}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, 'decrement')}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantities[item.id] || 1}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, 'increment')}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
  style={styles.addButton} 
  onPress={() => addToCart(item)}
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

  const onScroll = (event) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  const handleScrollButton = (direction) => {
    if (scrollRef.current) {
      let newX = direction === 'right' ? scrollX + scrollAmount : scrollX - scrollAmount;
      newX = Math.max(0, newX);
      scrollRef.current.scrollTo({ x: newX, animated: true });
      setScrollX(newX);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Grocery</Text>
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.navButton} onPress={() => handleScrollButton('left')}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => handleScrollButton('right')}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {groceryItems.map(renderGroceryItem)}
      </ScrollView>
    </View>
  );
};

// Update these styles in your StyleSheet.create section:

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,     // Increased from 1 to 15
    paddingBottom: 25,       // Added extra bottom padding
    minHeight: 400,          // Added minimum height for proper spacing
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
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15,       // Added bottom padding to scroll container
  },
  itemContainer: {
    width: 210,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 20,
    marginBottom: 10,        // Added bottom margin to items
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 100,
    height: 100,
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
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
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
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4, // Add some spacing between text and icon
  },
});

export default FeaturedGrocery;
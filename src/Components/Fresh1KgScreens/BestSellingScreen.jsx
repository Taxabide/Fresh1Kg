import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GroceryStore = () => {
  // Sample product data with distinct categories
  const products = [
    // Frozen Foods - Frozen items that need refrigeration
    {
      name: 'McCain French Fries Golden Long',
      price: 125.00,
      originalPrice: 145.00,
      discount: '14% Off',
      image: require('../../assets/images/P1.jpg'),
      category: 'Frozen Foods',
      weight: '750g Pack'
    },
    {
      name: 'Amul Frozen Green Peas',
      price: 85.00,
      originalPrice: 95.00,
      discount: '11% Off',
      image: require('../../assets/images/P2.png'),
      category: 'Frozen Foods',
      weight: '500g Pack'
    },
    {
      name: 'Venky\'s Chicken Nuggets',
      price: 220.00,
      originalPrice: 250.00,
      discount: '12% Off',
      image: require('../../assets/images/P3.png'),
      category: 'Frozen Foods',
      weight: '400g Pack'
    },
    {
      name: 'Vadilal Ice Cream Tub Vanilla',
      price: 180.00,
      originalPrice: 200.00,
      discount: '10% Off',
      image: require('../../assets/images/P4.png'),
      category: 'Frozen Foods',
      weight: '1L Tub'
    },

    // Healthy Foods - Natural, organic, nutritious foods
    {
      name: 'Nestle Cerelac Mixed Fruits & Wheat',
      price: 245.00,
      originalPrice: 280.00,
      discount: '12% Off',
      image: require('../../assets/images/P5.png'),
      category: 'Healthy Foods',
      weight: '300g Pack'
    },
    {
      name: 'Organic Quinoa Seeds',
      price: 320.00,
      originalPrice: 380.00,
      discount: '16% Off',
      image: require('../../assets/images/P6.png'),
      category: 'Healthy Foods',
      weight: '500g Pack'
    },
    {
      name: 'Fresh Organic Spinach',
      price: 45.00,
      originalPrice: 55.00,
      discount: '18% Off',
      image: require('../../assets/images/P7.png'),
      category: 'Healthy Foods',
      weight: '250g Bundle'
    },
    {
      name: 'Patanjali Honey Pure',
      price: 165.00,
      originalPrice: 185.00,
      discount: '11% Off',
      image: require('../../assets/images/P8.png'),
      category: 'Healthy Foods',
      weight: '500g Bottle'
    },

    // Diet Foods - Low calorie, weight management foods
    {
      name: 'Kellogg\'s Special K Original',
      price: 285.00,
      originalPrice: 320.00,
      discount: '11% Off',
      image: require('../../assets/images/P9.jpg'),
      category: 'Diet Foods',
      weight: '340g Box'
    },
    {
      name: 'Quaker Oats Steel Cut',
      price: 140.00,
      originalPrice: 165.00,
      discount: '15% Off',
      image: require('../../assets/images/P10.png'),
      category: 'Diet Foods',
      weight: '500g Container'
    },
    {
      name: 'Yoga Bar Dark Chocolate Protein',
      price: 95.00,
      originalPrice: 110.00,
      discount: '14% Off',
      image: require('../../assets/images/P3.png'),
      category: 'Diet Foods',
      weight: '38g Bar'
    },
    {
      name: 'Tropicana Essentials Probiotics',
      price: 75.00,
      originalPrice: 85.00,
      discount: '12% Off',
      image: require('../../assets/images/P9.jpg'),
      category: 'Diet Foods',
      weight: '200ml Bottle'
    },

    // Vitamin Items - Supplements and vitamin-rich products
    {
      name: 'Centrum Multivitamin Tablets',
      price: 650.00,
      originalPrice: 750.00,
      discount: '13% Off',
      image: require('../../assets/images/P10.png'),
      category: 'Vitamin Items',
      weight: '30 Tablets'
    },
    {
      name: 'Revital H Women Multivitamin',
      price: 420.00,
      originalPrice: 480.00,
      discount: '12% Off',
      image: require('../../assets/images/P3.png'),
      category: 'Vitamin Items',
      weight: '30 Capsules'
    },
    {
      name: 'Carbamide Forte Vitamin D3',
      price: 385.00,
      originalPrice: 450.00,
      discount: '14% Off',
      image: require('../../assets/images/P10.png'),
      category: 'Vitamin Items',
      weight: '60 Tablets'
    },
    {
      name: 'HealthKart Omega 3 Fish Oil',
      price: 550.00,
      originalPrice: 625.00,
      discount: '12% Off',
      image: require('../../assets/images/P10.png'),
      category: 'Vitamin Items',
      weight: '60 Capsules'
    }
  ];

  // State hooks - defined once at the top level
  const categories = ['Frozen Foods', 'Diet Foods', 'Healthy Foods', 'Vitamin Items'];
  const [selectedCategory, setSelectedCategory] = useState('Healthy Foods');
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  // Filtered products based on selected category
  const filteredProducts = products.filter(product => product.category === selectedCategory);

  // Helper functions
  const getQuantity = (productName) => {
    return quantities[productName] || 1;
  };

  const incrementQuantity = (productName) => {
    setQuantities(prev => ({
      ...prev,
      [productName]: (prev[productName] || 1) + 1
    }));
  };

  const decrementQuantity = (productName) => {
    setQuantities(prev => ({
      ...prev,
      [productName]: Math.max(1, (prev[productName] || 1) - 1)
    }));
  };

  const addToCart = (product) => {
    const quantity = getQuantity(product.name);
    const existingItemIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      setCart(prev => 
        prev.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Add new item to cart
      setCart(prev => [...prev, { ...product, quantity }]);
    }
    
    // Reset quantity to 1 after adding to cart
    setQuantities(prev => ({
      ...prev,
      [product.name]: 1
    }));
  };

  const renderProduct = ({ item, index }) => (
    <View style={styles.productCard}>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productWeight}>{item.weight}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{item.price.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>₹{item.originalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => decrementQuantity(item.name)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{getQuantity(item.name)}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => incrementQuantity(item.name)}
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

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.selectedCategoryButtonText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weekly Best Selling Groceries</Text>
        </View>

        {/* Category Buttons */}
        <View style={styles.categoryContainer}>
          {categories.map((category) => renderCategoryButton(category))}
        </View>

        {/* Products Horizontal List */}
        <FlatList
          key="horizontal-flatlist"
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        />
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
  
  // Fixed Category Container Styles - 2 buttons per row
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Space between for 2 items per row
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '48%',          // 48% width for 2 buttons per row with space
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: '#7CB342',
    borderColor: '#7CB342',
  },
  categoryButtonText: {
    fontSize: 12, // Reduced font size
    color: '#666',
    fontWeight: '500',
    textAlign: 'center', // Added text alignment
  },
  selectedCategoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Product Styles
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
  
  // Additional helpful styles for category sections
  sectionContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  
  // Responsive category layout for different screen sizes
  categoryContainerWide: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryButtonWide: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GroceryStore;
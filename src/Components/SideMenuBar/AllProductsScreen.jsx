import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const ProductsScreen = ({ route }) => {
  // Get category from navigation parameter with proper fallback
  const { category } = route.params || { category: 'vegetables' };
  
  console.log('Current category:', category); // Debug log

  // All data in one place
  const allData = {
    vegetables: {
      title: 'Fresh Vegetables',
      color: '#4CAF50',
      products: [
        { id: '1', name: 'Tomato', price: '₹40/kg', image: require('../../assets/images/vege.jpg') },
        { id: '2', name: 'Onion', price: '₹30/kg', image: require('../../assets/images/onion.jpg') },
        { id: '3', name: 'Cauliflower', price: '₹25/kg', image: require('../../assets/images/cauli.jpg') }, // Using same image for now
        { id: '4', name: 'Carrot', price: '₹35/kg', image: require('../../assets/images/carrot.jpg') },
      ]
    },
    fruits: {
      title: 'Fresh Fruits',
      color: '#FF9800',
      products: [
        { id: '1', name: 'Apple', price: '₹120/kg', image: require('../../assets/images/apple.jpg') },
        { id: '2', name: 'Watermelon', price: '₹60/kg', image: require('../../assets/images/watermelon.jpg') },
        { id: '3', name: 'Orange', price: '₹80/kg', image: require('../../assets/images/orange.jpg') },
        { id: '4', name: 'Mango', price: '₹150/kg', image: require('../../assets/images/fruit1.jpg') },
      ]
    },
    dryfruits: {
      title: 'Premium Dry Fruits',
      color: '#8BC34A',
      products: [
        { id: '1', name: 'Almonds', price: '₹949/kg', image: require('../../assets/images/almond.jpg') },
        { id: '2', name: 'Cashews', price: '₹950/kg', image: require('../../assets/images/dryfruit.jpg') },
        { id: '3', name: 'Rasins', price: '₹385/kg', image: require('../../assets/images/rasins.jpg') },
        { id: '4', name: 'Walnuts', price: '₹850/kg', image: require('../../assets/images/walnut.jpg') },
      
      ]
    },
    about: {
      title: 'About Fresh1kg',
      color: '#2196F3',
      content: `Welcome to Fresh1kg - your trusted partner for fresh and organic groceries.

We deliver farm-fresh vegetables, fruits, and premium dry fruits right to your doorstep.

Our mission is to provide the highest quality produce at affordable prices, ensuring your family gets the best nutrition every day.

Why Choose Us:
- 100% Fresh & Organic
- Direct from Farm
- Quality Guaranteed  
- Fast Delivery
- Affordable Prices

Contact us for bulk orders and special discounts!`
    },
    contact: {
      title: 'Contact Us',
      color: '#9C27B0',
      contactInfo: {
        phone: '02345691971',
        email: 'info@example.com',
        address: 'Fresh1kg Store, Green Valley, City',
        timing: 'Mon-Sun: 6:00 AM - 10:00 PM'
      }
    }
  };

  // Handle category name variations and convert display names to keys
  let normalizedCategory = category;
  
  // Map display names to data keys
  const categoryMapping = {
    'Dry Fruits': 'dryfruits',
    'dry-fruits': 'dryfruits',
    'Vegetables': 'vegetables',
    'Fruits': 'fruits',
    'About': 'about',
    'Contact': 'contact'
  };
  
  // Check if category needs mapping
  if (categoryMapping[category]) {
    normalizedCategory = categoryMapping[category];
  } else {
    // Convert to lowercase for consistency
    normalizedCategory = category.toLowerCase();
  }
  
  // Get current data based on category with better error handling
  const currentData = allData[normalizedCategory];
  
  if (!currentData) {
    console.warn(`Category "${category}" not found, defaulting to vegetables`);
    return (
      <View style={styles.container}>
        <Navbar/>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found: {category}</Text>
          <Text style={styles.errorSubText}>Available categories: vegetables, fruits, dry-fruits/dryfruits, about, contact</Text>
        </View>
        <Footer/>
      </View>
    );
  }

  // Render products in a single column layout for ScrollView
  const renderProductsGrid = () => {
    const products = currentData.products || [];
    
    if (products.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products available</Text>
        </View>
      );
    }
    
    return products.map((product) => (
      <View key={product.id} style={styles.productCard}>
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.productImage} />
          <View style={styles.checkIcon}>
            <Text style={styles.checkIconText}>✓</Text>
          </View>
        </View>
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>{product.price}</Text>
            <Text style={styles.perKg}>per kg</Text>
          </View>
          <Text style={styles.weight}>Weight - 1 kg</Text>
          <View style={styles.actualPriceRow}>
            <Text style={styles.actualPriceLabel}>Actual Price - </Text>
            <Text style={styles.actualPrice}>{product.price}</Text>
          </View>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Add To Cart</Text>
            <View style={styles.cartIconContainer}>
              <Icon name="shopping-cart" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  // Render About content
  const renderAbout = () => (
    <View style={styles.aboutContainer}>
      <Text style={styles.aboutText}>{currentData.content}</Text>
    </View>
  );

  // Render Contact content
//   const renderContact = () => (
//     <View style={styles.contactContainer}>
//       <View style={styles.contactCard}>
//         <Text style={styles.contactLabel}>📞 Phone:</Text>
//         <Text style={styles.contactValue}>{currentData.contactInfo.phone}</Text>
//       </View>
      
//       <View style={styles.contactCard}>
//         <Text style={styles.contactLabel}>📧 Email:</Text>
//         <Text style={styles.contactValue}>{currentData.contactInfo.email}</Text>
//       </View>
      
//       <View style={styles.contactCard}>
//         <Text style={styles.contactLabel}>📍 Address:</Text>
//         <Text style={styles.contactValue}>{currentData.contactInfo.address}</Text>
//       </View>
      
//       <View style={styles.contactCard}>
//         <Text style={styles.contactLabel}>🕒 Timing:</Text>
//         <Text style={styles.contactValue}>{currentData.contactInfo.timing}</Text>
//       </View>
//     </View>
//   );

  return (
    <View style={styles.container}>
      <Navbar/>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Debug info - remove this in production */}
        {/* <Text style={styles.debugText}>Current Category: {category}</Text> */}
        
        <Text style={[styles.title, { color: currentData.color }]}>{currentData.title}</Text>
        
        {/* Show products for vegetables, fruits, dryfruits */}
        {(normalizedCategory === 'vegetables' || normalizedCategory === 'fruits' || normalizedCategory === 'dryfruits') && (
          <View style={styles.productsContainer}>
            {renderProductsGrid()}
          </View>
        )}
        
        {/* Show about content */}
        {normalizedCategory === 'about' && renderAbout()}
        
        {/* Show contact content */}
        {normalizedCategory === 'contact' && renderContact()}
        <Footer/>
        
      </ScrollView>
      
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollViewContent: {
    paddingVertical: 15,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
  },
  productsContainer: {
    flex: 1,
  },
  productCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#28a745',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetails: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 6,
  },
  perKg: {
    fontSize: 14,
    color: '#666',
  },
  weight: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actualPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  actualPriceLabel: {
    fontSize: 14,
    color: '#666',
  },
  actualPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  addToCartText: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  cartIconContainer: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // About styles
  aboutContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
  },
  // Contact styles
  contactContainer: {
    flex: 1,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  contactValue: {
    fontSize: 16,
    color: '#666',
    flex: 2,
  },
});

export default ProductsScreen;
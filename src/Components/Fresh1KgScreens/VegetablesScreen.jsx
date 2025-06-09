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

const { width: screenWidth } = Dimensions.get('window');

const CategoryScroll = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollViewRef = useRef(null);

  const originalCategories = [
    {
      id: 1,
      title: 'Root\nVegetables',
      image: require('../../assets/images/root.png'),
    },
    {
      id: 2,
      title: 'Seasonal\nFruits',
      image: require('../../assets/images/seasonal.png'),
    },
    {
      id: 3,
      title: 'Organic\nFruits',
      image: require('../../assets/images/organic.png'),
    },
    {
      id: 4,
      title: 'Fruit\nBaskets',
      image: require('../../assets/images/fruit.png'),
    },
    {
      id: 5,
      title: 'Snacking\nDry\nFruits,Seeds',
      image: require('../../assets/images/dry.png'),
    },
    {
      id: 6,
      title: 'Dry Fruits\n& Berries',
      image: require('../../assets/images/berries.png'),
    },
    {
      id: 7,
      title: 'Organic\nDry Fruits',
      image: require('../../assets/images/organic-dry.png'),
    },
    {
      id: 8,
      title: 'Organic\nVegetables',
      image: require('../../assets/images/OrgaVeg.png'),
    },
    {
      id: 9,
      title: 'Leafy\nVegetables',
      image: require('../../assets/images/leaf.png'),
    },
    {
      id: 10,
      title: 'Gourd,\nPumpkin,\nDrumstick',
      image: require('../../assets/images/pumpkin.png'),
    },
  ];

  // Create infinite scroll by duplicating items
  const categories = [
    ...originalCategories.map(item => ({ ...item, id: `end-${item.id}` })), // Last items at beginning
    ...originalCategories, // Original items
    ...originalCategories.map(item => ({ ...item, id: `start-${item.id}` })), // First items at end
  ];

  const itemWidth = 92; // item width + margins (80 + 12)
  const totalOriginalWidth = originalCategories.length * itemWidth;

  const handleCategoryPress = (categoryId) => {
    // Extract original ID if it's a duplicated item
    const originalId = categoryId.toString().includes('-') ? 
      parseInt(categoryId.toString().split('-')[1]) : categoryId;
    setSelectedCategory(originalId);
    console.log('Selected category:', originalId);
  };

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const scrollX = contentOffset.x;
    
    // If scrolled past the original items to the right (into the duplicated start items)
    if (scrollX >= totalOriginalWidth * 2) {
      scrollViewRef.current?.scrollTo({ x: totalOriginalWidth, animated: false });
    }
    // If scrolled past the original items to the left (into the duplicated end items)
    else if (scrollX <= 0) {
      scrollViewRef.current?.scrollTo({ x: totalOriginalWidth, animated: false });
    }
  };

  const handleScrollEnd = () => {
    // Start from the middle section after component mounts
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: totalOriginalWidth, animated: false });
    }, 100);
  };

  const renderCategoryItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.categoryItem,
        (selectedCategory === parseInt(item.id.toString().split('-')[1] || item.id)) && styles.selectedCategoryItem,
      ]}
      onPress={() => handleCategoryPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.categoryImage} 
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error)}
          onLoad={() => console.log('Image loaded successfully')}
        />
      </View>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={itemWidth}
        snapToAlignment="start"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleScrollEnd}
      >
        {categories.map(renderCategoryItem)}
      </ScrollView>
    </View>
  );
};

// Update these styles in your StyleSheet.create section:

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15, // Increased from 7 to 15
    paddingBottom: 20,   // Added extra bottom padding
    backgroundColor: '#f8f9fa',
    minHeight: 140,      // Added minimum height to ensure enough space
    marginTop:-10
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,   // Added bottom padding to scroll container
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 8,     // Added bottom margin to items
    width: 80,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedCategoryItem: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#f8fff8',
  },
  imageContainer: {
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 11,
    textAlign: 'center',
    color: '#333',
    lineHeight: 14,
    fontWeight: '500',
  },
});

export default CategoryScroll;
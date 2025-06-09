import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

const { width } = Dimensions.get('window');

const GroceryDealsScrollView = () => {
  const [currentSlide, setCurrentSlide] = useState(2); // Start from middle to allow seamless loop
  const scrollViewRef = useRef(null);

  // Initialize scroll position
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: 2 * (width - 32), // Start from the middle set
        animated: false,
      });
    }, 100);
  }, []);

  const dealsData = [
    {
      id: 1,
      title: 'Up to 30% off on your first ₹150 purchase',
      subtitle: "Don't miss our amazing grocery deals",
      buttonText: 'Shop Now',
      backgroundImage: require('../../assets/images/01.webp'),
      backgroundColor: '#068A4F',
    },
    {
      id: 2,
      title: 'Up to 30% off on your first ₹150 purchase',
      subtitle: "Don't miss our amazing grocery deals",
      buttonText: 'Order Now',
      backgroundImage: require('../../assets/images/08.webp'),
      backgroundColor: '#068A4F',
    },
  ];

  // Create extended data for infinite scrolling
  const extendedData = [...dealsData, ...dealsData, ...dealsData];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prevSlide => {
        const nextSlide = prevSlide + 1;
        
        // Scroll to the next slide
        scrollViewRef.current?.scrollTo({
          x: nextSlide * (width - 32),
          animated: true,
        });
        
        return nextSlide;
      });
    }, 3000); // 3 seconds for faster scrolling

    return () => clearInterval(slideInterval);
  }, []);

  // Reset position when reaching the end to create infinite loop
  useEffect(() => {
    if (currentSlide >= dealsData.length * 2) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: dealsData.length * (width - 32),
          animated: false,
        });
        setCurrentSlide(dealsData.length);
      }, 100);
    }
  }, [currentSlide]);

  const handleCardPress = (item) => {
    console.log('Card pressed:', item.title);
    // Handle navigation or action here
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
    if (slideIndex >= 0 && slideIndex < extendedData.length) {
      setCurrentSlide(slideIndex);
    }
  };

  const renderDealCard = (item, index) => (
    <View key={`${item.id}-${index}`} style={styles.cardContainer}>
      <ImageBackground
        source={item.backgroundImage}
        style={styles.cardBackground}
        imageStyle={styles.backgroundImage}
        resizeMode="stretch" // This will show full image by stretching to fit container
        defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' }}
      >
        <View style={styles.overlay} />
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.offerText}>{item.title}</Text>
            <Text style={styles.descriptionText}>{item.subtitle}</Text>
            <TouchableOpacity
              style={[styles.shopButton, { backgroundColor: item.backgroundColor }]}
              onPress={() => handleCardPress(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={width - 32} // Adjusted for margins
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={false} // Disable manual scrolling for auto-scroll only
      >
        {extendedData.map(renderDealCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: -10,
  },
  scrollContent: {
    paddingVertical: 30,
  },
  cardContainer: {
    width: width - 32, // Reduced by total horizontal padding (16 * 2)
    height: 210, // Reduced height to better match typical image ratios
    borderRadius: 12,
    marginTop: -25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginHorizontal: 0,
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  backgroundImage: {
    borderRadius: 12,
    // Remove width and height constraints to fill container
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Further reduced opacity to show more of the image
    borderRadius: 12,
  },
  cardContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFE884',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'sans-serif',
  },
  descriptionText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 20,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GroceryDealsScrollView;
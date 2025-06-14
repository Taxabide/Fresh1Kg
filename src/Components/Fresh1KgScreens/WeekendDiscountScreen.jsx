import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const WeekendDiscountScreen = () => {
  const products = [
    {
      id: 1,
      title: 'Drink Fresh Corn Juice',
      subtitle: 'Good Taste',
      backgroundImage: require('../../assets/images/P1.jpg'),
      gradientColors: ['rgba(245, 243, 184, 0.1)', 'rgba(245, 243, 184, 0.3)'],
    },
    {
      id: 2,
      title: 'Organic Lemon Flavored',
      subtitle: 'Banana Chips',
      backgroundImage: require('../../assets/images/P12.jpg'),
      gradientColors: ['rgba(212, 230, 212, 0.1)', 'rgba(212, 230, 212, 0.3)'],
    },
    {
      id: 3,
      title: 'Nozes Pecanera Brasil',
      subtitle: 'Chocolate Snacks',
      backgroundImage: require('../../assets/images/P9.jpg'),
      gradientColors: ['rgba(230, 212, 196, 0.1)', 'rgba(230, 212, 196, 0.3)'],
    },
    {
      id: 4,
      title: 'Strawberry Water Drinks',
      subtitle: 'Flavors Awesome',
      backgroundImage: require('../../assets/images/P13.jpg'),
      gradientColors: ['rgba(230, 196, 230, 0.1)', 'rgba(230, 196, 230, 0.3)'],
    },
  ];

  const handleShopNow = (productId) => {
    // 
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cardsContainer}>
        {products.map((product) => (
          <View key={product.id} style={styles.card}>
            <ImageBackground
              source={product.backgroundImage}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              {/* Very light gradient overlay to ensure text readability */}
              <LinearGradient
                colors={product.gradientColors}
                style={styles.lightOverlay}
              >
                <View style={styles.cardContent}>
                  {/* Weekend Discount Badge */}
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>Weekend Discount</Text>
                  </View>

                  {/* Content positioned at bottom left */}
                  <View style={styles.bottomContent}>
                    {/* Product Title */}
                    <Text style={styles.productTitle}>{product.title}</Text>
                    
                    {/* Product Subtitle */}
                    <Text style={styles.productSubtitle}>{product.subtitle}</Text>

                    {/* Shop Now Button */}
                    <TouchableOpacity
                      style={styles.shopButton}
                      onPress={() => handleShopNow(product.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.plusIcon}>+</Text>
                      <Text style={styles.shopButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  cardsContainer: {
    paddingBottom: 20,
  },
  card: {
    height: 280,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  lightOverlay: {
    flex: 1,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  discountBadge: {
    backgroundColor: '#8BC34A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  discountText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomContent: {
    alignSelf: 'flex-start',
     marginBottom: 95,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
    lineHeight: 24,
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  productSubtitle: {
    fontSize: 16,
    color: '#8BC34A',
    fontWeight: '600',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent', 
    paddingHorizontal: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
  },
  plusIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    backgroundColor: '#8BC34A',  // Add this,
    width: 22,
    height: 22,
    textAlign: 'center',
    lineHeight: 22,
    borderRadius: 11,
  },
  shopButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default WeekendDiscountScreen;
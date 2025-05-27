import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Navbar = () => {
  const handleCartPress = () => {
    // Add cart functionality here
    console.log('Cart pressed');
  };

  const handleSearchPress = () => {
    // Add search functionality here
    console.log('Search pressed');
  };

  const handleMenuPress = () => {
    // Add menu functionality here
    console.log('Menu pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.navbar}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('./assets/fresh1kg.png')} // Replace with your logo path
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Right Icons Section */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleCartPress}
            activeOpacity={0.7}
          >
            <Icon name="shopping-cart" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleSearchPress}
            activeOpacity={0.7}
          >
            <Icon name="search" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <Icon name="menu" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: 40,
    width: 120, // Adjust width based on your logo dimensions
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
  },
});

export default Navbar;
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Modal,
  Animated,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  PixelRatio,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CartMenu from './CartMenu.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { searchProducts } from '../../redux/actions/productActions';
import { fetchWishlist } from '../../redux/actions/wishlistActions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fetchCart } from '../../redux/actions/cartActions';

// Get screen dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Scale factors based on design width (assuming 375 is base width)
const scale = SCREEN_WIDTH / 375;
const verticalScale = SCREEN_HEIGHT / 812; // assuming 812 is base height (iPhone X)

// Normalize sizing based on scale factor
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Screen size breakpoints
const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 360,
  isMedium: SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 400,
  isLarge: SCREEN_WIDTH >= 400 && SCREEN_WIDTH < 600,
  isTablet: SCREEN_WIDTH >= 600,
  scale: scale,
  verticalScale: verticalScale
};

// Dynamic navbar height based on screen size
const NAVBAR_HEIGHT = Platform.select({
  ios: normalize(44),
  android: normalize(56),
  default: normalize(50)
});

// Dynamic icon sizes
const ICON_SIZE = {
  small: normalize(20),
  medium: normalize(24),
  large: normalize(28)
};

const Navbar = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN.width * 0.8));
  const [searchQuery, setSearchQuery] = useState('');

  // Get user login status and cart items from Redux store
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const userId = useSelector(state => state.user.user ? state.user.user.u_id : null);
  const wishlistItems = useSelector(state => state.wishlistData.items);
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    if (isLoggedIn && userId) {
      dispatch(fetchCart(userId));
    }
  }, [isLoggedIn, userId, dispatch]);

  // Get dynamic dimensions for responsive design
  const screenData = Dimensions.get('window');
  const isSmallScreen = screenData.width < 375;
  const isTablet = screenData.width >= 768;

  const handleCartPress = () => {
    if (!isLoggedIn || !userId) {
      Alert.alert('Login Required', 'Please log in to view your cart.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    navigation?.navigate('CartMenu');
  };

  const handleWishlistPress = () => {
    if (!isLoggedIn || !userId) {
      Alert.alert('Login Required', 'Please log in to view your wishlist.', [
        { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
      ]);
      return;
    }
    dispatch(fetchWishlist(userId));
    navigation?.navigate('WishlistScreen');
  };

  const handleSearchPress = () => {
    setIsSearchVisible(true);
  };

  const closeSearchModal = () => {
    setIsSearchVisible(false);
    setSearchQuery('');
  };

  const handleMenuPress = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN.width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuVisible(false);
    });
  };

const handleMenuItemPress = (item) => {
  if (navigation) {
    switch(item) {
      case 'Home':
        navigation.navigate('HomeScreen');
        break;
      case 'My Orders':
        if (!isLoggedIn || !userId) {
          Alert.alert('Login Required', 'Please log in to view your orders.', [
            { text: 'OK', onPress: () => navigation.navigate('SignInScreen') },
          ]);
          return;
        }
        navigation.navigate('MyOrdersScreen');
        break;
      case 'About':
        navigation.navigate('ProductsScreen', { 
          category: 'about',
          title: 'About Us' 
        });
        break;
        
        
      case 'Vegetables':
        navigation.navigate('ProductsScreen', {
          categoryId: 2,
          title: 'Vegetables',
          categoryName: 'Vegetables',
          subcategory: 'all'
        });
        break;
      case 'Fruits':
        navigation.navigate('ProductsScreen', {
          categoryId: 1,
          title: 'Fruits',
          categoryName: 'Fruits',
          subcategory: 'all'
        });
        break;
      case 'Dry Fruits':
        navigation.navigate('ProductsScreen', {
          categoryId: 3,
          title: 'Dry Fruits',
          categoryName: 'Dry Fruits',
          subcategory: 'all'
        });
        break;
      case 'Contact Us':
        navigation.navigate('ContactScreen');
        break;
      case 'Wishlist':
        navigation.navigate('WishlistScreen');
        break;
      default:
        Alert.alert(
          'Notice',
          `${item} feature is not available yet.`,
          [{ text: 'OK' }]
        );
        break;
    }
  }
  
  closeMenu();
};

  const handleSearch = () => {
    if (searchQuery.trim() && navigation) {
      dispatch(searchProducts(searchQuery));
      navigation.navigate('SearchResultsScreen', { query: searchQuery });
    }
    
    closeSearchModal();
  };

  const renderMenuContent = () => {
    return (
      <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Home')}
        >
          <Text style={styles.menuItemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('My Orders')}
        >
          <Text style={styles.menuItemText}>My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('About')}
        >
          <Text style={styles.menuItemText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Vegetables')}
        >
          <Text style={styles.menuItemText}>Vegetables</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Fruits')}
        >
          <Text style={styles.menuItemText}>Fruits</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Dry Fruits')}
        >
          <Text style={styles.menuItemText}>Dry Fruits</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Contact Us')}
        >
          <Text style={styles.menuItemText}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuItemPress('Wishlist')}
        >
          <Text style={styles.menuItemText}>Wishlist</Text>
        </TouchableOpacity>

        <View style={[styles.bottomSection, { marginTop: 10 }]}>
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <MaterialIcons name="headset-mic" size={16} color="#7CB342" />
              <Text style={[
                styles.contactText,
                { fontSize: isSmallScreen ? 12 : 14 }
              ]}>
                02345697871
              </Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialIcons name="email" size={16} color="#7CB342" />
              <Text style={[
                styles.contactText,
                { fontSize: isSmallScreen ? 12 : 14 }
              ]}>
                info@example.com
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Right Icons Section */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate('ProfileScreen');
              } else {
                navigation.navigate('SignInScreen');
              }
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="person"
              size={24}
              color={isLoggedIn ? "#7CB342" : "#333"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleCartPress}
            activeOpacity={0.7}
          >
            <View>
              <MaterialIcons
                name="shopping-cart-checkout"
                size={24}
                color="#000"
              />
              {cartItems && cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSearchPress}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="search"
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="menu"
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Modal */}
      <Modal
        transparent={true}
        visible={isSearchVisible}
        animationType="fade"
        onRequestClose={closeSearchModal}
      >
        <View style={styles.searchModalOverlay}>
          <View style={styles.searchModalContent}>
            <TouchableOpacity 
              style={styles.searchCloseButton}
              onPress={closeSearchModal}
            >
              <MaterialIcons name="close" size={24} color="#629D23" />
            </TouchableOpacity>

            <View style={styles.searchInputSection}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchModalInput}
                  placeholder="Search for products,categories"
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity 
                  style={styles.searchSubmitButton}
                  onPress={handleSearch}
                >
                  <MaterialIcons name="search" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sidebar Menu Modal */}
      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            onPress={closeMenu}
            activeOpacity={1}
          />
          
          <Animated.View 
            style={[
              styles.sidebar,
              {
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeMenu}
            >
              <View style={styles.closeButtonContainer}>
                <MaterialIcons name="close" size={24} color="#ffffff" />
              </View>
            </TouchableOpacity>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity 
                style={styles.searchIconContainer}
                onPress={handleSearch}
              >
                <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
              {renderMenuContent()}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    height: NAVBAR_HEIGHT,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: SCREEN.isTablet ? '20%' : '25%',
  },
  logo: {
    width: SCREEN.isSmall 
      ? normalize(70) 
      : SCREEN.isTablet 
      ? normalize(100) 
      : normalize(85),
    height: SCREEN.isSmall 
      ? normalize(35) 
      : SCREEN.isTablet 
      ? normalize(50) 
      : normalize(42.5),
    resizeMode: 'contain',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    gap: normalize(SCREEN.isSmall ? 8 : 12),
  },
  iconButton: {
    padding: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? normalize(60) : normalize(40),
  },
  searchModalContent: {
    backgroundColor: '#ffffff',
    margin: normalize(20),
    borderRadius: normalize(8),
    padding: normalize(20),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: normalize(4),
      },
      android: {
        elevation: 5,
      },
    }),
  },
  searchCloseButton: {
    position: 'absolute',
    top: normalize(12),
    right: normalize(12),
    padding: normalize(4),
    zIndex: 1,
  },
  searchInputSection: {
    marginTop: normalize(30),
    marginBottom: normalize(20),
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: normalize(4),
    backgroundColor: '#f9f9f9',
  },
  searchModalInput: {
    flex: 1,
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    fontSize: normalize(SCREEN.isSmall ? 14 : 16),
    color: '#333',
  },
  searchSubmitButton: {
    backgroundColor: '#7CB342',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    borderTopRightRadius: normalize(4),
    borderBottomRightRadius: normalize(4),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sidebar: {
    width: SCREEN.isTablet ? SCREEN.width * 0.4 : SCREEN.width * 0.8,
    height: '100%',
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? normalize(50) : normalize(30),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: normalize(4),
      },
      android: {
        elevation: 10,
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? normalize(50) : normalize(30),
    left: normalize(22),
    zIndex: 1,
  },
  closeButtonContainer: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(4),
    backgroundColor: '#7CB342',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginHorizontal: normalize(20),
    marginTop: normalize(60),
    marginBottom: normalize(20),
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: normalize(4),
    paddingHorizontal: normalize(16),
    paddingRight: normalize(40),
    paddingVertical: normalize(12),
    fontSize: normalize(16),
    color: '#333',
    backgroundColor: '#ffffff',
  },
  searchIconContainer: {
    position: 'absolute',
    right: normalize(12),
    top: normalize(12),
  },
  searchIcon: {
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: normalize(20),
  },
  menuContent: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: normalize(SCREEN.isSmall ? 14 : 16),
    color: '#666',
  },
  bottomSection: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(24),
    paddingTop: normalize(16),
  },
  contactInfo: {
    backgroundColor: '#f8f8f8',
    padding: normalize(16),
    borderRadius: normalize(8),
    marginBottom: normalize(16),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  contactText: {
    marginLeft: normalize(8),
    color: '#333',
    fontSize: normalize(SCREEN.isSmall ? 12 : 14),
  },
  cartBadge: {
    position: 'absolute',
    top: normalize(-4),
    right: normalize(-4),
    backgroundColor: '#ff6f00',
    borderRadius: normalize(8),
    minWidth: normalize(16),
    height: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(4),
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: normalize(10),
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: normalize(20),
    marginBottom: normalize(20),
    borderRadius: normalize(4),
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#7CB342',
  },
  tabText: {
    fontSize: normalize(SCREEN.isSmall ? 14 : 16),
    fontWeight: 'bold',
    color: '#333',
  },
  activeTabText: {
    color: '#ffffff',
  },
});

export default Navbar;
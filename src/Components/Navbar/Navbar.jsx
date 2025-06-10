import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CartMenu from '../Navbar/CartMenu';
import { useSelector } from 'react-redux';


const { width, height } = Dimensions.get('window');

const Navbar = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width * 0.8));
  const [activeTab, setActiveTab] = useState('Menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Get user login status from Redux store
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  // Get dynamic dimensions for responsive design
  const screenData = Dimensions.get('window');
  const isSmallScreen = screenData.width < 375;
  const isTablet = screenData.width >= 768;

  const handleCartPress = () => {
    console.log('Cart pressed');
    navigation?.navigate('CartMenu');
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
      toValue: width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuVisible(false);
    });
  };

const handleMenuItemPress = (item) => {
  console.log(`${item} pressed`);
  
  if (navigation) {
    switch(item) {
      case 'Home':
        navigation.navigate('HomeScreen');  // ✅ Fixed: Home → HomeScreen
        break;
      case 'About':
        navigation.navigate('ProductsScreen', { 
          category: 'about',
          title: 'About Us' 
        });
        break;
      case 'Vegetables':
        navigation.navigate('ProductsScreen', { 
          category: 'vegetables',
          title: 'Vegetables',
          subcategory: 'all'
        });
        break;
      case 'Fruits':
        navigation.navigate('ProductsScreen', { 
          category: 'fruits',
          title: 'Fruits',
          subcategory: 'all'
        });
        break;
      case 'Dry Fruits':
        navigation.navigate('ProductsScreen', { 
          category: 'dry-fruits',
          title: 'Dry Fruits',
          subcategory: 'all'
        });
        break;
      case 'Contact Us':
        navigation.navigate('ContactScreen');  // ✅ Fixed: Contact → ContactScreen
        break;
      default:
        console.log(`No navigation defined for ${item}`);
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

  const handleCategoryPress = (categoryName, subcategory = null) => {
    console.log(`Category pressed: ${categoryName}${subcategory ? ` - ${subcategory}` : ''}`);
    
    if (navigation) {
      switch(categoryName) {
        case 'Breakfast & Dairy':
          navigation.navigate('BreakfastDairy', { subcategory });
          break;
        case 'Meats & Seafood':
          navigation.navigate('MeatsSeafood', { subcategory });
          break;
        case 'Breads & Bakery':
          navigation.navigate('BreadsBakery');
          break;
        case 'Chips & Snacks':
          navigation.navigate('ChipsSnacks', { subcategory });
          break;
        case 'Medical Healthcare':
          navigation.navigate('MedicalHealthcare');
          break;
        case 'Biscuits & Snacks':
          navigation.navigate('BiscuitsSnacks', { subcategory });
          break;
        case 'Frozen Foods':
          navigation.navigate('FrozenFoods');
          break;
        case 'Grocery & Staples':
          navigation.navigate('GroceryStaples');
          break;
        case 'Other Items':
          navigation.navigate('OtherItems');
          break;
        default:
          console.log(`No navigation defined for category: ${categoryName}`);
          Alert.alert(
            'Notice',
            `${categoryName} category is not available yet.`,
            [{ text: 'OK' }]
          );
          break;
      }
    }
    
    closeMenu();
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    
    if (navigation && searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery });
    }
    
    closeSearchModal();
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const categoryItems = [
    { 
      id: 1, 
      name: 'Breakfast & Dairy', 
      icon: 'local-cafe', 
      hasSubmenu: true,
      subcategories: ['Breakfast', 'Dinner', 'Pumpkin']
    },
    { 
      id: 2, 
      name: 'Meats & Seafood', 
      icon: 'restaurant', 
      hasSubmenu: true,
      subcategories: ['Fresh Meat', 'Seafood', 'Frozen Items']
    },
    { 
      id: 3, 
      name: 'Breads & Bakery', 
      icon: 'bakery-dining', 
      hasSubmenu: false,
      subcategories: []
    },
    { 
      id: 4, 
      name: 'Chips & Snacks', 
      icon: 'cookie', 
      hasSubmenu: true,
      subcategories: ['Chips', 'Cookies', 'Nuts', 'Crackers']
    },
    { 
      id: 5, 
      name: 'Medical Healthcare', 
      icon: 'medical-services', 
      hasSubmenu: false,
      subcategories: []
    },
    { 
      id: 6, 
      name: 'Biscuits & Snacks', 
      icon: 'cookie', 
      hasSubmenu: true,
      subcategories: ['Biscuits', 'Wafers', 'Health Snacks']
    },
    { 
      id: 7, 
      name: 'Frozen Foods', 
      icon: 'ac-unit', 
      hasSubmenu: false,
      subcategories: []
    },
    { 
      id: 8, 
      name: 'Grocery & Staples', 
      icon: 'shopping-basket', 
      hasSubmenu: false,
      subcategories: []
    },
    { 
      id: 9, 
      name: 'Other Items', 
      icon: 'more-horiz', 
      hasSubmenu: false,
      subcategories: []
    },
  ];

  const renderMenuContent = () => {
    if (activeTab === 'Menu') {
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
        </ScrollView>
      );
    } else {
      return (
        <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
          {categoryItems.map((category) => (
            <View key={category.id}>
              <TouchableOpacity 
                style={[
                  styles.categoryItem,
                  expandedCategories[category.id] && styles.expandedCategoryItem
                ]}
                onPress={() => {
                  if (category.hasSubmenu) {
                    toggleCategory(category.id);
                  } else {
                    handleCategoryPress(category.name);
                  }
                }}
              >
                <View style={styles.categoryLeft}>
                  <MaterialIcons 
                    name={category.icon} 
                    size={isSmallScreen ? 20 : 24} 
                    color="#666" 
                    style={styles.categoryIcon}
                  />
                  <Text style={[
                    styles.categoryItemText,
                    { fontSize: isSmallScreen ? 16 : 18 }
                  ]}>
                    {category.name}
                  </Text>
                </View>
                {category.hasSubmenu && (
                  <TouchableOpacity
                    style={styles.expandButton}
                    onPress={() => toggleCategory(category.id)}
                  >
                    <MaterialIcons 
                      name={expandedCategories[category.id] ? "remove" : "add"} 
                      size={isSmallScreen ? 20 : 24} 
                      color="#7CB342" 
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {category.hasSubmenu && expandedCategories[category.id] && (
                <View style={styles.subcategoriesContainer}>
                  {category.subcategories.map((subcategory, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.subcategoryItem}
                      onPress={() => handleCategoryPress(category.name, subcategory)}
                    >
                      <MaterialIcons 
                        name="chevron-right" 
                        size={16} 
                        color="#999" 
                        style={styles.subcategoryIcon}
                      />
                      <Text style={[
                        styles.subcategoryText,
                        { fontSize: isSmallScreen ? 14 : 16 }
                      ]}>
                        {subcategory}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      );
    }
  };

  return (
    <>
      {/* StatusBar - positioned at the very top */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      {/* Main Navbar Container - positioned right after status bar */}
      <SafeAreaView style={styles.safeArea}>
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
                <MaterialIcons 
                  name="shopping-cart" 
                  size={isSmallScreen ? 22 : isTablet ? 32 : 28} 
                  color="#333" 
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handleSearchPress}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name="search" 
                  size={isSmallScreen ? 22 : isTablet ? 32 : 28} 
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
                  size={isSmallScreen ? 22 : isTablet ? 32 : 28} 
                  color="#333" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

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
              />
              <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  activeTab === 'Menu' && styles.activeTab
                ]}
                onPress={() => setActiveTab('Menu')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'Menu' && styles.activeTabText,
                  { fontSize: isSmallScreen ? 14 : 16 }
                ]}>
                  Menu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.tabButton, 
                  activeTab === 'Category' && styles.activeTab
                ]}
                onPress={() => setActiveTab('Category')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'Category' && styles.activeTabText,
                  { fontSize: isSmallScreen ? 14 : 16 }
                ]}>
                  Category
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
              {renderMenuContent()}
            </View>

            <View style={styles.bottomSection}>
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
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Fixed SafeAreaView for proper positioning
  safeArea: {
    backgroundColor: '#ffffff',
  },
  // Clean navbar container - no extra padding
  navbarContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
navbar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: width < 375 ? 16 : 22, // 14→16, 18→22
  paddingVertical: width < 375 ? 12 : 15,   // 10→12, 12→15
  backgroundColor: '#ffffff',
  height: width < 375 ? 70 : width >= 768 ? 80 : 75, // 60→70, 65→75, 70→80
},
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
logo: {
  width: width < 375 ? 80 : width >= 768 ? 120 : 100,   // 80→100→120
  height: width < 375 ? 64 : width >= 768 ? 96 : 80,    // 64→80→96
},
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
  padding: width < 375 ? 10 : 12,                    // 8→10, 10→12
  marginLeft: width < 375 ? 10 : 12,                 // 6→10, 8→12
  borderRadius: 20,
  backgroundColor: 'rgba(0,0,0,0.05)',
  minWidth: width < 375 ? 44 : 48,                   // 40→44, 44→48
  minHeight: width < 375 ? 44 : 48,                  // 40→44, 44→48
  justifyContent: 'center',
  alignItems: 'center',
},
  overlayTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // Search Modal Styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  searchModalContent: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  searchInputSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  searchModalInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  searchSubmitButton: {
    backgroundColor: '#7CB342',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sidebar: {
    width: width >= 768 ? width * 0.4 : width * 0.8,
    height: height,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 22,
    zIndex: 1,
  },
  closeButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: '#7CB342',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingRight: 40,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#ffffff',
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#7CB342',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeTabText: {
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#666',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryItemText: {
    color: '#333',
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  contactInfo: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    color: '#333',
  },
  expandedCategoryItem: {
    backgroundColor: '#f0f8e8',
  },
  expandButton: {
    padding: 4,
  },
  subcategoriesContainer: {
    backgroundColor: '#f8f9fa',
    paddingLeft: 20,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subcategoryIcon: {
    marginRight: 12,
  },
  subcategoryText: {
    color: '#666',
    flex: 1,
  },
});

export default Navbar;
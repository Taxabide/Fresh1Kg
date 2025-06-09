import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const UserMenu = () => {
  const navigation = useNavigation();
  
  // ============= USER ICON RELATED STATES =============
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  // ============= NAVIGATION HANDLERS =============
  const handleNavigateToProfile = () => {
    setIsUserMenuVisible(false);
    navigation.navigate('Profile', { userData });
  };

  const handleNavigateToEditProfile = () => {
    setIsUserMenuVisible(false);
    navigation.navigate('EditProfile', { userData });
  };

  const handleNavigateToOrders = () => {
    setIsUserMenuVisible(false);
    navigation.navigate('MyOrdersScreen', { userData });
  };

  // const handleNavigateToWishlist = () => {
  //   setIsUserMenuVisible(false);
  //   navigation.navigate('Wishlist', { userData });
  // };

  const handleNavigateToAddresses = () => {
    setIsUserMenuVisible(false);
    navigation.navigate('Addresses', { userData });
  };

  // ============= USER ICON RELATED HANDLERS =============
  const handleUserPress = () => {
    if (isLoggedIn) {
      setIsUserMenuVisible(true);
    } else {
      setIsLoginVisible(true);
    }
  };

  const closeUserMenu = () => {
    setIsUserMenuVisible(false);
  };

  const handleLogin = () => {
    // Validate login form
    if (!loginEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    if (!loginPassword.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // If validation passes
    console.log('Login with:', { email: loginEmail, password: loginPassword });
    
    // Set user data and login state BEFORE showing alert
    setUserData({
      name: 'Gaurav AppDev',
      email: loginEmail,
      phone: '+1234567890',
    });
    setIsLoggedIn(true);
    
    // Show success message
    Alert.alert(
      'Success!', 
      'Login successful! Welcome back.',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsLoginVisible(false);
            setLoginEmail('');
            setLoginPassword('');
          }
        }
      ]
    );
  };

  const handleSignUp = () => {
    // Validate signup form
    if (!signupName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!signupEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    if (!signupPassword.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    if (!signupPhone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // Basic password validation
    if (signupPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(signupPhone.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    // If validation passes
    console.log('Sign up with:', { 
      name: signupName, 
      email: signupEmail, 
      password: signupPassword, 
      phone: signupPhone 
    });
    
    // Set user data and login state BEFORE showing alert
    setUserData({
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
    });
    setIsLoggedIn(true);
    
    // Show success message
    Alert.alert(
      'Success!', 
      'Account created successfully! Welcome to Fresh1Kg.',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsSignUpVisible(false);
            setSignupName('');
            setSignupEmail('');
            setSignupPassword('');
            setSignupPhone('');
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            setIsLoggedIn(false);
            setUserData(null);
            setIsUserMenuVisible(false);
            Alert.alert('Success', 'Logged out successfully!');
          },
        },
      ]
    );
  };

  const switchToSignUp = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(true);
  };

  const switchToLogin = () => {
    setIsSignUpVisible(false);
    setIsLoginVisible(true);
  };

  const closeLoginModal = () => {
    setIsLoginVisible(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  const closeSignUpModal = () => {
    setIsSignUpVisible(false);
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupPhone('');
  };

  return (
    <View>
      {/* ============= USER ICON JSX ============= */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={handleUserPress}
        activeOpacity={0.7}
      >
        <MaterialIcons 
          name={isLoggedIn ? "account-circle" : "person"} 
          size={24} 
          color={isLoggedIn ? "#7CB342" : "#333"} 
        />
      </TouchableOpacity>

      {/* ============= USER MODALS JSX ============= */}
      {/* Login Modal */}
      <Modal
        transparent={true}
        visible={isLoginVisible}
        animationType="fade"
        onRequestClose={closeLoginModal}
      >
        <View style={styles.authModalOverlay}>
          <View style={styles.authModalContent}>
            {/* Logo */}
            <View style={styles.authLogoContainer}>
              <Image 
                source={require('../../assets/images/logo.png')}
                style={styles.authLogo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.authTitle}>Login Into Your Account</Text>

            {/* Email Input */}
            <View style={styles.authInputContainer}>
              <Text style={styles.authLabel}>Email*</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Your Email"
                placeholderTextColor="#999"
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.authInputContainer}>
              <Text style={styles.authLabel}>Password*</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Your Password"
                placeholderTextColor="#999"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry={true}
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
              style={styles.authSubmitButton}
              onPress={handleLogin}
            >
              <Text style={styles.authSubmitText}>Sign In Account</Text>
            </TouchableOpacity>

            {/* Switch to Sign Up */}
            <View style={styles.authSwitchContainer}>
              <Text style={styles.authSwitchText}>Don't have an account? </Text>
              <TouchableOpacity onPress={switchToSignUp}>
                <Text style={styles.authSwitchLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sign Up Modal */}
      <Modal
        transparent={true}
        visible={isSignUpVisible}
        animationType="fade"
        onRequestClose={closeSignUpModal}
      >
        <View style={styles.authModalOverlay}>
          <View style={styles.authModalContent}>
            {/* Logo */}
            <View style={styles.authLogoContainer}>
              <Image 
                source={require('../../assets/images/logo.png')}
                style={styles.authLogo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.authTitle}>Sign Up Into Your Account</Text>

            {/* Name Input */}
            <View style={styles.authInputContainer}>
              <Text style={styles.authLabel}>Name*</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Your Name"
                placeholderTextColor="#999"
                value={signupName}
                onChangeText={setSignupName}
              />
            </View>

            {/* Email Input */}
            <View style={styles.authInputContainer}>
              <Text style={styles.authLabel}>Email*</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Your Email"
                placeholderTextColor="#999"
                value={signupEmail}
                onChangeText={setSignupEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.authInputContainer}>
              <Text style={styles.authLabel}>Password*</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Your Password"
                placeholderTextColor="#999"
                value={signupPassword}
                onChangeText={setSignupPassword}
                secureTextEntry={true}
              />
            </View>

            {/* Phone Number Input */}
            <View style={styles.authInputContainer}>
              <Text style={styles.authLabel}>Phone Number*</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Your Phone Number"
                placeholderTextColor="#999"
                value={signupPhone}
                onChangeText={setSignupPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={styles.authSubmitButton}
              onPress={handleSignUp}
            >
              <Text style={styles.authSubmitText}>Sign Up Account</Text>
            </TouchableOpacity>

            {/* Switch to Sign In */}
            <View style={styles.authSwitchContainer}>
              <Text style={styles.authSwitchText}>Already have an account? </Text>
              <TouchableOpacity onPress={switchToLogin}>
                <Text style={styles.authSwitchLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* User Menu Modal */}
      <Modal
        transparent={true}
        visible={isUserMenuVisible}
        animationType="fade"
        onRequestClose={closeUserMenu}
      >
        <View style={styles.userMenuOverlay}>
          <View style={styles.userMenuContent}>
            {/* Close button */}
            <TouchableOpacity 
              style={styles.userMenuCloseButton}
              onPress={closeUserMenu}
            >
              <MaterialIcons name="close" size={24} color="#629D23" />
            </TouchableOpacity>

            {/* User Profile Section */}
            <View style={styles.userProfileSection}>
              <View style={styles.userAvatarContainer}>
                <MaterialIcons name="account-circle" size={80} color="#7CB342" />
              </View>
              
              <Text style={styles.userName}>{userData?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{userData?.email || 'user@example.com'}</Text>
            </View>

            {/* User Info */}
            <View style={styles.userInfoSection}>
              <View style={styles.userInfoItem}>
                <MaterialIcons name="email" size={20} color="#666" />
                <Text style={styles.userInfoText}>{userData?.email}</Text>
              </View>
              
              <View style={styles.userInfoItem}>
                <MaterialIcons name="phone" size={20} color="#666" />
                <Text style={styles.userInfoText}>{userData?.phone}</Text>
              </View>
            </View>

            {/* Menu Options - Updated with navigation */}
            <View style={styles.userMenuOptions}>
              <TouchableOpacity 
                style={styles.userMenuOption}
                onPress={handleNavigateToEditProfile}
              >
                <MaterialIcons name="person" size={20} color="#666" />
                <Text style={styles.userMenuOptionText}>Edit Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.userMenuOption}
                onPress={handleNavigateToOrders}
              >
                <MaterialIcons name="shopping-bag" size={20} color="#666" />
                <Text style={styles.userMenuOptionText}>My Orders</Text>
              </TouchableOpacity>
              
              {/* <TouchableOpacity 
                style={styles.userMenuOption}
                onPress={handleNavigateToWishlist}
              >
                <MaterialIcons name="favorite" size={20} color="#666" />
                <Text style={styles.userMenuOptionText}>Wishlist</Text>
              </TouchableOpacity> */}
              
              <TouchableOpacity 
                style={styles.userMenuOption}
                onPress={handleNavigateToAddresses}
              >
                <MaterialIcons name="location-on" size={20} color="#666" />
                <Text style={styles.userMenuOptionText}>Addresses</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ============= STYLES WITH ENHANCED SHADOWS =============
const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
  },
  // Authentication Modal Styles with Enhanced Shadow
  authModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)', // Darker overlay like search modal
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  authModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    // Enhanced shadow effects from Navbar
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4, // Increased from 2
        },
        shadowOpacity: 0.3, // Increased from 0.25
        shadowRadius: 5, // Increased from 3.84
      },
      android: {
        elevation: 8, // Increased from 5
      },
    }),
  },
  authLogoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  authLogo: {
    width: 60,
    height: 60,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  authInputContainer: {
    marginBottom: 20,
  },
  authLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  authInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  authSubmitButton: {
    backgroundColor: '#7CB342',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  authSubmitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authSwitchText: {
    fontSize: 14,
    color: '#666',
  },
  authSwitchLink: {
    fontSize: 14,
    color: '#7CB342',
    fontWeight: 'bold',
  },
  // User Menu Modal with Enhanced Shadow (like sidebar)
  userMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Keep consistent with sidebar
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userMenuContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    // Enhanced shadow effects matching sidebar
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4, // Enhanced shadow
        },
        shadowOpacity: 0.3, // Stronger shadow
        shadowRadius: 6, // Larger blur radius
      },
      android: {
        elevation: 10, // Strong elevation like sidebar
      },
    }),
  },
  userMenuCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  userProfileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  userAvatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userInfoSection: {
    marginBottom: 30,
  },
  userInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  userMenuOptions: {
    marginBottom: 30,
  },
  userMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userMenuOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default UserMenu;
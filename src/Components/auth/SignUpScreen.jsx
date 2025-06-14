import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../redux/actions/userActions.jsx'; // Corrected path and extension

const SignUpScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, isLoggedIn, loading, error } = useSelector(state => state.user);

  // Signup form states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  // Effect to handle signup success/error
  useEffect(() => {
    if (isLoggedIn) {
      Alert.alert(
        'Success!',
        'Account created successfully! Please sign in with your new account.',
        [{
          text: 'OK',
          onPress: () => {
            navigation.navigate('SignInScreen');
          }
        }]
      );
    }
    if (error && !loading) {
      Alert.alert('Signup Error', error);
    }
  }, [isLoggedIn, error, loading, navigation]);

  const handleSignUp = () => {
    // Basic validation
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim() || !signupPhone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (signupPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(signupPhone.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    const userData = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      number: signupPhone,
      role: 0, // Default role for user
    };

    dispatch(signupUser(userData));
  };

  return (
    <View style={styles.authContainer}>
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
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.authSubmitText}>Sign Up Account</Text>
          )}
        </TouchableOpacity>

        {/* Switch to Sign In */}
        <View style={styles.authSwitchContainer}>
          <Text style={styles.authSwitchText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}> 
            <Text style={styles.authSwitchLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Light background for the screen
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
    // Enhanced shadow effects
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
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
});

export default SignUpScreen;
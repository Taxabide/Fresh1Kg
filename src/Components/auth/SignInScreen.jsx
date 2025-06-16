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
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actions/userActions.jsx';

const SignInScreen = () => {
  const navigation = useNavigation(); 
  const dispatch = useDispatch();

  const { user, isLoggedIn, loading, error } = useSelector(state => state.user);
console.log('>>>>>>>>>>>>>>>>>>user',user,isLoggedIn)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Keep track of whether a login attempt was made from this screen
  const [loginAttempted, setLoginAttempted] = useState(false);

  useEffect(() => {
    // Only show login success alert and navigate if a login was attempted from this screen
    if (isLoggedIn && loginAttempted) {
      Alert.alert('Success!', 'Logged in successfully! Welcome back.');
      if (user && Number(user.u_role) === 1) {
        navigation.navigate('AdminScreen'); // Navigate to AdminScreen for admin role
      } else {
        navigation.navigate('HomeScreen'); // Navigate to HomeScreen for other roles
      }// Navigate to HomeScreen on successful login
      setLoginAttempted(false); // Reset after successful login
    }
    if (error && !loading) {
      Alert.alert('Login Error', error);
    }
  }, [isLoggedIn, error, loading, navigation, loginAttempted]);

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoginAttempted(true); // Mark that a login attempt is being made
    dispatch(loginUser({ email, password }));
  };

  return (
    <View style={styles.container}>
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
            value={email}
            onChangeText={setEmail}
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
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity 
          style={styles.authSubmitButton}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.authSubmitText}>Sign In Account</Text>
          )}
        </TouchableOpacity>

        {/* Link to Sign Up */}
        <View style={styles.authSwitchContainer}>
          <Text style={styles.authSwitchText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.authSwitchLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // A light background for the whole screen
        paddingHorizontal: 20,
    },
    authModalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 30,
        width: '100%',
        maxWidth: 400,
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

export default SignInScreen; 
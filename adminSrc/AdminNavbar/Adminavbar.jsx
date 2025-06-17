import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../src/redux/actions/userActions';


const { width } = Dimensions.get('window');

const Adminnavbar = ({ 
  title = "Welcome Admin!", 
  onMenuPress, 
  showProfileDropdown = true 
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  const handleLogout = () => {
    setProfileDropdownVisible(false);
    dispatch(logoutUser());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignInScreen' }],
      })
    );
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const handleAdminProfileScreen = () => {
    setProfileDropdownVisible(false);
    navigation.navigate('AdminProfileScreen');
  };

  // Profile Dropdown Component
  const ProfileDropdown = () => (
    <View style={styles.profileDropdown}>
      <View style={styles.profileInfo}>
        <Image 
          source={require('../../src/assets/images/adminlogo.png')}
          style={styles.profileDropdownImage}
          resizeMode="cover"
        />
        <Text style={styles.profileName}>Admin</Text>
      </View>
      <View style={styles.dropdownDivider} />
      <TouchableOpacity style={styles.dropdownItem} onPress={handleAdminProfileScreen}>
        <MaterialIcons name="account-circle" size={20} color="#666" />
        <Text style={styles.dropdownText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color="#E53935" />
        <Text style={[styles.dropdownText, { color: '#E53935' }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.hamburgerButton} 
          onPress={onMenuPress}
        >
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        {showProfileDropdown && (
          <View style={styles.profileSection}>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={toggleProfileDropdown}
            >
              <Image 
                source={require('../../src/assets/images/adminlogo.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Profile Dropdown - Fixed positioning */}
      {profileDropdownVisible && showProfileDropdown && (
        <>
          <TouchableOpacity 
            style={styles.dropdownOverlay} 
            activeOpacity={1} 
            onPress={() => setProfileDropdownVisible(false)}
          />
          <View style={styles.profileDropdownContainer}>
            <ProfileDropdown />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 10,
  },
  hamburgerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    position: 'relative',
  },
  profileButton: {
    padding: 5,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: '#7CB342',
  },
  // Profile Dropdown Styles
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1998,
  },
  profileDropdownContainer: {
    position: 'absolute',
    top: 70,
    right: 20,
    zIndex: 1999,
    elevation: 1999,
  },
  profileDropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileDropdownImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default Adminnavbar;
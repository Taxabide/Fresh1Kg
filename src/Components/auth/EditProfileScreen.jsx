import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { editUserProfile, clearEditProfileStatus } from '../../redux/actions/profileActions';

const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { editProfileLoading, editProfileError, editProfileSuccess } = useSelector(state => state.user);

  // Prioritize user data from navigation params, fallback to Redux state
  const initialUserData = route.params?.userData || user;

  // Initialize form data with current user data or empty strings
  const [formData, setFormData] = useState({
    u_name: initialUserData?.u_name || initialUserData?.name || '',
    u_email: initialUserData?.u_email || initialUserData?.email || '',
    u_number: initialUserData?.u_number || initialUserData?.phone || '',
    u_pincode: initialUserData?.u_pincode || '',
    u_address: initialUserData?.u_address || '',
    // u_profile_photo: initialUserData?.u_profile_photo || '', // Handle file input separately if needed
  });

  useEffect(() => {
    if (editProfileSuccess) {
      Alert.alert('Success', 'Profile updated successfully!');
      dispatch(clearEditProfileStatus());
      navigation.goBack();
    } else if (editProfileError) {
      Alert.alert('Error', editProfileError);
      dispatch(clearEditProfileStatus());
    }
  }, [editProfileSuccess, editProfileError, dispatch, navigation]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // In a real app, you might want to validate form data here
    if (!formData.u_name || !formData.u_email || !formData.u_number) {
      Alert.alert('Validation Error', 'Name, email, and phone number are required.');
      return;
    }
    dispatch(editUserProfile(formData));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.u_name}
            onChangeText={(text) => handleChange('u_name', text)}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            keyboardType="email-address"
            value={formData.u_email}
            onChangeText={(text) => handleChange('u_email', text)}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={formData.u_number}
            onChangeText={(text) => handleChange('u_number', text)}
          />

          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your pincode"
            keyboardType="number-pad"
            value={formData.u_pincode}
            onChangeText={(text) => handleChange('u_pincode', text)}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter your address"
            multiline
            numberOfLines={4}
            value={formData.u_address}
            onChangeText={(text) => handleChange('u_address', text)}
          />

          {/* Profile Photo - more complex, would need file picker logic */}
          {/* <Text style={styles.label}>Profile Photo</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <MaterialIcons name="cloud-upload" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={editProfileLoading}
          >
            {editProfileLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 5 },
    }),
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formScrollView: {
    flex: 1,
    width: '100%',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 3 },
    }),
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#7CB342',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default EditProfileScreen; 
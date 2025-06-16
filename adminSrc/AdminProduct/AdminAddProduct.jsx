import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Adminnavbar from '../AdminNavbar/Adminavbar';
import AdminSidebar from '../AdminNavbar/AdminSidebar';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    productPrice: '',
    productRate: '',
    productImage: null,
    productUnit: '',
    productWeight: '',
    productUnique: '',
    productDescription: '',
    productImageName: '',
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRateDropdown, setShowRateDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const [showUniqueDropdown, setShowUniqueDropdown] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const categories = [
    'Fruits',
    'Vegeables',
    'Dry-fruits',
    
  ];

  // FIXED: Pricing method - how customer pays
  const rates = [
    'per kg',
    'per piece', 
    'per packet',
  ];

  // FIXED: Base measurement units - ONLY measurement types
  const units = [
    'gm',
    'ml',
    'Packet',
    'Piece',
  ];

  // FIXED: Specific package sizes with units - NO overlap
  const weights = [
    '50gm',
    '100gm', 
    '250gm',
    '500gm',
    '1kg',
    '2kg',
    '5kg',
    '100ml',
    '250ml',
    '500ml',
    '1liter',
    '1piece',
    '5pieces',
    '10pieces',
    '1packet',
    '1box',
  ];

  const uniqueOptions = [
    'yes',
    'no',
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDropdownSelect = (field, value, setShowDropdown) => {
    handleInputChange(field, value);
    closeAllDropdowns();
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
        Alert.alert('Error', 'Failed to pick image: ' + response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setFormData(prev => ({
          ...prev,
          productImage: selectedImage.uri,
          productImageName: selectedImage.fileName || 'Image Selected'
        }));
      }
    });
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      productImage: null,
      productImageName: ''
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.productName.trim()) {
      Alert.alert('Error', 'Please enter product name');
      return;
    }
    if (!formData.productCategory) {
      Alert.alert('Error', 'Please select product category');
      return;
    }
    if (!formData.productPrice.trim()) {
      Alert.alert('Error', 'Please enter product price');
      return;
    }
    if (!formData.productRate) {
      Alert.alert('Error', 'Please select pricing rate');
      return;
    }
    if (!formData.productUnit) {
      Alert.alert('Error', 'Please select product unit');
      return;
    }


    Alert.alert('Success', 'Product added successfully!');
    
    // Reset form
    setFormData({
      productName: '',
      productCategory: '',
      productPrice: '',
      productRate: '',
      productImage: null,
      productUnit: '',
      productWeight: '',
      productUnique: '',
      productDescription: '',
      productImageName: '',
    });
  };

  const closeAllDropdowns = () => {
    setShowCategoryDropdown(false);
    setShowRateDropdown(false);
    setShowUnitDropdown(false);
    setShowWeightDropdown(false);
    setShowUniqueDropdown(false);
  };

  const renderDropdown = (options, selectedValue, placeholder, onSelect, isVisible, setVisible) => (
    <View style={[styles.dropdownContainer, isVisible && styles.dropdownContainerActive]}>
      <TouchableOpacity
        style={[styles.dropdownButton, isVisible && styles.dropdownButtonActive]}
        onPress={() => {
          closeAllDropdowns();
          setVisible(!isVisible);
        }}
      >
        <Text style={[styles.dropdownButtonText, !selectedValue && styles.placeholderText]}>
          {selectedValue || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>{isVisible ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      
      {isVisible && (
        <View style={styles.dropdownList}>
          <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  selectedValue === option && styles.dropdownItemSelected
                ]}
                onPress={() => onSelect(option)}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedValue === option && styles.dropdownItemTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Admin Navbar - Fixed at top */}
        <View style={styles.navbarContainer}>
          <Adminnavbar onMenuPress={() => setSidebarVisible(true)} />
        </View>
        <AdminSidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          activeTab={'addProduct'}
          onMenuSelect={() => setSidebarVisible(false)}
        />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          <ScrollView style={styles.fullScreenScroll} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add Product</Text>
            </View>

            <ScrollView 
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.form}>
                {/* Product Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.productName}
                    onChangeText={(value) => handleInputChange('productName', value)}
                    placeholder="Enter product name"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Product Category */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Category</Text>
                  {renderDropdown(
                    categories,
                    formData.productCategory,
                    '-- Select Category --',
                    (value) => handleDropdownSelect('productCategory', value, setShowCategoryDropdown),
                    showCategoryDropdown,
                    setShowCategoryDropdown
                  )}
                </View>

                {/* Product Price */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Price</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.productPrice}
                    onChangeText={(value) => handleInputChange('productPrice', value)}
                    placeholder="Enter price (e.g., 100)"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>

                {/* Product Per Rate - Pricing Method */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Per Rate (Pricing Method)</Text>
                  {renderDropdown(
                    rates,
                    formData.productRate,
                    '-- Select Rate --',
                    (value) => handleDropdownSelect('productRate', value, setShowRateDropdown),
                    showRateDropdown,
                    setShowRateDropdown
                  )}
                </View>

                {/* Product Image */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Image</Text>
                  <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
                    <Text style={styles.imagePickerText}>
                      {formData.productImage ? 'Change Image' : 'Choose file'}
                    </Text>
                    <Text style={styles.imagePickerSubtext}>
                      {formData.productImageName || 'No file chosen'}
                    </Text>
                  </TouchableOpacity>
                  {formData.productImage && (
                    <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                      <Text style={styles.removeImageButtonText}>Remove Image</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Product Unit - Measurement Unit */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Unit (Measurement Unit)</Text>
                  {renderDropdown(
                    units,
                    formData.productUnit,
                    '-- Select Unit --',
                    (value) => handleDropdownSelect('productUnit', value, setShowUnitDropdown),
                    showUnitDropdown,
                    setShowUnitDropdown
                  )}
                </View>

                {/* Product Per Weight - Package Quantity */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Per Weight (Package Quantity)</Text>
                  {renderDropdown(
                    weights,
                    formData.productWeight,
                    '-- Select Weight --',
                    (value) => handleDropdownSelect('productWeight', value, setShowWeightDropdown),
                    showWeightDropdown,
                    setShowWeightDropdown
                  )}
                </View>

                {/* Product Unique */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Unique (yes/no)</Text>
                  {renderDropdown(
                    uniqueOptions,
                    formData.productUnique,
                    '-- Select Option --',
                    (value) => handleDropdownSelect('productUnique', value, setShowUniqueDropdown),
                    showUniqueDropdown,
                    setShowUniqueDropdown
                  )}
                </View>

                {/* Product Description */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={formData.productDescription}
                    onChangeText={(value) => handleInputChange('productDescription', value)}
                    placeholder="Enter product description"
                    placeholderTextColor="#999"
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  navbarContainer: {
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 70, // Adjust this based on your navbar height
  },
  fullScreenScroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop:10
  },
  scrollContainer: {
    flex: 1,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 5,
  },
  dropdownContainerActive: {
    paddingBottom: 160, // Accommodate the 150px max-height of the dropdown list plus some buffer
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonActive: {
    borderColor: '#4CAF50',
    zIndex: 1000,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dropdownScrollView: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemSelected: {
    backgroundColor: '#e8f5e8',
  },
  dropdownItemTextSelected: {
    color: '#28a745',
    fontWeight: '600',
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 16,
    color: '#007bff',
    marginRight: 12,
  },
  imagePickerSubtext: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  removeImageButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeImageButtonText: {
    fontSize: 16,
    color: '#28a745',
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default AddProduct;
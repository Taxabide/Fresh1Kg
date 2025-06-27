import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Alert,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const { width, height } = Dimensions.get('window');

const MultiStepForm = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_subject: '',
    contact_message: '',
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 3;

  // Reset form after successful submission
  useEffect(() => {
    if (success) {
      setFormData({
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        contact_subject: '',
        contact_message: '',
      });
      setCurrentStep(1);
      setErrors({});
    }
  }, [success]);

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.contact_name.trim()) {
          newErrors.contact_name = 'Name is required';
        }
        if (!formData.contact_email.trim()) {
          newErrors.contact_email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.contact_email.trim())) {
          newErrors.contact_email = 'Email is invalid';
        }
        break;
      case 2:
        if (!formData.contact_phone.trim()) {
          newErrors.contact_phone = 'Phone number is required';
        } else if (!/^\d{10,}$/.test(formData.contact_phone.replace(/\D/g, ''))) {
          newErrors.contact_phone = 'Phone number must be at least 10 digits';
        }
        if (!formData.contact_subject.trim()) {
          newErrors.contact_subject = 'Subject is required';
        }
        break;
      case 3:
        if (!formData.contact_message.trim()) {
          newErrors.contact_message = 'Message is required';
        } else if (formData.contact_message.trim().length < 10) {
          newErrors.contact_message = 'Message must be at least 10 characters long';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    const allErrors = {};
    
    if (!formData.contact_name.trim()) allErrors.contact_name = 'Name is required';
    if (!formData.contact_email.trim()) {
      allErrors.contact_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email.trim())) {
      allErrors.contact_email = 'Email is invalid';
    }
    if (!formData.contact_phone.trim()) {
      allErrors.contact_phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.contact_phone.replace(/\D/g, ''))) {
      allErrors.contact_phone = 'Phone number must be at least 10 digits';
    }
    if (!formData.contact_subject.trim()) allErrors.contact_subject = 'Subject is required';
    if (!formData.contact_message.trim()) {
      allErrors.contact_message = 'Message is required';
    } else if (formData.contact_message.trim().length < 10) {
      allErrors.contact_message = 'Message must be at least 10 characters long';
    }
    
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateAllFields()) {
      // Prepare form data with trimmed values
      const preparedFormData = {
        contact_name: formData.contact_name.trim(),
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.replace(/\D/g, ''), // Remove non-digits
        contact_subject: formData.contact_subject.trim(),
        contact_message: formData.contact_message.trim(),
      };

      // Additional validation before submission
      const isValid = Object.values(preparedFormData).every(value => value && value.length > 0);
      
      if (!isValid) {
        Alert.alert(
          'Validation Error',
          'Please fill in all required fields.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('Submitting prepared form data:', preparedFormData);
      const success = await dispatch(submitContactForm(preparedFormData));
      
      if (success) {
        console.log('Form submitted successfully');
        // Form reset is handled by the useEffect watching for success
      } else {
        console.log('Form submission failed');
        Alert.alert(
          'Submission Error',
          'Failed to send message. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } else {
      console.log('Form validation failed:', errors);
      Alert.alert(
        'Validation Error',
        'Please check all fields and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.progressStep}>
          <View
            style={[
              styles.progressCircle,
              currentStep >= step && styles.progressCircleActive,
            ]}
          >
            <Text
              style={[
                styles.progressText,
                currentStep >= step && styles.progressTextActive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < totalSteps && (
            <View
              style={[
                styles.progressLine,
                currentStep > step && styles.progressLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Please provide your basic details</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.contact_name && styles.inputError]}
          placeholder="Name*"
          placeholderTextColor="#999"
          value={formData.contact_name}
          onChangeText={(text) => updateFormData('contact_name', text)}
        />
        {errors.contact_name && <Text style={styles.errorText}>{errors.contact_name}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.contact_email && styles.inputError]}
          placeholder="Email*"
          placeholderTextColor="#999"
          value={formData.contact_email}
          onChangeText={(text) => updateFormData('contact_email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.contact_email && <Text style={styles.errorText}>{errors.contact_email}</Text>}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Contact Details</Text>
      <Text style={styles.stepSubtitle}>How can we reach you?</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.contact_phone && styles.inputError]}
          placeholder="Phone No.*"
          placeholderTextColor="#999"
          value={formData.contact_phone}
          onChangeText={(text) => updateFormData('contact_phone', text)}
          keyboardType="phone-pad"
        />
        {errors.contact_phone && <Text style={styles.errorText}>{errors.contact_phone}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.contact_subject && styles.inputError]}
          placeholder="Subject*"
          placeholderTextColor="#999"
          value={formData.contact_subject}
          onChangeText={(text) => updateFormData('contact_subject', text)}
        />
        {errors.contact_subject && <Text style={styles.errorText}>{errors.contact_subject}</Text>}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Message</Text>
      <Text style={styles.stepSubtitle}>Tell us how we can help you</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.messageInput, errors.contact_message && styles.inputError]}
          placeholder="Write Message Here*"
          placeholderTextColor="#999"
          value={formData.contact_message}
          onChangeText={(text) => updateFormData('contact_message', text)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        {errors.contact_message && <Text style={styles.errorText}>{errors.contact_message}</Text>}
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Review Your Information:</Text>
        <Text style={styles.summaryText}>Name: {formData.contact_name}</Text>
        <Text style={styles.summaryText}>Email: {formData.contact_email}</Text>
        <Text style={styles.summaryText}>Phone: {formData.contact_phone}</Text>
        <Text style={styles.summaryText}>Subject: {formData.contact_subject}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <Navbar navigation={navigation} />
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Hero Section */}
          <ImageBackground
            source={require('../../assets/images/contact.jpg')}
            style={styles.heroSection}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Ask Us Question</Text>
            </View>
          </ImageBackground>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Fill Up The Form If</Text>
            <Text style={styles.formTitle}>You Have Any</Text>
            <Text style={styles.formTitle}>Question</Text>

            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Form Steps */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            )}

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    loading && styles.disabledButton
                  ]}
                  onPress={handlePrevious}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[
                  styles.primaryButton, 
                  currentStep === 1 && styles.fullWidthButton,
                  loading && styles.disabledButton
                ]}
                onPress={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {currentStep === totalSteps ? 'Send Message' : 'Next'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Information Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactMainTitle}>You can ask us questions !</Text>
            
            <View style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Icon name="location-on" size={24} color="#27ae60" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactTitle}>Our Location!</Text>
                  <Text style={styles.contactSubtext}>68 Neswilla Road Dehradun</Text>
                </View>
              </View>
            </View>
            
            <Footer />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  heroSection: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  formSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleActive: {
    backgroundColor: '#27ae60',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  progressTextActive: {
    color: '#fff',
  },
  progressLine: {
    width: 50,
    height: 2,
    backgroundColor: '#e0e0e0',
  },
  progressLineActive: {
    backgroundColor: '#27ae60',
  },
  stepContainer: {
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 120,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButton: {
    flex: 1,
  },
  nextButton: {
    marginRight: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactSection: {
    backgroundColor: '#fff',
    padding: 20,
  },
  contactMainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  contactSubtext: {
    fontSize: 14,
    color: '#666',
  },
  disabledButton: {
    opacity: 0.7,
  },
  errorContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
  },
  errorMessage: {
    color: '#c62828',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default MultiStepForm;
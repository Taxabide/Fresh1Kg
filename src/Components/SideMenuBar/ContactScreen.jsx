import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const { width, height } = Dimensions.get('window');

const MultiStepForm = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 3;

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        break;
      case 2:
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Phone number must be at least 10 digits';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        break;
      case 3:
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = () => {
    Alert.alert(
      'Success!',
      'Your message has been sent successfully. We will get back to you soon.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
            });
            setCurrentStep(1);
            setErrors({});
          },
        },
      ]
    );
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
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
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Name*"
          placeholderTextColor="#999"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email*"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Contact Details</Text>
      <Text style={styles.stepSubtitle}>How can we reach you?</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Phone No.*"
          placeholderTextColor="#999"
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.subject && styles.inputError]}
          placeholder="Subject*"
          placeholderTextColor="#999"
          value={formData.subject}
          onChangeText={(text) => updateFormData('subject', text)}
        />
        {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Message</Text>
      <Text style={styles.stepSubtitle}>Tell us how we can help you</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.messageInput, errors.message && styles.inputError]}
          placeholder="Write Message Here*"
          placeholderTextColor="#999"
          value={formData.message}
          onChangeText={(text) => updateFormData('message', text)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Review Your Information:</Text>
        <Text style={styles.summaryText}>Name: {formData.name}</Text>
        <Text style={styles.summaryText}>Email: {formData.email}</Text>
        <Text style={styles.summaryText}>Phone: {formData.phone}</Text>
        <Text style={styles.summaryText}>Subject: {formData.subject}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <Navbar navigation={navigation} />
      </SafeAreaView>
      
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

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handlePrevious}
              >
                <Text style={styles.secondaryButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.primaryButton, currentStep === 1 && styles.fullWidthButton]}
              onPress={handleNext}
            >
              <Text style={styles.primaryButtonText}>
                {currentStep === totalSteps ? 'Send Message' : 'Next'}
              </Text>
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

          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Icon name="email" size={24} color="#27ae60" />
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactTitle}>Mail Us On!</Text>
                <Text style={[styles.contactSubtext, styles.contactLink]}>info@example.com</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Icon name="call" size={24} color="#27ae60" />
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactTitle}>Quick Call!</Text>
                <Text style={[styles.contactSubtext, styles.contactLink]}>12345678</Text>
              </View>
            </View>
          </View>
        </View>
        
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    backgroundColor: '#fff',
    zIndex: 1000,
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
    opacity: 0.8,
  },
  // heroOverlay: {
  //   backgroundColor: 'rgba(0, 0, 0, 0.4)',
  //   padding: 20,
  //   borderRadius: 10,
  // },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  formSection: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    minHeight: height - 300,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 30,
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
    backgroundColor: '#fff',
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
  },
  primaryButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  fullWidthButton: {
    marginLeft: 0,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27ae60',
    flex: 1,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#27ae60',
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
  contactLink: {
    color: '#27ae60',
    textDecorationLine: 'underline',
  },
});

export default MultiStepForm;
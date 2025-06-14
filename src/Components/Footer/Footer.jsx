import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [receiveNews, setReceiveNews] = useState(false);

  const handleSubscribe = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    Alert.alert('Success', 'Successfully subscribed to newsletter!');
    setEmail('');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+123456789');
  };

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const handleSocialPress = (platform) => {
    const urls = {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
      whatsapp: 'https://whatsapp.com',
      instagram: 'https://instagram.com',
    };
    
    if (urls[platform]) {
      handleLinkPress(urls[platform]);
    }
  };

  const handleAppDownload = (store) => {
    const urls = {
      playstore: 'https://play.google.com/store',
      appstore: 'https://apps.apple.com',
    };
    
    if (urls[store]) {
      handleLinkPress(urls[store]);
    }
  };

  // Social media icons configuration
  const socialIcons = [
    { 
      platform: 'facebook', 
      IconComponent: FontAwesome, 
      iconName: 'facebook', 
      color: '#1877F2' 
    },
    { 
      platform: 'twitter', 
      IconComponent: AntDesign, 
      iconName: 'twitter', 
      color: '#1DA1F2' 
    },
    { 
      platform: 'youtube', 
      IconComponent: AntDesign, 
      iconName: 'youtube', 
      color: '#FF0000' 
    },
    { 
      platform: 'whatsapp', 
      IconComponent: FontAwesome, 
      iconName: 'whatsapp', 
      color: '#25D366' 
    },
    { 
      platform: 'instagram', 
      IconComponent: AntDesign, 
      iconName: 'instagram', 
      color: '#E4405F' 
    },
  ];



  return (
    <ScrollView style={styles.container}>
      <View style={styles.footerContent}>
        
        {/* About Company Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Company</Text>
          
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>Have Question? Call Us</Text>
            <Text style={styles.availabilityText}>24/7</Text>
            <TouchableOpacity onPress={handlePhonePress} style={styles.phoneContainer}>
              <MaterialIcons name="phone" size={20} color="#27ae60" />
              <Text style={styles.phoneNumber}>+123456789</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scheduleInfo}>
            <View style={styles.scheduleRow}>
              {/* <MaterialIcons name="schedule" size={16} color="#7f8c8d" /> */}
              <Text style={styles.scheduleText}>
                Monday - Friday: <Text style={styles.boldText}>8:00am - 6:00pm</Text>
              </Text>
            </View>
            <Text style={styles.scheduleText}>
              Saturday: <Text style={styles.boldText}>8:00am - 6:00pm</Text>
            </Text>
            <Text style={styles.scheduleText}>
              Sunday: <Text style={styles.boldText}>Service Close</Text>
            </Text>
          </View>
        </View>

        {/* Horizontal Store and Shop Section */}
        <View style={styles.horizontalSection}>
          {/* Our Stores Section */}
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Our Stores</Text>
            <TouchableOpacity style={styles.linkButton}>
              <Entypo name="info-with-circle" size={14} color="#3498db" />
              <Text style={styles.linkText}>Delivery Information</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <MaterialIcons name="privacy-tip" size={14} color="#3498db" />
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <MaterialIcons name="description" size={14} color="#3498db" />
              <Text style={styles.linkText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <MaterialIcons name="support-agent" size={14} color="#3498db" />
              <Text style={styles.linkText}>Support Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <MaterialIcons name="work" size={14} color="#3498db" />
              <Text style={styles.linkText}>Careers</Text>
            </TouchableOpacity>
          </View>

          {/* Shop Section */}
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>Shop Categories</Text>
            
            <TouchableOpacity style={styles.linkButton}>
              <MaterialIcons name="contact-mail" size={14} color="#3498db" />
              <Text style={styles.linkText}>Contact Us </Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.linkButton}>
              <Entypo name="info-with-circle" size={14} color="#3498db" />
              <Text style={styles.linkText}> Information</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <MaterialIcons name="info" size={14} color="#3498db" />
              <Text style={styles.linkText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <MaterialIcons name="work" size={14} color="#3498db" />
              <Text style={styles.linkText}>Careers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton}>
              <MaterialIcons name="article" size={14} color="#3498db" />
              <Text style={styles.linkText}>Nest Stories</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Useful Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Useful Links</Text>
          <TouchableOpacity style={styles.linkButton}>
            <MaterialIcons name="assignment-return" size={14} color="#3498db" />
            <Text style={styles.linkText}>Cancellation & Returns</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton}>
            <MaterialIcons name="report" size={14} color="#3498db" />
            <Text style={styles.linkText}>Report Infringement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton}>
            <MaterialIcons name="payment" size={14} color="#3498db" />
            <Text style={styles.linkText}>Payments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton}>
            <MaterialIcons name="local-shipping" size={14} color="#3498db" />
            <Text style={styles.linkText}>Shipping</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton}>
            <MaterialIcons name="help" size={14} color="#3498db" />
            <Text style={styles.linkText}>FAQ</Text>
          </TouchableOpacity>
        </View>

        {/* Newsletter Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Newsletter</Text>
          <Text style={styles.newsletterText}>
            Subscribe to the mailing list to receive updates on
          </Text>
          <Text style={styles.newsletterSubText}>
            the new arrivals and other discounts
          </Text>
          
          <View style={styles.subscriptionContainer}>
            <View style={styles.emailInputContainer}>
              <MaterialIcons name="email" size={20} color="#999" style={styles.emailIcon} />
              <TextInput
                style={styles.emailInput}
                placeholder="Your email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
              <MaterialIcons name="send" size={16} color="#fff" />
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setReceiveNews(!receiveNews)}
          >
            <View style={[styles.checkbox, receiveNews && styles.checkboxChecked]}>
              {receiveNews && <MaterialIcons name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I would like to receive news and special offers
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social Media Section */}
        <View style={styles.socialSection}>
          <Text style={styles.followText}>Follow Us:</Text>
          <View style={styles.socialIcons}>
            {socialIcons.map((social) => {
              const { IconComponent, iconName, platform, color } = social;
              return (
                <TouchableOpacity 
                  key={platform}
                  style={[styles.socialIcon, { backgroundColor: color }]}
                  onPress={() => handleSocialPress(platform)}
                >
                  <IconComponent name={iconName} size={20} color="#fff" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Payment Methods with Single Strip Image */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentText}>Payment Accepts:</Text>
          <View style={styles.paymentMethodsContainer}>
            <Image 
              source={require('../../assets/images/payment.png')}
              style={styles.paymentMethodsStrip}
              resizeMode="contain"
            />
          </View>
        </View>


<View style={styles.appDownloadSection}>
  <Text style={styles.downloadText}>Download App</Text>
  <View style={styles.appButtons}>
    <TouchableOpacity 
      style={styles.appButton}
      onPress={() => handleAppDownload('playstore')}
    >
      <Image 
        source={require('../../assets/images/playstore.png')}
        style={styles.appButtonImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.appButton}
      onPress={() => handleAppDownload('appstore')}
    >
      <Image 
        source={require('../../assets/images/appstore.png')}
        style={styles.appButtonImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  </View>
</View>
        {/* Copyright Section */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            Copyright 2025 ©Fresh1Kg. All rights reserved. Powered By Tulyarth DigiWeb
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    flex: 1,
    marginTop:20,
  },
  footerContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  horizontalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  halfSection: {
    flex: 0.48,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
    marginTop: 5,
  },
  contactInfo: {
    marginBottom: 15,
  },
  contactText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  availabilityText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 8,
  },
  scheduleInfo: {
    marginTop: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  scheduleText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
    marginLeft: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  linkButton: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 5,
    marginLeft: 8,
  },
  newsletterText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  newsletterSubText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  emailInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  emailIcon: {
    marginLeft: 12,
  },
  emailInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 14,
  },
  subscribeButton: {
    backgroundColor: '#068A4F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
  socialSection: {
    marginBottom: 20,
  },
  followText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paymentCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    minHeight: 40,
  },
  paymentCardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 5,
  },
  paymentMethodsContainer: {
    alignItems: 'flex-start',
  },
  paymentMethodsStrip: {
    width: 300,
    height:50,
    borderRadius: 6,
  },
  appDownloadSection: {
    marginBottom: 20,
  },
  downloadText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  appButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  appButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  appButtonImage: {
    width: 135,
    height: 40,
  },
  copyrightSection: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    marginTop: 10,
  },
  copyrightText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default Footer;
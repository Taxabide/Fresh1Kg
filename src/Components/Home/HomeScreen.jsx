import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../Navbar/Navbar';
import SlideScreen from '../Fresh1KgScreens/SlideScreen';
import VegetableItems from '../Fresh1KgScreens/vegetableItems.jsx';
import FruitScreen from '../Fresh1KgScreens/FruitScreen.jsx';
import VegetablesScreen from '../Fresh1KgScreens/VegetablesScreen.jsx';
import PolicyScreen from '../Fresh1KgScreens/PolicyScreen';
import DiscountZoneScreen from '../Fresh1KgScreens/DiscountZoneScreen';
import WeekendDiscountScreen from '../Fresh1KgScreens/WeekendDiscountScreen';
import TrendingProductScreen from '../Fresh1KgScreens/TrendingProductScreen';
import Footer from '../Footer/Footer';
import DryFruitScreen from '../Fresh1KgScreens/DryFruitScreen.jsx';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        {/* Fixed Navbar */}
        <View style={styles.navbarWrapper}>
          <Navbar navigation={navigation} />
        </View>
        
        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={Platform.OS === 'ios'}
        >
          <SlideScreen />
          <VegetableItems />
          <PolicyScreen />
          <VegetablesScreen navigation={navigation} />
          <FruitScreen navigation={navigation} />
          <DryFruitScreen navigation={navigation} />
          <WeekendDiscountScreen />
          <TrendingProductScreen />
          <Footer />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navbarWrapper: {
    backgroundColor: '#ffffff',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
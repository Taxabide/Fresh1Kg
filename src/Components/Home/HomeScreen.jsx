import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

// Get screen dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Scale factors based on design width (assuming 375 is base width)
const scale = SCREEN_WIDTH / 375;
const verticalScale = SCREEN_HEIGHT / 812; // assuming 812 is base height (iPhone X)

// Normalize sizing based on scale factor
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Screen size breakpoints
const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 360,
  isMedium: SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 400,
  isLarge: SCREEN_WIDTH >= 400 && SCREEN_WIDTH < 600,
  isTablet: SCREEN_WIDTH >= 600,
  scale: scale,
  verticalScale: verticalScale
};

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={true}
      />
      
      {/* Main Content */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Navbar with proper top spacing */}
        <Navbar navigation={navigation} />
        
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: normalize(SCREEN.isSmall ? 16 : SCREEN.isTablet ? 32 : 24),
  },
});

export default HomeScreen;
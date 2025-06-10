// src/navigation/AppNavigator.jsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../Components/Home/HomeScreen';
// import UserMenu from '../Components/Navbar/UserMenu';
import CartMenu from '../Components/Navbar/CartMenu';
import SignInScreen from '../Components/auth/SignInScreen.jsx';
import SignUpScreen from '../Components/auth/SignUpScreen.jsx';
import ProfileScreen from '../Components/auth/ProfileScreen.jsx';

// Only import files that actually exist
import ContactScreen from '../Components/SideMenuBar/ContactScreen';
import AllProductsScreen from '../Components/SideMenuBar/AllProductsScreen';
import MyOrdersScreen from '../Components/MyOrders/MyOrdersScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown:false}}/>

      <Stack.Screen name="CartMenu" component={CartMenu} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
      <Stack.Screen
        name="MyOrdersScreen"
        component={MyOrdersScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen name="ProductsScreen" component={AllProductsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

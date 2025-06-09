// src/navigation/AppNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/Home/HomeScreen';
import UserMenu from '../components/Navbar/UserMenu';
import CartMenu from '../components/Navbar/CartMenu';

// Only import files that actually exist
import ContactScreen from '../components/SideMenuBar/ContactScreen'; 
import AllProductsScreen from '../components/SideMenuBar/AllProductsScreen'
import MyOrdersScreen from '../components/MyOrders/MyOrdersScreen'


// Future screens - uncomment when ready to implement
// import AboutScreen from '../components/SideMenuBar/AboutScreen';
// import VegetablesScreen from '../components/Products/VegetablesScreen';
// import FruitsScreen from '../components/Products/FruitsScreen';
// import DryFruitsScreen from '../components/Products/DryFruitsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      <Stack.Screen name="UserMenu" component={UserMenu} />
      <Stack.Screen name="CartMenu" component={CartMenu} />
      {/* Contact screen - uncomment when you create the ContactScreen component */}
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
      <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} options={{headerShown:false}}/>
      
      {/* User Profile Screens - uncomment when you create these components */}
      {/* 
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          headerShown: true,
          title: 'My Profile',
          headerStyle: {
            backgroundColor: '#7CB342',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: '#7CB342',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="MyOrders" 
        component={MyOrdersScreen} 
        options={{
          headerShown: true,
          title: 'My Orders',
          headerStyle: {
            backgroundColor: '#7CB342',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="Wishlist" 
        component={WishlistScreen} 
        options={{
          headerShown: true,
          title: 'My Wishlist',
          headerStyle: {
            backgroundColor: '#7CB342',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="Addresses" 
        component={AddressesScreen} 
        options={{
          headerShown: true,
          title: 'My Addresses',
          headerStyle: {
            backgroundColor: '#7CB342',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      */}
      
      {/* Future screens - add these when ready */}
      {/* <Stack.Screen name="About" component={AboutScreen} /> */}
      {/* <Stack.Screen name="Vegetables" component={VegetablesScreen} /> */}
      {/* <Stack.Screen name="Fruits" component={FruitsScreen} /> */}
      {/* <Stack.Screen name="DryFruits" component={DryFruitsScreen} /> */}
      <Stack.Screen name="ProductsScreen" component={AllProductsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
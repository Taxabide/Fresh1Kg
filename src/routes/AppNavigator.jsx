// src/navigation/AppNavigator.jsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../Components/Home/HomeScreen';
// import UserMenu from '../Components/Navbar/UserMenu';
import CartMenu from '../Components/Navbar/CartMenu';
import SignInScreen from '../Components/auth/SignInScreen.jsx';
import SignUpScreen from '../Components/auth/SignUpScreen.jsx';
import ProfileScreen from '../Components/auth/ProfileScreen.jsx';
import EditProfileScreen from '../Components/auth/EditProfileScreen.jsx';

// Only import files that actually exist
import ContactScreen from '../Components/SideMenuBar/ContactScreen';
import AllProductsScreen from '../Components/SideMenuBar/AllProductsScreen';
import MyOrdersScreen from '../Components/MyOrders/MyOrdersScreen';
import SearchResultsScreen from '../Components/Fresh1KgScreens/SearchResultsScreen';
import { useSelector } from 'react-redux';
import WishlistScreen from '../Components/Fresh1KgScreens/WishlistScreen.jsx';
import AdminScreen from '../../adminSrc/AdminScreen.jsx';
import AdminUserList from '../../adminSrc/AdminTables/AdminUserList.jsx'
import AdminContactList from '../../adminSrc/AdminTables/AdminContactList.jsx'
import AdminOrderList from '../../adminSrc/AdminTables/AdminOrderList.jsx';
import AdminAddProduct from '../../adminSrc/AdminProduct/AdminAddProduct.jsx'
import AdminProductList from '../../adminSrc/AdminProduct/AdminProductList.jsx';
import AdminProfileScreen from '../../adminSrc/AdminProfileScreen.jsx';

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
  const user = useSelector(state => state.user.user);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
        animation: 'slide_from_right'
      }}
      initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen 
        key={user?.u_id || 'default'}
        name="ProfileScreen" 
        component={ProfileScreen} 
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="CartMenu" component={CartMenu} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
      <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
      <Stack.Screen name="ProductsScreen" component={AllProductsScreen} />
      <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} />
      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} />
      <Stack.Screen name="AdminProfileScreen" component={AdminProfileScreen} />
      <Stack.Screen name="AdminUserList" component={AdminUserList} />
      <Stack.Screen name="AdminContactList" component={AdminContactList} />
      <Stack.Screen name="AdminOrderList" component={AdminOrderList} />
      <Stack.Screen name="AdminAddProduct" component={AdminAddProduct} />
      <Stack.Screen name="AdminProductList" component={AdminProductList} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

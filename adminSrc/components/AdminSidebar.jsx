// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const { width } = Dimensions.get('window');

// const AdminSidebar = ({
//   activeTab,
//   handleMenuSelect,
//   tablesDropdownVisible,
//   toggleTablesDropdown,
//   productDropdownVisible,
//   toggleProductDropdown,
//   handleUserListPress,
//   handleContactListPress,
//   handleOrderListPress,
//   handleProductPress,
//   handleProductListPress,
// }) => {
//   return (
//     <View style={styles.sidebar}>
//       {/* Logo */}
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../../src/assets/images/logo.png')} // Adjust path if necessary
//           style={styles.logoImage}
//           resizeMode="contain"
//         />
//       </View>

//       <Text style={styles.mainMenuTitle}>MAIN MENU</Text>

//       <TouchableOpacity
//         style={[styles.menuItem, activeTab === 'dashboard' && styles.activeMenuItem]}
//         onPress={() => handleMenuSelect('dashboard')}
//       >
//         <MaterialIcons
//           name="dashboard"
//           size={24}
//           color={activeTab === 'dashboard' ? '#7CB342' : '#666'}
//         />
//         <Text style={[
//           styles.menuItemText,
//           activeTab === 'dashboard' && styles.activeMenuText
//         ]}>
//           Dashboards
//         </Text>
//       </TouchableOpacity>

//       {/* Tables Menu Item with Dropdown */}
//       <View>
//         <TouchableOpacity
//           style={[styles.menuItem, (activeTab === 'tables' || activeTab === 'users' || activeTab === 'orders' || activeTab === 'contacts') && styles.activeMenuItem]}
//           onPress={toggleTablesDropdown}
//         >
//           <MaterialIcons
//             name="table-chart"
//             size={24}
//             color={(activeTab === 'tables' || activeTab === 'users' || activeTab === 'orders' || activeTab === 'contacts') ? '#7CB342' : '#666'}
//           />
//           <Text style={[
//             styles.menuItemText,
//             (activeTab === 'tables' || activeTab === 'users' || activeTab === 'orders' || activeTab === 'contacts') && styles.activeMenuText
//           ]}>
//             Tables
//           </Text>
//           <MaterialIcons
//             name={tablesDropdownVisible ? "expand-less" : "expand-more"}
//             size={20}
//             color="#666"
//           />
//         </TouchableOpacity>

//         {/* Tables Dropdown Menu */}
//         {tablesDropdownVisible && (
//           <View style={styles.dropdownMenu}>
//             <TouchableOpacity
//               style={[styles.dropdownMenuItem, activeTab === 'users' && styles.activeDropdownItem]}
//               onPress={handleUserListPress}
//             >
//               <Text style={[
//                 styles.dropdownMenuText,
//                 activeTab === 'users' && styles.activeDropdownText
//               ]}>
//                 User List
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.dropdownMenuItem, activeTab === 'contacts' && styles.activeDropdownItem]}
//               onPress={handleContactListPress}
//             >
//               <Text style={[
//                 styles.dropdownMenuText,
//                 activeTab === 'contacts' && styles.activeDropdownText
//               ]}>
//                 Contact List
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.dropdownMenuItem, activeTab === 'orders' && styles.activeDropdownItem]}
//               onPress={handleOrderListPress}
//             >
//               <Text style={[
//                 styles.dropdownMenuText,
//                 activeTab === 'orders' && styles.activeDropdownText
//               ]}>
//                 Order List
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Product Menu Item with Dropdown */}
//       <View>
//         <TouchableOpacity
//           style={[styles.menuItem, (activeTab === 'product' || activeTab === 'addProduct' || activeTab === 'productList') && styles.activeMenuItem]}
//           onPress={toggleProductDropdown}
//         >
//           <MaterialIcons
//             name="shopping-bag"
//             size={24}
//             color={(activeTab === 'product' || activeTab === 'addProduct' || activeTab === 'productList') ? '#7CB342' : '#666'}
//           />
//           <Text style={[
//             styles.menuItemText,
//             (activeTab === 'product' || activeTab === 'addProduct' || activeTab === 'productList') && styles.activeMenuText
//           ]}>
//             Product
//           </Text>
//           <MaterialIcons
//             name={productDropdownVisible ? "expand-less" : "expand-more"}
//             size={20}
//             color="#666"
//           />
//         </TouchableOpacity>

//         {/* Product Dropdown Menu */}
//         {productDropdownVisible && (
//           <View style={styles.dropdownMenu}>
//             <TouchableOpacity
//               style={[styles.dropdownMenuItem, activeTab === 'addProduct' && styles.activeDropdownItem]}
//               onPress={handleProductPress}
//             >
//               <Text style={[
//                 styles.dropdownMenuText,
//                 activeTab === 'addProduct' && styles.activeDropdownText
//               ]}>
//                 Add Product
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.dropdownMenuItem, activeTab === 'productList' && styles.activeDropdownItem]}
//               onPress={handleProductListPress}
//             >
//               <Text style={[
//                 styles.dropdownMenuText,
//                 activeTab === 'productList' && styles.activeDropdownText
//               ]}>
//                 Product List
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   sidebar: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     paddingTop: 20,
//     paddingHorizontal: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 2, height: 0 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 8,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 30,
//     paddingHorizontal: 10,
//   },
//   logoImage: {
//     width: 120,
//     height: 60,
//   },
//   mainMenuTitle: {
//     fontSize: 12,
//     color: '#888',
//     fontWeight: 'bold',
//     marginBottom: 15,
//     paddingHorizontal: 10,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   activeMenuItem: {
//     backgroundColor: '#f0f8e8',
//   },
//   menuItemText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//     flex: 1,
//   },
//   activeMenuText: {
//     color: '#7CB342',
//     fontWeight: 'bold',
//   },
//   dropdownMenu: {
//     paddingLeft: 20,
//     marginTop: -5,
//     marginBottom: 5,
//   },
//   dropdownMenuItem: {
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     borderRadius: 6,
//     marginHorizontal: 8,
//     marginVertical: 5,
//     backgroundColor: 'transparent',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   activeDropdownItem: {
//     backgroundColor: '#f0f8e8',
//     borderBottomColor: '#e0e8d8',
//   },
//   dropdownMenuText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   activeDropdownText: {
//     color: '#7CB342',
//     fontWeight: '600',
//   },
//   sidebarContainer: {
//     width: width * 0.75,
//     height: '100%',
//   },
// });

// export default AdminSidebar; 
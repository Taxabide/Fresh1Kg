import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {placeOrder} from '../../redux/actions/orderActions';

const PlaceOrderForm = ({navigation, route}) => {
  // Get user and cart data directly from the Redux store
  const user = useSelector(state => state.user.user);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  // Calculate totals based on the cart items from Redux
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.p_price * item.quantity), 0);
  const totalSavings = cartItems.reduce((sum, item) => sum + ((item.original_price - item.p_price) * item.quantity), 0);

  useEffect(() => {
    if (user) {
      console.log('User data from Redux:', JSON.stringify(user, null, 2));
    } else {
      console.log('No user data in Redux store.');
    }
  }, [user]);

  // State for GPS coordinates
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [formData, setFormData] = useState({
    address: '',
    currentAddress: '',
    phone: '',
    coordinates: '',
    message: '',
  });

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Fresh1Kg-App/1.0',
          },
        },
      );
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return '';
    } catch (error) {
      console.log('Geocoding Error:', error);
      return '';
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  };

  const getLocation = async () => {
    try {
      let hasPermission = false;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (!granted) {
          const permissionResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission Required',
              message:
                'Fresh1Kg needs access to your location to auto-fill delivery address',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          hasPermission =
            permissionResult === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          hasPermission = true;
        }
      } else {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        hasPermission = auth === 'granted';
      }

      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services in settings to auto-fill your address',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return;
      }

      // Get location immediately after permission is granted
      const position = await getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Update coordinates state and display
      setLatitude(lat.toString());
      setLongitude(lng.toString());
      setFormData(prev => ({
        ...prev,
        coordinates: `Lat: ${lat}, Lng: ${lng}`,
      }));

      // Get address from coordinates and update current address
      const address = await getAddressFromCoordinates(lat, lng);
      if (address) {
        setFormData(prev => ({
          ...prev,
          currentAddress: address,
        }));
      }
    } catch (error) {
      console.log('Location Error:', error);
      let errorMessage =
        'Could not get your location. Please try again or enter address manually.';

      if (error.code === 1) {
        errorMessage =
          'Location access denied. Please enable location services and try again.';
      } else if (error.code === 2) {
        errorMessage = 'Please turn on your GPS and try again.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }

      Alert.alert(
        'Location Error',
        errorMessage,
        error.code === 1
          ? [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open Settings', onPress: () => Linking.openSettings()},
            ]
          : [{text: 'OK'}],
      );
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    // Validate user and cart data first, using the correct user ID field 'u_id'
    if (!user || !user.u_id || !cartItems || cartItems.length === 0) {
      Alert.alert(
        'Error',
        'Missing user or product data. Please log in or add items to your cart.',
      );
      return;
    }

    // Validate required fields
    if (
      !formData.address ||
      !formData.currentAddress ||
      !formData.phone ||
      !formData.coordinates
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Prepare order data according to DB schema, using the correct user ID field 'u_id'
    const orderData = {
      userId: user.u_id,
      phone: formData.phone,
      address: formData.address,
      currentAddress: formData.currentAddress,
      message: formData.message,
      latitude: latitude,
      longitude: longitude,
      paymentMethod: paymentMethod,
      products: cartItems.map(item => ({
        productId: item.p_id,
        quantity: item.quantity,
        subtotal: item.quantity * item.p_price,
        price: item.p_price,
        weight: item.weight || '0',
      })),
    };

    // Dispatch place order action
    const result = await dispatch(placeOrder(orderData));

    if (result.success) {
      Alert.alert('Success', 'Order placed successfully!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.reset({
              index: 1,
              routes: [
                { name: 'HomeScreen' },
                { name: 'MyOrdersScreen' },
              ],
            }),
        },
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Selected Items Summary */}
          <View style={styles.orderSummaryContainer}>
            <Text style={styles.sectionTitle}>Selected Items</Text>
            <View style={styles.selectedItems}>
              {cartItems.map(item => (
                <View key={item.cart_id} style={styles.selectedItemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.p_name}</Text>
                    <Text style={styles.itemQuantity}>
                      Quantity: {item.quantity}
                    </Text>
                    <Text style={styles.itemPrice}>
                      Price: ₹{(item.quantity * item.p_price).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Address<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, styles.elevatedInput]}
              value={formData.address}
              onChangeText={text => handleInputChange('address', text)}
              placeholder="Enter your address"
              placeholderTextColor="#757575"
              multiline
            />
          </View>

          {/* Current Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Current Address/Location<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, styles.elevatedInput]}
              value={formData.currentAddress}
              onChangeText={text => handleInputChange('currentAddress', text)}
              placeholder="Click GPS button below to auto-fill address"
              placeholderTextColor="#757575"
              multiline
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Phone Number<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, styles.elevatedInput]}
              value={formData.phone}
              onChangeText={text => handleInputChange('phone', text)}
              placeholder="Enter your phone number"
              placeholderTextColor="#757575"
              keyboardType="phone-pad"
            />
          </View>

          {/* GPS Coordinates */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              GPS Coordinates<Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={getLocation}
              style={styles.gpsInputContainer}
              activeOpacity={0.7}>
              <TextInput
                style={[styles.textInput, styles.elevatedInput]}
                value={formData.coordinates}
                placeholder="Tap to get current location"
                placeholderTextColor="#757575"
                editable={false}
              />
              <Icon
                name="my-location"
                size={24}
                color="#1976D2"
                style={styles.locationIcon}
              />
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Click here to auto-fill both location and GPS coordinates
            </Text>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentContainer}>
            <Text style={[styles.label, {marginBottom: 12}]}>
              Payment Method<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.radioRow}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPaymentMethod('COD')}>
                <View style={styles.radioButton}>
                  {paymentMethod === 'COD' && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Cash on Delivery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPaymentMethod('ONLINE')}>
                <View style={styles.radioButton}>
                  {paymentMethod === 'ONLINE' && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Online Payment</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Message */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.messageInput]}
              value={formData.message}
              onChangeText={text => handleInputChange('message', text)}
              placeholder="Type your message here..."
              placeholderTextColor="#757575"
              multiline
            />
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
            activeOpacity={0.8}>
            <Text style={styles.placeOrderText}>Place Order / Buy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  orderSummaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 16,
  },
  selectedItems: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectedItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#616161',
  },
  itemPrice: {
    fontSize: 13,
    color: '#616161',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  elevatedInput: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  paymentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#1976D2',
  },
  radioText: {
    fontSize: 16,
    color: '#212121',
  },
  placeOrderButton: {
    backgroundColor: '#00C853',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
    marginLeft: 4,
  },
  required: {
    color: '#D32F2F',
    marginLeft: 4,
  },
  gpsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  locationIcon: {
    position: 'absolute',
    right: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default PlaceOrderForm;

import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
} from '../constants/actionTypes';
import { Alert } from 'react-native';

const ADD_TO_CART_API_URL = 'https://fresh1kg.com/api/add-cart-api.php';
const FETCH_CART_API_URL = 'https://fresh1kg.com/api/my-cart-api.php';

export const addToCart = (productId, userId, quantity = 1) => async (dispatch) => {
  // Validate parameters
  if (!productId || productId === null || productId === undefined) {
    dispatch({ type: ADD_TO_CART_FAILURE, payload: 'Product ID is required' });
    return;
  }
  
  if (!userId || userId === null || userId === undefined) {
    dispatch({ type: ADD_TO_CART_FAILURE, payload: 'User must be logged in to add items to cart' });
    return;
  }

  dispatch({ type: ADD_TO_CART_REQUEST });
  
  try {
    const formData = new FormData();
    formData.append('product_id', String(productId));
    formData.append('user_id', String(userId));
    formData.append('quantity', String(quantity));
    
    const response = await fetch(ADD_TO_CART_API_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'success' || data.status === 'exists') {
      dispatch({ 
        type: ADD_TO_CART_SUCCESS, 
        payload: { 
          productId, 
          userId, 
          quantity, 
          message: data.message, 
          status: data.status,
        } 
      });
      
      // Try to fetch updated cart
      try {
        await dispatch(fetchCart(userId));
      } catch (cartError) {
        
      }
      Alert.alert('Success', data.message || 'Product added to cart successfully!');
    } else {
      Alert.alert('Error', data.message || 'Failed to add to cart.');
    }
  } catch (error) {
    
    dispatch({ type: ADD_TO_CART_FAILURE, payload: error.message });
    Alert.alert('Error', error.message || 'An unexpected error occurred while adding to cart.');
  }
};

export const fetchCart = (userId) => async (dispatch) => {
  if (!userId) {
    
    dispatch({ type: FETCH_CART_FAILURE, payload: 'User ID is required to fetch cart' });
    return;
  }

  dispatch({ type: FETCH_CART_REQUEST });
  
  try {
    // Construct URL with query parameter for GET request
    const url = `${FETCH_CART_API_URL}?user_id=${String(userId)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      // No body for GET requests
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 404) {
        dispatch({ type: FETCH_CART_FAILURE, payload: 'Cart API endpoint not found. Please check the API URL.' });
        return;
      } else if (response.status === 401) {
        dispatch({ type: FETCH_CART_FAILURE, payload: 'Please log in to view your cart.' });
        return;
      } else {
        dispatch({ type: FETCH_CART_FAILURE, payload: `Server error: ${response.status} ${response.statusText}` });
        return;
      }
    }

    const data = await response.json();
    
    if (data.status === 'success') {
      const mappedCartItems = Array.isArray(data.cart_items) ? data.cart_items.map(mapCartItemData) : [];
      dispatch({ type: FETCH_CART_SUCCESS, payload: mappedCartItems });
    } else if (data.status === 'error') {
      if (data.message === 'Unauthorized user') {
        dispatch({ type: FETCH_CART_FAILURE, payload: 'Please log in to view your cart.' });
        return;
      } else {
        dispatch({ type: FETCH_CART_FAILURE, payload: data.message || 'Failed to fetch cart' });
        return;
      }
    } else {
      dispatch({ type: FETCH_CART_FAILURE, payload: 'Invalid response from cart API' });
      return;
    }
  } catch (error) {
    let errorMessage = 'An unknown error occurred while fetching cart.';
    if (error) {
      if (typeof error === 'object' && error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        if (error === 'undefined') {
          errorMessage = 'An unexpected error occurred.';
        } else {
          errorMessage = error;
        }
      } else if (typeof error === 'object' && !error.message) {
        errorMessage = 'An error object was received, but no specific message.';
      }
    }
    dispatch({ type: FETCH_CART_FAILURE, payload: errorMessage });
  }
};

const mapCartItemData = (item) => {
  return {
    cart_id: item.a_c_id,
    p_id: item.a_c_product_id,
    quantity: parseInt(item.a_c_quantity || 1, 10),
    p_name: item.p_name,
    p_image: item.p_image,
    p_price: item.p_price,
    original_price: item.original_price,
    p_weight: item.p_weight,
    p_unit: item.p_unit,
    p_category_id: item.p_category_id,
    p_description: item.p_description,
    p_stock: item.p_stock,
    price_per_rate: item.price_per_rate,
    p_unique: item.p_unique,
    unit_name: item.unit_name,
    product_image_url: item.product_image_url,
    formatted_weight: item.formatted_weight,
    actual_price: item.actual_price,
    stock_status: item.stock_status,
  };
};

export const updateCartItemQuantity = (cartId, userId, change) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('product_id', String(productId));
    formData.append('user_id', String(userId));
    formData.append('quantity_change', String(change));

    const response = await fetch('https://fresh1kg.com/api/update-cart-api.php', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      dispatch({ type: UPDATE_CART_ITEM_QUANTITY, payload: { productId, change } });
      // Refresh cart after update
      await dispatch(fetchCart(userId));
    } else {
      throw new Error(data.message || 'Failed to update cart item quantity');
    }
  } catch (error) {
    throw error;
  }
};

export const removeCartItem = (cartId, userId) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('product_id', String(productId));
    formData.append('user_id', String(userId));

    const response = await fetch('https://fresh1kg.com/api/remove-cart-api.php', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      dispatch({ type: REMOVE_CART_ITEM, payload: productId });
      // Refresh cart after removal
      await dispatch(fetchCart(userId));
    } else {
      throw new Error(data.message || 'Failed to remove cart item');
    }
  } catch (error) {
    throw error;
  }
};
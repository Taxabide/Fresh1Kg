import {
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_SUCCESS,
  ADD_TO_WISHLIST_FAILURE,
  FETCH_WISHLIST_REQUEST,
  FETCH_WISHLIST_SUCCESS,
  FETCH_WISHLIST_FAILURE,
  REMOVE_FROM_WISHLIST_REQUEST,
  REMOVE_FROM_WISHLIST_SUCCESS,
  REMOVE_FROM_WISHLIST_FAILURE,
} from '../constants/actionTypes';
import {Alert} from 'react-native';

const ADD_TO_WISHLIST_API_URL = 'https://fresh1kg.com/api/add-wishlist-api.php';
const FETCH_WISHLIST_API_URL = 'https://fresh1kg.com/api/wishlist-api.php';
const REMOVE_FROM_WISHLIST_API_URL = 'https://fresh1kg.com/api/remove-wishlist-api.php';

export const addToWishlist = (productId, userId) => async dispatch => {
  dispatch({type: ADD_TO_WISHLIST_REQUEST});

  try {
    if (!userId) {
      Alert.alert('Login Required', 'User ID is required to add to wishlist.');
      dispatch({
        type: ADD_TO_WISHLIST_FAILURE,
        payload: 'User ID is required to add to wishlist.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('product_id', String(productId));
    formData.append('user_id', String(userId));

    const response = await fetch(ADD_TO_WISHLIST_API_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.status === 'success') {
      dispatch({
        type: ADD_TO_WISHLIST_SUCCESS,
        payload: data.message || 'Product added to wishlist successfully!',
      });
      Alert.alert(
        'Success',
        data.message || 'Product added to wishlist successfully!',
      );
    } else {
      if (data.message && data.message.includes('already in wishlist')) {
        Alert.alert('Info', data.message);
      } else {
        Alert.alert(
          'Error',
          data.message || 'Failed to add product to wishlist.',
        );
      }
      dispatch({
        type: ADD_TO_WISHLIST_FAILURE,
        payload: data.message || 'Failed to add product to wishlist.',
      });
    }
  } catch (error) {
    Alert.alert(
      'Error',
      error.message || 'An unexpected error occurred while adding to wishlist.',
    );
    dispatch({
      type: ADD_TO_WISHLIST_FAILURE,
      payload:
        error.message ||
        'An unexpected error occurred while adding to wishlist.',
    });
  }
};

export const fetchWishlist = userId => async dispatch => {
  dispatch({type: FETCH_WISHLIST_REQUEST});

  try {
    if (!userId) {
      dispatch({
        type: FETCH_WISHLIST_FAILURE,
        payload: 'User ID is required to fetch wishlist.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('user_id', String(userId));

    const response = await fetch(
      `${FETCH_WISHLIST_API_URL}?user_id=${userId}`,
      {
        method: 'GET',
      },
    );

    const responseText = await response.text();

    const data = JSON.parse(responseText);

    if (data.status === 'success') {
      dispatch({type: FETCH_WISHLIST_SUCCESS, payload: data.wishlist || []});
    } else {
      dispatch({
        type: FETCH_WISHLIST_FAILURE,
        payload: data.message || 'Failed to fetch wishlist.',
      });
    }
  } catch (error) {
    dispatch({
      type: FETCH_WISHLIST_FAILURE,
      payload:
        error.message ||
        'An unexpected error occurred while fetching wishlist.',
    });
  }
};

export const removeFromWishlist = (userId, w_id) => async dispatch => {
  dispatch({type: REMOVE_FROM_WISHLIST_REQUEST});

  try {
    if (!userId || !w_id) {
      dispatch({
        type: REMOVE_FROM_WISHLIST_FAILURE,
        payload:
          'User ID and Wishlist ID are required to remove from wishlist.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('user_id', String(userId));
    formData.append('w_id', String(w_id));

    const response = await fetch(REMOVE_FROM_WISHLIST_API_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.status === 'success') {
      dispatch({type: REMOVE_FROM_WISHLIST_SUCCESS, payload: w_id});
      Alert.alert('Success', 'Item removed from wishlist successfully!');
    } else {
      dispatch({
        type: REMOVE_FROM_WISHLIST_FAILURE,
        payload: data.message || 'Failed to remove product from wishlist.',
      });
    }
  } catch (error) {
    dispatch({
      type: REMOVE_FROM_WISHLIST_FAILURE,
      payload:
        error.message ||
        'An unexpected error occurred while removing from wishlist.',
    });
  }
};

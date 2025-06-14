import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_USER,
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE,
  CLEAR_EDIT_PROFILE_STATUS,
} from '../constants/actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://fresh1kg.com/api/sign-up-api.php';
const LOGIN_API_URL = 'https://fresh1kg.com/api/sign-in-api.php';
const USER_DETAILS_API_URL = 'https://fresh1kg.com/api/user-details-api.php';

export const signupUser = (userData) => async (dispatch) => {
  dispatch({ type: SIGNUP_REQUEST });

  try {
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      // When using FormData, fetch automatically sets the correct 'Content-Type' header.
    });

    const data = await response.json();
    if (data.status === 'success') {

      const returnedUser = data.user_data || userData;
      if (returnedUser && returnedUser.u_id) {
        await AsyncStorage.setItem('user_id', returnedUser.u_id.toString());
      }
      dispatch({ type: SIGNUP_SUCCESS, payload: returnedUser });
    } else {
      throw new Error(data.message || 'Signup failed');
    }
  } catch (error) {
    dispatch({ type: SIGNUP_FAILURE, payload: error.message });
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const formData = new FormData();
    for (const key in credentials) {
      formData.append(key, credentials[key]);
    }
    const response = await fetch(LOGIN_API_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.status === 'success') {
      if (data.user_data && data.user_data.u_id) {
        await AsyncStorage.setItem('user_id', data.user_data.u_id.toString());
      }
      dispatch({ type: LOGIN_SUCCESS, payload: data.user_data });
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

export const restoreUser = () => async (dispatch) => {
  try {
    const userId = await AsyncStorage.getItem('user_id');
    if (userId) {
      const response = await fetch(`${USER_DETAILS_API_URL}?user_id=${encodeURIComponent(userId)}`);

      if (!response.ok) {
        dispatch({ type: LOGOUT });
        await AsyncStorage.removeItem('user_id');
        return;
      }

      const data = await response.json();

      if (data.status === 'success' && data.user_data) {
        dispatch({ type: SET_USER, payload: data.user_data });
      } else if (data.status === 'error' && data.message === 'User not found') {
        await AsyncStorage.removeItem('user_id'); // Clear invalid ID
        dispatch({ type: LOGOUT });
      } else {
        await AsyncStorage.removeItem('user_id');
        dispatch({ type: LOGOUT });
      }
    } else {
      
      dispatch({ type: LOGOUT }); // Ensure no stale user state
    }
  } catch (error) {
    await AsyncStorage.removeItem('user_id'); // Clear any problematic ID
    dispatch({ type: LOGOUT });
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('user_id');
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.log(error)
  }
}; 
import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../constants/actionTypes';

const API_URL = 'https://fresh1kg.com/api/sign-up-api.php';
const LOGIN_API_URL = 'https://fresh1kg.com/api/sign-in-api.php';

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
    console.log(">>>>>>>>>>>>>>>response",data)
    if (data.status === 'success') {
      // The API should ideally return the complete user object, including the new u_id.
      // Changed from data.user to data.user_data to match API response
      const returnedUser = data.user_data || userData;
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
      // Changed from data.user to data.user_data to match API response
      dispatch({ type: LOGIN_SUCCESS, payload: data.user_data });
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

export const logoutUser = () => ({
  type: LOGOUT,
}); 
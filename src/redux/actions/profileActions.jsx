import {
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE,
  CLEAR_EDIT_PROFILE_STATUS,
} from '../constants/actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EDIT_PROFILE_API_URL = 'https://fresh1kg.com/api/edit-profile-api.php';

export const editUserProfile = (userData) => async (dispatch) => {
  dispatch({ type: EDIT_PROFILE_REQUEST });

  try {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      throw new Error('User not logged in or user ID not found.');
    }

    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    // Ensure user_id is sent with the request
    formData.append('user_id', userId);

    const response = await fetch(EDIT_PROFILE_API_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    

    if (data.status === 'success') {
      
      // Update the user data in Redux with the submitted form data,
      // merging with any data returned by the API.
      const updatedUserData = { ...userData, ...data.user_data };
      dispatch({ type: EDIT_PROFILE_SUCCESS, payload: updatedUserData });
    } else {
      throw new Error(data.message || 'Failed to update profile');
    }
  } catch (error) {
    dispatch({ type: EDIT_PROFILE_FAILURE, payload: error.message });
  }
};

export const clearEditProfileStatus = () => ({
  type: CLEAR_EDIT_PROFILE_STATUS,
}); 
import {
  FETCH_ADMIN_USERS_REQUEST,
  FETCH_ADMIN_USERS_SUCCESS,
  FETCH_ADMIN_USERS_FAILURE,
} from '../constants/actionTypes';

const USER_LIST_API = 'https://fresh1kg.com/api/user-list-api.php';

export const fetchAdminUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_ADMIN_USERS_REQUEST });

  try {
    const response = await fetch(USER_LIST_API);
    const responseText = await response.text();
    const data = JSON.parse(responseText);

    if (data.status === 'success' && Array.isArray(data.data)) {
      dispatch({ type: FETCH_ADMIN_USERS_SUCCESS, payload: data.data });
    } else {
      throw new Error(data.message || 'Failed to fetch users');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    dispatch({ 
      type: FETCH_ADMIN_USERS_FAILURE, 
      payload: error.message || 'Failed to fetch users. Please try again later.' 
    });
  }
}; 
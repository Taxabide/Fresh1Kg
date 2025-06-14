import {
  SET_USER,
  LOGOUT,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE,
  CLEAR_EDIT_PROFILE_STATUS,
} from '../constants/actionTypes.jsx';

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  editProfileLoading: false,
  editProfileError: null,
  editProfileSuccess: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_REQUEST:
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
    case SET_USER:
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        user: action.payload,
        error: null,
      };
    case SIGNUP_FAILURE:
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        isLoggedIn: false,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    case EDIT_PROFILE_REQUEST:
      return {
        ...state,
        editProfileLoading: true,
        editProfileError: null,
        editProfileSuccess: false,
      };
    case EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        editProfileLoading: false,
        editProfileSuccess: true,
        user: action.payload, // Update user data with the new profile
        editProfileError: null,
      };
    case EDIT_PROFILE_FAILURE:
      return {
        ...state,
        editProfileLoading: false,
        editProfileError: action.payload,
        editProfileSuccess: false,
      };
    case CLEAR_EDIT_PROFILE_STATUS:
      return {
        ...state,
        editProfileLoading: false,
        editProfileError: null,
        editProfileSuccess: false,
      };
    default:
      return state;
  }
};

export default userReducer; 
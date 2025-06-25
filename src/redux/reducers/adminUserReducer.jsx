import {
  FETCH_ADMIN_USERS_REQUEST,
  FETCH_ADMIN_USERS_SUCCESS,
  FETCH_ADMIN_USERS_FAILURE,
} from '../constants/actionTypes';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const adminUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
      };
    case FETCH_ADMIN_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        users: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default adminUserReducer; 
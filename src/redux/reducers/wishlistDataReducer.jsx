import {
  FETCH_WISHLIST_REQUEST,
  FETCH_WISHLIST_SUCCESS,
  FETCH_WISHLIST_FAILURE,
  REMOVE_FROM_WISHLIST_REQUEST,
  REMOVE_FROM_WISHLIST_SUCCESS,
  REMOVE_FROM_WISHLIST_FAILURE,
} from '../constants/actionTypes';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null,
      };
    case FETCH_WISHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        items: [],
        error: action.payload,
      };
    case REMOVE_FROM_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case REMOVE_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.filter(item => item.p_id !== action.payload),
        error: null,
      };
    case REMOVE_FROM_WISHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default wishlistDataReducer; 
import { ADD_TO_WISHLIST_REQUEST, ADD_TO_WISHLIST_SUCCESS, ADD_TO_WISHLIST_FAILURE } from '../constants/actionTypes';

const initialState = {
  addToWishlistLoading: false,
  addToWishlistSuccess: false,
  addToWishlistError: null,
  addToWishlistMessage: null,
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_WISHLIST_REQUEST:
      return {
        ...state,
        addToWishlistLoading: true,
        addToWishlistSuccess: false,
        addToWishlistError: null,
        addToWishlistMessage: null,
      };
    case ADD_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        addToWishlistLoading: false,
        addToWishlistSuccess: true,
        addToWishlistError: null,
        addToWishlistMessage: action.payload,
      };
    case ADD_TO_WISHLIST_FAILURE:
      return {
        ...state,
        addToWishlistLoading: false,
        addToWishlistSuccess: false,
        addToWishlistError: action.payload,
        addToWishlistMessage: null,
      };
    default:
      return state;
  }
};

export default wishlistReducer; 
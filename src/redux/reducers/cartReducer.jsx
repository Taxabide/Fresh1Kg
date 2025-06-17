import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
  LOGOUT,
} from '../constants/actionTypes';

const initialState = {
  items: [], // Array of cart items
  loading: false,
  error: null,
  addToCartLoading: false,
  addToCartError: null,
  addToCartMessage: null, // New field for success messages
};

const cartReducer = (state = initialState, action) => {
  console.log('Cart Reducer - Action dispatched:', action.type, action.payload);
  console.log('Cart Reducer - Current state:', state);
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
      console.log('Cart Reducer - Handling ADD_TO_CART_REQUEST');
      return {
        ...state,
        addToCartLoading: true,
        addToCartError: null,
        addToCartMessage: null, // Clear previous message on new request
      };
    case ADD_TO_CART_SUCCESS:
      console.log('Cart Reducer - Handling ADD_TO_CART_SUCCESS');
      return {
        ...state,
        addToCartLoading: false,
        addToCartError: null,
        addToCartMessage: action.payload.message, // Store the success message
      };
    case ADD_TO_CART_FAILURE:
      console.log('Cart Reducer - Handling ADD_TO_CART_FAILURE');
      return {
        ...state,
        addToCartLoading: false,
        addToCartError: action.payload,
        addToCartMessage: null, // Clear message on failure
      };
    case FETCH_CART_REQUEST:
      console.log('Cart Reducer - Handling FETCH_CART_REQUEST',FETCH_CART_REQUEST);
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CART_SUCCESS:
      console.log('Cart Reducer - Handling FETCH_CART_SUCCESS');
      return {
        ...state,
        loading: false,
        items: action.payload, // Use the mapped and prepared items directly
        error: null,
      };
    case FETCH_CART_FAILURE:
      console.log('Cart Reducer - Handling FETCH_CART_FAILURE');
      return {
        ...state,
        loading: false,
        error: action.payload,
        items: [],
      };
    case UPDATE_CART_ITEM_QUANTITY:
      console.log('Cart Reducer - Handling UPDATE_CART_ITEM_QUANTITY');
      return {
        ...state,
        items: state.items.map(item =>
          item.p_id === action.payload.productId
            ? { ...item, quantity: Math.max(1, item.quantity + action.payload.change) }
            : item
        ),
      };
    case REMOVE_CART_ITEM:
      console.log('Cart Reducer - Handling REMOVE_CART_ITEM');
      return {
        ...state,
        items: state.items.filter(item => item.cart_id !== action.payload),
      };
    case LOGOUT:
      console.log('Cart Reducer - Handling LOGOUT');
      return initialState; // Clear cart on logout
    default:
      return state;
  }
};

export default cartReducer; 
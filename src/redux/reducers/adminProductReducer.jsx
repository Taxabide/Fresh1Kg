import {
  FETCH_ADMIN_PRODUCTS_REQUEST,
  FETCH_ADMIN_PRODUCTS_SUCCESS,
  FETCH_ADMIN_PRODUCTS_FAILURE,
} from '../constants/actionTypes';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const adminProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null,
      };
    case FETCH_ADMIN_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        products: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default adminProductReducer; 
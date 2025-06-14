import {
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
} from '../constants/actionTypes';

const initialState = {
  products: {},
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: {
          ...state.products,
          [action.payload.categoryId === null ? 'searchResults' : String(action.payload.categoryId)]: action.payload.products,
        },
        error: null,
      };
    case SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        // When there's an error, we might want to clear products for that category
        // or handle it differently. For now, we'll keep existing products.
        // products: [], 
      };
    default:
      return state;
  }
};

export default productReducer; 
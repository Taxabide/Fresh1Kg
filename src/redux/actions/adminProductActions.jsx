import {
  FETCH_ADMIN_PRODUCTS_REQUEST,
  FETCH_ADMIN_PRODUCTS_SUCCESS,
  FETCH_ADMIN_PRODUCTS_FAILURE,
} from '../constants/actionTypes';

const PRODUCT_LIST_API = 'https://fresh1kg.com/api/all-product-list-api.php';

export const fetchAdminProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_ADMIN_PRODUCTS_REQUEST });

  try {
    const response = await fetch(PRODUCT_LIST_API);
    const responseText = await response.text();
    const data = JSON.parse(responseText);

    if (data.status === 'success' && Array.isArray(data.data)) {
      dispatch({ type: FETCH_ADMIN_PRODUCTS_SUCCESS, payload: data.data });
    } else {
      throw new Error(data.message || 'Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    dispatch({ 
      type: FETCH_ADMIN_PRODUCTS_FAILURE, 
      payload: error.message || 'Failed to fetch products. Please try again later.' 
    });
  }
}; 
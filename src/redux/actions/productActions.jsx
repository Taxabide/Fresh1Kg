import {
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
} from '../constants/actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_PRODUCTS_API_URL = 'https://fresh1kg.com/api/products-list-api.php';

export const searchProducts = (queryOrCategoryId) => async (dispatch) => {
  dispatch({ type: SEARCH_PRODUCTS_REQUEST });

  try {
    
    let apiUrl = BASE_PRODUCTS_API_URL;
    // let clientSideQueryFilter = null; // No longer needed for server-side search

    // Determine if queryOrCategoryId is a category ID (number) or a search query (string)
    if (typeof queryOrCategoryId === 'number') {
      // It's a category ID, append to API URL
      apiUrl = `${BASE_PRODUCTS_API_URL}?c_id=${queryOrCategoryId}`;
      
    } else if (typeof queryOrCategoryId === 'string' && queryOrCategoryId.trim() !== '') {
      // It's a search query, append to API URL for server-side filtering
      const encodedQuery = encodeURIComponent(queryOrCategoryId);
      apiUrl = `${BASE_PRODUCTS_API_URL}?search=${encodedQuery}`;
      
    }

    const response = await fetch(apiUrl);
    const data = await response.json();
    

    if (data.status === 'success' && Array.isArray(data.products)) {
      let productsToDispatch = data.products;

      // Client-side filtering is no longer needed as the API handles it
      // if (clientSideQueryFilter) {
      //   productsToDispatch = productsToDispatch.filter(
      //     (product) =>
      //       product.p_name.toLowerCase().includes(clientSideQueryFilter) ||
      //       product.p_description.toLowerCase().includes(clientSideQueryFilter)
      //   );
      // }

      dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: { products: productsToDispatch, categoryId: typeof queryOrCategoryId === 'number' ? queryOrCategoryId : null } });
      
      
    } else {
      
      throw new Error(data.message || 'Failed to fetch products');
    }
  } catch (error) {
    dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: error.message });
  }
}; 
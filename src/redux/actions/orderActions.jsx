import {
  PLACE_ORDER_REQUEST,
  PLACE_ORDER_SUCCESS,
  PLACE_ORDER_FAILURE,
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDER_DETAILS_REQUEST,
  FETCH_ORDER_DETAILS_SUCCESS,
  FETCH_ORDER_DETAILS_FAILURE,
} from '../constants/actionTypes';

export const placeOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: PLACE_ORDER_REQUEST });

    // Create a FormData object to send the data as 'form-data'
    const formData = new FormData();

    // Match keys to the working Postman request
    formData.append('user_id', orderData.userId);
    formData.append('phone', orderData.phone);
    formData.append('address', orderData.address);
    formData.append('current_address', orderData.currentAddress);
    formData.append('message', orderData.message);
    formData.append('latitude', orderData.latitude);
    formData.append('longitude', orderData.longitude);
    formData.append('payment_method', orderData.paymentMethod);
    formData.append('status', 'PLACED'); // Set default status
    formData.append('payment_status', 'PENDING'); // Set default payment status

    // The backend expects the products array as a JSON string.
    const productsForApi = orderData.products.map(p => ({
      product_id: p.productId,
      quantity: p.quantity,
      subtotal: p.subtotal,
      price: p.price,
      weight: p.weight,
    }));
    formData.append('products', JSON.stringify(productsForApi));

    const response = await fetch('https://fresh1kg.com/api/place-order-api.php', {
      method: 'POST',
      body: formData,
      // No 'Content-Type' header needed, fetch sets it automatically for FormData
    });

    // Check if the response is valid JSON before parsing
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (data.status === 'success') {
      dispatch({
        type: PLACE_ORDER_SUCCESS,
        payload: data,
      });
      return { success: true, message: data.message };
    } else {
      dispatch({
        type: PLACE_ORDER_FAILURE,
        payload: data.message || 'Failed to place order',
      });
      return { success: false, message: data.message || 'Failed to place order' };
    }
  } catch (error) {
    console.error('Place Order Error:', error);
    dispatch({
      type: PLACE_ORDER_FAILURE,
      payload: 'An unexpected error occurred. Please try again.',
    });
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
};

export const fetchOrders = userId => async dispatch => {
  dispatch({type: FETCH_ORDERS_REQUEST});
  try {
    const response = await fetch(
      `https://fresh1kg.com/api/my-orders-list-api.php?user_id=${userId}`,
    );
    const data = await response.json();

    if (data.status === 'success' && Array.isArray(data.data)) {
      dispatch({type: FETCH_ORDERS_SUCCESS, payload: data.data});
    } else {
      dispatch({
        type: FETCH_ORDERS_FAILURE,
        payload: data.message || 'Failed to fetch orders. Please try again.',
      });
    }
  } catch (error) {
    console.error('Network or parsing error:', error);
    dispatch({
      type: FETCH_ORDERS_FAILURE,
      payload:
        'An error occurred while fetching your orders. Please check your network connection.',
    });
  }
};

export const fetchOrderDetails = orderId => async (dispatch, getState) => {
  dispatch({ type: FETCH_ORDER_DETAILS_REQUEST });
  try {
    const userId = getState().user.user?.u_id;

    if (!userId) {
      throw new Error('User is not logged in.');
      }

    const response = await fetch(
      `https://fresh1kg.com/api/view-order-api.php?o_id=${orderId}&user_id=${userId}`,
    );
    const data = await response.json();

    if (data.status === 'success' && data.order) {
      dispatch({ type: FETCH_ORDER_DETAILS_SUCCESS, payload: data.order });
    } else {
      dispatch({
        type: FETCH_ORDER_DETAILS_FAILURE,
        payload: data.message || 'Failed to fetch order details.',
      });
    }
  } catch (error) {
    console.error('Fetch Order Details Error:', error);
    dispatch({
      type: FETCH_ORDER_DETAILS_FAILURE,
      payload: error.message || 'An error occurred while fetching order details.',
    });
  }
}; 
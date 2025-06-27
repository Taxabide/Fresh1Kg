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

const initialState = {
  loading: false,
  error: null,
  orders: [],
  orderDetailsLoading: false,
  orderDetailsError: null,
  orderDetails: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLACE_ORDER_REQUEST:
    case FETCH_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ORDER_DETAILS_REQUEST:
      return {
        ...state,
        orderDetailsLoading: true,
        orderDetailsError: null,
      };
    case PLACE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
      };
    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };
    case FETCH_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        orderDetailsLoading: false,
        orderDetails: action.payload,
      };
    case PLACE_ORDER_FAILURE:
    case FETCH_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ORDER_DETAILS_FAILURE:
      return {
        ...state,
        orderDetailsLoading: false,
        orderDetailsError: action.payload,
      };
    default:
      return state;
  }
};

export default orderReducer; 
import {
  SUBMIT_CONTACT_REQUEST,
  SUBMIT_CONTACT_SUCCESS,
  SUBMIT_CONTACT_FAILURE,
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_CONTACT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
        message: null,
      };
    case SUBMIT_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
        message: action.payload,
      };
    case SUBMIT_CONTACT_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
        message: null,
      };
    default:
      return state;
  }
};

export default contactReducer; 
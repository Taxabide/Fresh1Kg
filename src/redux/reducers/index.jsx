import { combineReducers } from 'redux';
import userReducer from './userReducer.jsx';
import productReducer from './productReducer.jsx';
import cartReducer from './cartReducer.jsx';
import wishlistReducer from './wishlistReducer.jsx';
import wishlistDataReducer from './wishlistDataReducer.jsx';
import contactReducer from './contactReducer.jsx';
import adminUserReducer from './adminUserReducer.jsx';
import adminProductReducer from './adminProductReducer.jsx';

const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  wishlistData: wishlistDataReducer,
  contact: contactReducer,
  adminUsers: adminUserReducer,
  adminProducts: adminProductReducer,
});

export default rootReducer; 

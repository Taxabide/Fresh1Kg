import { combineReducers } from 'redux';
import userReducer from './userReducer.jsx';
import productReducer from './productReducer.jsx';
import cartReducer from './cartReducer.jsx';
import wishlistReducer from './wishlistReducer.jsx';
import wishlistDataReducer from './wishlistDataReducer.jsx';

const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  wishlistData: wishlistDataReducer,
});

export default rootReducer; 

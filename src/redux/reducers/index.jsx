import { combineReducers } from 'redux';
import userReducer from './userReducer.jsx';

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer; 

import { combineReducers } from 'redux';
import web3Reducer from './web3Reducer';
import userReducer from './userReducer';
import eventReducer from './eventReducer';

export default combineReducers({
    web3: web3Reducer,
    user: userReducer,
    events: eventReducer
});

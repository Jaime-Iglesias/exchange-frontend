import { combineReducers } from 'redux';
import web3Reducer from './web3Reducer';
import userReducer from './userReducer';
import eventReducer from './eventReducer';
import tokenReducer from './tokenReducer';

export default combineReducers({
    web3: web3Reducer,
    user: userReducer,
    tokens: tokenReducer,
    events: eventReducer
});

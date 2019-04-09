import {  } from '../actions/types';

const initialState = {
    userAccount: '',
    netWorkId: -1,
    
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LOAD_WEB3:
            return {
                ...state,
                web3Instance: action.payload
            };
        default:
            return state;
    }
}

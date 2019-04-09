import { LOAD_WEB3, GET_NETWORK, GET_EXCHANGE, GET_TOKEN } from '../actions/types';

const initialState = {
    web3Instance: null,
};

export default function(state = initialState, action) {
    console.log('reducer', action);
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

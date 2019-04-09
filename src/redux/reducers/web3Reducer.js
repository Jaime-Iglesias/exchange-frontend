import { LOAD_WEB3, GET_ACCOUNT, GET_NETWORK, GET_EXCHANGE, GET_TOKEN } from '../actions/types';

const initialState = {
    web3Instance: null,
    userAddress: '',
    networkId: -1,
    exchangeContract: null,
    tokenContract: null
};

export default function(state = initialState, action) {
    console.log('reducer running', action);
    switch(action.type) {
        case LOAD_WEB3:
            return {
                ...state,
                web3Instance: action.payload
            };
        case GET_ACCOUNT:
            return {
                ...state,
                userAddress: action.payload
            };
        case GET_NETWORK:
            return {
                ...state,
                networkId: action.payload
            };
        case GET_EXCHANGE:
            return {
                ...state,
                exchangeContract: action.payload
            };
        case GET_TOKEN:
            return {
                ...state,
                tokenContract: action.payload
            };
        default:
            return state;
    }
}

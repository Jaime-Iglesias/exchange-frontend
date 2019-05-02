import { WEB3_LOAD, GET_NETWORK, IS_METAMASK_UNLOCKED,
         INSTANTIATE_CONTRACTS, CONTEXT_LOAD_ERROR  } from '../actions/types';

const initialState = {
    zeroAddress: '0x0000000000000000000000000000000000000000',
    web3Instance: null,
    netWorkId: -1,
    metamaskUnlocked: false,
    exchangeContract: null,
    error: ''
};

export default function(state = initialState, action) {
    //console.log('web3Reducer', action.type, action.payload);
    switch(action.type) {
        case WEB3_LOAD:
            return {
                ...state,
                web3Instance: action.payload
            };
        case GET_NETWORK:
            return {
                ...state,
                netWorkId: action.payload
            };
        case IS_METAMASK_UNLOCKED:
            return {
                ...state,
                metamaskUnlocked: action.payload
            };
        case INSTANTIATE_CONTRACTS:
            return {
                ...state,
                exchangeContract: action.payload
            };
        case CONTEXT_LOAD_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}

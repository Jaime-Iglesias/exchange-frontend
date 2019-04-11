import { LOADING_CONTEXT, WEB3_LOAD, GET_NETWORK, IS_METAMASK_UNLOCKED, INSTANTIATE_CONTRACTS, CONTEXT_LOAD_ERROR, CONTEXT_LOADED  } from '../actions/types';

const initialState = {
    zeroAddress: '0x0000000000000000000000000000000000000000',
    isLoading: false,
    isLoaded: false,
    web3Instance: null,
    netWorkId: -1,
    metamaskUnlocked: false,
    exchangeContract: null,
    tokenContract: null,
    error: ''
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_CONTEXT:
            return {
                ...state,
                isLoading: action.payload
            };
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
                exchangeContract: action.payload.exchangeContract,
                tokenContract: action.payload.tokenContract
            };
        case CONTEXT_LOADED:
            return {
                ...state,
                isLoaded: action.payload.isLoaded,
                isLoading: action.payload.isLoading
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

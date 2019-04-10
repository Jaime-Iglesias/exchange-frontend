import { WEB3_LOAD, GET_NETWORK, IS_METAMASK_UNLOCKED, INSTANTIATE_CONTRACTS  } from '../actions/types';

const initialState = {
    web3Instance: null,
    netWorkId: -1,
    metamaskUnlocked: false,
    exchangeContract: null,
    tokenContract: null
};

export default function(state = initialState, action) {
    console.log('reducer', action);
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
                exchangeContract: action.payload.exchangeContract,
                tokenContract: action.payload.tokenContract
            };
        default:
            return state;
    }
}

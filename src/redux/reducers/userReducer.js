import { GET_ACCOUNT, GET_ETH, GET_TOKENS, GET_ETH_CONTRACT, GET_TOKENS_CONTRACT, USER_ERROR } from '../actions/types';

const initialState = {
    userAccount: '',
    userEthBalance: -1,
    userTokenBalance: -1,
    userEthContractBalance: {
        available: -1,
        locked: -1
    },
    userTokenContractBalance: {
        available: -1,
        locked: -1
    },
    error: ''
};

export default function(state = initialState, action) {
    //console.log('userReducer', action.type, action.payload);
    switch(action.type) {
        case GET_ACCOUNT:
            return {
                ...state,
                userAccount: action.payload
            };
        case GET_ETH:
            return {
                ...state,
                userEthBalance: action.payload
            };
        case GET_TOKENS:
            return {
                ...state,
                userTokenBalance: action.payload
            }
        case GET_ETH_CONTRACT:
            return {
                ...state,
                userEthContractBalance: {
                    ...state.userEthContractBalance,
                    available: action.payload.available,
                    locked: action.payload.locked
                }
            };
        case GET_TOKENS_CONTRACT:
            return {
                ...state,
                userTokenContractBalance: {
                    ...state.userTokenContractBalance,
                    available: action.payload.available,
                    locked: action.payload.locked
                }
            };
        case USER_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
}

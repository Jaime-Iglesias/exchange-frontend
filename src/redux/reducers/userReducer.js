import { GET_ACCOUNT, GET_ETH, GET_TOKENS, GET_ETH_CONTRACT, GET_TOKENS_CONTRACT, USER_ERROR } from '../actions/types';

const initialState = {
    userAccount: '',
    userEthBalance: -1,
    userTokenBalance: -1,
    userEthContractBalance: -1,
    userTokenContractBalance: -1,
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
                userEthContractBalance: action.payload
            };
        case GET_TOKENS_CONTRACT:
            return {
                ...state,
                userTokenContractBalance: action.payload
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

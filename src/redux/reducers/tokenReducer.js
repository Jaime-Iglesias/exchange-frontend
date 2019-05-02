import { GET_TRADEABLE_TOKENS, SET_TOKEN, TOKEN_ERROR } from '../actions/types';
const initialState = {
    tokenList: [],
    selectedToken: null,
    error: ''
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_TRADEABLE_TOKENS:
            return {
                ...state,
                tokenList: action.payload
            };
        case SET_TOKEN:
            return {
                ...state,
                selectedToken: action.payload
            };
        case TOKEN_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}

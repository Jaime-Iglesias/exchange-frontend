import { GET_ORDER_LIST } from '../actions/types';

const initialState = {
    orders: [],
    error: ''
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ORDER_LIST:
            return {
                ...state,
                orders: action.payload
            };
        default:
            return state;
    }
}

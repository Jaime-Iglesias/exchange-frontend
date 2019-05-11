import { GET_ORDER_LIST, GET_ORDER_ERROR } from '../actions/types';

const initialState = {
    buyOrders: [],
    sellOrders: [],
    error: ''
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ORDER_LIST:
            return {
                ...state,
                buyOrders: action.payload.buyOrders,
                sellOrders: action.payload.sellOrders
            };
        case GET_ORDER_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
}

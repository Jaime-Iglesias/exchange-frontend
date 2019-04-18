import { INIT_DEPOSIT_EMITTER, INIT_WITHDRAW_EMITTER,
         ADD_DEPOSIT_EVENT, ADD_WITHDRAW_EVENT,
         REMOVE_DEPOSIT_EVENT, REMOVE_WITHDRAW_EVENT,
         EVENT_ERROR, LOAD_PAST_ORDERS,
         LOAD_PAST_DEPOSITS, LOAD_PAST_WITHDRAWS } from '../actions/types';

const initialState = {
    expiration: 10000,
    orders: [],
    depositEmitter: null,
    depositEvents: [],
    withdrawEmitter: null,
    withdrawEvents: [],
    error: ''
};

export default function(state = initialState, action) {
    //console.log('eventReducer', action.type, action.payload);
    switch(action.type) {
        case INIT_DEPOSIT_EMITTER:
            return {
                ...state,
                depositEmitter: action.payload
            };
        case INIT_WITHDRAW_EMITTER:
            return {
                ...state,
                withdrawEmitter: action.payload
            };
        case ADD_DEPOSIT_EVENT:
            return {
                ...state,
                depositEvents: [...state.depositEvents, action.payload]
            };
        case ADD_WITHDRAW_EVENT:
            return {
                ...state,
                withdrawEvents: [...state.withdrawEvents, action.payload]
            };
        case REMOVE_DEPOSIT_EVENT:
            return {
                ...state,
                depositEvents: state.depositEvents.filter(item => item !== action.payload)
            };
        case REMOVE_WITHDRAW_EVENT:
            return {
                ...state,
                withdrawEvents: state.withdrawEvents.filter(item => item !== action.payload)
            };
        case LOAD_PAST_DEPOSITS:
            return {
                ...state,
                depositEvents: action.payload
            };
        case LOAD_PAST_WITHDRAWS:
            return {
                ...state,
                withdrawEvents: action.payload
            };
        case LOAD_PAST_ORDERS:
            return {
                ...state,
                orders: action.payload
            };
        case EVENT_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
}

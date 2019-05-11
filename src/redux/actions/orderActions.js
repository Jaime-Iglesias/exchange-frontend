import { GET_ORDER_LIST } from '../actions/types';

export function getOpenOrders() {
    return async function(dispatch, getState) {
        try {
            const state = getState();
            const orders = await state.web3.exchangeContract.methods.getOpenOrders().call( { from: state.user.userAccount });
            console.log(orders, "orders");
        } catch (err) {
            console.log(err.message);
        }
    }
}

export function getOrder() {
    return async function(dispatch, getState) {
        try {
            const state = getState();
            const order = await state.web3.exchangeContract.methods.getOrder(1).call( { from: state.user.userAccount });
            console.log(order, "order");
        } catch (err) {
            console.log(err.message);
        }
    }
}

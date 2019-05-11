import { GET_ORDER_LIST, GET_ORDER_ERROR } from '../actions/types';

export function getOpenOrders() {
    return async function(dispatch, getState) {
        try {
            const state = getState();
            const orders = await state.web3.exchangeContract.methods.getOpenOrders().call( { from: state.user.userAccount });

            const formatedOrders = orders[0].map( (item, index) =>  {
                const container = {};
                container.orderMaker = item.orderMaker;
                container.haveTokenId = item.haveTokenId.toString();
                container.haveTokenAmount = item.haveAmount.toString();
                container.wantTokenId = item.wantTokenId.toString();
                container.wantTokenAmount = item.wantAmount.toString();
                container.creationBlock = item.creationBlock.toString();
                container.realIndex = orders[1][index].toString();
                return container;
            });

            const buyOrders = formatedOrders.filter(item => item.haveTokenId === "1");
            const sellOrders = formatedOrders.filter(item => item.haveTokenId !== "1");

            dispatch({
                type: GET_ORDER_LIST,
                payload: {
                    buyOrders: buyOrders,
                    sellOrders: sellOrders
                }
            });

        } catch (err) {
            dispatch({
                type: GET_ORDER_ERROR,
                payload: err.message
            });
            console.log(err.message);
        }
    }
}

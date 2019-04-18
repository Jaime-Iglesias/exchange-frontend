import { INIT_DEPOSIT_EMITTER, INIT_WITHDRAW_EMITTER,
         ADD_DEPOSIT_EVENT, ADD_WITHDRAW_EVENT,
         REMOVE_DEPOSIT_EVENT, REMOVE_WITHDRAW_EVENT,
         EVENT_ERROR, LOAD_PAST_ORDERS,
         LOAD_PAST_DEPOSITS, LOAD_PAST_WITHDRAWS } from '../actions/types';

export function depositListener() {
    return function(dispatch, getState) {
        try{
            const state = getState();
            const depositEmitter = state.web3.exchangeContract.events.LogDepositToken({
                filter: { _user: state.user.userAccount }
            });

            dispatch({
                type: INIT_DEPOSIT_EMITTER,
                payload: depositEmitter
            });

            depositEmitter.on('data', (event) => {
                if (state.events.depositEvents.indexOf(event.logIndex) === -1) {
                    dispatch({
                        type: ADD_DEPOSIT_EVENT,
                        payload: event
                    });
                }
            });

            depositEmitter.on('changed', (event) => {
                dispatch({
                    type: REMOVE_DEPOSIT_EVENT,
                    payload: event
                });
            });

            depositEmitter.on('error', (error) => {
                dispatch({
                    type: EVENT_ERROR,
                    payload: error.message || 'Something went wrong'
                });
            });

        } catch (err) {
            dispatch({
                type: EVENT_ERROR,
                payload: err.message || 'Something went wrong'
            });
        }
    }
}

export function withdrawListener() {
    return function(dispatch, getState) {
        try{
            const state = getState();
            const withdrawEmitter = state.web3.exchangeContract.events.LogWithdrawToken({
                filter: { _user: state.user.userAccount }
            });

            dispatch({
                type: INIT_WITHDRAW_EMITTER,
                payload: withdrawEmitter
            });

            withdrawEmitter.on('data', (event) => {
                if (state.events.withdrawEvents.indexOf(event.logIndex) === -1) {
                    dispatch({
                        type: ADD_WITHDRAW_EVENT,
                        payload: event
                    });
                }
            });

            withdrawEmitter.on('changed', (event) => {
                dispatch({
                    type: REMOVE_WITHDRAW_EVENT,
                    payload: event
                });
            });

            withdrawEmitter.on('error', (error) => {
                dispatch({
                    type: EVENT_ERROR,
                    payload: error.message || 'Something went wrong'
                });
            });
        } catch (err) {
            dispatch({
                type: EVENT_ERROR,
                payload: err.message || 'Something went wrong'
            });
        }
    }
}

export function getPastDeposits() {
    return async function(dispatch, getState) {
        try{
            const state = getState();
            const currentBlock = await state.web3.web3Instance.eth.getBlockNumber();
            const depositEvents = await state.web3.exchangeContract.getPastEvents('LogDepositToken', {
                _user: state.user.userAccount,
                fromBlock: currentBlock - state.events.expiration,
                toBlock: 'latest'
            });

            dispatch({
                type: LOAD_PAST_DEPOSITS,
                payload: depositEvents
            });

        } catch (err) {
            console.log(err);
            dispatch({
                type: EVENT_ERROR,
                payload: err.message || 'Someting went wrong'
            });
        }
    }
}

export function getPastWithdraws() {
    return async function(dispatch, getState) {
        try{
            const state = getState();
            const currentBlock = await state.web3.web3Instance.eth.getBlockNumber();
            const withdrawEvents = await state.web3.exchangeContract.getPastEvents('LogWithdrawToken', {
                _user: state.user.userAccount,
                fromBlock: currentBlock - state.events.expiration,
                toBlock: 'latest'
            });

            dispatch({
                type: LOAD_PAST_WITHDRAWS,
                payload: withdrawEvents
            });

        } catch (err) {
            console.log(err);
            dispatch({
                type: EVENT_ERROR,
                payload: err.message || 'Someting went wrong'
            });
        }
    }
}

export function getPastOrders() {
    return async function(dispatch, getState) {
        try{
            const state = getState();
            const currentBlock = await state.web3.web3Instance.eth.getBlockNumber();
            const orders = await state.web3.exchangeContract.getPastEvents('LogOrder', {
                fromBlock: currentBlock - state.events.expiration,
                toBlock: 'latest'
            });

            dispatch({
                type: LOAD_PAST_ORDERS,
                payload: orders
            });

        } catch (err) {
            console.log(err);
            dispatch({
                type: EVENT_ERROR,
                payload: err.message || 'Someting went wrong'
            });
        }
    }
}

export function createNewOrder() {

}

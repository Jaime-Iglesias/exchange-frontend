import { GET_ACCOUNT, GET_ETH, GET_TOKENS, GET_ETH_CONTRACT, GET_TOKENS_CONTRACT, USER_ERROR } from './types.js';

export function getAccount() {
    return async function (dispatch, getState) {
        const state = getState();
        try{
            const accounts = await state.web3.web3Instance.eth.getAccounts();
            dispatch({
                type: GET_ACCOUNT,
                payload: accounts[0]
            });
        } catch (err) {
            dispatch({
                type: USER_ERROR,
                payload: err.message || 'failed to retrieve account'
            });
        }
    }
}

export function getUserEthBalance() {
    return async function (dispatch, getState) {
        const state = getState();
        try{
            const balanceWei = await state.web3.web3Instance.eth.getBalance(state.user.userAccount);
            const balance = state.web3.web3Instance.utils.fromWei(balanceWei, 'ether');
            dispatch({
                type: GET_ETH,
                payload: balance
            });
        } catch (err) {
            console.log(err);
            dispatch({
                type: USER_ERROR,
                payload: err.message
            })
        }
    }
}

export function getUserTokenBalance() {
    return async function (dispatch, getState) {
        const state = getState();
        try{
            const balanceBN = await state.web3.exchangeContract.methods.balanceOf(state.web3.tokenContract.options.address).call( { from: state.user.userAccount });
            const balance = balanceBN.toString();
            dispatch({
                type: GET_TOKENS,
                payload: balance
            });
        } catch (err) {
            dispatch({
                type: USER_ERROR,
                payload: err.message
            });
        }
    }
}

export function getUserContractEthBalance() {
    return async function (dispatch, getState) {
        const state = getState();
        try {
            const balanceBN = await state.web3.exchangeContract.methods.getUserBalanceForToken(state.web3.zeroAddress).call( { from: state.user.userAccount });
            const balanceWei = balanceBN.toString();
            const balance = state.web3.web3Instance.utils.fromWei(String(balanceWei), 'ether');
            dispatch({
                type: GET_ETH_CONTRACT,
                payload: balance
            });
        } catch (err) {
            dispatch({
                type: USER_ERROR,
                payload: err.message
            });
        }
    }
}

export function getUserContractTokenBalance() {
    return async function (dispatch, getState) {
        const state = getState();
        try {
            const balanceBN = await state.web3.exchangeContract.methods.getUserBalanceForToken(state.web3.tokenContract.options.address).call( { from: state.user.userAccount});
            const balance = balanceBN.toString();
            dispatch({
                type: GET_TOKENS_CONTRACT,
                payload: balance
            });
        } catch (err) {
            dispatch({
                type: USER_ERROR,
                payload: err.message
            });
        }
    }
}

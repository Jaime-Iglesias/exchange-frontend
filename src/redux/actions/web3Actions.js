import { LOADING_CONTEXT, WEB3_LOAD, GET_NETWORK, IS_METAMASK_UNLOCKED,
        INSTANTIATE_CONTRACTS, CONTEXT_LOAD_ERROR, CONTEXT_LOADED } from './types';

import Web3 from 'web3';

import Exchange from '../../contracts/MyExchange.json';
import TestingToken from '../../contracts/TestingToken.json';

const options = {
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

export function getWeb3() {
    return async dispatch => {
        dispatch({
            type: LOADING_CONTEXT,
            payload: true
        });
        // Modern dapp browsers...
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum, null, options);
            console.log('web3 version', web3.version);
            console.log('web3 confirmation blocks', web3.transactionConfirmationBlocks);
            //Ask user permission
            try{
                await window.ethereum.enable();
                dispatch({
                    type: WEB3_LOAD,
                    payload: web3
                });
                dispatch(getNetwork());
            } catch (err) {
                dispatch({
                    type: CONTEXT_LOAD_ERROR,
                    payload: err.message || 'Something went wrong.'
                });
            }
        } else if (window.web3) {
            // Legacy dapp browsers...
            const web3 = new Web3(window.web3, undefined, { transactionConfirmationBlocks: 1, });
            dispatch({
                types: WEB3_LOAD,
                payload: web3
            });
            dispatch(getNetwork());
        } else {
            dispatch({
                type: CONTEXT_LOAD_ERROR,
                payload: 'No web3 detected, please consider using MetaMask'
            });
        }
    }
}

export function getNetwork() {
    return async function(dispatch, getState) {
        try {
            const state = getState();
            const networkId = await state.web3.web3Instance.eth.net.getId();
            if (networkId === 5777) {
                dispatch({
                    type: GET_NETWORK,
                    payload: networkId
                });
                dispatch(isMetaMaskUnlocked());
            } else {
                dispatch({
                    type: CONTEXT_LOAD_ERROR,
                    payload: 'Wrong network, please change to local network.'
                });
            }

        } catch (err) {
            console.log(err);
            dispatch({
                type: CONTEXT_LOAD_ERROR,
                payload: err.message || 'Something went wrong'
            });
        }
    }
}

export function isMetaMaskUnlocked() {
    return async function(dispatch, getState) {
        try {
            const state = getState();
            const accounts = await state.web3.web3Instance.eth.getAccounts();
            if (accounts.length > 0) {
                dispatch({
                    type: IS_METAMASK_UNLOCKED,
                    payload: true
                });
                dispatch(getContracts());
            } else {
                dispatch({
                    type: CONTEXT_LOAD_ERROR,
                    payload: 'please, unlock metamask.'
                });
            }
        } catch (err) {
            dispatch({
                type: CONTEXT_LOAD_ERROR,
                payload: err.message || 'Something went wrong'
            });
        }
    }
}

export function getContracts() {
    return async function(dispatch, getState) {
        try{
            const state = getState();
            const exchangeContract = new state.web3.web3Instance.eth.Contract(Exchange.abi, Exchange.networks[state.web3.netWorkId].address);
            const tokenContract = new state.web3.web3Instance.eth.Contract(TestingToken.abi, TestingToken.networks[state.web3.netWorkId].address);
            if (exchangeContract && tokenContract) {
                dispatch({
                    type: INSTANTIATE_CONTRACTS,
                    payload: {
                        exchangeContract: exchangeContract,
                        tokenContract: tokenContract
                    }
                });
                dispatch({
                    type: CONTEXT_LOADED,
                    payload: {
                        isLoading: false,
                        isLoaded: true
                    }
                });
            } else{
                dispatch({
                    type: CONTEXT_LOAD_ERROR,
                    payload: 'Could not instantiate contracts'
                })
            }
        } catch (err) {
            dispatch({
                type: CONTEXT_LOAD_ERROR,
                payload: err.message || 'Something went wrong'
            });
        }
    }
}

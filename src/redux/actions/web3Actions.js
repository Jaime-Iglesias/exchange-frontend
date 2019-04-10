import { WEB3_LOAD, WEB3_LOAD_ERROR,
        GET_NETWORK, NETWORK_ERROR,
        IS_METAMASK_UNLOCKED, METAMASK_UNLOCKED_ERROR,
        INSTANTIATE_CONTRACTS, CONTRACT_INSTANTIATION_ERROR } from './types';

import Web3 from 'web3';

import Exchange from '../../contracts/MyExchange.json';
import TestingToken from '../../contracts/TestingToken.json';

export function getWeb3() {
    return async dispatch => {
        // Modern dapp browsers...
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            //Ask user permission
            try{
                await window.ethereum.enable();
                console.log(web3.version);
                dispatch({
                    type: WEB3_LOAD,
                    payload: web3
                });
                dispatch(getNetwork());
            } catch (err) {
                dispatch({
                    type: WEB3_LOAD_ERROR,
                    payload: err.message || 'Something went wrong.'
                });
            }
        } else if (window.web3) {
            // Legacy dapp browsers...
            const web3 = window.web3;
            dispatch({
                types: WEB3_LOAD,
                payload: web3
            });
            dispatch(getNetwork());
        } else {
            dispatch({
                type: WEB3_LOAD_ERROR,
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
                    type: NETWORK_ERROR,
                    payload: 'Wrong network, please change to local network.'
                });
            }

        } catch (err) {
            console.log(err);
            dispatch({
                type: NETWORK_ERROR,
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
                    type: METAMASK_UNLOCKED_ERROR,
                    payload: false
                });
            }
        } catch (err) {
            dispatch({
                type: METAMASK_UNLOCKED_ERROR,
                payload: err.message || 'Something went wrong'
            });
        }
    }
}

export function getContracts() {
    return async function(dispatch, getState) {
        try{
            const state = getState();
            console.log(state);
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
            } else{
                dispatch({
                    type: CONTRACT_INSTANTIATION_ERROR,
                    payload: 'Could not instantiate contracts'
                })
            }
        } catch (err) {
            dispatch({
                type: CONTRACT_INSTANTIATION_ERROR,
                payload: err.message || 'Something went wrong'
            });
        }
    }
}

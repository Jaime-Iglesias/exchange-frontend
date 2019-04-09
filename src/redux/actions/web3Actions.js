import { LOAD_WEB3, WEB3_LOAD_ERROR } from './types';
import Web3 from 'web3';

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
                    type: 'LOAD_WEB3',
                    payload: web3
                });
            } catch (err) {
                console.log(err);
                dispatch({
                    type: 'WEB3_LOAD_ERROR',
                    payload: err
                });
            }
        } else if (window.web3) {
            // Legacy dapp browsers...
            const web3 = window.web3;
            console.log("Injected web3 detected.");
            dispatch({
                types: 'LOAD_WEB3',
                payload: web3
            });
        } else {
            console.log("No web3 detected, please consider using Metamask");
            dispatch({
                type: 'WEB3_LOAD_ERROR',
                payload: 'No web3 detected'
            });
        }
    }
}

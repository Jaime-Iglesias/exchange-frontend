import Web3 from 'web3';

import { LOAD_WEB3, GET_ACCOUNT, GET_NETWORK } from './types';

const getWeb3 = () =>
    new Promise((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                      // Request account access if needed
                      await window.ethereum.enable();
                      // Acccounts now exposed
                      //dispatch web3 loaded
                      resolve(web3);
                } catch (error) {
                    reject(error);
                }
             }
              // Legacy dapp browsers...
             else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                //dispatch web3 loaded
                resolve(web3);
             }
             else {
                console.log("No web3 instance injected");
             }
        });
    });

export const loadWeb3 = () => dispatch => {
    const web3 = getWeb3();
    console.log('action');
    dispatch({
        type: LOAD_WEB3,
        payload: web3
    });
}

export const getAccount = () => dispatch => {
    //get the account
}

export const getNetwork = () => dispatch => {
    //get the network
}

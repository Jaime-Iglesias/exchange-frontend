import React, { Component } from 'react';
import Web3 from 'web3';

import Exchange from '../contracts/MyExchange.json';
import TestingToken from '../contracts/TestingToken.json';

import App from '../App';

class Web3Provider extends Component {
        constructor(props) {
            super(props);

            this.expectedNetworkId = 5777;

            this.state = {
                web3: null,
                isMetamaskInstalled: false,
                isMetamaskUnlocked: false,
                networkId: -1,
                userAccount: '',
                userBalance: -1,
                exchangeContract: null,
                tokenContract: null,
            };
        }

        componentDidMount() {
            this.getWeb3();
        }

        async getWeb3() {
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                //Ask user permission
                try{
                    await window.ethereum.enable();
                    this.setState({
                        web3,
                    });
                    console.log(web3.version);
                    this.isMetamaskInstalled();
                } catch (err) {
                    console.log(err);
                }
            // Legacy dapp browsers...
            } else if (window.web3) {
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                this.setState({
                    web3,
                });
                this.isMetamaskInstalled();
            }
        }

        isMetamaskInstalled() {
            if (this.state.web3.givenProvider) {
                this.setState({
                    isMetamaskInstalled: true,
                });

                this.isMetamaskUnlocked();
            }
        }

        async isMetamaskUnlocked() {
                try {
                    const accounts = await this.state.web3.eth.getAccounts();
                    if (accounts.length > 0) {
                        this.setState({
                            isMetamaskUnlocked: true,
                        });

                        this.getNetworkInfo();
                    }
                } catch (err) {
                    console.log(err);
                }
        }

        async getNetworkInfo() {
            try {
                const networkId = await this.state.web3.eth.net.getId();
                if (networkId === this.expectedNetworkId) {
                    this.setState({
                        networkId,
                    });

                    this.getUserInfo();
                }
            } catch (err) {
                console.log(err);
            }
        }

        async getUserInfo() {
            try {
                const accounts = await this.state.web3.eth.getAccounts();
                const balanceWei = await this.state.web3.eth.getBalance(accounts[0]);
                const balance = this.state.web3.utils.fromWei(balanceWei, 'ether');
                this.setState({
                    userAccount: accounts[0],
                    userBalance: balance,
                });

                this.getExchangeContract();
            } catch (err) {
                console.log(err);
            }
        }

        async getExchangeContract() {
            try {
                const exchangeContract = new this.state.web3.eth.Contract(Exchange.abi, Exchange.networks[this.state.networkId].address);
                this.setState({
                    exchangeContract,
                });

                this.getTokenContract();
            } catch (err) {
                console.log(err);
            }
        }

        async getTokenContract() {
            try {
                const tokenContract = new this.state.web3.eth.Contract(TestingToken.abi, TestingToken.networks[this.state.networkId].address);
                this.setState({
                    tokenContract,
                });

            } catch (err) {
                console.log(err);
            }
        }

        checkInfo() {
            const {
                isMetamaskInstalled,
                isMetamaskUnlocked,
                networkId,
                userAccount,
                userBalance,
                exchangeContract,
                tokenContract,
            } = this.state;

            if (isMetamaskInstalled === false) {
                console.log('You need to install metamask!');
                return;
            }

            if (isMetamaskUnlocked === false) {
                console.log('Please, unlock your metamask');
                return;
            }

            if (networkId !== this.expectedNetworkId ) {
                console.log('Wrong network, please change to a local network');
                return;
            }

            if (userAccount === '' || userBalance === -1) {
                console.log('Please unlock your account');
                return;
            }

            if (exchangeContract === null) {
                console.log('Could not instanciate exchange contract');
                return;
            }

            if (tokenContract === null) {
                console.log('Could not instanciate token contract');
                return;
            }

            return (
                <App
                    userAccount = { this.state.userAccount }
                    userBalance = { this.state.userBalance }
                    exchangeContract = { this.state.exchangeContract }
                    tokenContract = { this.state.tokenContract }
                />
            );
        }

        render() {
            return(
                <div> { this.checkInfo() } </div>
            );
        }
}

export default Web3Provider;

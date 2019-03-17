import React, { Component } from 'react'
import './App.css'

import Header from "./components/Header"
import GetWeb3 from './components/GetWeb3'
import Exchange from './contracts/MyExchange.json'
import TestingToken from './contracts/TestingToken.json'
import MyExchange from './components/MyExchange'

class App extends Component {

    constructor(props) {
        super(props)
        this.state ={
            web3: null,
            network: -1,
            account: '',
            dapp: null,
            token: null,
            loaded: false,
        }
    }

    componentWillMount() {
        this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const expectedNetwork = 5777
        try {
            const web3 = await GetWeb3()
            const network = await web3.eth.net.getId()
            const accounts = await web3.eth.getAccounts()
            if (network === expectedNetwork) {
                const exchangeContract = new web3.eth.Contract(Exchange.abi, Exchange.networks[network].address)
                const tokenContract = new web3.eth.Contract(TestingToken.abi, TestingToken.networks[network].address)
                this.setState( {
                    web3,
                    network,
                    account: accounts[0],
                    dapp: exchangeContract,
                    token: tokenContract,
                    loaded: true,
                })
            } else {
                console.log("Current version of this app is only supported by a local network, please run a local Ganache to use it")
            }
        } catch (err) {
            console.log(err)
        }
    }

    renderApp() {
        if (this.state.loaded === false) {
            return ( <p> Loading... </p> )
        } else {
            return(
                <div>
                    <Header/>
                    <h1>  Hello World!  </h1>
                    <p> Your account: { this.state.account } </p>
                    <p> The network: { this.state.network } </p>
                </div>
            )
        }
    }

    render() {
        return(
          <div> { this.renderApp() } </div>
        )
    }
}

export default App

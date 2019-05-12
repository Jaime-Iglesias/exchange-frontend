import React, { Component } from 'react';

import { Grid, CssBaseline } from '@material-ui/core';

import { connect } from 'react-redux';
import { getWeb3, getNetwork, isMetaMaskUnlocked, getContracts } from './redux/actions/web3Actions';
import { getAccount } from './redux/actions/userActions';
import { getTokens } from './redux/actions/tokenActions';

import Header from './components/Header';
import Funds from './components/Funds';
import TxHistory from './components/TxHistory';
import CreateOrders from './components/CreateOrders';
import OrderList from './components/OrderList';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isLoaded: false
        };
    }

    async componentDidMount() {
        await this.props.getWeb3();
        await this.props.getNetwork();
        await this.props.isMetaMaskUnlocked();
        await this.props.getContracts();
        await this.props.getAccount();
        await this.props.getTokens();
        if (this.props.Web3Error === '' && this.props.tokenError === '') {
            this.setState({
                isLoading: false,
                isLoaded: true
            });
        }
    }

    render() {
        const { Web3Error, tokenError } = this.props;
        const { isLoading, isLoaded } = this.state;
        return(
            <React.Fragment>
                <CssBaseline />
                { isLoading && <div className="spinner-border"/> }
                { isLoaded && Web3Error === '' && tokenError === '' &&
                    <React.Fragment>
                        <Header/>
                        <br/>
                        <Grid container spacing = { 8 } direction = 'row' alignItems = 'flex-start' justify = 'center'>
                            <Grid item sm = { 5 }>
                                <Funds />
                            </Grid>
                            <Grid item sm = { 4 }>
                                <CreateOrders />
                            </Grid>
                        </Grid>
                        <Grid container spacing = { 8 } direction = 'row' alignItems = 'flex-start' justify = 'center'>
                            <Grid item sm = { 3 }>
                                <TxHistory />
                            </Grid>
                            <Grid item sm = { 7}>
                                <OrderList />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    Web3Error: state.web3.error,
    tokenError: state.tokens.error
});

export default connect(mapStateToProps, { getWeb3, getNetwork, isMetaMaskUnlocked, getContracts, getAccount, getTokens })(App);

import React, { Component } from 'react';

import { Grid, CssBaseline } from '@material-ui/core';

import { connect } from 'react-redux';
import { getWeb3 } from './redux/actions/web3Actions';
import { getAccount } from './redux/actions/userActions';

import Header from './components/Header';
import Funds from './components/Funds';
import TxHistory from './components/TxHistory';
import CreateOrders from './components/CreateOrders';
import OrderList from './components/OrderList';

class App extends Component {

    async componentDidMount() {
        await this.props.getWeb3()
        await this.props.getAccount();
    }

    render() {
        const { isLoading, isLoaded, userAccount, error } = this.props;
        return(
            <React.Fragment>
                <CssBaseline />
                { isLoading && <div className="spinner-border"/> }
                { isLoaded && userAccount !== '' &&
                    <React.Fragment>
                        <Header/>
                        <br/>
                        <Grid container spacing = { 8 } direction = 'row' alignItems = 'flex-start' justify = 'center'>
                            <Grid item xs = {5}>
                                <Funds />
                            </Grid>
                            <Grid item xs = {4}>
                                <CreateOrders />
                            </Grid>
                        </Grid>
                        <Grid container spacing = { 8 } direction = 'row' alignItems = 'flex-start' justify = 'center'>
                            <Grid item xs = {5}>
                                <TxHistory />
                            </Grid>
                            <Grid item>
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
    isLoading: state.web3.isLoading,
    isLoaded: state.web3.isLoaded,
    error: state.web3.error,
    userAccount: state.user.userAccount
});

export default connect(mapStateToProps, { getWeb3, getAccount })(App);

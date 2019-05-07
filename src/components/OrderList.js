import React, { Component } from 'react';

import { Grid, Card, CardHeader, CardContent,
         Table, TableHead, TableBody, TableRow,
         TableCell } from '@material-ui/core';

import { connect } from 'react-redux';
import { getPastOrders } from '../redux/actions/eventActions';

class OrderList extends Component {

    renderBuyOrderList() {
        const buyOrders = this.getBuyOrderList();
        return buyOrders.map(item =>
            <TableRow hover onClick = { ()  => console.log('soy') } key = { item.transactionHash }>
                <TableCell align = 'left'> { item.returnValues._amountMake / item.returnValues._amountTake }</TableCell>
                <TableCell align = 'left'> { item.returnValues._amountMake.toString() } </TableCell>
                <TableCell align = 'left'> { item.returnValues._amountTake.toString() } </TableCell>
            </TableRow>
        );
    }

    doSomething() {
        console.log('submit');
    }

    renderSellOrderList() {
        const sellOrders = this.getSellOrderList();
        return sellOrders.map(item =>
            <TableRow hover onClick = { ()  => console.log('soy') } key = { item.transactionHash } >
                <TableCell align = 'left'> { item.returnValues._amountMake / item.returnValues._amountTake } </TableCell>
                <TableCell align = 'left'> { item.returnValues._amountMake.toString() } </TableCell>
                <TableCell align = 'left'> { item.returnValues._amountTake.toString() } </TableCell>
            </TableRow >
        );
    }

    render() {
        return (
            <Grid container spacing = { 8 } direction = 'row' alignItems = 'center'>
                <Grid item>
                    <Card raised>
                        <CardHeader title = 'Buy orders'/>
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align = 'left'> Price(ETH) </TableCell>
                                        <TableCell align = 'left'> Amount() </TableCell>
                                        <TableCell align = 'left'> Total cost(ETH) </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card raised>
                        <CardHeader title = 'Sell orders'/>
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align = 'left'> Price(ETH) </TableCell>
                                        <TableCell align = 'left'> Amount() </TableCell>
                                        <TableCell align = 'left'> Total cost(ETH) </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
    exchangeContract: state.web3.exchangeContract,
    token: state.tokens.selectedToken,
    userAccount: state.user.userAccount,
});

export default connect(
    mapStateToProps,
    { })(OrderList);

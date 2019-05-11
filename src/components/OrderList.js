import React, { Component } from 'react';

import { Grid, Card, CardHeader, CardContent,
         Table, TableHead, TableBody, TableRow,
         TableCell } from '@material-ui/core';

import { AutoSizer } from 'react-virtualized';
import MuiTable from "mui-virtualized-table";

import { connect } from 'react-redux';
import { getPastOrders } from '../redux/actions/eventActions';
import { getOpenOrders, getOrder } from '../redux/actions/orderActions';

class OrderList extends Component {
    constructor(props) {
        super(props);
        const columns = [
            {
                name: "_token",
                header: "Currency"
            },
            {
                name: "_amount",
                header: "Amount"
            },
            {
                name: "event",
                header: "Transaction type"
            }
        ];
    }

    componentDidMount() {
        this.props.getOrder();
        this.props.getOpenOrders();
    }

    renderBuyOrderList() {
        const buyOrders = [];
        return(
            <AutoSizer>
                {({ height, width  }) => (
                    <MuiTable
                        data = { buyOrders }
                        columns = { this.columns }
                        includeHeaders = { true }
                        fixedRowCount = { 1 }
                        width = { width }
                        height = { height }
                        isCellHovered = {(column, rowData, hoveredColumn, hoveredRowData) =>
                            rowData.transactionHash && rowData.transactionHash === hoveredRowData.transactionHash
                        }
                    />
                )}
            </AutoSizer>
        );
    }

    doSomething() {
        console.log('submit');
    }

    renderSellOrderList() {
        const sellOrders = [];
        return(
            <AutoSizer>
                {({ height, width  }) => (
                    <MuiTable
                        data = { sellOrders }
                        columns = { this.columns }
                        includeHeaders = { true }
                        fixedRowCount = { 1 }
                        width = { width }
                        height = { height }
                        isCellHovered = {(column, rowData, hoveredColumn, hoveredRowData) =>
                            rowData.transactionHash && rowData.transactionHash === hoveredRowData.transactionHash
                        }
                    />
                )}
            </AutoSizer>
        );
    }
    render() {
        return (
            <Grid container spacing = { 8 } direction = 'row' alignItems = 'center'>
                <Grid item>
                    <Card raised>
                        <CardHeader title = 'Buy orders'/>
                        <CardContent>
                            { this.renderBuyOrderList() }
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card raised>
                        <CardHeader title = 'Sell orders'/>
                        <CardContent>
                            { this.renderSellOrderList() }
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
    { getOrder, getOpenOrders })(OrderList);

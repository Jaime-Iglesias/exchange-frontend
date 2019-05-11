import React, { Component } from 'react';

import { Grid, Card, CardHeader, CardContent,
         Table, TableHead, TableBody, TableRow,
         TableCell } from '@material-ui/core';

import { AutoSizer } from 'react-virtualized';
import MuiTable from "mui-virtualized-table";

import { connect } from 'react-redux';
import { getOpenOrders } from '../redux/actions/orderActions';

class OrderList extends Component {

    componentDidMount() {
        this.props.getOpenOrders();
    }

    renderBuyOrderList() {
        const columnsBuy = [
            {
                name: "wantTokenAmount",
                header: "Amount Tokens"
            },
            {
                name: "haveTokenAmount",
                header: "Amount ETH"
            }
        ];
        const { userAccount, token, buyOrders } = this.props;
        const orders = buyOrders.filter(item => item.orderMaker !== userAccount && item.wantTokenId == token.tokenIndex);
        return(
            <div style = {{ height: 300 }}>
                <AutoSizer>
                    {({ height, width  }) => (
                        <MuiTable
                            data = { orders }
                            columns = { columnsBuy }
                            includeHeaders = { true }
                            fixedRowCount = { 1 }
                            width = { 800 }
                            height = { height }
                            isCellHovered = {(column, rowData, hoveredColumn, hoveredRowData) =>
                                rowData.realIndex && rowData.realIndex === hoveredRowData.realIndex
                            }
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

    doSomething() {
        console.log('submit');
    }

    renderSellOrderList() {
        const columnsSell = [
            {
                name: "haveTokenAmount",
                header: "Amount Tokens"
            },
            {
                name: "wantTokenAmount",
                header: "Amount ETH"
            }
        ];
        const { userAccount, token, sellOrders } = this.props;
        const orders = sellOrders.filter(item => item.orderMaker !== userAccount && item.haveTokenId == token.tokenIndex);
        return(
            <div style = {{ height: 300 }}>
                <AutoSizer>
                    {({ height, width  }) => (
                        <MuiTable
                            data = { orders }
                            columns = { columnsSell }
                            includeHeaders = { true }
                            fixedRowCount = { 1 }
                            width = { width }
                            height = { height }
                            isCellHovered = {(column, rowData, hoveredColumn, hoveredRowData) =>
                                rowData.realIndex && rowData.realIndex === hoveredRowData.realIndex
                            }
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
    /*
    <Grid item>
        <Card raised>
            <CardHeader title = 'Sell orders'/>
            <CardContent>
                { this.renderSellOrderList() }
            </CardContent>
        </Card>
    </Grid>
    */
    /*
    return (
        <Grid container spacing = { 8 } direction = 'row' alignItems = 'center'>
            <Grid item>
                <Card raised>
                    <CardHeader title = 'Buy orders'/>
                    <CardContent>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
    */
    render() {
        return (
            <React.Fragment>
                { this.renderBuyOrderList() }
            </React.Fragment>
        );

    }
}

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
    exchangeContract: state.web3.exchangeContract,
    token: state.tokens.selectedToken,
    userAccount: state.user.userAccount,
    buyOrders: state.orders.buyOrders,
    sellOrders: state.orders.sellOrders
});

export default connect(
    mapStateToProps,
    { getOpenOrders })(OrderList);

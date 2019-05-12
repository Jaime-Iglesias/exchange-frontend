import React, { Component } from 'react';

import { Grid, Card, CardHeader, CardContent,
         Dialog, DialogTitle, Button,
         DialogContent, DialogActions, DialogContentText,
         TextField } from '@material-ui/core';

import { AutoSizer } from 'react-virtualized';
import MuiTable from "mui-virtualized-table";

import ExecuteOrder from './ExecuteOrder';
import IERC20 from '../contracts/IERC20.json';

import { connect } from 'react-redux';
import { getOpenOrders } from '../redux/actions/orderActions';
import { getUserEthBalance, getUserTokenBalance,
        getUserContractEthBalance, getUserContractTokenBalance } from '../redux/actions/userActions';
        
class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOrder: null,
            open: false,
            amountFill: 0,
            amountBank: 0,
        }
    }

    componentDidMount() {
        this.props.getOpenOrders();
    }

    async executeOrder(orderIndex, amountFill, msgValue) {
        const { web3Instance, userAccount, exchangeContract } = this.props;
        try {
            console.log(orderIndex, "index");
            console.log(amountFill, "fill");
            await exchangeContract.methods.executeOrder(orderIndex, amountFill).send({
                from: userAccount,
                value: msgValue
            })
            .on('transactionHash', (hash) => {
                //update eth balance
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                this.props.getUserEthBalance();
                this.props.getUserContractEthBalance();
                this.props.getUserTokenBalance();
                this.props.getUserContractTokenBalance();
                this.props.getOpenOrders();
                /*if (confirmationNumber === 4) {
                    //update OrderList
                    //add fillOrder event
                }*/
            })
            .on('receipt', (receipt) => {
                //do something with receipt
                //console.log(receipt);
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    async getOrder(orderIndex) {
        try {
            const order = await this.props.exchangeContract.methods.getOrder(orderIndex).call( { from: this.props.userAccount });

            const container = {};
            container.orderMaker = order.orderMaker;
            container.haveTokenId = order.haveTokenId.toString();
            container.haveTokenAmount = order.haveAmount.toString();
            container.wantTokenId = order.wantTokenId.toString();
            container.wantTokenAmount = order.wantAmount.toString();
            container.creationBlock = order.creationBlock.toString();
            container.realIndex = orderIndex;

            if (container.haveTokenId === "1") {
                container.haveTokenAmount = this.props.web3Instance.utils.fromWei(container.haveTokenAmount, 'ether');
            } else if (container.wantTokenId === "1") {
                container.wantTokenAmount = this.props.web3Instance.utils.fromWei(container.wantTokenAmount, 'ether');
            }

            if (container.haveAmount === 0) {
                console.log("order has expired");
            } else {
                this.setState({
                    selectedOrder: container
                });
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    async approve(amount) {
        const { web3Instance, token, exchangeContract, userAccount } = this.props;
        try {
            const tokenContract = new web3Instance.eth.Contract(IERC20.abi, token.address);
            await tokenContract.methods.approve(exchangeContract.options.address, amount).send({
                from: userAccount
            });

        } catch (err) {
            console.log(err);
        }
    }

    handleClick = (column, data) => {
        this.setState({
            open: !this.state.open
        });

        this.getOrder(data.realIndex);
    }

    handleClose = () => {
        this.setState({
            open: false,
            selectedOrder: ''
        });
    }

    handleExecution = () => {
        const { selectedOrder, amountBank, amountFill } = this.state;
        ///BuyOrder
        if (selectedOrder.haveTokenId === "1") {
            if (amountBank !== 0) {
                this.approve(amountBank);
            }
            this.executeOrder(selectedOrder.realIndex, amountFill, 0);
        } else {
            const fill = this.props.web3Instance.utils.toWei(amountFill, 'ether');
            this.executeOrder(selectedOrder.realIndex, fill, amountBank);
        }
        console.log("execute!");
    }

    renderDialog() {
        const { selectedOrder, amountFill } = this.state;
        return (
            <React.Fragment>
            { this.state.selectedOrder &&
                <Dialog
                  open = { this.state.open }
                  keepMounted
                  onClose = { this.handleToggle }
                 >
                    <DialogTitle> Fill order </DialogTitle>
                    <DialogContent>
                    <form>
                        <TextField
                            label = 'Price (ETH)'
                            disabled
                            value = { selectedOrder.haveTokenAmount/selectedOrder.wantTokenAmount }
                            onChange = { event => this.setState({ ethValueBuy: event.target.value }) }
                            type = 'number'
                            inputProps = {{ min: '0' }}
                        />
                        <br />
                        <TextField
                            label = 'Amount to fill'
                            required
                            value = { amountFill }
                            onChange = { event => this.setState({ amountFill: event.target.value }) }
                            type = 'number'
                            fullWidth = { true }
                            inputProps = {{ min: '0', max: selectedOrder.wantTokenAmount }}
                        />
                        <br />
                        <TextField
                            label = 'Amount to get'
                            disabled
                            value = { amountFill/(selectedOrder.haveTokenAmount/selectedOrder.wantTokenAmount) }
                            onChange = { event => this.setState({ msgValue: event.target.value }) }
                            type = 'number'
                            inputProps = {{ min: '0' }}
                        />
                        <br />
                        <TextField
                            label = 'Total to pay'
                            disabled
                            value = { (selectedOrder.haveTokenAmount/selectedOrder.wantTokenAmount)* amountFill }
                            type = 'number'
                            inputProps = {{ min: '0' }}
                        />
                    </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick = { this.handleExecution } color="primary">
                          Execute
                        </Button>
                        <Button onClick = { this.handleClose } color="primary">
                          Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            </React.Fragment>
        );
    }

    renderBuyOrderList() {
        const { userAccount, token, buyOrders } = this.props;
        const columnsBuy = [
            {
                name: "wantTokenAmount",
                header: token.symbol
            },
            {
                name: "haveTokenAmount",
                header: "ETH"
            },
            {
                header: "Price",
                cell: d => `${d.haveTokenAmount / d.wantTokenAmount}`
            }
        ];
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
                            width = { width }
                            height = { height }
                            isCellHovered = {(column, rowData, hoveredColumn, hoveredRowData) =>
                                rowData.realIndex && rowData.realIndex === hoveredRowData.realIndex
                            }
                            onCellClick = {( column, data ) =>  this.handleClick(column, data)  }
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

    renderSellOrderList() {
        const { userAccount, token, sellOrders } = this.props;
        const columnsSell = [
            {
                name: "haveTokenAmount",
                header: token.symbol
            },
            {
                name: "wantTokenAmount",
                header: "ETH"
            },
            {
                header: "Price",
                cell: d => `${d.haveTokenAmount / d.wantTokenAmount}`
            }
        ];
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
                            onCellClick = {( column, data ) =>  this.handleClick(column, data)  }
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

    render() {
        return (
            <Grid container spacing = { 8 } direction = 'row' alignItems = 'center'>
                <Grid item sm>
                    <Card raised>
                        <CardHeader title = 'Buy orders'/>
                        <CardContent>
                            { this.renderBuyOrderList() }
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm>
                    <Card raised>
                        <CardHeader title = 'Sell orders'/>
                        <CardContent>
                            { this.renderSellOrderList() }
                        </CardContent>
                    </Card>
                </Grid>
                { this.renderDialog() }
            </Grid>
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

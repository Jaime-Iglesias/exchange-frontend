import React, { Component } from 'react';

import { Grid, Card, CardHeader, CardContent, Tabs, Tab } from '@material-ui/core';

import { AutoSizer } from 'react-virtualized';
import MuiTable from "mui-virtualized-table";

import { connect } from 'react-redux';
import { getExpiration, getPastDeposits, getPastWithdraws,
         depositListener, withdrawListener } from '../redux/actions/eventActions';

class TxHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabValue: 0
        };
    }

    componentDidMount() {
        this.props.getExpiration();
        this.props.getPastDeposits();
        this.props.getPastWithdraws();
        //this.props.depositListener();
        //this.props.withdrawListener();
    }

    formatFundEvents(eventArray) {
        const { tokens } = this.props;
        const formatedEvents = eventArray.map(item =>  {
            const container = {};

            container.transactionHash = item.transactionHash;
            if (item.event === "LogDepositToken") {
                container.event = "Deposit";
            } else {
                container.event = "Witdraw";
            }


            container._token = tokens.find(token => token.address === item.returnValues._token).symbol;

            if (item.returnValues._token === this.props.zeroAddress){
                container._amount = this.props.web3Instance.utils.fromWei(item.returnValues._amount.toString(), 'ether');
            }
            else {
                container._amount = item.returnValues._amount.toString();
            }


            return container;
        });

        return formatedEvents;
    }

    renderFundsTab() {
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
        const data = this.formatFundEvents([...this.props.depositEvents, ...this.props.withdrawEvents]);
        return(
            <div style = {{ height: 300 }}>
                <AutoSizer>
                    {({ height, width  }) => (
                        <MuiTable
                            data = { data }
                            columns = { columns }
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
            </div>
        );
    }

/*renderOrdersTab() {
        const columns = [
            {
                name: "tokenSymbol",
                header: "Currency"
            },
            {
                name: "haveAmount",
                header: "Amount"
            },
            {
                name: "event",
                header: "Transaction type"
            }
        ];
        const data = this.formatFundEvents([...this.props.depositEvents, ...this.props.withdrawEvents]);
        return(
            <div style = {{ height: 300 }}>
                <AutoSizer>
                    {({ height, width  }) => (
                        <MuiTable
                            data = { data }
                            columns = { columns }
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
            </div>
        );
    }*/

    handleChange = (event, newValue) => {
        this.setState({ tabValue: newValue })
    }

    renderEventList() {
        return(
            <Grid item>
                <Card raised>
                    <CardHeader title = 'My transactions'/>
                    <CardContent>
                        <Tabs value = { this.state.tabValue } onChange = { this.handleChange }>
                            <Tab label = 'funds'/>
                            <Tab label = 'my orders'/>
                        </Tabs>
                        { this.state.tabValue === 0 &&  <div> { this.renderFundsTab() } </div> }
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    render() {
        return(
            <div> { this.renderEventList() } </div>
        );
    }
}

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
    depositEvents: state.events.depositEvents,
    withdrawEvents: state.events.withdrawEvents,
    tokens: state.tokens.tokenList,
    token: state.tokens.selectedToken,
    zeroAddress: state.web3.zeroAddress
});

export default connect(
    mapStateToProps,
    { getExpiration, getPastDeposits, getPastWithdraws, depositListener, withdrawListener })(TxHistory);

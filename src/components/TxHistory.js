import React, { Component } from 'react';

import { Grid, Card, CardHeader, CardContent,
        Table, TableHead, TableBody, TableRow,
        TableCell, Tabs, Tab } from '@material-ui/core';

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
            container.event = item.event;

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

    renderFundsTableRows() {
        let events =  [...this.props.depositEvents, ...this.props.withdrawEvents];
        let formatedEvents = this.formatFundEvents(events);
        if (!events || !events.length) {
            return (
                <TableRow>
                    <TableCell> No items found </TableCell>
                </TableRow>
            );
        }
        return formatedEvents.map(item =>
            <TableRow hover key = { item.transactionHash }>
                <TableCell align = 'left'> { item._token } </TableCell>
                <TableCell align = 'left'> { item._amount } </TableCell>
                <TableCell align = 'left'> { item.event } </TableCell>
            </TableRow>
        );
    }

    renderFundsTab() {
        const { token } = this.props;
        return(
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align = 'left'> Currency </TableCell>
                        <TableCell align = 'left'> Amount </TableCell>
                        <TableCell align = 'left'> Transaction type </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { this.renderFundsTableRows() }
                </TableBody>
            </Table>
        );
    }

    renderOrdersTab() {
        return(
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align = 'left'> Currency </TableCell>
                        <TableCell align = 'left'> Amount </TableCell>
                        <TableCell align = 'left'> Transaction type </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { this.renderFundsTableRows() }
                </TableBody>
            </Table>
        );
    }

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

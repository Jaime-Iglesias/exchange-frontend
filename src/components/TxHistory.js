import React, { Component } from 'react';
import {Container, Col, Card, Tabs, Tab, Table } from 'react-bootstrap';

class TxHistory extends Component {

    constructor(props){
        super(props);

        this.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

        this.state = {
            key: 'funds',
            fundsEventList: [],
            orderEventList: [],
        };

        this.depositListener();
        this.withdrawListener();
    }

    eventFormater(event) {
        if (event) {
            var FormattedEvent = {
                id: event.id,
                transactionHash: event.transactionHash,
                token: '',
                amount: -1,
                eventType: ''
            };

            if (event.event === "LogDepositToken") {
                FormattedEvent.eventType = "Deposit";
            }

            if (event.event === "LogWithdrawToken") {
                FormattedEvent.eventType = "Withdraw";
            }

            if (event.returnValues._token === this.ZERO_ADDRESS) {
                FormattedEvent.token = "ETH";
                FormattedEvent.amount = this.props.web3.utils.fromWei(event.returnValues._amount, 'ether');
            } else {
                FormattedEvent.token = "Token";
                FormattedEvent.amount = event.returnValues._amount;
            }
            return FormattedEvent;
        }
    }

    depositListener() {
        this.props.exchangeContract.events.LogDepositToken({
            filter: { _user: this.props.userAccount }
        })
        .on('data', (event) => {
            var index = this.state.fundsEventList.indexOf(event.id);
            if (index === -1) {
                this.setState({
                    fundsEventList: this.state.fundsEventList.concat(this.eventFormater(event)),
                });
            }
        })
        .on('changed', (event) => {
            const index = this.state.fundsEventList.indexOf(event.transactionHash);
            if (index > -1) {
                this.setState({
                    fundsEventList: this.state.fundsEventList.splice(index, 1),
                });
            }
        })
        .on('error', (error) => {
            console.log(error);
        });
    }

    withdrawListener() {
        this.props.exchangeContract.events.LogWithdrawToken({
            filter: { _user: this.props.userAccount }
        })
        .on('data', (event) => {
            this.setState({
                fundsEventList: this.state.fundsEventList.concat(this.eventFormater(event)),
            });
        })
        .on('changed', (event) => {
            const index = this.state.fundsEventList.indexOf(event.transactionHash);
            if (index > -1) {
                this.setState({
                    fundsEventList: this.state.fundsEventList.splice(index, 1),
                });
            }
        })
        .on('error', (error) => {
            console.log(error);
        });
    }

    renderFundsTableRows() {
        return this.state.fundsEventList.map(item =>
            <tr key = { item.transactionHash }>
                <td> { item.transactionHash } </td>
                <td> { item.token } </td>
                <td> { item.amount } </td>
                <td> { item.eventType } </td>
            </tr>
        );
    }

    renderFundsTab() {
        return(
            <Table size="sm" responsive>
                <thead>
                    <tr>
                        <th> TransactionHash </th>
                        <th> Currency </th>
                        <th> Amount </th>
                        <th> Transaction type </th>
                    </tr>
                </thead>
                <tbody>
                    { this.renderFundsTableRows() }
                </tbody>
            </Table>
        );
    }

    renderEventList() {
        return(
            <Container fluid>
                <Card>
                    <Card.Title> My transactions </Card.Title>
                    <Card.Body>
                        <Tabs activeKey = { this.state.key } onSelect = { key => this.setState({ key })}>
                            <Tab eventKey = 'funds' title = 'funds'>
                                { this.renderFundsTab() }
                            </Tab>
                            <Tab eventKey = 'orders' title = 'my orders'>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    render() {
        return(
            <div> { this.renderEventList() } </div>
        );
    }
}

export default TxHistory;

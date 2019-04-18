import React, { Component } from 'react';
import {Container, Col, Card, Tabs, Tab, Table } from 'react-bootstrap';

import { connect } from 'react-redux';
import { getPastDeposits, getPastWithdraws, depositListener, withdrawListener } from '../redux/actions/eventActions';

class TxHistory extends Component {

    constructor(props){
        super(props);

        this.state = {
            key: 'funds',
        };

    }

    componentDidMount() {
        this.props.getPastDeposits();
        this.props.getPastWithdraws();
        //this.props.depositListener();
        //this.props.withdrawListener();
    }


    formatEvents(eventArray) {
        const formatedEvents = eventArray.map(item =>  {
            const container = {};

            container.transactionHash = item.transactionHash;
            container.event = item.event;

            if (item.returnValues._token === this.props.zeroAddress){
                container._token = 'ETH';
                container._amount = this.props.web3Instance.utils.fromWei(item.returnValues._amount.toString(), 'ether');
            }
            else {
                container._token = 'TOKEN';
                container._amount = item.returnValues._amount.toString();
            }

            return container;
        });

        return formatedEvents;
    }

    renderFundsTableRows() {
        let events =  [...this.props.depositEvents, ...this.props.withdrawEvents];
        let formatedEvents = this.formatEvents(events);
        if (!events || !events.length) {
            return <td> 'No events found' </td>;
        }
        return formatedEvents.map(item =>
            <tr key = { item.transactionHash }>
                <td> { item._token } </td>
                <td> { item._amount } </td>
                <td> { item.event } </td>
            </tr>
        );
    }

    renderFundsTab() {
        return(
            <Table size="sm" responsive hover>
                <thead>
                    <tr>
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
                            <Tab display = 'inline' eventKey = 'funds' title = 'funds'>
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

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
    depositEvents: state.events.depositEvents,
    withdrawEvents: state.events.withdrawEvents,
    zeroAddress: state.web3.zeroAddress
});

export default connect(
    mapStateToProps,
    { getPastDeposits, getPastWithdraws, depositListener, withdrawListener })(TxHistory);

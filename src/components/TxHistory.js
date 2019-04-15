import React, { Component } from 'react';
import {Container, Col, Card, Tabs, Tab, Table } from 'react-bootstrap';

import { connect } from 'react-redux';
import { depositListener, withdrawListener } from '../redux/actions/eventActions';

class TxHistory extends Component {

    constructor(props){
        super(props);

        this.state = {
            key: 'funds',
            fundTransactions: []
        };

    }

    componentDidMount() {
        this.props.depositListener();
        this.props.withdrawListener();
    }

    renderFundsTableRows() {
        this.setState
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
    }*/

    render() {
        return(
            <div> <p>  Events </p> </div>
        );
    }
}

const mapStateToProps = state => ({
    depositEvents: state.events.depositEvents,
    withdrawEvents: state.events.withdrawEvents
});

export default connect(
    mapStateToProps,
    { depositListener, withdrawListener })(TxHistory);

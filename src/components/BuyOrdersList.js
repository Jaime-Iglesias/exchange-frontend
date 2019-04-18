import React, { Component } from 'react';
import { Container, Card, Row, Col, Table } from 'react-bootstrap';

import { connect } from 'react-redux';
import { getPastOrders } from '../redux/actions/eventActions';

class BuyOrdersList extends Component {

    componentDidMount() {
        this.props.getPastOrders();
    }

    getBuyOrderList() {
        const { orders, userAccount, tokenContract } = this.props;
        const buyOrders = orders.filter(item =>
            item.returnValues._sender !== userAccount &&
            item.returnValues._tokenMake === tokenContract.options.address);
        return buyOrders;
    }

    renderBuyOrderList() {
        const buyOrders = this.getBuyOrderList();
        return buyOrders.map(item =>
            <tr key = { item.transactionHash }>
                <td> { item.returnValues._amountMake / item.returnValues._amountTake }</td>
                <td> { item.returnValues._amountMake.toString() } </td>
                <td> { item.returnValues._amountTake.toString() } </td>
            </tr>
        );
    }

    getSellOrderList() {
        const { orders, userAccount, zeroAddress } = this.props;
        const sellOrders = orders.filter(item =>
            item.returnValues._sender !== userAccount &&
            item.returnValues._tokenMake === zeroAddress);
        return sellOrders;
    }

    doSomething() {
        console.log('submit');
    }

    renderSellOrderList() {
        const sellOrders = this.getSellOrderList();
        return sellOrders.map(item =>
            <tr onClick = { ()  => console.log('soy') } key = { item.transactionHash } >
                <td> { item.returnValues._amountMake / item.returnValues._amountTake } </td>
                <td> { item.returnValues._amountMake.toString() } </td>
                <td> { item.returnValues._amountTake.toString() } </td>
            </tr>
        );
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Title> Buy orders </Card.Title>
                            <Card.Body>
                                <Table size="sm" responsive hover>
                                    <thead>
                                        <tr>
                                            <th> Price </th>
                                            <th> TFG </th>
                                            <th> ETH </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.renderBuyOrderList() }
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Title> Sell orders </Card.Title>
                            <Card.Body>
                            <Table size="sm" responsive hover>
                                <thead>
                                    <tr>
                                        <th> Price </th>
                                        <th> TFG </th>
                                        <th> ETH </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.renderSellOrderList() }
                                </tbody>
                            </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    orders: state.events.orders,
    web3Instance: state.web3.web3Instance,
    exchangeContract: state.web3.exchangeContract,
    tokenContract: state.web3.tokenContract,
    zeroAddress: state.web3.zeroAddress,
    userAccount: state.user.userAccount,
});

export default connect(
    mapStateToProps,
    { getPastOrders })(BuyOrdersList);

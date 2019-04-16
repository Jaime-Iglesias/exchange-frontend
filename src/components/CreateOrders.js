import React, { Component } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { MdCached } from 'react-icons/md';

import { connect } from 'react-redux';

class CreateOrders extends Component {
    constructor(props){
        super(props);

        this.state = {
            ethValueBuy: 0,
            ethValueSell: 0,
            amountTokensBuy: 0,
            amountTokensSell: 0,
        };
    }


    async placeOrder(tokenGetAddress, amountGet, tokenGiveAddress, amountGive) {
        const { web3Instance, userAccount, exchangeContract } = this.props;
        try{
            const currentBlock = await web3Instance.eth.getBlockNumber();
            const nonce = await web3Instance.eth.getTransactionCount(userAccount)
            const expiration = currentBlock + 1000;
            exchangeContract.methods.placeOrder(tokenGetAddress, amountGet, tokenGiveAddress, amountGive, expiration, nonce).send({
                from: this.props.userAccount
            })
            .on('transactionHash', (hash) => {
                //do something wth transaction hash
            })
            .on('confirmation', (confirmationNumber, receipt) => {

            })
            .on('receipt', (receipt) => {
                //do something with receipt
                console.log(receipt);
            });
        } catch (err) {
            console.log(err);
        }
    }

    submitFormBuy = (e) => {
       e.preventDefault();

       const { tokenContract, zeroAddress } = this.props;
       const { amountTokensBuy, ethValueBuy } = this.state;

       this.placeOrder(
           tokenContract.options.address,
           amountTokensBuy,
           zeroAddress,
           ethValueBuy
       );

       this.setState({
           ethValueBuy: 0,
           amountTokensBuy: 0,
       });

       //console.log("submit!");
    }

    resetFormBuy = (e) => {
        this.setState({
            ethValueBuy: 0,
            amountTokensBuy: 0,
        });
    }

    renderBuyOrder() {
        return(
            <Form onSubmit = { this.submitFormBuy }>
                <Col>
                    <Form.Group>
                        <Form.Label> Prize (ETH) </Form.Label>
                        <Form.Control
                            required
                            value = { this.state.ethValueBuy }
                            onChange = { event => this.setState({ ethValueBuy: event.target.value }) }
                            type = "number"
                            min = { 0 }
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label> Amount (Tokens) </Form.Label>
                        <Form.Control
                            required
                            value = { this.state.amountTokensBuy }
                            onChange = { event => this.setState({ amountTokensBuy: event.target.value }) }
                            type = "number"
                            min = { 0 }
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label> Total </Form.Label>
                        <Form.Control
                            disabled
                            value = { this.state.ethValueBuy * this.state.amountTokensBuy }
                            type = "number"
                        />
                    </Form.Group>
                </Col>
                <Button type = "submit"> Buy </Button>
            </Form>
        );
    }

    submitFormSell = (e) => {
       e.preventDefault();

       const { tokenContract, zeroAddress } = this.props;
       const { amountTokensSell, ethValueSell } = this.state;

       this.placeOrder(
           zeroAddress,
           ethValueSell,
           tokenContract.options.address,
           amountTokensSell,
       );

       this.setState({
           ethValueSell: 0,
           amountTokensSell: 0,
       });
    }

    resetFormSell = (e) => {
        this.setState({
            ethValueSell: 0,
            amountTokensSell: 0,
        });
    }

    renderSellOrder() {
        return(
            <Form onSubmit = { this.submitFormSell }>
                <Col>
                    <Form.Group>
                        <Form.Label> Prize (ETH) </Form.Label>
                        <Form.Control
                            required
                            value = { this.state.ethValueSell }
                            onChange = { event => this.setState({ ethValueSell: event.target.value }) }
                            type = "number"
                            min = { 0 }
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label> Amount (Tokens) </Form.Label>
                        <Form.Control
                            required
                            value = { this.state.amountTokensSell }
                            onChange = { event => this.setState({ amountTokensSell: event.target.value }) }
                            type = "number"
                            min = { 0 }
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label> Total </Form.Label>
                        <Form.Control
                            disabled
                            value = { this.state.ethValueSell * this.state.amountTokensSell }
                            type = "number"
                        />
                    </Form.Group>
                </Col>
                <Button type = "submit"> Sell </Button>
            </Form>
        );
    }

    render() {
        return(
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title> Buy </Card.Title>
                                <Button className = "float-right" onClick = { this.resetFormBuy }> <MdCached/> </Button>
                            </Card.Header>
                            <Card.Body>
                                { this.renderBuyOrder() }
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title> Sell </Card.Title>
                                <Button className = "float-right" onClick = { this.resetFormSell }> <MdCached/> </Button>
                            </Card.Header>
                            <Card.Body>
                                { this.renderSellOrder() }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    web3Instance: state.web3.web3Instance,
    exchangeContract: state.web3.exchangeContract,
    tokenContract: state.web3.tokenContract,
    zeroAddress: state.web3.zeroAddress,
    userAccount: state.user.userAccount,
});

export default connect(
    mapStateToProps,
    {  })(CreateOrders);

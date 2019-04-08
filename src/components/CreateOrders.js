import React, { Component } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { MdCached } from 'react-icons/md';

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


    //sync createOrder(amountTokens, amountEth)
    submitFormBuy = (e) => {
       e.preventDefault();

       if (this.state.ethValueBuy !== 0 && this.state.amountTokensBuy !== 0) {
           console.log("submit!");
       }
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
       console.log("submit");
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
                                Sell
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

export default CreateOrders;

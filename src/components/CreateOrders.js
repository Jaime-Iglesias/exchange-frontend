import React, { Component } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'

class CreateOrders extends Component {
    constructor(props){
        super(props);

    }


    submitForm = (e) => {
       e.preventDefault();
       console.log("submit");
    }

    renderBuyOrder() {
        return(
            <Form>
                <Col>
                    <Form.Group>
                        <Form.Label> Prize (ETH) </Form.Label>
                        <Form.Control
                            required
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
                            type = "number"
                            min = { 0 }
                        />
                    </Form.Group>
                </Col>
                <Button type = "submit"> Buy </Button>
            </Form>
        );
    }

    renderSellOrder() {
        return(
            <Form>
                <Col>
                    <Form.Group>
                        <Form.Label> Prize (ETH) </Form.Label>
                        <Form.Control
                            required
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
                            type = "number"
                            min = { 0 }
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
                            <Card.Title> Buy </Card.Title>
                            <Card.Body>
                                { this.renderBuyOrder() }
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Title> Sell </Card.Title>
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
